'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePipelineStages } from '@/lib/hooks/usePipelineStages';

export function StatusUpdater({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { stages, loading } = usePipelineStages();

  const handleChange = async (newStatus: string) => {
    if (newStatus === status || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-2">
      {stages.map((s) => {
        const isActive = s.slug === status;
        return (
          <button
            key={s.slug}
            onClick={() => handleChange(s.slug)}
            disabled={saving}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-left flex items-center gap-3 transition-all duration-300 disabled:opacity-50"
            style={{
              backgroundColor: isActive ? s.bgColor : '#FAFBFC',
              color: isActive ? s.color : '#64748B',
              boxShadow: isActive ? `inset 0 0 0 2px ${s.color}` : 'inset 0 0 0 1px #E2E8F0',
            }}
          >
            {s.icon && <i className={`${s.icon} text-base`} />}
            {s.name}
            {isActive && (
              <i className="ph-bold ph-check text-xs ml-auto" />
            )}
          </button>
        );
      })}
    </div>
  );
}
