'use client';

import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: string;
  data: Record<string, unknown>;
  performedBy: string | null;
  createdAt: string;
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getIcon(type: string): string {
  switch (type) {
    case 'application_created': return 'ph ph-envelope-simple';
    case 'status_change': return 'ph ph-arrow-right';
    case 'note_added': return 'ph ph-note';
    case 'ai_scored': return 'ph ph-robot';
    case 'email_sent': return 'ph ph-paper-plane-tilt';
    case 'evaluation_added': return 'ph ph-star';
    case 'interview_scheduled': return 'ph ph-calendar-plus';
    case 'interview_completed': return 'ph ph-calendar-check';
    default: return 'ph ph-clock';
  }
}

function getDescription(type: string, data: Record<string, unknown>): string {
  switch (type) {
    case 'application_created':
      return 'Application submitted';
    case 'status_change':
      return `Status changed to ${String(data.to || '').charAt(0).toUpperCase() + String(data.to || '').slice(1)}`;
    case 'note_added':
      return 'Note added';
    case 'ai_scored':
      return `AI scored candidate: ${data.score}%`;
    case 'email_sent':
      return `Email sent: ${data.subject || 'Untitled'}`;
    case 'evaluation_added':
      return `Evaluation submitted (${data.rating}/5)`;
    case 'interview_scheduled':
      return `Interview scheduled: ${data.title || 'Interview'}`;
    case 'interview_completed':
      return `Interview completed: ${data.title || 'Interview'}`;
    default:
      return type.replace(/_/g, ' ');
  }
}

function getColor(type: string): string {
  switch (type) {
    case 'application_created': return '#4F46E5';
    case 'status_change': return '#D97706';
    case 'note_added': return '#64748B';
    case 'ai_scored': return '#16A34A';
    case 'email_sent': return '#2563EB';
    case 'evaluation_added': return '#F59E0B';
    case 'interview_scheduled': return '#8B5CF6';
    case 'interview_completed': return '#10B981';
    default: return '#94A3B8';
  }
}

export function ActivityTimeline({ applicationId }: { applicationId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/applications/${applicationId}/activity`)
      .then((res) => res.json())
      .then((data) => setActivities(data.activities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <i className="ph ph-clock-counter-clockwise text-xl text-[#4F46E5]" />
          <h3 className="text-lg font-bold text-[#1E293B]">Activity Timeline</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <i className="ph ph-clock-counter-clockwise text-xl text-[#4F46E5]" />
        <h3 className="text-lg font-bold text-[#1E293B]">Activity Timeline</h3>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">No activity recorded yet.</p>
      ) : (
        <div className="space-y-0">
          {activities.map((activity, i) => {
            const color = getColor(activity.type);
            const isLast = i === activities.length - 1;
            return (
              <div key={activity.id} className="flex gap-3">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <i className={`${getIcon(activity.type)} text-sm`} style={{ color }} />
                  </div>
                  {!isLast && (
                    <div className="w-px flex-1 bg-slate-200 my-1" />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-4 ${isLast ? '' : ''}`}>
                  <p className="text-sm font-medium text-[#1E293B]">
                    {getDescription(activity.type, activity.data as Record<string, unknown>)}
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {relativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
