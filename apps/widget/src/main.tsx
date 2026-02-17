import { createRoot } from 'react-dom/client';
import { CVBuilder } from '@repo/cv-builder';
import { ChatCVBuilder } from '@repo/cv-builder';
import './widget.css';

interface WidgetConfig {
  companyId: string;
  jobId?: string;
  containerId?: string;
  container?: HTMLElement;
}

const isDev = import.meta.env?.DEV;

class HireKitWidget {
  private root: ReturnType<typeof createRoot> | null = null;

  async init(config: WidgetConfig) {
    const container = config.container
      || document.getElementById(config.containerId || 'hirekit-widget');
    if (!container) {
      console.error(`HireKit: Container #${config.containerId || 'hirekit-widget'} not found`);
      return;
    }

    const apiUrl = (window as any).__HIREKIT_API_URL__
      || import.meta.env?.VITE_API_URL
      || 'https://app.hirekit.io/api';

    let companyConfig: any;
    try {
      const res = await fetch(`${apiUrl}/v1/widget/config/${config.companyId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      companyConfig = await res.json();
    } catch (err) {
      console.error('HireKit: Failed to load company config', err);
      container.innerHTML = '<p style="color:red;padding:1rem;">Failed to load application form. Please try again later.</p>';
      return;
    }

    let mountPoint: HTMLElement;

    if (isDev) {
      mountPoint = document.createElement('div');
      mountPoint.id = 'hirekit-root';
      container.appendChild(mountPoint);
    } else {
      const shadow = container.attachShadow({ mode: 'open' });
      const styleSheet = new CSSStyleSheet();
      const styles = document.querySelector('style[data-hirekit]');
      if (styles) {
        styleSheet.replaceSync(styles.textContent || '');
        shadow.adoptedStyleSheets = [styleSheet];
      }
      mountPoint = document.createElement('div');
      mountPoint.id = 'hirekit-root';
      shadow.appendChild(mountPoint);
    }

    const showSuccess = (mp: HTMLElement, message: string) => {
      mp.innerHTML = `
        <div style="text-align:center;padding:3rem 2rem;font-family:Inter,system-ui,sans-serif;">
          <div style="width:64px;height:64px;background:#DCFCE7;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p style="font-size:1.25rem;font-weight:700;color:#1E293B;margin-bottom:8px;">Application Submitted</p>
          <p style="font-size:0.95rem;color:#64748B;line-height:1.6;">${message}</p>
        </div>
      `;
    };

    const successMsg = companyConfig.landingPage?.successMessage
      || 'Thank you! Your application has been submitted.';

    const widgetType = companyConfig.widgetType || 'form';

    this.root = createRoot(mountPoint);

    if (widgetType === 'chat') {
      // Render AI Chat CV Builder
      mountPoint.style.height = '700px';
      this.root.render(
        <ChatCVBuilder
          context="widget"
          branding={companyConfig.branding}
          templateId={companyConfig.templateType || 'classic'}
          apiUrl={apiUrl}
          companyId={config.companyId}
          onComplete={async (cvData) => {
            try {
              const res = await fetch(`${apiUrl}/v1/applications`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Company-ID': config.companyId,
                },
                body: JSON.stringify({ cvData, jobId: config.jobId }),
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              showSuccess(mountPoint, successMsg);
            } catch (err) {
              console.error('HireKit: Submission failed', err);
              alert('Submission failed. Please try again.');
            }
          }}
          onError={(err) => {
            console.error('HireKit: Chat CV Builder error', err);
          }}
        />
      );
    } else {
      // Render Step-by-Step Form
      this.root.render(
        <CVBuilder
          context="widget"
          branding={companyConfig.branding}
          sections={companyConfig.sections}
          initialData={{}}
          onComplete={async (cvData) => {
            try {
              const res = await fetch(`${apiUrl}/v1/applications`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Company-ID': config.companyId,
                },
                body: JSON.stringify({ cvData, jobId: config.jobId }),
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              showSuccess(mountPoint, successMsg);
            } catch (err) {
              console.error('HireKit: Submission failed', err);
              alert('Submission failed. Please try again.');
            }
          }}
          onError={(err) => {
            console.error('HireKit: CV Builder error', err);
          }}
        />
      );
    }
  }

  destroy() {
    this.root?.unmount();
    this.root = null;
  }
}

if (typeof window !== 'undefined') {
  (window as any).HireKit = new HireKitWidget();
}
