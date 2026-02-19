'use client';

import { useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: string | null;
  isDefault: boolean;
}

const TRIGGER_OPTIONS = [
  { value: '', label: 'Manual only' },
  { value: 'new', label: 'New application' },
  { value: 'screening', label: 'Moved to Screening' },
  { value: 'interviewing', label: 'Moved to Interviewing' },
  { value: 'offered', label: 'Offer extended' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

export function EmailTemplatesTab() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', subject: '', body: '', trigger: '' });
  const [saving, setSaving] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const load = () => {
    fetch('/api/v1/email-templates')
      .then((r) => r.json())
      .then((data) => setTemplates(data.templates || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startEdit = (t: Template) => {
    setEditingId(t.id);
    setForm({ name: t.name, subject: t.subject, body: t.body, trigger: t.trigger || '' });
    setShowNew(false);
  };

  const startNew = () => {
    setShowNew(true);
    setEditingId(null);
    setForm({ name: '', subject: '', body: '', trigger: '' });
  };

  const save = async () => {
    setSaving(true);
    try {
      if (showNew) {
        await fetch('/api/v1/email-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else if (editingId) {
        await fetch(`/api/v1/email-templates/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      load();
      setEditingId(null);
      setShowNew(false);
    } catch {} finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    await fetch(`/api/v1/email-templates/${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-slate-200 rounded w-48" /><div className="h-32 bg-slate-200 rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1E293B]">Email Templates</h3>
          <p className="text-sm text-[#64748B] mt-1">Manage templates for candidate communication. Auto-trigger templates are sent automatically on status changes.</p>
        </div>
        <button
          onClick={startNew}
          className="px-4 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all flex items-center gap-2"
        >
          <i className="ph ph-plus" />
          New Template
        </button>
      </div>

      {(showNew || editingId) && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h4 className="font-bold text-[#1E293B] mb-4">{showNew ? 'New Template' : 'Edit Template'}</h4>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  placeholder="Template name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1E293B] mb-1">Auto-trigger</label>
                <select
                  value={form.trigger}
                  onChange={(e) => setForm({ ...form, trigger: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                >
                  {TRIGGER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                placeholder="Email subject with {{merge_fields}}"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1">Body</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={8}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] resize-none"
                placeholder="Email body with {{merge_fields}}"
              />
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-[#64748B] mb-1">Available merge fields: <code className="text-[#4F46E5]">{'{{candidate_name}} {{candidate_email}} {{job_title}} {{company_name}} {{status}} {{application_date}}'}</code></p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setEditingId(null); setShowNew(false); }} className="px-4 py-2 text-sm text-[#64748B]">Cancel</button>
              <button onClick={save} disabled={saving} className="px-6 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-[#1E293B] text-sm">{t.name}</h4>
                {t.trigger && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#E0E7FF] text-[#4F46E5]">
                    Auto: {TRIGGER_OPTIONS.find((o) => o.value === t.trigger)?.label || t.trigger}
                  </span>
                )}
                {t.isDefault && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">Default</span>
                )}
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">{t.subject}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(t)} className="px-3 py-1.5 text-xs font-medium text-[#4F46E5] hover:bg-[#E0E7FF] rounded-lg transition-colors">
                Edit
              </button>
              <button onClick={() => remove(t.id)} className="px-3 py-1.5 text-xs font-medium text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <p className="text-sm text-[#94A3B8] text-center py-8">No email templates yet. Create one to get started.</p>
        )}
      </div>
    </div>
  );
}
