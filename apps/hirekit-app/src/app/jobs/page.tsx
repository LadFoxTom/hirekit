import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { DashboardLayout } from '@/app/components/DashboardLayout';

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { active?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) redirect('/onboarding');

  const showActive = searchParams.active !== 'false';

  const [jobs, activeCount, inactiveCount] = await Promise.all([
    db.job.findMany({
      where: { companyId: ctx.companyId, active: showActive },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } },
      },
    }),
    db.job.count({ where: { companyId: ctx.companyId, active: true } }),
    db.job.count({ where: { companyId: ctx.companyId, active: false } }),
  ]);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B]">Jobs</h2>
            <p className="text-[#64748B] text-[15px] mt-1">
              Manage your job postings
            </p>
          </div>
          <Link
            href="/jobs/new"
            className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl font-semibold text-sm hover:bg-[#4338CA] transition-all duration-300 shadow-md shadow-indigo-500/25 flex items-center gap-2"
          >
            <i className="ph ph-plus text-base" />
            New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-[20px] flex items-center justify-center bg-[#DCFCE7]">
                <i className="ph ph-check-circle text-xl text-[#16A34A]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1E293B]">{activeCount}</p>
            <p className="text-sm text-[#64748B] mt-1">Active Jobs</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-[20px] flex items-center justify-center bg-[#F1F5F9]">
                <i className="ph ph-archive text-xl text-[#64748B]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1E293B]">{inactiveCount}</p>
            <p className="text-sm text-[#64748B] mt-1">Inactive Jobs</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Link
            href="/jobs"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              showActive
                ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                : 'bg-white text-[#64748B] border border-slate-200 hover:border-[#4F46E5] hover:text-[#4F46E5]'
            }`}
          >
            Active ({activeCount})
          </Link>
          <Link
            href="/jobs?active=false"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              !showActive
                ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                : 'bg-white text-[#64748B] border border-slate-200 hover:border-[#4F46E5] hover:text-[#4F46E5]'
            }`}
          >
            Inactive ({inactiveCount})
          </Link>
        </div>

        {/* Job List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {jobs.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-[#E0E7FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-briefcase text-[#4F46E5] text-2xl" />
              </div>
              <p className="text-[#64748B] text-[15px]">
                {showActive
                  ? 'No active jobs. Create your first job posting.'
                  : 'No inactive jobs.'}
              </p>
              {showActive && (
                <Link
                  href="/jobs/new"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl font-semibold text-sm hover:bg-[#4338CA] transition-all"
                >
                  <i className="ph ph-plus" />
                  Create Job
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-[#FAFBFC]">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-[#FAFBFC] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {job.department || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {job.location || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {job.type ? job.type.charAt(0).toUpperCase() + job.type.slice(1) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E293B]">
                        <i className="ph ph-users text-[#94A3B8]" />
                        {job._count.applications}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
