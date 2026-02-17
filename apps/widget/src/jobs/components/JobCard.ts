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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

export function renderJobCard(
  job: Job,
  layout: 'cards' | 'list',
  onSelect: (job: Job) => void,
  onApply: (job: Job) => void
): HTMLElement {
  const card = document.createElement('div');
  card.className = layout === 'list' ? 'hk-card hk-card--list' : 'hk-card';

  const salary = formatSalary(job);
  const badges: string[] = [];
  if (job.department) badges.push(job.department);
  if (job.location) badges.push(`📍 ${job.location}`);
  if (job.type) badges.push(job.type);

  const badgesHtml = badges
    .map((b) => `<span class="hk-badge">${b}</span>`)
    .join('');

  if (layout === 'list') {
    card.innerHTML = `
      <div class="hk-card-body">
        <div class="hk-card-title">${job.title}</div>
        <div class="hk-card-meta">${badgesHtml}</div>
        ${salary ? `<div class="hk-card-salary">${salary}</div>` : ''}
      </div>
      <div class="hk-card-actions">
        <span class="hk-card-date">${timeAgo(job.createdAt)}</span>
        <button class="hk-btn hk-btn-primary hk-apply-btn" style="margin-left:12px">Apply</button>
      </div>
    `;
  } else {
    card.innerHTML = `
      <div class="hk-card-title">${job.title}</div>
      <div class="hk-card-meta">${badgesHtml}</div>
      ${salary ? `<div class="hk-card-salary">${salary}</div>` : ''}
      <div class="hk-card-footer">
        <span class="hk-card-date">${timeAgo(job.createdAt)}</span>
        <button class="hk-btn hk-btn-primary hk-apply-btn">Apply</button>
      </div>
    `;
  }

  card.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.hk-apply-btn')) {
      e.stopPropagation();
      onApply(job);
    } else {
      onSelect(job);
    }
  });

  return card;
}
