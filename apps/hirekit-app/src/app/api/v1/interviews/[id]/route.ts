import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { logActivity } from '@/lib/activity';
import { sendEmail } from '@/lib/email';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const interview = await db.interview.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
    include: { application: { select: { name: true } } },
  });

  if (!interview) {
    return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
  }

  const body = await request.json();
  const { status, startTime, endTime, location, meetingLink, notes, feedback } = body;

  const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updated = await db.interview.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(startTime && { startTime: new Date(startTime) }),
      ...(endTime && { endTime: new Date(endTime) }),
      ...(location !== undefined && { location }),
      ...(meetingLink !== undefined && { meetingLink }),
      ...(notes !== undefined && { notes }),
      ...(feedback !== undefined && { feedback }),
    },
  });

  if (status === 'completed') {
    logActivity({
      companyId: ctx.companyId,
      applicationId: interview.applicationId,
      type: 'interview_completed',
      data: { title: interview.title, interviewId: interview.id },
      performedBy: session.user.id,
    });
  }

  // Notify candidate of cancellation
  if (status === 'cancelled') {
    sendEmail({
      to: interview.candidateEmail,
      subject: `Interview Cancelled: ${interview.title}`,
      html: `<p>Hi ${interview.application.name || 'there'},</p><p>Unfortunately, the interview "${interview.title}" with ${ctx.companyName} has been cancelled. We apologize for any inconvenience.</p><p>Best regards,<br>${ctx.companyName}</p>`,
    }).catch(() => {});
  }

  return NextResponse.json({ interview: updated });
}
