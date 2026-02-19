import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { StatusUpdater } from './StatusUpdater';
import { AiScoreCard } from './AiScoreCard';
import { ActivityTimeline } from './ActivityTimeline';
import { EmailHistory } from './EmailHistory';
import { ApplicationEmailButton } from './ApplicationEmailButton';
import { EvaluationPanel } from './EvaluationPanel';
import { AssigneeSelector } from './AssigneeSelector';
import { InterviewSection } from './InterviewSection';
import { getCompanyForUser } from '@/lib/company';

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) redirect('/onboarding');

  const application = await db.application.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
    include: { job: true },
  });
  if (!application) notFound();

  const cvData = application.cvData as Record<string, any>;
  const skills = getSkills(cvData.skills);
  const aiScore = (application as any).aiScore as number | null;
  const aiScoreData = (application as any).aiScoreData as Record<string, any> | null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <Link
            href="/applications"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
          >
            <i className="ph ph-arrow-left" />
            Back to Applications
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: CV Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#4F46E5] rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {(application.name || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#1E293B]">
                    {application.name || 'Unnamed Applicant'}
                  </h2>
                  {cvData.title && (
                    <p className="text-[15px] text-[#64748B] mt-1">{cvData.title}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-3">
                    {application.email && (
                      <span className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                        <i className="ph ph-envelope-simple" />
                        {application.email}
                      </span>
                    )}
                    {application.phone && (
                      <span className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                        <i className="ph ph-phone" />
                        {application.phone}
                      </span>
                    )}
                    {cvData.contact?.location && (
                      <span className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                        <i className="ph ph-map-pin" />
                        {cvData.contact.location}
                      </span>
                    )}
                  </div>
                </div>
                <ApplicationEmailButton applicationId={application.id} />
              </div>
            </div>

            {/* Summary */}
            {cvData.summary && (
              <Section title="Professional Summary" icon="ph ph-user-circle">
                <p className="text-[#1E293B] text-[15px] leading-relaxed whitespace-pre-wrap">
                  {cvData.summary}
                </p>
              </Section>
            )}

            {/* Experience */}
            {cvData.experience?.length > 0 && (
              <Section title="Work Experience" icon="ph ph-briefcase">
                <div className="space-y-5">
                  {cvData.experience.map((exp: Record<string, any>, i: number) => (
                    <div key={i} className="border-l-2 border-[#4F46E5] pl-5">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#1E293B]">
                          {exp.title || 'Untitled Position'}
                        </h4>
                        {exp.dates && (
                          <span className="text-sm text-[#94A3B8] shrink-0 ml-4 bg-[#F1F5F9] px-2 py-0.5 rounded">
                            {exp.dates}
                          </span>
                        )}
                      </div>
                      {exp.company && (
                        <p className="text-sm text-[#64748B] mt-0.5">{exp.company}</p>
                      )}
                      {(exp.achievements || exp.content)?.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {(exp.achievements || exp.content).map((item: string, j: number) => (
                            <li key={j} className="text-sm text-[#1E293B] flex gap-2">
                              <span className="text-[#51CF66] shrink-0 mt-0.5">
                                <i className="ph ph-check-circle text-base" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Education */}
            {cvData.education?.length > 0 && (
              <Section title="Education" icon="ph ph-graduation-cap">
                <div className="space-y-4">
                  {cvData.education.map((edu: Record<string, any>, i: number) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[#1E293B]">
                          {[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Untitled'}
                        </h4>
                        {edu.institution && (
                          <p className="text-sm text-[#64748B] mt-0.5">{edu.institution}</p>
                        )}
                      </div>
                      {edu.dates && (
                        <span className="text-sm text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded">
                          {edu.dates}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <Section title="Skills" icon="ph ph-star">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#E0E7FF] text-[#4F46E5] rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Interviews */}
            <InterviewSection applicationId={application.id} candidateEmail={application.email} />

            {/* Email History */}
            <EmailHistory applicationId={application.id} />

            {/* Activity Timeline */}
            <ActivityTimeline applicationId={application.id} />
          </div>

          {/* Right: Meta & Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1E293B] mb-4">Status</h3>
              <StatusUpdater
                applicationId={application.id}
                currentStatus={application.status}
              />
            </div>

            {/* Assignee */}
            <AssigneeSelector
              applicationId={application.id}
              currentAssignee={application.assignedTo}
            />

            {/* AI Score */}
            <AiScoreCard
              applicationId={application.id}
              currentScore={aiScore}
              currentScoreData={aiScoreData as any}
              hasJob={!!application.job}
            />

            {/* Evaluations */}
            <EvaluationPanel applicationId={application.id} />

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1E293B] mb-4">Details</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-[#94A3B8]">Applied</dt>
                  <dd className="font-medium text-[#1E293B] mt-0.5">
                    {new Date(application.createdAt).toLocaleString()}
                  </dd>
                </div>
                {application.job && (
                  <div>
                    <dt className="text-[#94A3B8]">Job</dt>
                    <dd className="font-medium text-[#1E293B] mt-0.5">
                      <Link
                        href={`/jobs/${application.job.id}`}
                        className="text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                      >
                        {application.job.title}
                      </Link>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-[#94A3B8]">Application ID</dt>
                  <dd className="font-mono text-xs text-[#94A3B8] mt-0.5">
                    {application.id}
                  </dd>
                </div>
              </dl>
            </div>

            {application.notes && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#1E293B] mb-3">Notes</h3>
                <p className="text-sm text-[#1E293B] whitespace-pre-wrap">
                  {application.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <i className={`${icon} text-xl text-[#4F46E5]`} />
        <h3 className="text-lg font-bold text-[#1E293B]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function getSkills(skills: unknown): string[] {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  if (typeof skills === 'object' && skills !== null) {
    const s = skills as Record<string, string[]>;
    return [...(s.technical || []), ...(s.soft || []), ...(s.tools || []), ...(s.industry || [])];
  }
  return [];
}
