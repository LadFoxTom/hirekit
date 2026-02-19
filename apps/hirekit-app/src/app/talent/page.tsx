'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { StatusBadge } from '@/app/components/StatusBadge';
import { usePipelineStages } from '@/lib/hooks/usePipelineStages';

interface Candidate {
  id: string;
  name: string | null;
  email: string;
  status: string;
  aiScore: number | null;
  source: string | null;
  createdAt: string;
  job: { id: string; title: string } | null;
}

interface SearchResult {
  candidates: Candidate[];
  total: number;
  page: number;
  totalPages: number;
}

export default function TalentPoolPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [jobId, setJobId] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
  const { stages } = usePipelineStages();

  // Fetch jobs for filter
  useEffect(() => {
    fetch('/api/v1/jobs')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
        else if (data.jobs) setJobs(data.jobs);
      })
      .catch(() => {});
  }, []);

  const search = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (status) params.set('status', status);
    if (jobId) params.set('jobId', jobId);
    if (minScore > 0) params.set('minScore', String(minScore));
    if (maxScore < 100) params.set('maxScore', String(maxScore));
    params.set('page', String(page));

    try {
      const res = await fetch(`/api/v1/talent?${params}`);
      if (res.ok) {
        setResult(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [query, status, jobId, minScore, maxScore, page]);

  // Debounced search on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      search();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, status, jobId, minScore, maxScore]);

  // Search on page change
  useEffect(() => {
    search();
  }, [page]);

  const stageData = stages.map((s) => ({ slug: s.slug, name: s.name, color: s.color, bgColor: s.bgColor }));

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1E293B]">Talent Pool</h2>
          <p className="text-[#64748B] text-[15px] mt-1">
            Search across all candidates and applications
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <i className="ph ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, or CV content..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                <option value="">All Statuses</option>
                {stages.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Job Filter */}
            {jobs.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">Job</label>
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                >
                  <option value="">All Jobs</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
            )}

            {/* AI Score Range */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">AI Score Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                  className="w-16 rounded-xl border border-slate-200 px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
                <span className="text-xs text-[#94A3B8]">to</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={maxScore}
                  onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
                  className="w-16 rounded-xl border border-slate-200 px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading && !result ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="w-8 h-8 border-2 border-[#4F46E5]/30 border-t-[#4F46E5] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#64748B]">Searching...</p>
          </div>
        ) : result && result.candidates.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[#64748B]">
                {result.total} candidate{result.total !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#FAFBFC]">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                      AI Score
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.candidates.map((c) => {
                    const scoreColor = c.aiScore
                      ? c.aiScore >= 80 ? '#16A34A' : c.aiScore >= 60 ? '#D97706' : '#DC2626'
                      : null;
                    return (
                      <tr key={c.id} className="hover:bg-[#FAFBFC] transition-colors">
                        <td className="px-6 py-4">
                          <Link
                            href={`/applications/${c.id}`}
                            className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                          >
                            {c.name || 'Unnamed'}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{c.email}</td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{c.job?.title || '-'}</td>
                        <td className="px-6 py-4">
                          {c.aiScore !== null && c.aiScore !== undefined ? (
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
                              style={{
                                backgroundColor: `${scoreColor}15`,
                                color: scoreColor!,
                              }}
                            >
                              {c.aiScore}%
                            </span>
                          ) : (
                            <span className="text-xs text-[#94A3B8]">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#64748B] capitalize">
                          {c.source?.replace(/_/g, ' ') || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={c.status} stages={stageData} />
                        </td>
                        <td className="px-6 py-4 text-sm text-[#94A3B8]">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {result.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-[#64748B]">
                  Page {result.page} of {result.totalPages}
                </p>
                <div className="flex gap-2">
                  {result.page > 1 && (
                    <button
                      onClick={() => setPage(result.page - 1)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-[#1E293B] hover:border-[#4F46E5] transition-all"
                    >
                      Previous
                    </button>
                  )}
                  {result.page < result.totalPages && (
                    <button
                      onClick={() => setPage(result.page + 1)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-[#1E293B] hover:border-[#4F46E5] transition-all"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : result ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-[#E0E7FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ph ph-magnifying-glass text-[#4F46E5] text-2xl" />
              </div>
              <p className="text-[#64748B] text-[15px]">
                {query ? 'No candidates match your search criteria.' : 'No candidates yet. Applications will appear here.'}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
