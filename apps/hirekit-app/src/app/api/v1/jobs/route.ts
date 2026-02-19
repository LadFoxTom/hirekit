import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const { searchParams } = request.nextUrl;
  const active = searchParams.get('active');
  const search = searchParams.get('search');

  const where: Record<string, unknown> = { companyId: ctx.companyId };
  if (active !== null) where.active = active === 'true';
  if (search) {
    where.title = { contains: search, mode: 'insensitive' };
  }

  const jobs = await db.job.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { applications: true } },
    },
  });

  return NextResponse.json({ jobs });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.title || typeof body.title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const job = await db.job.create({
    data: {
      companyId: ctx.companyId,
      title: body.title as string,
      description: (body.description as string) || null,
      location: (body.location as string) || null,
      type: (body.type as string) || null,
      department: (body.department as string) || null,
      salaryMin: body.salaryMin ? Number(body.salaryMin) : null,
      salaryMax: body.salaryMax ? Number(body.salaryMax) : null,
      salaryCurrency: (body.salaryCurrency as string) || 'EUR',
    },
  });

  return NextResponse.json({ job }, { status: 201 });
}
