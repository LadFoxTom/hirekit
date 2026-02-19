'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/app/components/StatusBadge';
import { BulkEmailModal } from './BulkEmailModal';

interface Application {
  id: string;
  name: string | null;
  email: string;
  status: string;
  aiScore: number | null;
  createdAt: string;
  job: { id: string; title: string } | null;
}

interface StageInfo {
  slug: string;
  name: string;
  color: string;
  bgColor: string;
}

const DEFAULT_STATUSES = ['new', 'screening', 'interviewing', 'offered', 'hired', 'rejected'];

export function ApplicationsTable({ applications, stages }: { applications: Application[]; stages?: StageInfo[] }) {
  const STATUSES = stages ? stages.map((s) => s.slug) : DEFAULT_STATUSES;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const router = useRouter();

  const toggleAll = () => {
    if (selected.size === applications.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(applications.map(a => a.id)));
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleBulkAction = async (status: string) => {
    if (selected.size === 0 || !status) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/v1/applications/batch-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationIds: [...selected], status }),
      });
      if (res.ok) {
        setSelected(new Set());
        router.refresh();
      }
    } finally {
      setProcessing(false);
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-16 text-center">
          <div className="w-16 h-16 bg-[#E0E7FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ph ph-users text-[#4F46E5] text-2xl" />
          </div>
          <p className="text-[#64748B] text-[15px]">
            No applications yet. Install the widget to start receiving CVs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-[#FAFBFC]">
              <th className="px-4 py-3.5 text-left w-10">
                <input
                  type="checkbox"
                  checked={selected.size === applications.length && applications.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                />
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Applicant
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
                Status
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => {
              const scoreColor = app.aiScore
                ? app.aiScore >= 80
                  ? '#16A34A'
                  : app.aiScore >= 60
                  ? '#D97706'
                  : '#DC2626'
                : null;
              return (
                <tr
                  key={app.id}
                  className={`hover:bg-[#FAFBFC] transition-colors duration-200 ${
                    selected.has(app.id) ? 'bg-[#EEF2FF]' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(app.id)}
                      onChange={() => toggle(app.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/applications/${app.id}`}
                      className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                    >
                      {app.name || 'Unnamed'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#64748B]">
                    {app.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#64748B]">
                    {app.job?.title || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {app.aiScore !== null && app.aiScore !== undefined ? (
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
                        style={{
                          backgroundColor: `${scoreColor}15`,
                          color: scoreColor!,
                        }}
                      >
                        {app.aiScore}%
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A3B8]">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} stages={stages} />
                  </td>
                  <td className="px-6 py-4 text-sm text-[#94A3B8]">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1E293B] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 z-50">
          <span className="text-sm font-semibold">
            {selected.size} selected
          </span>
          <div className="w-px h-5 bg-white/20" />
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) handleBulkAction(e.target.value);
              e.target.value = '';
            }}
            disabled={processing}
            className="bg-white/10 text-white text-sm rounded-lg px-3 py-1.5 border border-white/20 cursor-pointer appearance-none"
          >
            <option value="" disabled>Change Status...</option>
            {stages ? stages.map(s => (
              <option key={s.slug} value={s.slug} className="text-[#1E293B]">
                {s.name}
              </option>
            )) : STATUSES.map(s => (
              <option key={s} value={s} className="text-[#1E293B]">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowBulkEmail(true)}
            disabled={processing}
            className="px-4 py-1.5 bg-[#4F46E5] text-white text-sm font-semibold rounded-lg hover:bg-[#4338CA] transition-colors disabled:opacity-50"
          >
            Send Email
          </button>
          <button
            onClick={() => handleBulkAction('rejected')}
            disabled={processing}
            className="px-4 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Reject All'}
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {showBulkEmail && (
        <BulkEmailModal
          applicationIds={[...selected]}
          onClose={() => setShowBulkEmail(false)}
          onSent={() => { setSelected(new Set()); setShowBulkEmail(false); }}
        />
      )}
    </>
  );
}
