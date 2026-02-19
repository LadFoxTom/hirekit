import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';

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

  const job = await db.job.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
    include: {
      _count: { select: { applications: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(job);
}

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

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.location !== undefined) data.location = body.location || null;
  if (body.type !== undefined) data.type = body.type || null;
  if (body.department !== undefined) data.department = body.department || null;
  if (body.salaryMin !== undefined) data.salaryMin = body.salaryMin ? Number(body.salaryMin) : null;
  if (body.salaryMax !== undefined) data.salaryMax = body.salaryMax ? Number(body.salaryMax) : null;
  if (body.salaryCurrency !== undefined) data.salaryCurrency = body.salaryCurrency || 'EUR';
  if (body.active !== undefined) data.active = Boolean(body.active);

  const result = await db.job.updateMany({
    where: { id: params.id, companyId: ctx.companyId },
    data,
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
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

  // Soft delete by setting active to false
  const result = await db.job.updateMany({
    where: { id: params.id, companyId: ctx.companyId },
    data: { active: false },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
