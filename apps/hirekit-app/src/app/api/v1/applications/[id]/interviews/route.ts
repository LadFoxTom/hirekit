import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomBytes } from 'crypto';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { logActivity } from '@/lib/activity';
import { sendInterviewEmail } from '@/lib/email';

export async function GET(
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

  const interviews = await db.interview.findMany({
    where: { applicationId: params.id, companyId: ctx.companyId },
    orderBy: { startTime: 'desc' },
  });

  return NextResponse.json({ interviews });
}

export async function POST(
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

  const application = await db.application.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
    select: { id: true, email: true, name: true },
  });
  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const body = await request.json();
  const {
    title,
    startTime,
    endTime,
    timezone = 'UTC',
    location,
    meetingLink,
    interviewers = [],
    notes,
    createSchedulingLink,
  } = body;

  if (!title || !startTime || !endTime) {
    return NextResponse.json({ error: 'Title, start time, and end time are required' }, { status: 400 });
  }

  const interview = await db.interview.create({
    data: {
      companyId: ctx.companyId,
      applicationId: params.id,
      scheduledBy: session.user.id,
      interviewers,
      candidateEmail: application.email,
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      timezone,
      location: location || null,
      meetingLink: meetingLink || null,
      notes: notes || null,
    },
  });

  let schedulingUrl: string | undefined;

  // Optionally create a self-scheduling link
  if (createSchedulingLink) {
    const token = randomBytes(16).toString('hex');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
    schedulingUrl = `${appUrl}/schedule/${token}`;

    await db.schedulingLink.create({
      data: {
        companyId: ctx.companyId,
        applicationId: params.id,
        token,
        interviewerIds: interviewers,
        duration: Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000),
        title,
        availableFrom: new Date(startTime),
        availableTo: new Date(new Date(endTime).getTime() + 7 * 24 * 3600000), // 1 week window
        expiresAt: new Date(Date.now() + 14 * 24 * 3600000), // 2 weeks
      },
    });
  }

  logActivity({
    companyId: ctx.companyId,
    applicationId: params.id,
    type: 'interview_scheduled',
    data: { title, startTime, interviewId: interview.id },
    performedBy: session.user.id,
  });

  // Send email to candidate
  sendInterviewEmail({
    to: application.email,
    candidateName: application.name || 'Candidate',
    companyName: ctx.companyName,
    title,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    timezone,
    location,
    meetingLink,
    schedulingUrl,
  }).catch((err) => {
    console.error('Failed to send interview email:', err);
  });

  return NextResponse.json({ interview, schedulingUrl }, { status: 201 });
}
