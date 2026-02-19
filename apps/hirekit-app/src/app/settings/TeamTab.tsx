'use client';

import { useState, useEffect } from 'react';

interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  hiring_manager: 'Hiring Manager',
  member: 'Member',
  viewer: 'Viewer',
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  owner: { bg: '#FEF3C7', text: '#D97706' },
  admin: { bg: '#E0E7FF', text: '#4F46E5' },
  hiring_manager: { bg: '#DCFCE7', text: '#16A34A' },
  member: { bg: '#F1F5F9', text: '#64748B' },
  viewer: { bg: '#F1F5F9', text: '#94A3B8' },
};

export function TeamTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState('member');
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState('');

  const load = () => {
    fetch('/api/v1/team')
      .then((r) => r.json())
      .then((data) => {
        setMembers(data.members || []);
        setPendingInvites(data.pendingInvites || []);
        setCurrentUserRole(data.currentUserRole || 'member');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const isAdmin = ['owner', 'admin'].includes(currentUserRole);

  const invite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    setMessage('');
    try {
      const res = await fetch('/api/v1/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Invitation sent!');
        setInviteEmail('');
        load();
      } else {
        setMessage(data.error || 'Failed to invite');
      }
    } catch {
      setMessage('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const changeRole = async (memberId: string, role: string) => {
    await fetch(`/api/v1/team/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    load();
  };

  const removeMember = async (memberId: string) => {
    if (!confirm('Remove this team member?')) return;
    await fetch(`/api/v1/team/${memberId}`, { method: 'DELETE' });
    load();
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-slate-200 rounded w-48" /><div className="h-32 bg-slate-200 rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#1E293B]">Team Members</h3>
        <p className="text-sm text-[#64748B] mt-1">Manage who has access to your HireKit account.</p>
      </div>

      {/* Invite form */}
      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h4 className="font-bold text-[#1E293B] mb-4">Invite Team Member</h4>
          {message && (
            <div className={`p-3 rounded-xl text-sm mb-4 ${message.includes('sent') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            >
              <option value="member">Member</option>
              <option value="hiring_manager">Hiring Manager</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={invite}
              disabled={inviting || !inviteEmail}
              className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 disabled:opacity-50 flex items-center gap-2"
            >
              <i className="ph ph-paper-plane-tilt" />
              {inviting ? 'Sending...' : 'Invite'}
            </button>
          </div>
        </div>
      )}

      {/* Members list */}
      <div className="space-y-3">
        {members.map((m) => {
          const colors = ROLE_COLORS[m.role] || ROLE_COLORS.member;
          return (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#E0E7FF] rounded-full flex items-center justify-center">
                  <span className="text-[#4F46E5] text-sm font-bold">{m.name[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#1E293B] text-sm">{m.name}</h4>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {ROLE_LABELS[m.role] || m.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">{m.email}</p>
                </div>
              </div>
              {isAdmin && m.role !== 'owner' && (
                <div className="flex items-center gap-2">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  >
                    <option value="member">Member</option>
                    <option value="hiring_manager">Hiring Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="px-2 py-1.5 text-xs text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pending invitations */}
      {pendingInvites.length > 0 && (
        <div>
          <h4 className="font-bold text-[#1E293B] mb-3">Pending Invitations</h4>
          <div className="space-y-2">
            {pendingInvites.map((inv) => (
              <div key={inv.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">{inv.email}</p>
                  <p className="text-xs text-[#94A3B8]">
                    Role: {ROLE_LABELS[inv.role] || inv.role} &middot; Expires: {new Date(inv.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 bg-amber-50 text-amber-600 rounded-full font-medium">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
