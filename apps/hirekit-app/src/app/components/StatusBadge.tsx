'use client';

interface StageInfo {
  slug: string;
  name: string;
  color: string;
  bgColor: string;
}

// Fallback styles for when stages aren't loaded yet
const FALLBACK_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: '#E0E7FF', text: '#4F46E5', label: 'New' },
  screening: { bg: '#FEF3C7', text: '#D97706', label: 'Screening' },
  interviewing: { bg: '#DBEAFE', text: '#2563EB', label: 'Interviewing' },
  offered: { bg: '#F3E8FF', text: '#7C3AED', label: 'Offered' },
  hired: { bg: '#DCFCE7', text: '#16A34A', label: 'Hired' },
  rejected: { bg: '#FEE2E2', text: '#DC2626', label: 'Rejected' },
  reviewing: { bg: '#FEF3C7', text: '#D97706', label: 'Reviewing' },
  shortlisted: { bg: '#DCFCE7', text: '#16A34A', label: 'Shortlisted' },
};

export function StatusBadge({ status, stages }: { status: string; stages?: StageInfo[] }) {
  let bg: string, text: string, label: string;

  if (stages) {
    const stage = stages.find((s) => s.slug === status);
    if (stage) {
      bg = stage.bgColor;
      text = stage.color;
      label = stage.name;
    } else {
      const fallback = FALLBACK_STYLES[status];
      bg = fallback?.bg || '#F1F5F9';
      text = fallback?.text || '#64748B';
      label = fallback?.label || status;
    }
  } else {
    const fallback = FALLBACK_STYLES[status] || { bg: '#F1F5F9', text: '#64748B', label: status };
    bg = fallback.bg;
    text = fallback.text;
    label = fallback.label;
  }

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}
