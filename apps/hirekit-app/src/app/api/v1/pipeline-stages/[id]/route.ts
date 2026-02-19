import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';

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
  if (body.name !== undefined) data.name = body.name;
  if (body.color !== undefined) data.color = body.color;
  if (body.bgColor !== undefined) data.bgColor = body.bgColor;
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.type !== undefined) data.type = body.type;
  if (body.order !== undefined) data.order = body.order;

  const result = await db.pipelineStage.updateMany({
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

  const { searchParams } = request.nextUrl;
  const migrateTo = searchParams.get('migrateTo');

  const stage = await db.pipelineStage.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
  });
  if (!stage) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!migrateTo) {
    return NextResponse.json({ error: 'migrateTo parameter required' }, { status: 400 });
  }

  // Verify target stage exists
  const targetStage = await db.pipelineStage.findFirst({
    where: { companyId: ctx.companyId, slug: migrateTo },
  });
  if (!targetStage) {
    return NextResponse.json({ error: 'Target stage not found' }, { status: 400 });
  }

  // Transaction: migrate applications then delete stage
  await db.$transaction([
    db.application.updateMany({
      where: { companyId: ctx.companyId, status: stage.slug },
      data: { status: migrateTo },
    }),
    db.pipelineStage.delete({ where: { id: params.id } }),
  ]);

  return NextResponse.json({ success: true });
}
