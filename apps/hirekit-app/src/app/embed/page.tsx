'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/app/components/DashboardLayout';

type Tab = 'cv-builder' | 'job-listings';

export default function EmbedCodePage() {
  const [companyId, setCompanyId] = useState('');
  const [copied, setCopied] = useState(false);
  const [appOrigin, setAppOrigin] = useState('');
  const [tab, setTab] = useState<Tab>('cv-builder');

  // Job listings config
  const [layout, setLayout] = useState<'cards' | 'list'>('cards');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showFilters, setShowFilters] = useState(true);
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    setAppOrigin(window.location.origin);
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setCompanyId(data.company?.id || ''))
      .catch(() => {});
  }, []);

  const widgetUrl = `${appOrigin}/widget/hirekit-widget.iife.js`;
  const jobsWidgetUrl = `${appOrigin}/widget/hirekit-jobs.iife.js`;

  const embedCode = `<!-- HireKit CV Builder Widget -->
<div id="hirekit-widget"></div>
<script>
  (function(w,d,s,o){
    w.HireKitConfig={companyId:'${companyId}'};
    var js=d.createElement(s);js.async=1;
    js.src='${widgetUrl}';
    js.onload=function(){w.HireKit.init(w.HireKitConfig)};
    d.head.appendChild(js);
  })(window,document,'script');
</script>`;

  const jobsConfigObj = [
    `companyId:'${companyId}'`,
    layout !== 'cards' ? `layout:'${layout}'` : '',
    theme !== 'light' ? `theme:'${theme}'` : '',
    !showFilters ? 'showFilters:false' : '',
    !showSearch ? 'showSearch:false' : '',
  ]
    .filter(Boolean)
    .join(',');

  const jobsEmbedCode = `<!-- HireKit Job Listings Widget -->
<div id="hirekit-jobs"></div>
<script>
  (function(w,d,s){
    var js=d.createElement(s);js.async=1;
    js.src='${jobsWidgetUrl}';
    js.onload=function(){w.HireKitJobs.init({${jobsConfigObj}})};
    d.head.appendChild(js);
  })(window,document,'script');
</script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1E293B]">Embed Code</h2>
          <p className="text-[#64748B] text-[15px] mt-1">
            Add HireKit widgets to your career page
          </p>
        </div>

        {copied && (
          <div className="mb-6 p-4 bg-[#DCFCE7] text-[#16A34A] rounded-2xl text-sm font-medium flex items-center gap-2">
            <i className="ph-check-circle text-lg" />
            Copied to clipboard!
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('cv-builder')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              tab === 'cv-builder'
                ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                : 'bg-white border border-slate-200 text-[#64748B] hover:border-[#4F46E5] hover:text-[#4F46E5]'
            }`}
          >
            <i className="ph-code mr-1.5" />
            CV Builder
          </button>
          <button
            onClick={() => setTab('job-listings')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              tab === 'job-listings'
                ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                : 'bg-white border border-slate-200 text-[#64748B] hover:border-[#4F46E5] hover:text-[#4F46E5]'
            }`}
          >
            <i className="ph-briefcase mr-1.5" />
            Job Listings
          </button>
        </div>

        {tab === 'cv-builder' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <i className="ph-code text-xl text-[#4F46E5]" />
                <h3 className="text-lg font-bold text-[#1E293B]">Embed Widget</h3>
              </div>
              <p className="text-[15px] text-[#64748B] mb-6">
                Copy this code into your career page where you want the CV builder to appear.
              </p>
              <div className="bg-[#1E293B] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-xs text-slate-500 ml-2">career-page.html</span>
                </div>
                <pre className="p-6 text-sm text-[#818CF8] overflow-x-auto">
{embedCode}
                </pre>
              </div>
              <button
                onClick={() => copyToClipboard(embedCode)}
                className="mt-4 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-[#1E293B] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all duration-300"
              >
                <i className="ph-copy mr-1.5" />
                Copy to Clipboard
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <i className="ph-link text-xl text-[#4F46E5]" />
                <h3 className="text-lg font-bold text-[#1E293B]">With Job ID</h3>
              </div>
              <p className="text-[15px] text-[#64748B] mb-4">
                Link applications to a specific job posting.
              </p>
              <div className="bg-[#1E293B] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                </div>
                <pre className="p-6 text-sm text-[#818CF8] overflow-x-auto">
{`<!-- Link to a specific job posting -->
<div id="hirekit-widget"></div>
<script>
  (function(w,d,s,o){
    w.HireKitConfig={companyId:'${companyId}',jobId:'YOUR_JOB_ID'};
    var js=d.createElement(s);js.async=1;
    js.src='${widgetUrl}';
    js.onload=function(){w.HireKit.init(w.HireKitConfig)};
    d.head.appendChild(js);
  })(window,document,'script');
