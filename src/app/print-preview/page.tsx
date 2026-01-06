import { useAuth } from '@/context/AuthContext';
import useCVData from '@/hooks/useCVData';
import { CVPreview } from '@/components/CVPreview';
import React from 'react';

export const dynamic = 'force-dynamic';

export default function PrintPreviewPage() {
  const { isAuthenticated } = useAuth();
  const { cvData } = useCVData();

  if (typeof window !== 'undefined' && !isAuthenticated) {
    window.location.href = '/auth/login?next=/print-preview';
    return null;
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center py-0">
      <div className="w-full max-w-3xl" id="cv-preview-root">
        <CVPreview data={cvData} isPreview={true} />
      </div>
    </div>
  );
} 