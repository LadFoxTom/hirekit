'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PipelineStageClient {
  id: string;
  name: string;
  slug: string;
  color: string;
  bgColor: string;
  icon: string | null;
  order: number;
  type: string;
}

export function usePipelineStages() {
  const [stages, setStages] = useState<PipelineStageClient[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch('/api/v1/pipeline-stages')
      .then((r) => r.json())
      .then((data) => setStages(data.stages || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  return { stages, loading, mutate: load };
}
