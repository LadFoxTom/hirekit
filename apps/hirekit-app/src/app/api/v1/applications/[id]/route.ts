import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { logActivity } from '@/lib/activity';
import { getCompanyForUser } from '@/lib/company';
import { triggerAutoEmail } from '@/lib/candidate-email';
import { isValidStage, getStageBySlug } from '@/lib/pipeline';

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

  const body = await request.json();

  if (body.status && !(await isValidStage(ctx.companyId, body.status))) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  // Check if this is a positive end stage (e.g. hired)
  let isPositiveEnd = false;
  if (body.status) {
    const stage = await getStageBySlug(ctx.companyId, body.status);
    isPositiveEnd = stage?.type === 'positive_end';
  }

  const application = await db.application.updateMany({
    where: { id: params.id, companyId: ctx.companyId },
    data: {
      ...(body.status && { status: body.status }),
      ...(isPositiveEnd && { hiredAt: new Date() }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.assignedTo !== undefined && { assignedTo: body.assignedTo }),
    },
  });

  if (application.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (body.status) {
    logActivity({
      companyId: ctx.companyId,
      applicationId: params.id,
      type: 'status_change',
      data: { to: body.status },
      performedBy: session.user.id,
    });
    // Fire-and-forget auto email
    triggerAutoEmail(ctx.companyId, params.id, body.status).catch(() => {});
  }
  if (body.notes !== undefined) {
    logActivity({
      companyId: ctx.companyId,
      applicationId: params.id,
      type: 'note_added',
      data: { notes: typeof body.notes === 'string' ? body.notes.substring(0, 200) : '' },
      performedBy: session.user.id,
    });
  }

  return NextResponse.json({ success: true });
}

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

  const application = await db.application.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
    include: { job: true },
  });

  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(application);
}
