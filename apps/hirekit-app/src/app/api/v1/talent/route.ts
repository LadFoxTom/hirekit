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
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const jobId = searchParams.get('jobId') || '';
  const minScore = parseInt(searchParams.get('minScore') || '0', 10);
  const maxScore = parseInt(searchParams.get('maxScore') || '100', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { companyId: ctx.companyId };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { cvText: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (jobId) {
    where.jobId = jobId;
  }

  if (minScore > 0 || maxScore < 100) {
    where.aiScore = {
      ...(minScore > 0 ? { gte: minScore } : {}),
      ...(maxScore < 100 ? { lte: maxScore } : {}),
    };
  }

  const [applications, total] = await Promise.all([
    db.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        aiScore: true,
        source: true,
        createdAt: true,
        job: { select: { id: true, title: true } },
      },
    }),
    db.application.count({ where }),
  ]);

  return NextResponse.json({
    candidates: applications,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
