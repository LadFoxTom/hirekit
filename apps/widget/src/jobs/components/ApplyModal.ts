import type { Job } from '../types';
import { getApiUrl } from '../api';

export function openApplyModal(
  job: Job,
  companyId: string,
  shadowRoot: ShadowRoot
): void {
  const overlay = document.createElement('div');
  overlay.className = 'hk-modal-overlay';

  overlay.innerHTML = `
    <div class="hk-modal">
      <div class="hk-modal-header">
        <span class="hk-modal-title">Apply — ${job.title}</span>
        <button class="hk-modal-close">✕</button>
      </div>
      <div class="hk-modal-body">
        <div class="hk-modal-loading">Loading application form...</div>
      </div>
    </div>
  `;

  const close = () => {
    overlay.remove();
  };

  overlay.querySelector('.hk-modal-close')!.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  shadowRoot.appendChild(overlay);

  const modalBody = overlay.querySelector('.hk-modal-body') as HTMLElement;

  // Load the CV builder widget dynamically
  loadCVBuilder(modalBody, companyId, job.id, close);
}

async function loadCVBuilder(
  container: HTMLElement,
  companyId: string,
  jobId: string,
  onClose: () => void
): Promise<void> {
  const apiUrl = getApiUrl();

  // Check if HireKit widget is already loaded
  if ((window as any).HireKit) {
    initWidget(container, companyId, jobId);
    return;
  }

  // Determine widget script URL
  const existingScript = document.querySelector(
    'script[src*="hirekit-widget"]'
  ) as HTMLScriptElement | null;
  const widgetUrl =
    existingScript?.src || `${apiUrl.replace('/api', '')}/widget/hirekit-widget.iife.js`;

  try {
    const script = document.createElement('script');
    script.src = widgetUrl;
    script.async = true;
    script.onload = () => {
      initWidget(container, companyId, jobId);
    };
    script.onerror = () => {
      container.innerHTML =
        '<div class="hk-error">Failed to load application form. Please try again later.</div>';
    };
    document.head.appendChild(script);
  } catch {
    container.innerHTML =
      '<div class="hk-error">Failed to load application form. Please try again later.</div>';
  }
}

function initWidget(
  container: HTMLElement,
  companyId: string,
  jobId: string
): void {
  container.innerHTML = '';
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'hirekit-widget-modal-' + jobId;
  container.appendChild(widgetContainer);

  (window as any).HireKit.init({
    companyId,
    jobId,
    container: widgetContainer,
  });
}
