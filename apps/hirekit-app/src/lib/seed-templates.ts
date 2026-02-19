import { db } from '@repo/database-hirekit';

const DEFAULT_TEMPLATES = [
  {
    name: 'Application Received',
    subject: 'Application Received - {{job_title}} at {{company_name}}',
    body: `Dear {{candidate_name}},

Thank you for applying for the {{job_title}} position at {{company_name}}. We have received your application and will review it carefully.

We will be in touch soon with next steps.

Best regards,
{{company_name}} Hiring Team`,
    trigger: 'new',
    isDefault: true,
  },
  {
    name: 'Moved to Screening',
    subject: 'Application Update - {{company_name}}',
    body: `Dear {{candidate_name}},

We are pleased to inform you that your application for {{job_title}} has moved to the screening phase. Our team is reviewing your qualifications.

We will reach out shortly with more details.

Best regards,
{{company_name}} Hiring Team`,
    trigger: 'screening',
    isDefault: true,
  },
  {
    name: 'Interview Invitation',
    subject: 'Interview Invitation - {{job_title}} at {{company_name}}',
    body: `Dear {{candidate_name}},

Congratulations! We'd like to invite you for an interview for the {{job_title}} position at {{company_name}}.

We will be reaching out shortly to schedule a convenient time.

Best regards,
{{company_name}} Hiring Team`,
    trigger: 'interviewing',
    isDefault: true,
  },
  {
    name: 'Offer Extended',
    subject: 'Exciting News - {{company_name}}',
    body: `Dear {{candidate_name}},

We are delighted to extend an offer for the {{job_title}} position at {{company_name}}. We were impressed by your qualifications and believe you would be a great addition to our team.

We will be in touch with the formal details shortly.

Best regards,
{{company_name}} Hiring Team`,
    trigger: 'offered',
    isDefault: true,
  },
  {
    name: 'Application Rejection',
    subject: 'Application Update - {{company_name}}',
    body: `Dear {{candidate_name}},

Thank you for your interest in the {{job_title}} position at {{company_name}} and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We appreciate your interest and wish you the best in your career search.

Best regards,
{{company_name}} Hiring Team`,
    trigger: 'rejected',
    isDefault: true,
  },
];

export async function seedDefaultEmailTemplates(companyId: string) {
  const existing = await db.emailTemplate.count({ where: { companyId } });
  if (existing > 0) return;

  await db.emailTemplate.createMany({
    data: DEFAULT_TEMPLATES.map((t) => ({
      ...t,
      companyId,
    })),
  });
}
