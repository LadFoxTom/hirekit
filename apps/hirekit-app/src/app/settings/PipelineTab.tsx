'use client';

import { useState, useEffect } from 'react';

interface Stage {
  id: string;
  name: string;
  slug: string;
  color: string;
  bgColor: string;
  icon: string | null;
  order: number;
  type: string;
}

const STAGE_TYPES = [
  { value: 'active', label: 'Active' },
  { value: 'positive_end', label: 'Positive End (e.g. Hired)' },
  { value: 'negative_end', label: 'Negative End (e.g. Rejected)' },
];

const ICON_OPTIONS = [
  { value: 'ph ph-envelope-simple', label: 'Envelope' },
  { value: 'ph ph-eye', label: 'Eye' },
  { value: 'ph ph-video-camera', label: 'Video' },
  { value: 'ph ph-hand-heart', label: 'Heart' },
  { value: 'ph ph-check-circle', label: 'Check' },
  { value: 'ph ph-x-circle', label: 'X Circle' },
  { value: 'ph ph-phone', label: 'Phone' },
  { value: 'ph ph-chat-circle', label: 'Chat' },
  { value: 'ph ph-file-text', label: 'Document' },
  { value: 'ph ph-star', label: 'Star' },
  { value: 'ph ph-clipboard-text', label: 'Clipboard' },
  { value: 'ph ph-users', label: 'Users' },
];

export function PipelineTab() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Stage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Stage | null>(null);
  const [migrateTo, setMigrateTo] = useState('');

  const load = () => {
    fetch('/api/v1/pipeline-stages')
      .then((r) => r.json())
      .then((data) => setStages(data.stages || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const moveStage = async (index: number, direction: -1 | 1) => {
    const newStages = [...stages];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newStages.length) return;

    [newStages[index], newStages[swapIndex]] = [newStages[swapIndex], newStages[index]];
    const reordered = newStages.map((s, i) => ({ ...s, order: i }));
    setStages(reordered);

    await fetch('/api/v1/pipeline-stages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stages: reordered.map((s) => ({ id: s.id, order: s.order })) }),
    });
  };

  const startNew = () => {
    setIsNew(true);
    setEditing({
      id: '',
      name: '',
      slug: '',
      color: '#4F46E5',
      bgColor: '#E0E7FF',
      icon: 'ph ph-circle',
      order: stages.length,
      type: 'active',
    });
  };

  const saveStage = async () => {
    if (!editing || !editing.name) return;
    setSaving(true);

    if (isNew) {
      const slug = editing.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
      await fetch('/api/v1/pipeline-stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, slug }),
      });
    } else {
      await fetch(`/api/v1/pipeline-stages/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editing.name,
          color: editing.color,
          bgColor: editing.bgColor,
          icon: editing.icon,
          type: editing.type,
        }),
      });
    }

    setSaving(false);
    setEditing(null);
    setIsNew(false);
    load();
  };

  const deleteStage = async () => {
    if (!deleteTarget || !migrateTo) return;
    setSaving(true);
    await fetch(`/api/v1/pipeline-stages/${deleteTarget.id}?migrateTo=${migrateTo}`, {
      method: 'DELETE',
    });
    setSaving(false);
    setDeleteTarget(null);
    setMigrateTo('');
    load();
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1E293B]">Pipeline Stages</h3>
          <p className="text-sm text-[#64748B] mt-1">Customize your hiring pipeline stages. Drag to reorder.</p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold hover:bg-[#4338CA] transition-colors"
        >
          <i className="ph ph-plus" />
          Add Stage
        </button>
      </div>

      {/* Stage list */}
      <div className="space-y-2">
        {stages.map((stage, i) => (
          <div
            key={stage.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4"
          >
            {/* Reorder buttons */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveStage(i, -1)}
                disabled={i === 0}
                className="text-[#94A3B8] hover:text-[#4F46E5] disabled:opacity-30 transition-colors"
              >
                <i className="ph ph-caret-up text-sm" />
              </button>
              <button
                onClick={() => moveStage(i, 1)}
                disabled={i === stages.length - 1}
                className="text-[#94A3B8] hover:text-[#4F46E5] disabled:opacity-30 transition-colors"
              >
                <i className="ph ph-caret-down text-sm" />
              </button>
            </div>

            {/* Color dot */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: stage.bgColor }}
            >
              {stage.icon ? (
                <i className={stage.icon} style={{ color: stage.color }} />
              ) : (
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
              )}
            </div>

            {/* Name & info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#1E293B]">{stage.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-[#64748B]">
                  {stage.slug}
                </span>
                {stage.type !== 'active' && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: stage.type === 'positive_end' ? '#DCFCE7' : '#FEE2E2',
                      color: stage.type === 'positive_end' ? '#16A34A' : '#DC2626',
                    }}
                  >
                    {stage.type === 'positive_end' ? 'Positive End' : 'Negative End'}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setEditing(stage); setIsNew(false); }}
                className="text-xs px-3 py-1.5 rounded-lg text-[#4F46E5] hover:bg-[#E0E7FF] font-medium transition-colors"
              >
                Edit
              </button>
              {stages.length > 2 && (
                <button
                  onClick={() => { setDeleteTarget(stage); setMigrateTo(''); }}
                  className="text-xs px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 font-medium transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New modal */}
      {editing && (
        <div className="bg-white rounded-2xl border border-[#4F46E5] p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-[#1E293B]">{isNew ? 'New Stage' : 'Edit Stage'}</h4>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Name</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="e.g. Phone Screen"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Type</label>
              <select
                value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                {STAGE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editing.color}
                  onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={editing.color}
                  onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editing.bgColor}
                  onChange={(e) => setEditing({ ...editing, bgColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={editing.bgColor}
                  onChange={(e) => setEditing({ ...editing, bgColor: e.target.value })}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Icon</label>
              <select
                value={editing.icon || ''}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value || null })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                <option value="">None</option>
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic.value} value={ic.value}>{ic.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-4 py-2 text-sm text-[#64748B]">
              Cancel
            </button>
            <button
              onClick={saveStage}
              disabled={saving || !editing.name}
              className="px-6 py-2 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : isNew ? 'Create Stage' : 'Update Stage'}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-[#1E293B]">Delete &quot;{deleteTarget.name}&quot;</h4>
          <p className="text-sm text-[#64748B]">
            All applications with this status will be moved to the stage you select below.
          </p>
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Move applications to</label>
            <select
              value={migrateTo}
              onChange={(e) => setMigrateTo(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Select stage...</option>
              {stages.filter((s) => s.id !== deleteTarget.id).map((s) => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm text-[#64748B]">Cancel</button>
            <button
              onClick={deleteStage}
              disabled={saving || !migrateTo}
              className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Delete & Migrate'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
