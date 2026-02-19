import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { getPipelineStages } from '@/lib/pipeline';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const stages = await getPipelineStages(ctx.companyId);
  return NextResponse.json({ stages });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const body = await request.json();
  const { name, slug, color, bgColor, icon, type } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
  }

  // Get max order
  const maxStage = await db.pipelineStage.findFirst({
    where: { companyId: ctx.companyId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const stage = await db.pipelineStage.create({
    data: {
      companyId: ctx.companyId,
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      color: color || '#4F46E5',
      bgColor: bgColor || '#E0E7FF',
      icon: icon || null,
      order: (maxStage?.order ?? -1) + 1,
      type: type || 'active',
    },
  });

  return NextResponse.json({ stage }, { status: 201 });
}

// PUT: bulk reorder
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const { stages } = await request.json();
  if (!Array.isArray(stages)) {
    return NextResponse.json({ error: 'stages array required' }, { status: 400 });
  }

  // Update all stages in a transaction
  await db.$transaction(
    stages.map((s: { id: string; order: number; name?: string; color?: string; bgColor?: string; icon?: string; type?: string }) =>
      db.pipelineStage.updateMany({
        where: { id: s.id, companyId: ctx.companyId },
        data: {
          order: s.order,
          ...(s.name !== undefined && { name: s.name }),
          ...(s.color !== undefined && { color: s.color }),
          ...(s.bgColor !== undefined && { bgColor: s.bgColor }),
          ...(s.icon !== undefined && { icon: s.icon }),
          ...(s.type !== undefined && { type: s.type }),
        },
      })
    )
  );

  const updated = await getPipelineStages(ctx.companyId);
  return NextResponse.json({ stages: updated });
}
