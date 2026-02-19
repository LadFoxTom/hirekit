import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { getPipelineStages } from '@/lib/pipeline';

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
  const days = parseInt(searchParams.get('days') || '30', 10);
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const companyId = ctx.companyId;

  // Fetch all applications in date range
  const applications = await db.application.findMany({
    where: { companyId, createdAt: { gte: fromDate } },
    select: { id: true, status: true, source: true, createdAt: true, hiredAt: true, jobId: true },
  });

  // Total counts
  const totalApplications = await db.application.count({ where: { companyId } });

  // Trend: daily counts
  const trendMap: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    trendMap[d.toISOString().split('T')[0]] = 0;
  }
  for (const app of applications) {
    const key = app.createdAt.toISOString().split('T')[0];
    if (trendMap[key] !== undefined) trendMap[key]++;
  }
  const trend = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

  // Pipeline: status distribution (all time)
  const stages = await getPipelineStages(companyId);
  const pipelineRaw = await db.application.groupBy({
    by: ['status'],
    where: { companyId },
    _count: { id: true },
  });
  const pipeline = stages.map((s) => ({
    status: s.slug,
    name: s.name,
    color: s.color,
    bgColor: s.bgColor,
    count: pipelineRaw.find((p) => p.status === s.slug)?._count.id || 0,
  }));

  // Source breakdown
  const sourceMap: Record<string, number> = {};
  for (const app of applications) {
    const src = app.source || 'unknown';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  }
  const sources = Object.entries(sourceMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  // Time to hire (from applications that have hiredAt)
  const hiredApps = await db.application.findMany({
    where: { companyId, hiredAt: { not: null } },
    select: { createdAt: true, hiredAt: true },
  });

  let timeToHire = { avg: 0, median: 0, count: 0 };
  if (hiredApps.length > 0) {
    const durations = hiredApps
      .map((a) => {
        const diff = (a.hiredAt!.getTime() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return Math.max(0, Math.round(diff));
      })
      .sort((a, b) => a - b);

    const avg = Math.round(durations.reduce((s, d) => s + d, 0) / durations.length);
    const median = durations[Math.floor(durations.length / 2)];
    timeToHire = { avg, median, count: durations.length };
  }

  // Top jobs by application count
  const topJobs = await db.job.findMany({
    where: { companyId, active: true },
    include: { _count: { select: { applications: true } } },
    orderBy: { applications: { _count: 'desc' } },
    take: 10,
  });

  // Conversion rate — sum positive_end stages
  const positiveEndSlugs = stages.filter((s) => s.type === 'positive_end').map((s) => s.slug);
  const hiredCount = pipeline.filter((p) => positiveEndSlugs.includes(p.status)).reduce((sum, p) => sum + p.count, 0);
  const conversionRate = totalApplications > 0 ? Math.round((hiredCount / totalApplications) * 100) : 0;

  return NextResponse.json({
    totalApplications,
    trend,
    pipeline,
    sources,
    timeToHire,
    conversionRate,
    topJobs: topJobs.map((j) => ({
      id: j.id,
      title: j.title,
      department: j.department,
      applications: j._count.applications,
    })),
  });
}
