import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { sendCandidateEmail } from '@/lib/candidate-email';

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

  const logs = await db.emailLog.findMany({
    where: { applicationId: params.id, companyId: ctx.companyId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ emails: logs });
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
    include: {
      job: { select: { title: true } },
      company: { select: { name: true } },
    },
  });

  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const { subject, body, templateId } = await request.json();

  if (!subject || !body) {
    return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 });
  }

  const sent = await sendCandidateEmail({
    companyId: ctx.companyId,
    applicationId: params.id,
    to: application.email,
    subject,
    body,
    templateId,
    sentBy: session.user.id,
    candidateName: application.name || undefined,
    jobTitle: application.job?.title || undefined,
    companyName: application.company.name,
  });

  return NextResponse.json({ success: sent });
}
