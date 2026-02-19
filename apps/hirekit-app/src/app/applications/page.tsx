import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { getPipelineStages } from '@/lib/pipeline';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { KanbanBoard } from './components/KanbanBoard';
import { JobFilter } from './components/JobFilter';
import { ApplicationsTable } from './components/ApplicationsTable';

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string; view?: string; jobId?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) redirect('/onboarding');

  const status = searchParams.status || 'all';
  const page = parseInt(searchParams.page || '1', 10);
  const view = searchParams.view || 'table';
  const jobId = searchParams.jobId || '';
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { companyId: ctx.companyId };
  if (status !== 'all') where.status = status;
  if (jobId) where.jobId = jobId;

  const [applications, total, jobs, pipelineStages] = await Promise.all([
    db.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(view === 'table' ? { skip, take: limit } : {}),
      include: { job: { select: { id: true, title: true } } },
    }),
    db.application.count({ where }),
    db.job.findMany({
      where: { companyId: ctx.companyId, active: true },
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    }),
    getPipelineStages(ctx.companyId),
  ]);

  const totalPages = Math.ceil(total / limit);
  const stageData = pipelineStages.map((s) => ({ slug: s.slug, name: s.name, color: s.color, bgColor: s.bgColor }));
  const statusOptions = ['all', ...pipelineStages.map((s) => s.slug)];

  const buildUrl = (params: Record<string, string>) => {
    const base: Record<string, string> = {};
    if (status !== 'all') base.status = status;
    if (view !== 'table') base.view = view;
    if (jobId) base.jobId = jobId;
    const merged = { ...base, ...params };
    const qs = new URLSearchParams(merged).toString();
    return `/applications${qs ? `?${qs}` : ''}`;
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B]">Applications</h2>
            <p className="text-[#64748B] text-[15px] mt-1">{total} total applications</p>
          </div>
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            <Link
              href={buildUrl({ view: 'table' })}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                view === 'table'
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <i className="ph ph-list text-base" />
            </Link>
            <Link
              href={buildUrl({ view: 'kanban' })}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                view === 'kanban'
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <i className="ph ph-kanban text-base" />
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((s) => (
              <Link
                key={s}
                href={buildUrl({ status: s === 'all' ? '' : s, page: '' })}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  status === s || (s === 'all' && status === 'all')
                    ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                    : 'bg-white text-[#64748B] border border-slate-200 hover:border-[#4F46E5] hover:text-[#4F46E5]'
                }`}
              >
                {s === 'all' ? 'All' : pipelineStages.find((st) => st.slug === s)?.name || s}
              </Link>
            ))}
          </div>

          {/* Job Filter */}
          {jobs.length > 0 && (
            <JobFilter
              jobs={jobs}
              currentJobId={jobId}
              baseUrl={buildUrl({})}
            />
          )}
        </div>

        {/* Kanban View */}
        {view === 'kanban' ? (
          <KanbanBoard
            applications={applications.map((app) => ({
              id: app.id,
              name: app.name,
              email: app.email,
              status: app.status,
              aiScore: (app as any).aiScore ?? null,
              createdAt: app.createdAt.toISOString(),
              job: app.job,
            }))}
            stages={pipelineStages.map((s) => ({ id: s.slug, label: s.name, color: s.color, bg: s.bgColor }))}
          />
        ) : (
          <>
            {/* Table View with Bulk Actions */}
            <ApplicationsTable
              applications={applications.map((app) => ({
                id: app.id,
                name: app.name,
                email: app.email,
                status: app.status,
                aiScore: (app as any).aiScore ?? null,
                createdAt: app.createdAt.toISOString(),
                job: app.job,
              }))}
              stages={stageData}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-[#64748B]">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={buildUrl({ page: String(page - 1) })}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-[#1E293B] hover:border-[#4F46E5] transition-all"
                    >
                      Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={buildUrl({ page: String(page + 1) })}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-[#1E293B] hover:border-[#4F46E5] transition-all"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
