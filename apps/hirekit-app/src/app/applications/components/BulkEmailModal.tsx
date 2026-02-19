'use client';

import { useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export function BulkEmailModal({
  applicationIds,
  onClose,
  onSent,
}: {
  applicationIds: string[];
  onClose: () => void;
  onSent: () => void;
}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/email-templates')
      .then((r) => r.json())
      .then((data) => setTemplates(data.templates || []))
      .catch(() => {});
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const t = templates.find((t) => t.id === templateId);
    if (t) {
      setSubject(t.subject);
      setBody(t.body);
    }
  };

  const handleSend = async () => {
    if (!subject || !body) { setError('Subject and body required'); return; }
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/v1/applications/bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationIds, subject, body, templateId: selectedTemplate || undefined }),
      });
      if (!res.ok) throw new Error('Failed to send');
      onSent();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-[#1E293B]">Send Email to {applicationIds.length} Candidate{applicationIds.length !== 1 ? 's' : ''}</h3>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#1E293B]"><i className="ph ph-x text-xl" /></button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Template</label>
            <select value={selectedTemplate} onChange={(e) => handleTemplateSelect(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]">
              <option value="">Custom email</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#64748B]">Cancel</button>
          <button onClick={handleSend} disabled={sending} className="px-6 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold disabled:opacity-50">
            {sending ? 'Sending...' : `Send to ${applicationIds.length}`}
          </button>
        </div>
      </div>
    </div>
  );
}
