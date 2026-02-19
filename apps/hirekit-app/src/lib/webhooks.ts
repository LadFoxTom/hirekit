import { db } from '@repo/database-hirekit';
import crypto from 'crypto';

const EVENT_MAP: Record<string, string> = {
  application_created: 'application.created',
  status_change: 'application.status_changed',
  note_added: 'application.note_added',
  ai_scored: 'application.ai_scored',
  evaluation_added: 'evaluation.added',
  interview_scheduled: 'interview.scheduled',
  interview_completed: 'interview.completed',
  email_sent: 'email.sent',
};

export async function dispatchWebhooks(
  companyId: string,
  activityType: string,
  payload: Record<string, unknown>
) {
  const eventName = EVENT_MAP[activityType];
  if (!eventName) return;

  try {
    const webhooks = await db.webhook.findMany({
      where: { companyId, active: true },
    });

    for (const webhook of webhooks) {
      if (!webhook.events.includes(eventName)) continue;

      const body = JSON.stringify({
        event: eventName,
        timestamp: new Date().toISOString(),
        data: payload,
      });

      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(body)
        .digest('hex');

      // Fire-and-forget
      fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-HireKit-Signature': signature,
          'X-HireKit-Event': eventName,
        },
        body,
        signal: AbortSignal.timeout(10000),
      })
        .then(async (res) => {
          if (!res.ok) {
            await db.webhook.update({
              where: { id: webhook.id },
              data: { lastError: `HTTP ${res.status}`, lastTriggeredAt: new Date() },
            });
          } else {
            await db.webhook.update({
              where: { id: webhook.id },
              data: { lastError: null, lastTriggeredAt: new Date() },
            });
          }
        })
        .catch(async (err) => {
          await db.webhook.update({
            where: { id: webhook.id },
            data: {
              lastError: err instanceof Error ? err.message : 'Unknown error',
              lastTriggeredAt: new Date(),
            },
          }).catch(() => {});
        });
    }
  } catch (err) {
    console.error('[Webhooks] Failed to dispatch:', err);
  }
}
