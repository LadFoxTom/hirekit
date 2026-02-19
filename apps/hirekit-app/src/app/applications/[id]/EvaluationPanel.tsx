'use client';

import { useState, useEffect } from 'react';

interface EvaluationData {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  recommendation: string | null;
  notes: string | null;
  createdAt: string;
}

export function EvaluationPanel({ applicationId }: { applicationId: string }) {
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    fetch(`/api/v1/applications/${applicationId}/evaluations`)
      .then((r) => r.json())
      .then((data) => {
        setEvaluations(data.evaluations || []);
        setCurrentUserId(data.currentUserId || '');
        // Pre-fill if current user already evaluated
        const myEval = (data.evaluations || []).find((e: EvaluationData) => e.userId === data.currentUserId);
        if (myEval) {
          setRating(myEval.rating);
          setRecommendation(myEval.recommendation || '');
          setNotes(myEval.notes || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [applicationId]);

  const submit = async () => {
    if (rating < 1) return;
    setSaving(true);
    await fetch(`/api/v1/applications/${applicationId}/evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, recommendation, notes }),
    });
    load();
    setSaving(false);
    setShowForm(false);
  };

  const avgRating = evaluations.length > 0
    ? (evaluations.reduce((s, e) => s + e.rating, 0) / evaluations.length).toFixed(1)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#1E293B]">Evaluations</h3>
        {avgRating && (
          <span className="text-sm font-semibold text-[#F59E0B] flex items-center gap-1">
            <i className="ph-fill ph-star" /> {avgRating}
          </span>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse h-8 bg-slate-200 rounded" />
      ) : (
        <>
          {evaluations.length > 0 && (
            <div className="space-y-3 mb-4">
              {evaluations.map((ev) => (
                <div key={ev.id} className="border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1E293B]">{ev.userName}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className={`ph${s <= ev.rating ? '-fill' : ''} ph-star text-sm ${s <= ev.rating ? 'text-[#F59E0B]' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  {ev.recommendation && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                      ev.recommendation === 'strong_yes' ? 'bg-green-50 text-green-600' :
                      ev.recommendation === 'yes' ? 'bg-blue-50 text-blue-600' :
                      ev.recommendation === 'no' ? 'bg-red-50 text-red-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {ev.recommendation === 'strong_yes' ? 'Strong Yes' :
                       ev.recommendation === 'yes' ? 'Yes' :
                       ev.recommendation === 'no' ? 'No' :
                       ev.recommendation === 'strong_no' ? 'Strong No' : ev.recommendation}
                    </span>
                  )}
                  {ev.notes && <p className="text-xs text-[#64748B] mt-1">{ev.notes}</p>}
                </div>
              ))}
            </div>
          )}

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-sm font-medium text-[#4F46E5] hover:bg-[#FAFBFC] transition-colors"
            >
              {evaluations.find((e) => e.userId === currentUserId) ? 'Update Your Evaluation' : 'Add Evaluation'}
            </button>
          ) : (
            <div className="space-y-3 border border-slate-200 rounded-xl p-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(s)}
                      className="text-xl transition-colors"
                    >
                      <i className={`ph${s <= rating ? '-fill' : ''} ph-star ${s <= rating ? 'text-[#F59E0B]' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">Recommendation</label>
                <select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="strong_yes">Strong Yes</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="strong_no">Strong No</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none"
                  placeholder="Your thoughts..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs text-[#64748B]">Cancel</button>
                <button
                  onClick={submit}
                  disabled={saving || rating < 1}
                  className="px-4 py-1.5 bg-[#4F46E5] text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Submit'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
