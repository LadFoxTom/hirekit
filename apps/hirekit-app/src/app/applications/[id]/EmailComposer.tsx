'use client';

import { useState, useEffect } from 'react';
import { AVAILABLE_MERGE_FIELDS } from '@/lib/merge-fields';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: string | null;
}

export function EmailComposer({
  applicationId,
  onClose,
  onSent,
}: {
  applicationId: string;
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
    if (!subject || !body) {
      setError('Subject and body are required');
      return;
    }

    setSending(true);
    setError('');

    try {
      const res = await fetch(`/api/v1/applications/${applicationId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, templateId: selectedTemplate || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send');
      }

      onSent();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-[#1E293B]">Send Email</h3>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#1E293B] transition-colors">
            <i className="ph ph-x text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            >
              <option value="">Custom email (no template)</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              placeholder="Email subject..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] resize-none"
              placeholder="Email body..."
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-[#64748B] mb-1.5">Available merge fields:</p>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_MERGE_FIELDS.map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => setBody((b) => b + field)}
                  className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg text-[#4F46E5] hover:bg-[#E0E7FF] transition-colors font-mono"
                >
                  {field}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-6 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}
