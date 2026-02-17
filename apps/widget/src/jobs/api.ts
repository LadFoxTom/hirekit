import type { JobsApiResponse } from './types';

export function getApiUrl(): string {
  return (
    (window as any).__HIREKIT_API_URL__ ||
    'https://app.hirekit.io/api'
  );
}

export async function fetchJobs(companyId: string): Promise<JobsApiResponse> {
  const apiUrl = getApiUrl();
  const res = await fetch(`${apiUrl}/v1/public/jobs/${companyId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
