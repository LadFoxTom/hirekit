import type { Job } from '../types';
import { renderJobCard } from './JobCard';

export function renderJobList(
  jobs: Job[],
  layout: 'cards' | 'list',
  onSelect: (job: Job) => void,
  onApply: (job: Job) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = layout === 'list' ? 'hk-list' : 'hk-grid';

  for (const job of jobs) {
    container.appendChild(renderJobCard(job, layout, onSelect, onApply));
  }

  return container;
}
