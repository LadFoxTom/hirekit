'use client';

import { useState, useEffect } from 'react';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  lastError: string | null;
  lastTriggeredAt: string | null;
  createdAt: string;
}

const ALL_EVENTS = [
  { value: 'application.created', label: 'Application Created' },
  { value: 'application.status_changed', label: 'Status Changed' },
  { value: 'application.note_added', label: 'Note Added' },
  { value: 'application.ai_scored', label: 'AI Scored' },
  { value: 'evaluation.added', label: 'Evaluation Added' },
  { value: 'interview.scheduled', label: 'Interview Scheduled' },
  { value: 'interview.completed', label: 'Interview Completed' },
  { value: 'email.sent', label: 'Email Sent' },
];

export function WebhooksTab() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; error?: string } | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());

  const fetchWebhooks = async () => {
    try {
      const res = await fetch('/api/v1/webhooks');
      if (res.ok) setWebhooks(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWebhooks(); }, []);

  const handleCreate = async () => {
    if (!url || selectedEvents.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch('/api/v1/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, events: selectedEvents }),
      });
      if (res.ok) {
        setUrl('');
        setSelectedEvents([]);
        setShowForm(false);
        fetchWebhooks();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    await fetch(`/api/v1/webhooks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    setWebhooks((prev) => prev.map((w) => (w.id === id ? { ...w, active } : w)));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/v1/webhooks/${id}`, { method: 'DELETE' });
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  };

  const handleTest = async (id: string) => {
    setTesting(id);
    setTestResult(null);
    try {
      const res = await fetch(`/api/v1/webhooks/${id}`, { method: 'POST' });
      const data = await res.json();
      setTestResult({ id, success: data.success, error: data.error });
    } catch {
      setTestResult({ id, success: false, error: 'Request failed' });
    } finally {
      setTesting(null);
    }
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const maskSecret = (secret: string) => `${secret.substring(0, 8)}${'*'.repeat(24)}`;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="animate-pulse h-16 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] text-[#64748B]">
            Send real-time events to external services like Zapier, Slack, or your own API.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all flex items-center gap-2"
        >
          <i className="ph ph-plus" />
          Add Webhook
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#1E293B] mb-4">New Webhook</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1">Endpoint URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-server.com/webhook"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">Events</label>
              <div className="flex flex-wrap gap-2">
                {ALL_EVENTS.map((evt) => (
                  <button
                    key={evt.value}
                    onClick={() => toggleEvent(evt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedEvents.includes(evt.value)
                        ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/25'
                        : 'bg-white text-[#64748B] border border-slate-200 hover:border-[#4F46E5] hover:text-[#4F46E5]'
                    }`}
                  >
                    {evt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={saving || !url || selectedEvents.length === 0}
                className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 disabled:opacity-50 transition-all"
              >
                {saving ? 'Creating...' : 'Create Webhook'}
              </button>
              <button
                onClick={() => { setShowForm(false); setUrl(''); setSelectedEvents([]); }}
                className="px-5 py-2.5 text-[#64748B] text-sm font-semibold hover:text-[#1E293B] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook List */}
      {webhooks.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-[#E0E7FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ph ph-webhooks-logo text-[#4F46E5] text-2xl" />
            </div>
            <p className="text-[#1E293B] font-semibold mb-1">No webhooks yet</p>
            <p className="text-[#64748B] text-sm">
              Create a webhook to start receiving real-time events.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <code className="text-sm font-mono text-[#1E293B] bg-[#FAFBFC] px-3 py-1 rounded-lg border border-slate-200">
                      {webhook.url}
                    </code>
                    <div
                      onClick={() => handleToggle(webhook.id, !webhook.active)}
                      className={`w-9 h-5 rounded-full cursor-pointer transition-colors relative ${
                        webhook.active ? 'bg-[#16A34A]' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform ${
                          webhook.active ? 'translate-x-4' : ''
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {webhook.events.map((evt) => (
                      <span
                        key={evt}
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#E0E7FF] text-[#4F46E5]"
                      >
                        {evt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTest(webhook.id)}
                    disabled={testing === webhook.id}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all disabled:opacity-50"
                  >
                    {testing === webhook.id ? 'Testing...' : 'Test'}
                  </button>
                  <button
                    onClick={() => handleDelete(webhook.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#DC2626] bg-white border border-slate-200 rounded-lg hover:border-[#DC2626] transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Secret */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-[#64748B]">Secret:</span>
                <code className="text-xs font-mono text-[#94A3B8]">
                  {revealedSecrets.has(webhook.id) ? webhook.secret : maskSecret(webhook.secret)}
                </code>
                <button
                  onClick={() => {
                    setRevealedSecrets((prev) => {
                      const next = new Set(prev);
                      if (next.has(webhook.id)) next.delete(webhook.id);
                      else next.add(webhook.id);
                      return next;
                    });
                  }}
                  className="text-xs text-[#4F46E5] hover:underline"
                >
                  {revealedSecrets.has(webhook.id) ? 'Hide' : 'Reveal'}
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(webhook.secret)}
                  className="text-xs text-[#4F46E5] hover:underline"
                >
                  Copy
                </button>
              </div>

              {/* Status info */}
              <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                {webhook.lastTriggeredAt && (
                  <span>Last triggered: {new Date(webhook.lastTriggeredAt).toLocaleString()}</span>
                )}
                {webhook.lastError && (
                  <span className="text-[#DC2626]">Last error: {webhook.lastError}</span>
                )}
              </div>

              {/* Test result */}
              {testResult && testResult.id === webhook.id && (
                <div
                  className={`mt-3 p-3 rounded-xl text-sm ${
                    testResult.success
                      ? 'bg-[#DCFCE7] text-[#16A34A]'
                      : 'bg-[#FEE2E2] text-[#DC2626]'
                  }`}
                >
                  {testResult.success ? 'Test webhook sent successfully!' : `Test failed: ${testResult.error}`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-[#E0E7FF] rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <i className="ph ph-info text-[#4F46E5] text-xl mt-0.5" />
          <div>
            <h4 className="font-bold text-[#1E293B] text-sm">Webhook Security</h4>
            <p className="text-sm text-[#64748B] mt-1">
              Each webhook is signed with HMAC-SHA256. Verify the <code className="text-xs bg-white px-1 py-0.5 rounded">X-HireKit-Signature</code> header
              against the request body using your webhook secret. The event name is sent in the <code className="text-xs bg-white px-1 py-0.5 rounded">X-HireKit-Event</code> header.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
