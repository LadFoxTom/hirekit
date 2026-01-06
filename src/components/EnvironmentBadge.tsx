'use client';

import { getEnvironmentBadge } from '@/lib/environment';

export default function EnvironmentBadge() {
  const badge = getEnvironmentBadge();
  
  if (!badge) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color} ${badge.textColor} shadow-lg`}>
        {badge.name}
      </div>
    </div>
  );
} 