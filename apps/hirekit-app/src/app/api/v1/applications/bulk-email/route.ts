import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { sendCandidateEmail } from '@/lib/candidate-email';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const { applicationIds, templateId, subject, body } = await request.json();

  if (!applicationIds?.length || !subject || !body) {
    return NextResponse.json({ error: 'applicationIds, subject, and body are required' }, { status: 400 });
  }

  const applications = await db.application.findMany({
    where: { id: { in: applicationIds }, companyId: ctx.companyId },
    include: {
      job: { select: { title: true } },
      company: { select: { name: true } },
    },
  });

  let sent = 0;
  for (const app of applications) {
    const ok = await sendCandidateEmail({
      companyId: ctx.companyId,
      applicationId: app.id,
      to: app.email,
      subject,
      body,
      templateId,
      sentBy: session.user.id,
      candidateName: app.name || undefined,
      jobTitle: app.job?.title || undefined,
      companyName: app.company.name,
    });
    if (ok) sent++;
  }

  return NextResponse.json({ success: true, sent, total: applications.length });
}
