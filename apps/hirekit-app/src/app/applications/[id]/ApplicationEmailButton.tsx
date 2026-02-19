'use client';

import { useState } from 'react';
import { EmailComposer } from './EmailComposer';

export function ApplicationEmailButton({ applicationId }: { applicationId: string }) {
  const [showComposer, setShowComposer] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowComposer(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#E0E7FF] text-[#4F46E5] rounded-xl text-sm font-semibold hover:bg-[#C7D2FE] transition-colors shrink-0"
      >
        <i className="ph ph-envelope" />
        Send Email
      </button>
      {showComposer && (
        <EmailComposer
          applicationId={applicationId}
          onClose={() => setShowComposer(false)}
          onSent={() => window.location.reload()}
        />
      )}
    </>
  );
}
