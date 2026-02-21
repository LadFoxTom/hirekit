import Link from 'next/link';
import { ProblemCard, FeatureCard, FeatureShowcaseBlock, HeroMockup } from '@/components/InteractiveCards';


/* ═══════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════ */
function Header() {
  return (
    <header className="sticky top-0 z-50 bg-hk-bg/85 backdrop-blur-md border-b border-slate-200 py-5">
      <div className="max-w-container mx-auto px-6">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold text-hk-primary flex items-center gap-2">
            <i className="ph-fill ph-circles-three-plus text-[32px]" />
            HireKit
          </Link>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="font-medium text-hk-dark hover:text-hk-primary transition-colors">Features</a>
            <a href="#how-it-works" className="font-medium text-hk-dark hover:text-hk-primary transition-colors">How it Works</a>
            <a href="#pricing" className="font-medium text-hk-dark hover:text-hk-primary transition-colors">Pricing</a>
            <a href="/auth/login" className="font-medium text-hk-dark hover:text-hk-primary transition-colors">Login</a>
          </div>
          <a
            href="/auth/signup"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-hk-primary text-white rounded-full font-semibold shadow-md shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/35 transition-all duration-300"
          >
            Start free trial <i className="ph-bold ph-arrow-right" />
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */
function Hero() {
  return (
    <section className="pt-20 pb-36 relative overflow-hidden">
      <div className="max-w-container mx-auto px-6 relative z-[2]">
        {/* Blobs */}
        <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] bg-indigo-100 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[80px] opacity-60 animate-blob-float z-0" />
        <div className="absolute bottom-[50px] -left-[100px] w-[400px] h-[400px] bg-rose-100 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-[80px] opacity-60 animate-blob-float z-0" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="relative z-[2]">
            <h1 className="text-5xl lg:text-[64px] mb-6 font-bold tracking-tight leading-[1.1]">
              The all-in-one hiring platform{' '}
              <span className="text-hk-primary">for growing teams.</span>
            </h1>
            <p className="text-xl mb-10 max-w-[500px] text-slate-500">
              ATS pipeline, embeddable widgets, AI scoring, hosted career pages, and everything you need to hire — all in one platform.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-hk-primary text-white rounded-full font-semibold shadow-md shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/35 transition-all duration-300"
              >
                Start free trial
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-hk-dark hover:bg-black/[0.03] transition-all duration-300"
              >
                <i className="ph-fill ph-arrow-down" /> See features
              </a>
            </div>
          </div>

          {/* Right: Mockup */}
          <div className="relative z-[2]">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PROBLEMS
   ═══════════════════════════════════════════ */
function ProblemsSection() {
  return (
    <section className="pt-10 pb-28">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProblemCard
            icon="ph-fill ph-file-x"
            title="PDF Chaos"
            description="Parsing unstructured PDFs is a nightmare. Missing data and broken formatting kill productivity."
            iconBg="#FEE2E2"
            iconColor="#FF6B6B"
            rotate="rotate(-2deg)"
          />
          <ProblemCard
            icon="ph-fill ph-envelope-open"
            title="Inbox Overflow"
            description="Email attachments get lost. Keeping track of versions across threads is impossible."
            iconBg="#E0E7FF"
            iconColor="#4F46E5"
            rotate="rotate(1deg)"
          />
          <ProblemCard
            icon="ph-fill ph-mask-sad"
            title="Bad UX"
            description="Clunky forms drive top talent away. Candidates hate re-typing their resume 50 times."
            iconBg="#DCFCE7"
            iconColor="#51CF66"
            rotate="rotate(2deg)"
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SOLUTION (code snippet)
   ═══════════════════════════════════════════ */
function SolutionSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <span className="text-hk-primary font-bold uppercase text-sm tracking-widest">
              The Solution
            </span>
            <h2 className="text-4xl mt-4 mb-6 font-bold">Just 5 lines of code.</h2>
            <p className="text-slate-500 text-lg">
              Copy our embed snippet, drop it into your existing React, Vue, or HTML page, and instantly get a full-featured CV builder or interactive job board. It matches your brand automatically.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Hosted career pages with SEO and Google Jobs schema',
                'Rich text editor for beautiful, structured job listings',
                'Get structured JSON data for every applicant',
                'Mobile responsive out of the box',
              ].map((item) => (
                <li key={item} className="flex gap-3 items-center">
                  <i className="ph-fill ph-check-circle text-hk-accent text-2xl" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Code block */}
          <div className="bg-hk-dark rounded-2xl p-6 font-mono text-indigo-300 text-sm shadow-lg relative overflow-hidden">
            <div className="flex gap-1.5 mb-5 opacity-50">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <code className="block mb-2">
              <span className="text-pink-400">&lt;script</span>{' '}
              <span className="text-purple-400">src</span>=
              <span className="text-hk-accent">&quot;https://your-app.vercel.app/widget/hirekit-widget.iife.js&quot;</span>
              <span className="text-pink-400">&gt;&lt;/script&gt;</span>
            </code>
            <code className="block mb-2" />
            <code className="block mb-2">
              <span className="text-pink-400">&lt;div</span>{' '}
              <span className="text-purple-400">id</span>=
              <span className="text-hk-accent">&quot;hirekit-widget&quot;</span>
              <span className="text-pink-400">&gt;&lt;/div&gt;</span>
            </code>
            <code className="block mb-2" />
            <code className="block mb-2">
              <span className="text-pink-400">&lt;script&gt;</span>
            </code>
            <code className="block mb-2">
              {'  '}HireKit.<span className="text-purple-400">init</span>({'{'}{' '}
            </code>
            <code className="block mb-2">
              {'    '}<span className="text-purple-400">companyId</span>:{' '}
              <span className="text-hk-accent">&quot;your-company-id&quot;</span>,
            </code>
            <code className="block mb-2">
              {'    '}<span className="text-purple-400">jobId</span>:{' '}
              <span className="text-hk-accent">&quot;optional-job-id&quot;</span>
            </code>
            <code className="block mb-2">
              {'  '}{'}'});
            </code>
            <code className="block mb-2">
              <span className="text-pink-400">&lt;/script&gt;</span>
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FEATURES
   ═══════════════════════════════════════════ */
function FeaturesSection() {
  const features = [
    {
      icon: 'ph-duotone ph-kanban',
      title: 'ATS Pipeline',
      description: 'Custom pipeline stages with drag-and-drop Kanban board to track every candidate.',
      color: '#F59E0B',
    },
    {
      icon: 'ph-duotone ph-magic-wand',
      title: 'AI Scoring',
      description: 'Automatically score and rank candidates based on skills, experience, and job fit.',
      color: '#8B5CF6',
    },
    {
      icon: 'ph-duotone ph-sparkle',
      title: 'AI Job Writer',
      description: 'Generate rich job descriptions, requirements, and benefits with a single click.',
      color: '#EC4899',
    },
    {
      icon: 'ph-duotone ph-text-aa',
      title: 'Rich Text Editor',
      description: 'WYSIWYG editor for beautiful, structured job listings with formatting and media.',
      color: '#0EA5E9',
    },
    {
      icon: 'ph-duotone ph-globe',
      title: 'Hosted Career Pages',
      description: 'Branded career pages with SEO optimization and Google Jobs JSON-LD schema.',
      color: '#51CF66',
    },
    {
      icon: 'ph-duotone ph-code',
      title: 'Embeddable Widgets',
      description: 'CV builder and job board widgets you can embed in your site with just 5 lines of code.',
      color: '#4F46E5',
    },
    {
      icon: 'ph-duotone ph-magnifying-glass',
      title: 'Talent Pool',
      description: 'Search and filter across all candidates and past applicants by name, email, or skills.',
      color: '#FF6B6B',
    },
    {
      icon: 'ph-duotone ph-calendar',
      title: 'Interview Scheduling',
      description: 'Self-scheduling links so candidates can book their own interview slots.',
      color: '#F59E0B',
    },
    {
      icon: 'ph-duotone ph-envelope',
      title: 'Email & Communication',
      description: 'Customizable email templates for every hiring stage, from application to offer.',
      color: '#8B5CF6',
    },
    {
      icon: 'ph-duotone ph-exam',
      title: 'Evaluation Scorecards',
      description: 'Criteria-based scoring for structured, fair, and consistent candidate evaluations.',
      color: '#EC4899',
    },
    {
      icon: 'ph-duotone ph-users-three',
      title: 'Team Collaboration',
      description: 'Invite recruiters, assign roles (admin, recruiter, viewer), and collaborate on hiring.',
      color: '#0EA5E9',
    },
    {
      icon: 'ph-duotone ph-webhooks-logo',
      title: 'Webhooks & Integrations',
      description: 'Connect to Zapier, Slack, or your own API with real-time webhook events.',
      color: '#51CF66',
    },
  ];

  return (
    <section id="features" className="py-28">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Everything you need to hire</h2>
          <p className="mt-4 text-slate-500 text-lg">A complete hiring platform — not just a form builder.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.description}
              color={f.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   HOW IT WORKS — Deep Dive Showcase
   ═══════════════════════════════════════════ */

function JobFormMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="ph-fill ph-briefcase text-hk-primary text-lg" />
        <span className="font-bold text-hk-dark text-sm">New Job Listing</span>
      </div>
      <div className="space-y-3">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-[10px] text-slate-400 mb-1">Job Title</div>
          <div className="w-3/4 h-3 bg-slate-200 rounded" />
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-[10px] text-slate-400 mb-1">Description (Rich Text)</div>
          <div className="flex gap-1 mb-2">
            <div className="w-5 h-5 bg-slate-200 rounded" />
            <div className="w-5 h-5 bg-slate-200 rounded" />
            <div className="w-5 h-5 bg-slate-200 rounded" />
            <div className="w-5 h-5 bg-indigo-100 rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-slate-200 rounded" />
            <div className="w-5/6 h-2 bg-slate-200 rounded" />
            <div className="w-2/3 h-2 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-slate-50 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 mb-1">Workplace</div>
            <div className="w-2/3 h-3 bg-slate-200 rounded" />
          </div>
          <div className="flex-1 bg-slate-50 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 mb-1">Salary</div>
            <div className="w-1/2 h-3 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="px-3 py-1.5 bg-hk-primary text-white text-[10px] font-semibold rounded-lg">Publish</div>
          <div className="px-3 py-1.5 bg-indigo-50 text-hk-primary text-[10px] font-semibold rounded-lg flex items-center gap-1">
            <i className="ph-fill ph-sparkle text-xs" /> Generate with AI
          </div>
        </div>
      </div>
    </div>
  );
}

function CareerPageMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="bg-indigo-600 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg" />
          <div className="w-24 h-3 bg-white/30 rounded" />
        </div>
        <div className="w-3/4 h-4 bg-white/20 rounded mb-1" />
        <div className="w-1/2 h-3 bg-white/15 rounded" />
      </div>
      <div className="space-y-2">
        {['Senior Frontend Engineer', 'Product Designer', 'DevOps Engineer'].map((job) => (
          <div key={job} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <div className="text-xs font-semibold text-hk-dark">{job}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Remote &middot; Full-time</div>
            </div>
            <div className="px-2 py-1 bg-hk-primary text-white text-[10px] rounded-md font-medium">Apply</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-400">
        <i className="ph-fill ph-check-circle text-hk-accent" />
        Google Jobs schema included
      </div>
    </div>
  );
}

function PipelineMockup() {
  const stages = [
    { label: 'Applied', color: '#3B82F6', count: 18 },
    { label: 'Screening', color: '#F59E0B', count: 9 },
    { label: 'Interview', color: '#8B5CF6', count: 5 },
    { label: 'Offer', color: '#4F46E5', count: 2 },
    { label: 'Hired', color: '#51CF66', count: 1 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="ph-fill ph-kanban text-hk-primary text-lg" />
          <span className="font-bold text-hk-dark text-sm">Pipeline</span>
        </div>
        <div className="flex gap-1.5">
          <div className="px-2 py-1 bg-hk-primary text-white rounded text-[10px] font-medium">Board</div>
          <div className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-medium">List</div>
        </div>
      </div>
      <div className="flex gap-2">
        {stages.map((s) => (
          <div key={s.label} className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
              <span className="text-[10px] font-semibold text-hk-dark">{s.label}</span>
              <span className="text-[10px] text-slate-400 ml-auto">{s.count}</span>
            </div>
            {[...Array(Math.min(s.count, 2))].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-md border border-slate-100 p-2 mb-1.5">
                <div className="w-full h-1.5 bg-slate-200 rounded mb-1" />
                <div className="w-2/3 h-1.5 bg-slate-100 rounded mb-1.5" />
                <div className="flex items-center justify-between">
                  <div className="w-4 h-4 bg-slate-100 rounded-full" />
                  {i === 0 && (
                    <div className="flex items-center gap-0.5">
                      <i className="ph-fill ph-star text-amber-400 text-[8px]" />
                      <span className="text-[8px] font-bold text-slate-500">{92 - stages.indexOf(s) * 5}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 p-2 bg-slate-50 rounded-lg">
        <i className="ph-fill ph-clock-counter-clockwise text-slate-400 text-xs" />
        <span className="text-[10px] text-slate-400">Activity: Moved to Interview &middot; 2h ago</span>
      </div>
    </div>
  );
}

function ScorecardMockup() {
  const criteria = [
    { name: 'Technical Skills', score: 4 },
    { name: 'Communication', score: 5 },
    { name: 'Culture Fit', score: 3 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="ph-fill ph-exam text-hk-primary text-lg" />
        <span className="font-bold text-hk-dark text-sm">Evaluation</span>
      </div>
      <div className="space-y-3 mb-4">
        {criteria.map((c) => (
          <div key={c.name}>
            <div className="flex justify-between mb-1">
              <span className="text-[11px] font-medium text-hk-dark">{c.name}</span>
              <span className="text-[10px] text-slate-400">{c.score}/5</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="h-1.5 flex-1 rounded-full"
                  style={{ background: n <= c.score ? '#4F46E5' : '#E2E8F0' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <i className="ph-fill ph-calendar text-hk-primary text-sm" />
          <span className="text-[11px] font-semibold text-hk-dark">Interview</span>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium text-hk-dark">Technical Round</div>
            <div className="text-[9px] text-slate-400">Mon, 10:00 AM &middot; Self-scheduled</div>
          </div>
          <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] rounded font-medium">Confirmed</div>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-3 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center">
            <i className="ph-fill ph-user text-hk-primary text-[10px]" />
          </div>
          <div className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center">
            <i className="ph-fill ph-user text-rose-400 text-[10px]" />
          </div>
          <span className="text-[10px] text-slate-400 ml-1">2 evaluators</span>
        </div>
      </div>
    </div>
  );
}

function EmailMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="ph-fill ph-envelope text-hk-primary text-lg" />
        <span className="font-bold text-hk-dark text-sm">Email Templates</span>
      </div>
      <div className="space-y-2 mb-4">
        {[
          { name: 'Application Received', color: '#3B82F6' },
          { name: 'Interview Invitation', color: '#8B5CF6' },
          { name: 'Offer Letter', color: '#51CF66' },
        ].map((t) => (
          <div key={t.name} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
            <span className="text-[11px] font-medium text-hk-dark">{t.name}</span>
            <i className="ph-bold ph-pencil text-slate-300 text-xs ml-auto" />
          </div>
        ))}
      </div>
      <div className="bg-slate-50 rounded-lg p-3">
        <div className="text-[10px] text-slate-400 mb-2">Composing to 12 candidates...</div>
        <div className="space-y-1.5 mb-3">
          <div className="w-full h-2 bg-slate-200 rounded" />
          <div className="w-4/5 h-2 bg-slate-200 rounded" />
          <div className="w-3/5 h-2 bg-slate-100 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-hk-primary text-white text-[10px] rounded-md font-medium">Send Bulk</div>
          <span className="text-[9px] text-slate-400">Personalized with merge tags</span>
        </div>
      </div>
    </div>
  );
}

function InsightsMockup() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="ph-fill ph-chart-line-up text-hk-primary text-lg" />
        <span className="font-bold text-hk-dark text-sm">Reports</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Avg. Time to Hire', value: '18d' },
          { label: 'Open Positions', value: '12' },
          { label: 'This Month', value: '47' },
        ].map((s) => (
          <div key={s.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-hk-dark">{s.value}</div>
            <div className="text-[9px] text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
      {/* Mini chart */}
      <div className="flex items-end gap-1 h-16 mb-4">
        {[40, 55, 35, 65, 50, 80, 60, 75, 90, 70, 85, 95].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${h}%`, background: i >= 10 ? '#4F46E5' : '#E0E7FF' }}
          />
        ))}
      </div>
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <i className="ph-fill ph-webhooks-logo text-slate-400 text-xs" />
            <span className="text-[10px] text-slate-500">Webhook: Slack #hiring</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <i className="ph-fill ph-rss text-slate-400 text-xs" />
            <span className="text-[10px] text-slate-500">Indeed XML Feed</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-hk-primary font-bold uppercase text-sm tracking-widest">How it works</span>
          <h2 className="text-4xl mt-4 font-bold">From job post to hire, all in one place</h2>
          <p className="text-slate-500 text-lg mt-4 max-w-[600px] mx-auto">
            HireKit covers every step of the hiring process. Here&apos;s how teams use it to hire faster and smarter.
          </p>
        </div>

        <div className="space-y-24">
          <FeatureShowcaseBlock
            icon="ph-fill ph-pencil-simple-line"
            title="Post Jobs in Minutes"
            description="Create compelling job listings with our rich text editor or let AI generate the entire description for you. Add salary ranges, workplace type, benefits, and publish instantly."
            bullets={[
              'WYSIWYG rich text editor with formatting, lists, and media',
              'AI job description generator — one click for description, requirements, and benefits',
              'Salary period, workplace type, department, and benefit tags',
              'Publish to your career page and Indeed feed simultaneously',
            ]}
            visual={<JobFormMockup />}
          />

          <FeatureShowcaseBlock
            icon="ph-fill ph-globe"
            title="Branded Career Pages"
            description="Every company gets a hosted career page that looks professional, ranks in search engines, and converts visitors into applicants."
            bullets={[
              'SEO-optimized with automatic Google Jobs JSON-LD schema',
              'Responsive design that works on every device',
              'Custom branding — your logo, colors, and company info',
              'Or embed the job board widget on your own website',
            ]}
            visual={<CareerPageMockup />}
            reversed
          />

          <FeatureShowcaseBlock
            icon="ph-fill ph-kanban"
            title="Track Every Candidate"
            description="A visual Kanban pipeline that adapts to your hiring process. Customize stages, drag candidates between them, and let AI surface the best fits."
            bullets={[
              'Custom pipeline stages with colors, icons, and drag-and-drop reorder',
              'AI-powered candidate scoring based on job requirements',
              'Full activity timeline — every action tracked per candidate',
              'Talent pool search across all candidates and past applicants',
            ]}
            visual={<PipelineMockup />}
          />

          <FeatureShowcaseBlock
            icon="ph-fill ph-exam"
            title="Evaluate & Collaborate"
            description="Make fair, structured hiring decisions with scorecards and interview scheduling. Invite your team to collaborate with role-based access."
            bullets={[
              'Criteria-based evaluation scorecards for consistent assessments',
              'Self-scheduling interview links — candidates pick their own slots',
              'Team roles: admin, recruiter, and viewer permissions',
              'Multiple evaluators per candidate with aggregated scores',
            ]}
            visual={<ScorecardMockup />}
            reversed
          />

          <FeatureShowcaseBlock
            icon="ph-fill ph-envelope"
            title="Communicate at Scale"
            description="Customizable email templates for every hiring stage. Send personalized bulk emails and keep a complete communication history for every candidate."
            bullets={[
              'Pre-built templates for applications, interviews, offers, and rejections',
              'Bulk email with merge tags for personalization',
              'Batch status changes across multiple candidates',
              'Full communication history per candidate',
            ]}
            visual={<EmailMockup />}
          />

          <FeatureShowcaseBlock
            icon="ph-fill ph-chart-line-up"
            title="Insights & Integrations"
            description="Understand your hiring performance with built-in analytics. Connect HireKit to the tools you already use with webhooks and automated feeds."
            bullets={[
              'Pipeline reports, time-to-hire metrics, and CSV export',
              'Webhooks to Zapier, Slack, or any custom API',
              'Automatic Indeed XML feed for job syndication',
              'GDPR compliance tools — consent management and data deletion',
            ]}
            visual={<InsightsMockup />}
            reversed
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ATS PIPELINE
   ═══════════════════════════════════════════ */
function ATSPipelineSection() {
  const stages = [
    { label: 'Applied', color: '#3B82F6', icon: 'ph-fill ph-plus-circle', count: 24 },
    { label: 'Screening', color: '#F59E0B', icon: 'ph-fill ph-eye', count: 12 },
    { label: 'Interview', color: '#8B5CF6', icon: 'ph-fill ph-video-camera', count: 8 },
    { label: 'Offered', color: '#4F46E5', icon: 'ph-fill ph-handshake', count: 3 },
    { label: 'Hired', color: '#51CF66', icon: 'ph-fill ph-check-circle', count: 2 },
  ];

  return (
    <section className="py-28">
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <span className="text-hk-primary font-bold uppercase text-sm tracking-widest">
              Built-in ATS
            </span>
            <h2 className="text-4xl mt-4 mb-6 font-bold">
              More than a CV builder.{' '}
              <span className="text-hk-primary">A complete hiring pipeline.</span>
            </h2>
            <p className="text-slate-500 text-lg mb-8">
              Manage your entire hiring process from one dashboard. Customize pipeline stages, score candidates with AI, and track every interaction.
            </p>
            <ul className="space-y-4">
              {[
                { icon: 'ph-fill ph-kanban', text: 'Custom pipeline stages with drag-and-drop reorder' },
                { icon: 'ph-fill ph-brain', text: 'AI-powered candidate scoring based on job requirements' },
                { icon: 'ph-fill ph-magnifying-glass', text: 'Talent pool search across all candidates and applicants' },
                { icon: 'ph-fill ph-clock-counter-clockwise', text: 'Full activity timeline — every action logged per candidate' },
              ].map((item) => (
                <li key={item.text} className="flex gap-3 items-start">
                  <i className={`${item.icon} text-hk-primary text-xl mt-0.5`} />
                  <span className="text-slate-600">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Pipeline mockup */}
          <div className="bg-hk-bg rounded-2xl border border-slate-200 p-6 shadow-sm">
            {/* Mini header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <i className="ph-fill ph-kanban text-hk-primary text-xl" />
                <span className="font-bold text-hk-dark">Pipeline View</span>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-500">All Jobs</div>
                <div className="px-3 py-1 bg-hk-primary text-white rounded-lg text-xs font-medium">Board</div>
              </div>
            </div>

            {/* Pipeline columns */}
            <div className="flex gap-3">
              {stages.map((stage) => (
                <div key={stage.label} className="flex-1">
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                    <span className="text-xs font-semibold text-hk-dark">{stage.label}</span>
                    <span className="text-xs text-slate-400 ml-auto">{stage.count}</span>
                  </div>
                  {/* Mini cards */}
                  {[...Array(Math.min(stage.count, 3))].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-slate-200 p-2.5 mb-2 shadow-sm">
                      <div className="w-full h-2 bg-slate-200 rounded mb-1.5" />
                      <div className="w-2/3 h-2 bg-slate-100 rounded mb-2" />
                      <div className="flex items-center justify-between">
                        <div className="w-5 h-5 bg-slate-100 rounded-full" />
                        {i === 0 && stage.label !== 'Applied' && (
                          <div className="flex items-center gap-1">
                            <i className="ph-fill ph-star text-amber-400 text-[10px]" />
                            <span className="text-[10px] font-bold text-slate-500">{85 - i * 10}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {stage.count > 3 && (
                    <div className="text-center text-[10px] text-slate-400 font-medium">+{stage.count - 3} more</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════ */
function PricingSection() {
  return (
    <section id="pricing" className="py-28 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-4xl font-bold">Simple, transparent pricing</h2>
          <p className="text-slate-500 text-lg mt-4 mb-10">
            We&apos;re currently in early access. Get started for free and we&apos;ll work with you on a plan that fits your hiring needs.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <i className="ph-fill ph-rocket-launch text-hk-primary text-3xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-hk-dark mb-2">Early Access</h3>
            <p className="text-slate-500 mb-8">
              Full access to every feature. No credit card required.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-[450px] mx-auto">
              {[
                'Unlimited applications',
                'Embeddable widgets',
                'Custom pipeline stages',
                'AI candidate scoring',
                'Hosted career pages',
                'AI job description writer',
                'Rich text editor',
                'Interview scheduling',
                'Email templates',
                'Evaluation scorecards',
                'Team collaboration',
                'Webhooks & integrations',
                'Talent pool search',
                'Reports & CSV export',
                'GDPR compliance tools',
                'Indeed XML feed',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <i className="ph-bold ph-check text-hk-accent text-lg shrink-0" />
                  <span className="text-sm text-slate-600">{feature}</span>
                </div>
              ))}
            </div>

            <a
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-3 bg-hk-primary text-white rounded-full font-semibold shadow-md shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/35 transition-all duration-300"
            >
              Get Started for Free <i className="ph-bold ph-arrow-right" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   WHY HIREKIT
   ═══════════════════════════════════════════ */
function WhyHireKitSection() {
  const reasons = [
    {
      icon: 'ph-fill ph-lightning',
      title: 'Setup in minutes',
      desc: 'Embed widgets, publish career pages, or configure your pipeline — go live in under 10 minutes.',
    },
    {
      icon: 'ph-fill ph-puzzle-piece',
      title: 'Everything in one platform',
      desc: 'ATS, career pages, widgets, scheduling, email, analytics — no more juggling separate tools.',
    },
    {
      icon: 'ph-fill ph-brain',
      title: 'AI does the heavy lifting',
      desc: 'AI writes job descriptions, scores candidates, and surfaces the best fits so you can focus on people.',
    },
  ];

  return (
    <section className="pb-28">
      <div className="max-w-container mx-auto px-6">
        <div className="bg-white p-12 rounded-[32px] max-w-[900px] mx-auto border border-slate-200">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-hk-dark">Why teams choose HireKit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((r) => (
              <div key={r.title} className="text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className={`${r.icon} text-hk-primary text-2xl`} />
                </div>
                <h3 className="font-bold text-hk-dark mb-2">{r.title}</h3>
                <p className="text-sm text-slate-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════ */
function CTASection() {
  return (
    <div className="max-w-container mx-auto px-6">
      <section
        className="relative rounded-[32px] py-20 px-6 mb-10 text-center text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)' }}
      >
        {/* Blobs */}
        <div className="absolute -top-[50px] -left-[50px] w-[300px] h-[300px] bg-white blur-[80px] opacity-10" />
        <div className="absolute -bottom-[50px] -right-[50px] w-[300px] h-[300px] bg-hk-accent blur-[80px] opacity-20" />

        <h2 className="text-5xl mb-6 relative z-[2] font-bold">Ready to streamline hiring?</h2>
        <p className="text-indigo-200 relative z-[2] mb-8 text-lg">
          Free during early access. No credit card required.
        </p>
        <a
          href="/auth/signup"
          className="relative z-[2] inline-flex items-center px-12 py-4 bg-white text-hk-primary rounded-full font-semibold text-lg hover:bg-hk-light hover:shadow-xl transition-all duration-300"
        >
          Get Started for Free
        </a>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <ProblemsSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ATSPipelineSection />
      <PricingSection />
      <WhyHireKitSection />
      <CTASection />
    </main>
  );
}
