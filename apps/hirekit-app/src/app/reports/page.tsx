'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { TrendChart, PipelineChart, SourceChart } from './components/ReportCharts';

interface ReportData {
  totalApplications: number;
  trend: { date: string; count: number }[];
  pipeline: { status: string; name?: string; color?: string; bgColor?: string; count: number }[];
  sources: { source: string; count: number }[];
  timeToHire: { avg: number; median: number; count: number };
  conversionRate: number;
  topJobs: { id: string; title: string; department: string | null; applications: number }[];
}

const RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: '1 year', value: 365 },
];

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/reports?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  const exportCsv = () => {
    window.open(`/api/v1/reports/export?days=${days}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B]">Reports</h2>
            <p className="text-[#64748B] text-[15px] mt-1">
              Hiring analytics and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDays(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    days === opt.value
                      ? 'bg-white text-[#4F46E5] shadow-sm'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-[#1E293B] hover:border-slate-300 transition-colors"
            >
              <i className="ph ph-download-simple" />
              Export CSV
            </button>
          </div>
        </div>

        {loading || !data ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="animate-pulse h-16 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="animate-pulse h-72 bg-slate-200 rounded" />
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <StatCard
                label="Total Applications"
                value={data.totalApplications}
                icon="ph ph-users"
                color="#4F46E5"
                bgColor="#E0E7FF"
              />
              <StatCard
                label="Conversion Rate"
                value={`${data.conversionRate}%`}
                icon="ph ph-trend-up"
                color="#16A34A"
                bgColor="#DCFCE7"
              />
              <StatCard
                label="Avg. Time to Hire"
                value={data.timeToHire.count > 0 ? `${data.timeToHire.avg}d` : 'N/A'}
                icon="ph ph-clock"
                color="#2563EB"
                bgColor="#DBEAFE"
                subtitle={data.timeToHire.count > 0 ? `Median: ${data.timeToHire.median}d` : undefined}
              />
              <StatCard
                label={`Applications (${days}d)`}
                value={data.trend.reduce((s, t) => s + t.count, 0)}
                icon="ph ph-chart-line-up"
                color="#7C3AED"
                bgColor="#EDE9FE"
              />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Trend */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#1E293B] mb-4">Applications Over Time</h3>
                <TrendChart data={data.trend} />
              </div>

              {/* Pipeline */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#1E293B] mb-4">Pipeline Distribution</h3>
                <PipelineChart data={data.pipeline} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Sources */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#1E293B] mb-4">Application Sources</h3>
                <SourceChart data={data.sources} />
              </div>

              {/* Top Jobs */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#1E293B] mb-4">Top Jobs by Applications</h3>
                {data.topJobs.length === 0 ? (
                  <div className="flex items-center justify-center h-[280px] text-sm text-[#94A3B8]">
                    No active jobs
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.topJobs.map((job, i) => {
                      const max = data.topJobs[0].applications || 1;
                      const pct = (job.applications / max) * 100;
                      return (
                        <div key={job.id}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-[#1E293B] font-medium truncate flex-1 mr-4">
                              {job.title}
                            </span>
                            <span className="text-[#64748B] text-xs">{job.applications}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: '#4F46E5',
                                opacity: 1 - i * 0.1,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#1E293B] mb-4">Hiring Funnel</h3>
              <div className="flex items-end justify-between gap-2 h-[200px]">
                {data.pipeline.map((stage, i) => {
                  const maxCount = Math.max(...data.pipeline.map((p) => p.count), 1);
                  const pct = (stage.count / maxCount) * 100;
                  return (
                    <div key={stage.status} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-sm font-bold text-[#1E293B]">{stage.count}</span>
                      <div
                        className="w-full rounded-t-lg transition-all"
                        style={{
                          height: `${Math.max(pct, 4)}%`,
                          backgroundColor: stage.color || '#94A3B8',
                        }}
                      />
                      <span className="text-[10px] text-[#64748B]">{stage.name || stage.status}</span>
                      {i < data.pipeline.length - 1 && data.pipeline[i].count > 0 && (
                        <span className="text-[10px] text-[#94A3B8]">
                          {Math.round(((data.pipeline[i + 1]?.count || 0) / stage.count) * 100)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
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
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-[16px] flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <i className={`${icon} text-lg`} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
      <p className="text-xs text-[#64748B] mt-1">{label}</p>
      {subtitle && <p className="text-[10px] text-[#94A3B8] mt-0.5">{subtitle}</p>}
    </div>
  );
}
