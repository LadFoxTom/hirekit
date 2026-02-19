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

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [recentApplications, allApplications, topJobs] = await Promise.all([
    // Applications from last 30 days for trend
    db.application.findMany({
      where: {
        companyId: ctx.companyId,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
    // All applications for pipeline counts
    db.application.groupBy({
      by: ['status'],
      where: { companyId: ctx.companyId },
      _count: { id: true },
    }),
    // Top jobs by application count
    db.job.findMany({
      where: { companyId: ctx.companyId, active: true },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: {
        applications: { _count: 'desc' },
      },
      take: 5,
    }),
  ]);

  // Build daily trend data for last 30 days
  const dailyTrend: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split('T')[0];
    dailyTrend[key] = 0;
  }
  for (const app of recentApplications) {
    const key = app.createdAt.toISOString().split('T')[0];
    if (dailyTrend[key] !== undefined) {
      dailyTrend[key]++;
    }
  }

  const trend = Object.entries(dailyTrend).map(([date, count]) => ({
    date,
    count,
  }));

  // Pipeline funnel
  const pipelineOrder = ['new', 'screening', 'interviewing', 'offered', 'hired', 'rejected'];
  const pipeline = pipelineOrder.map((status) => {
    const found = allApplications.find((a) => a.status === status);
    return {
      status,
      count: found?._count?.id || 0,
    };
  });

  // Top jobs
  const topJobsData = topJobs.map((job) => ({
    title: job.title,
    count: job._count.applications,
  }));

  return NextResponse.json({
    trend,
    pipeline,
    topJobs: topJobsData,
  });
}
