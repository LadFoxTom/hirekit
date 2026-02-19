import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { StatusBadge } from '@/app/components/StatusBadge';
import { DashboardCharts } from './components/DashboardCharts';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) redirect('/onboarding');

  const company = await db.company.findUnique({
    where: { id: ctx.companyId },
    include: { branding: true },
  });
  if (!company) redirect('/onboarding');

  const [totalApplications, newApplications, activeJobs, hiredCount, recentApplications, upcomingInterviews] =
    await Promise.all([
      db.application.count({ where: { companyId: company.id } }),
      db.application.count({ where: { companyId: company.id, status: 'new' } }),
      db.job.count({ where: { companyId: company.id, active: true } }),
      db.application.count({ where: { companyId: company.id, status: 'hired' } }),
      db.application.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { job: { select: { title: true } } },
      }),
      db.interview.findMany({
        where: {
          companyId: company.id,
          startTime: { gte: new Date() },
          status: { in: ['scheduled', 'confirmed'] },
        },
        include: { application: { select: { name: true, email: true } } },
        orderBy: { startTime: 'asc' },
        take: 5,
      }),
    ]);

  const primaryColor = company.branding?.primaryColor || '#4F46E5';

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1E293B]">Dashboard</h2>
          <p className="text-[#64748B] text-[15px] mt-1">
            Welcome back. Here&apos;s what&apos;s happening with your applications.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Applications"
            value={totalApplications}
            icon="ph ph-users"
            color="#4F46E5"
            bgColor="#E0E7FF"
          />
          <StatCard
            label="New (Unreviewed)"
            value={newApplications}
            icon="ph ph-envelope-simple"
            color="#FF6B6B"
            bgColor="#FEE2E2"
          />
          <StatCard
            label="Active Jobs"
            value={activeJobs}
            icon="ph ph-briefcase"
            color="#2563EB"
            bgColor="#DBEAFE"
          />
          <StatCard
            label="Hired"
            value={hiredCount}
            icon="ph ph-check-circle"
            color="#16A34A"
            bgColor="#DCFCE7"
          />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <DashboardCharts />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Widget Snippet */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E0E7FF] rounded-[20px] flex items-center justify-center">
                <i className="ph ph-code text-[#4F46E5] text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">Install Widget</h3>
                <p className="text-sm text-[#64748B]">
                  Add this to your career page
                </p>
              </div>
            </div>
            <div className="bg-[#1E293B] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-xs text-slate-500 ml-2">embed.html</span>
              </div>
              <pre className="p-6 text-sm overflow-x-auto">
                <code>
                  <span className="text-[#F472B6]">&lt;div</span>
                  <span className="text-[#A78BFA]"> id</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-[#51CF66]">&quot;hirekit-widget&quot;</span>
                  <span className="text-[#F472B6]">&gt;&lt;/div&gt;</span>
                  {'\n'}
                  <span className="text-[#F472B6]">&lt;script</span>
                  <span className="text-[#A78BFA]"> src</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-[#51CF66]">&quot;/widget/hirekit-widget.iife.js&quot;</span>
                  <span className="text-[#F472B6]">&gt;&lt;/script&gt;</span>
                  {'\n'}
                  <span className="text-[#F472B6]">&lt;script&gt;</span>
                  {'\n'}
                  <span className="text-[#818CF8]">{'  HireKit'}</span>
                  <span className="text-slate-400">.init</span>
                  <span className="text-slate-300">{'({'}</span>
                  {'\n'}
                  <span className="text-[#A78BFA]">{'    companyId'}</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-[#51CF66]">&apos;{company.id}&apos;</span>
                  {'\n'}
                  <span className="text-slate-300">{'  })'}</span>
                  {'\n'}
                  <span className="text-[#F472B6]">&lt;/script&gt;</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#E0E7FF] rounded-[20px] flex items-center justify-center">
                <i className="ph ph-lightning text-[#4F46E5] text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">Quick Actions</h3>
                <p className="text-sm text-[#64748B]">Common tasks</p>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                href="/jobs/new"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-[#4F46E5] hover:bg-[#FAFBFC] transition-all duration-300"
              >
                <i className="ph ph-plus text-[#4F46E5]" />
                <span className="text-sm font-semibold text-[#1E293B]">Create New Job</span>
              </Link>
              <Link
                href="/applications?view=kanban"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-[#4F46E5] hover:bg-[#FAFBFC] transition-all duration-300"
              >
                <i className="ph ph-kanban text-[#4F46E5]" />
                <span className="text-sm font-semibold text-[#1E293B]">Pipeline Board</span>
              </Link>
              <Link
                href="/applications"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-[#4F46E5] hover:bg-[#FAFBFC] transition-all duration-300"
              >
                <i className="ph ph-users text-[#4F46E5]" />
                <span className="text-sm font-semibold text-[#1E293B]">View All Applications</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        {upcomingInterviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8">
            <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="ph ph-calendar text-lg text-[#4F46E5]" />
                <h3 className="text-lg font-bold text-[#1E293B]">Upcoming Interviews</h3>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E0E7FF] rounded-full flex items-center justify-center">
                      <i className="ph ph-video-camera text-[#4F46E5]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E293B] text-sm">{interview.title}</p>
                      <p className="text-xs text-[#94A3B8]">
                        {interview.application.name || interview.application.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1E293B]">
                      {new Date(interview.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {new Date(interview.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1E293B]">Recent Applications</h3>
            <Link
              href="/applications"
              className="text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
            >
              View all
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-[#E0E7FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-users text-[#4F46E5] text-2xl" />
              </div>
              <p className="text-[#64748B] text-[15px]">
                No applications yet. Install the widget to start receiving CVs.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between px-8 py-4 hover:bg-[#FAFBFC] transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {(app.name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E293B]">
                        {app.name || 'Unnamed Applicant'}
                      </p>
                      <p className="text-sm text-[#94A3B8]">{app.email}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <StatusBadge status={app.status} />
                    <span className="text-xs text-[#94A3B8]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  bgColor,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-[20px] flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <i className={`${icon} text-xl`} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#1E293B]">{value}</p>
      <p className="text-sm text-[#64748B] mt-1">{label}</p>
    </div>
  );
}
