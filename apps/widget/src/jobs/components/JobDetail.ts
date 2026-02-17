import type { Job } from '../types';

function formatSalary(job: Job): string | null {
  if (!job.salaryMin && !job.salaryMax) return null;
  const currency = job.salaryCurrency || 'EUR';
  const fmt = (n: number) =>
    new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  if (job.salaryMin && job.salaryMax) return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
  if (job.salaryMin) return `From ${fmt(job.salaryMin)}`;
  return `Up to ${fmt(job.salaryMax!)}`;
}

export function renderJobDetail(
  job: Job,
  onBack: () => void,
  onApply: (job: Job) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'hk-detail';

  const salary = formatSalary(job);
  const badges: string[] = [];
  if (job.department) badges.push(job.department);
  if (job.location) badges.push(`📍 ${job.location}`);
  if (job.type) badges.push(job.type);

  const badgesHtml = badges
    .map((b) => `<span class="hk-badge">${b}</span>`)
    .join('');

  container.innerHTML = `
    <button class="hk-detail-back">← Back to all jobs</button>
    <div class="hk-detail-title">${job.title}</div>
    <div class="hk-detail-meta">${badgesHtml}</div>
    ${salary ? `<div class="hk-detail-salary">${salary}</div>` : ''}
    ${job.description ? `<div class="hk-detail-description">${job.description}</div>` : ''}
    <div class="hk-detail-apply">
      <button class="hk-btn hk-btn-primary hk-detail-apply-btn">Apply for this position</button>
    </div>
  `;

  container.querySelector('.hk-detail-back')!.addEventListener('click', onBack);
  container.querySelector('.hk-detail-apply-btn')!.addEventListener('click', () => onApply(job));

  return container;
}