</script>`}
                </pre>
              </div>
            </div>

            <div className="bg-[#E0E7FF] rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <i className="ph-lightbulb text-[#4F46E5] text-xl mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#1E293B] text-sm">Local Testing</h4>
                  <p className="text-sm text-[#64748B] mt-1">
                    To test the widget against your local dev server, add this before the init call:
                  </p>
                  <code className="block mt-2 text-xs text-[#4F46E5] bg-white/60 px-3 py-2 rounded-lg">
                    window.__HIREKIT_API_URL__ = &apos;http://localhost:3002/api&apos;;
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'job-listings' && (
          <div className="space-y-6">
            {/* Config controls */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <i className="ph-sliders-horizontal text-xl text-[#4F46E5]" />
                <h3 className="text-lg font-bold text-[#1E293B]">Configuration</h3>
              </div>
              <p className="text-[15px] text-[#64748B] mb-6">
                Customize how the job listing widget appears on your site. The code snippet below updates automatically.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Layout</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLayout('cards')}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        layout === 'cards'
                          ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]'
                          : 'bg-white border border-slate-200 text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      <i className="ph-grid-four mr-1.5" />
                      Cards
                    </button>
                    <button
                      onClick={() => setLayout('list')}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        layout === 'list'
                          ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]'
                          : 'bg-white border border-slate-200 text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      <i className="ph-list mr-1.5" />
                      List
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Theme</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        theme === 'light'
                          ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]'
                          : 'bg-white border border-slate-200 text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      <i className="ph-sun mr-1.5" />
                      Light
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]'
                          : 'bg-white border border-slate-200 text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      <i className="ph-moon mr-1.5" />
                      Dark
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Show Filters</label>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
                      showFilters ? 'bg-[#4F46E5]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full shadow absolute top-1 transition-all duration-300 ${
                        showFilters ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Show Search</label>
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
                      showSearch ? 'bg-[#4F46E5]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full shadow absolute top-1 transition-all duration-300 ${
                        showSearch ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Embed code */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <i className="ph-code text-xl text-[#4F46E5]" />
                <h3 className="text-lg font-bold text-[#1E293B]">Embed Code</h3>
              </div>
              <p className="text-[15px] text-[#64748B] mb-6">
                Copy this code into your career page. Candidates can browse jobs, view details, and apply — all without leaving your site.
              </p>
              <div className="bg-[#1E293B] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-xs text-slate-500 ml-2">careers.html</span>
                </div>
                <pre className="p-6 text-sm text-[#818CF8] overflow-x-auto">
{jobsEmbedCode}
                </pre>
              </div>
              <button
                onClick={() => copyToClipboard(jobsEmbedCode)}
                className="mt-4 px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-[#1E293B] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all duration-300"
              >
                <i className="ph-copy mr-1.5" />
                Copy to Clipboard
              </button>
            </div>

            <div className="bg-[#E0E7FF] rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <i className="ph-lightbulb text-[#4F46E5] text-xl mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#1E293B] text-sm">How it works</h4>
                  <p className="text-sm text-[#64748B] mt-1">
                    The job listing widget displays all your active jobs. When candidates click &quot;Apply&quot;, it loads the CV builder inline — they can browse and apply without leaving your site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
