'use client';

import { useState, useEffect } from 'react';

interface EmailLogEntry {
  id: string;
  to: string;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
}

export function EmailHistory({ applicationId }: { applicationId: string }) {
  const [emails, setEmails] = useState<EmailLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/v1/applications/${applicationId}/email`)
      .then((r) => r.json())
      .then((data) => setEmails(data.emails || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <i className="ph ph-envelope text-xl text-[#4F46E5]" />
          <h3 className="text-lg font-bold text-[#1E293B]">Email History</h3>
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
        <i className="ph ph-envelope text-xl text-[#4F46E5]" />
        <h3 className="text-lg font-bold text-[#1E293B]">Email History</h3>
      </div>

      {emails.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">No emails sent yet.</p>
      ) : (
        <div className="space-y-3">
          {emails.map((email) => (
            <div key={email.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${email.status === 'sent' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-[#1E293B]">{email.subject}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      To: {email.to} &middot; {new Date(email.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <i className={`ph ph-caret-${expandedId === email.id ? 'up' : 'down'} text-[#94A3B8]`} />
              </button>
              {expandedId === email.id && (
                <div className="px-4 pb-4 border-t border-slate-100">
                  <pre className="text-sm text-[#64748B] whitespace-pre-wrap mt-3 leading-relaxed">{email.body}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
