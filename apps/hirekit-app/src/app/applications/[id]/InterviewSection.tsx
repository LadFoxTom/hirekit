'use client';

import { useState, useEffect } from 'react';

interface InterviewData {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location: string | null;
  meetingLink: string | null;
  status: string;
  notes: string | null;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  scheduled: { bg: '#E0E7FF', text: '#4F46E5' },
  confirmed: { bg: '#DCFCE7', text: '#16A34A' },
  completed: { bg: '#F1F5F9', text: '#64748B' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  no_show: { bg: '#FEF3C7', text: '#D97706' },
};

export function InterviewSection({
  applicationId,
  candidateEmail,
}: {
  applicationId: string;
  candidateEmail: string;
}) {
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    date: '',
    startTime: '10:00',
    endTime: '10:30',
    timezone: 'UTC',
    location: '',
    meetingLink: '',
    notes: '',
    createSchedulingLink: false,
  });

  const load = () => {
    fetch(`/api/v1/applications/${applicationId}/interviews`)
      .then((r) => r.json())
      .then((data) => setInterviews(data.interviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [applicationId]);

  const handleSchedule = async () => {
    if (!form.title || !form.date || !form.startTime || !form.endTime) return;
    setSaving(true);

    const startTime = new Date(`${form.date}T${form.startTime}:00`);
    const endTime = new Date(`${form.date}T${form.endTime}:00`);

    await fetch(`/api/v1/applications/${applicationId}/interviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        timezone: form.timezone,
        location: form.location || null,
        meetingLink: form.meetingLink || null,
        notes: form.notes || null,
        createSchedulingLink: form.createSchedulingLink,
      }),
    });

    setSaving(false);
    setShowForm(false);
    setForm({ title: '', date: '', startTime: '10:00', endTime: '10:30', timezone: 'UTC', location: '', meetingLink: '', notes: '', createSchedulingLink: false });
    load();
  };

  const updateStatus = async (interviewId: string, status: string) => {
    await fetch(`/api/v1/interviews/${interviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <i className="ph ph-calendar text-xl text-[#4F46E5]" />
          <h3 className="text-lg font-bold text-[#1E293B]">Interviews</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E0E7FF] text-[#4F46E5] rounded-xl text-sm font-semibold hover:bg-[#C7D2FE] transition-colors"
        >
          <i className="ph ph-plus" />
          Schedule
        </button>
      </div>

      {showForm && (
        <div className="border border-slate-200 rounded-xl p-5 mb-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Technical Interview"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Start</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">End</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Timezone</label>
              <select
                value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern</option>
                <option value="America/Chicago">Central</option>
                <option value="America/Denver">Mountain</option>
                <option value="America/Los_Angeles">Pacific</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Europe/Berlin">Berlin</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Office, conference room..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Meeting Link</label>
              <input
                type="url"
                value={form.meetingLink}
                onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                placeholder="https://zoom.us/j/..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              placeholder="Internal notes..."
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.createSchedulingLink}
              onChange={(e) => setForm({ ...form, createSchedulingLink: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]"
            />
            <span className="text-sm text-[#64748B]">Create self-scheduling link for candidate</span>
          </label>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-[#64748B]">Cancel</button>
            <button
              onClick={handleSchedule}
              disabled={saving || !form.title || !form.date}
              className="px-6 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? 'Scheduling...' : 'Schedule Interview'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse h-8 bg-slate-200 rounded" />
      ) : interviews.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">No interviews scheduled yet.</p>
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => {
            const styles = STATUS_STYLES[interview.status] || STATUS_STYLES.scheduled;
            return (
              <div key={interview.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-[#1E293B] text-sm">{interview.title}</h4>
                    <p className="text-xs text-[#64748B] mt-1">
                      {new Date(interview.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' '}{new Date(interview.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      {' - '}{new Date(interview.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      {' '}({interview.timezone})
                    </p>
                    {interview.location && (
                      <p className="text-xs text-[#94A3B8] mt-0.5"><i className="ph ph-map-pin" /> {interview.location}</p>
                    )}
                    {interview.meetingLink && (
                      <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-[#4F46E5] hover:underline mt-0.5 block">
                        Join Meeting
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: styles.bg, color: styles.text }}
                    >
                      {interview.status}
                    </span>
                    {interview.status === 'scheduled' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateStatus(interview.id, 'completed')}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 font-medium"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateStatus(interview.id, 'cancelled')}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
