interface MergeContext {
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  companyName?: string;
  status?: string;
  applicationDate?: string;
}

const MERGE_FIELDS: Record<string, (ctx: MergeContext) => string> = {
  '{{candidate_name}}': (ctx) => ctx.candidateName || 'Candidate',
  '{{candidate_email}}': (ctx) => ctx.candidateEmail || '',
  '{{job_title}}': (ctx) => ctx.jobTitle || 'the position',
  '{{company_name}}': (ctx) => ctx.companyName || 'Our Company',
  '{{status}}': (ctx) => ctx.status || '',
  '{{application_date}}': (ctx) => ctx.applicationDate || '',
};

export function applyMergeFields(template: string, context: MergeContext): string {
  let result = template;
  for (const [field, resolver] of Object.entries(MERGE_FIELDS)) {
    result = result.replaceAll(field, resolver(context));
  }
  return result;
}

export const AVAILABLE_MERGE_FIELDS = Object.keys(MERGE_FIELDS);
