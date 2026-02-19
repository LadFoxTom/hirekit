import { db } from '@repo/database-hirekit';
import type { Prisma } from '@repo/database-hirekit';

type ActivityType =
  | 'application_created'
  | 'status_change'
  | 'note_added'
  | 'ai_scored'
  | 'email_sent'
  | 'evaluation_added'
  | 'interview_scheduled'
  | 'interview_completed';

export function logActivity(params: {
  companyId: string;
  applicationId?: string | null;
  type: ActivityType;
  data: Record<string, unknown>;
  performedBy?: string | null;
}) {
  // Fire-and-forget: non-blocking, errors silently caught
  db.activityLog.create({
    data: {
      companyId: params.companyId,
      applicationId: params.applicationId ?? null,
      type: params.type,
      data: params.data as Prisma.InputJsonValue,
      performedBy: params.performedBy ?? null,
    },
  }).catch((err) => {
    console.error('[ActivityLog] Failed to log activity:', err);
  });
}
