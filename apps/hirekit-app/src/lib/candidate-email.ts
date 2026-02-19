import { db } from '@repo/database-hirekit';
import { sendCandidateEmailRaw } from '@/lib/email';
import { applyMergeFields } from '@/lib/merge-fields';
import { logActivity } from '@/lib/activity';

interface SendCandidateEmailParams {
  companyId: string;
  applicationId: string;
  to: string;
  subject: string;
  body: string;
  templateId?: string;
  sentBy?: string;
  candidateName?: string;
  jobTitle?: string;
  companyName?: string;
}

export async function sendCandidateEmail(params: SendCandidateEmailParams) {
  const context = {
    candidateName: params.candidateName,
    candidateEmail: params.to,
    jobTitle: params.jobTitle,
    companyName: params.companyName,
  };

  const subject = applyMergeFields(params.subject, context);
  const body = applyMergeFields(params.body, context);

  const sent = await sendCandidateEmailRaw({ to: params.to, subject, body });

  // Log to database
  await db.emailLog.create({
    data: {
      companyId: params.companyId,
      applicationId: params.applicationId,
      templateId: params.templateId || null,
      to: params.to,
      subject,
      body,
      status: sent ? 'sent' : 'failed',
      sentBy: params.sentBy || null,
    },
  });

  // Log activity
  logActivity({
    companyId: params.companyId,
    applicationId: params.applicationId,
    type: 'email_sent',
    data: { subject, to: params.to },
    performedBy: params.sentBy,
  });

  return sent;
}

export async function triggerAutoEmail(
  companyId: string,
  applicationId: string,
  newStatus: string
) {
  try {
    const template = await db.emailTemplate.findFirst({
      where: { companyId, trigger: newStatus },
    });

    if (!template) return;

    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { select: { title: true } },
        company: { select: { name: true } },
      },
    });

    if (!application) return;

    await sendCandidateEmail({
      companyId,
      applicationId,
      to: application.email,
      subject: template.subject,
      body: template.body,
      templateId: template.id,
      candidateName: application.name || undefined,
      jobTitle: application.job?.title || undefined,
      companyName: application.company.name,
    });
  } catch (err) {
    console.error('[AutoEmail] Failed to trigger auto email:', err);
  }
}
