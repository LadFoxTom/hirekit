import Link from 'next/link';
import { ProblemCard, FeatureCard, HeroMockup } from '@/components/InteractiveCards';


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
              Stop sorting CVs.{' '}
              <span className="text-hk-primary">Start hiring faster.</span>
            </h1>
            <p className="text-xl mb-10 max-w-[500px] text-slate-500">
              Embed our powerful CV builder directly into your career portal. Give candidates a beautiful experience and get structured data instantly.
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
              Copy our embed snippet, drop it into your existing React, Vue, or HTML page, and instantly get a full-featured CV builder. It matches your brand automatically.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Customize colors and branding from the dashboard',
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
  return (
    <section id="features" className="py-28">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Everything you need to hire</h2>
          <p className="mt-4 text-slate-500 text-lg">More than just a form builder.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon="ph-duotone ph-paint-brush-broad"
            title="Theme Editor"
            description="Customize fonts, colors, and border radii to match your design system perfectly."
            color="#FF6B6B"
          />
          <FeatureCard
            icon="ph-duotone ph-database"
            title="Structured Data"
            description="Don't guess. Get clean JSON objects for every applicant: work history, skills, education."
            color="#4F46E5"
          />
          <FeatureCard
            icon="ph-duotone ph-translate"
            title="Multi-language"
            description="Supports multiple languages so candidates can apply in their preferred language."
            color="#51CF66"
          />
          <FeatureCard
            icon="ph-duotone ph-kanban"
            title="ATS Pipeline"
            description="Track candidates through screening, interviews, offers, and hiring with a drag-and-drop Kanban board."
            color="#F59E0B"
          />
          <FeatureCard
            icon="ph-duotone ph-magic-wand"
            title="AI Scoring"
            description="Automatically score and rank candidates based on skills, experience, and job fit using AI."
            color="#8B5CF6"
          />
          <FeatureCard
            icon="ph-duotone ph-chat-circle-dots"
            title="Chat Mode"
            description="Candidates can build their CV through an AI-powered conversational interface instead of forms."
            color="#EC4899"
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
    { label: 'New', color: '#3B82F6', icon: 'ph-fill ph-plus-circle', count: 24 },
    { label: 'Screening', color: '#F59E0B', icon: 'ph-fill ph-eye', count: 12 },
    { label: 'Interview', color: '#8B5CF6', icon: 'ph-fill ph-video-camera', count: 8 },
    { label: 'Offered', color: '#4F46E5', icon: 'ph-fill ph-handshake', count: 3 },
    { label: 'Hired', color: '#51CF66', icon: 'ph-fill ph-check-circle', count: 2 },
  ];

  return (
    <section className="py-28 bg-white">
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
              Manage your entire hiring process from one dashboard. Track candidates through every stage, score them with AI, and make data-driven hiring decisions.
            </p>
            <ul className="space-y-4">
              {[
                { icon: 'ph-fill ph-kanban', text: 'Drag-and-drop Kanban board for visual pipeline management' },
                { icon: 'ph-fill ph-brain', text: 'AI-powered candidate scoring based on job requirements' },
                { icon: 'ph-fill ph-chart-line-up', text: 'Analytics dashboard with hiring trends and funnel metrics' },
                { icon: 'ph-fill ph-briefcase', text: 'Full job management with departments and salary ranges' },
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
                        {i === 0 && stage.label !== 'New' && (
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
   HOW IT WORKS
   ═══════════════════════════════════════════ */
function HowItWorksSection() {
  const steps = [
    { num: 1, icon: 'ph-duotone ph-code', title: 'Embed Widget', desc: 'Add the Javascript snippet to your career page.' },
    { num: 2, icon: 'ph-duotone ph-sliders-horizontal', title: 'Configure', desc: 'Set your required fields and branding in our dashboard.' },
    { num: 3, icon: 'ph-duotone ph-paper-plane-tilt', title: 'Receive CVs', desc: 'Candidates apply and data flows into your database.' },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">How it works</h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between relative mt-16">
          {/* Gradient line */}
          <div
            className="hidden md:block absolute top-10 left-[50px] right-[50px] h-0.5 opacity-30 z-0"
            style={{ background: 'linear-gradient(90deg, #4F46E5 0%, #FF6B6B 50%, #51CF66 100%)' }}
          />

          {steps.map((step) => (
            <div key={step.num} className="relative z-[1] bg-hk-bg p-4 w-full md:w-[30%] text-center">
              <div className="w-12 h-12 bg-white border-2 border-hk-primary text-hk-primary font-bold rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
                {step.num}
              </div>
              <i className={`${step.icon} text-5xl text-hk-dark mb-4 block`} />
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-[15px] text-slate-500 mt-2">{step.desc}</p>
            </div>
          ))}
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
    <section id="pricing" className="py-28">
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
              Full access to the CV builder widget, ATS pipeline, AI scoring, and analytics dashboard. No credit card required.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-[400px] mx-auto">
              {[
                'Unlimited applications',
                'Embeddable widget',
                'Kanban pipeline',
                'AI candidate scoring',
                'Job management',
                'Analytics dashboard',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <i className="ph-bold ph-check text-hk-accent text-lg" />
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
      desc: 'Copy a snippet, paste it on your career page, and start receiving structured applications immediately.',
    },
    {
      icon: 'ph-fill ph-puzzle-piece',
      title: 'Widget + ATS in one',
      desc: 'No need to juggle separate tools. The CV builder and hiring pipeline work together seamlessly.',
    },
    {
      icon: 'ph-fill ph-brain',
      title: 'AI does the heavy lifting',
      desc: 'Candidates get AI writing help. You get AI-powered scoring and ranking. Everyone wins.',
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
      <ATSPipelineSection />
      <HowItWorksSection />
      <PricingSection />
      <WhyHireKitSection />
      <CTASection />
    </main>
  );
}
