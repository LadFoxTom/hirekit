'use client';

import { useState, useEffect } from 'react';

interface TeamMember {
  userId: string;
  name: string;
}

export function AssigneeSelector({
  applicationId,
  currentAssignee,
}: {
  applicationId: string;
  currentAssignee: string | null;
}) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [assignee, setAssignee] = useState(currentAssignee || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/v1/team')
      .then((r) => r.json())
      .then((data) => setMembers((data.members || []).map((m: any) => ({ userId: m.userId, name: m.name }))))
      .catch(() => {});
  }, []);

  const handleChange = async (userId: string) => {
    setAssignee(userId);
    setSaving(true);
    await fetch(`/api/v1/applications/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedTo: userId || null }),
    });
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-[#1E293B] mb-3">Assigned To</h3>
      <select
        value={assignee}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] disabled:opacity-50"
      >
        <option value="">Unassigned</option>
        {members.map((m) => (
          <option key={m.userId} value={m.userId}>{m.name}</option>
        ))}
      </select>
    </div>
  );
}
