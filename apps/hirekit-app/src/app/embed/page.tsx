'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/app/components/DashboardLayout';

export default function EmbedCodePage() {
  const [companyId, setCompanyId] = useState('');
  const [copied, setCopied] = useState(false);
  const [appOrigin, setAppOrigin] = useState('');

  useEffect(() => {
    setAppOrigin(window.location.origin);
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setCompanyId(data.company?.id || ''))
      .catch(() => {});
  }, []);

  const widgetUrl = `${appOrigin}/widget/hirekit-widget.iife.js`;

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
            Add the HireKit widget to your career page
          </p>
        </div>

        {copied && (
          <div className="mb-6 p-4 bg-[#DCFCE7] text-[#16A34A] rounded-2xl text-sm font-medium flex items-center gap-2">
            <i className="ph-check-circle text-lg" />
            Copied to clipboard!
          </div>
        )}

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
      </div>
    </DashboardLayout>
  );
}
