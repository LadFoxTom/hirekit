import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { logActivity } from '@/lib/activity';
import { getCompanyForUser } from '@/lib/company';
import { triggerAutoEmail } from '@/lib/candidate-email';

const VALID_STATUSES = ['new', 'screening', 'interviewing', 'offered', 'hired', 'rejected'];

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const body = await request.json();
  const { applicationId, applicationIds, status } = body;

  // Support both single ID (kanban) and array (bulk actions)
  const ids: string[] = applicationIds
    ? applicationIds
    : applicationId
      ? [applicationId]
      : [];

  if (ids.length === 0 || !status) {
    return NextResponse.json({ error: 'Missing applicationId(s) or status' }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const result = await db.application.updateMany({
    where: { id: { in: ids }, companyId: ctx.companyId },
    data: { status },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Log activity and trigger auto emails for each updated application
  for (const id of ids) {
    logActivity({
      companyId: ctx.companyId,
      applicationId: id,
      type: 'status_change',
      data: { to: status },
      performedBy: session.user.id,
    });
    triggerAutoEmail(ctx.companyId, id, status).catch(() => {});
  }

  return NextResponse.json({ success: true, updated: result.count });
}
