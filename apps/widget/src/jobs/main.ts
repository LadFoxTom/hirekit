import type { JobsWidgetConfig, Job, WidgetState, FilterState } from './types';
import { fetchJobs } from './api';
import { renderFilters, applyFilters } from './components/Filters';
import { renderJobList } from './components/JobList';
import { renderJobDetail } from './components/JobDetail';
import { renderEmptyState } from './components/EmptyState';
import { openApplyModal } from './components/ApplyModal';
import { injectJsonLd } from './components/JsonLd';
import styles from './styles.css?inline';

class HireKitJobs {
  private shadowRoot: ShadowRoot | null = null;
  private root: HTMLElement | null = null;
  private config: JobsWidgetConfig | null = null;

  private state: WidgetState = {
    jobs: [],
    filteredJobs: [],
    company: null,
    filters: { search: '', department: '', location: '', type: '' },
    view: 'list',
    selectedJob: null,
    loading: true,
    error: null,
  };

  async init(config: JobsWidgetConfig): Promise<void> {
    this.config = config;

    const container = document.getElementById(config.containerId || 'hirekit-jobs');
    if (!container) {
      console.error(`HireKitJobs: Container #${config.containerId || 'hirekit-jobs'} not found`);
      return;
    }

    // Shadow DOM setup
    this.shadowRoot = container.attachShadow({ mode: 'open' });

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(styles);
    this.shadowRoot.adoptedStyleSheets = [styleSheet];

    // Apply theme class
    if (config.theme === 'dark') {
      (this.shadowRoot as any).host.classList.add('hk-dark');
    }

    // Apply custom primary color
    if (config.primaryColor) {
      (this.shadowRoot as any).host.style.setProperty('--hk-primary', config.primaryColor);
    }

    this.root = document.createElement('div');
    this.root.className = 'hk-jobs-root';
    this.shadowRoot.appendChild(this.root);

    this.render();

    try {
      const data = await fetchJobs(config.companyId);
      this.state.company = data.company;
      this.state.jobs = data.jobs;
      this.state.filteredJobs = data.jobs;
      this.state.loading = false;

      // Use company's primary color if not overridden
      if (!config.primaryColor && data.company.primaryColor) {
        (this.shadowRoot as any).host.style.setProperty(
          '--hk-primary',
          data.company.primaryColor
        );
      }

      // Inject JSON-LD for SEO
      injectJsonLd(data.jobs, data.company);

      this.render();
    } catch (err) {
      console.error('HireKitJobs: Failed to load jobs', err);
      this.state.loading = false;
      this.state.error = 'Failed to load job listings. Please try again later.';
      this.render();
    }
  }

  private render(): void {
    if (!this.root || !this.config) return;
    this.root.innerHTML = '';

    if (this.state.loading) {
      this.root.innerHTML = '<div class="hk-loading"><div class="hk-spinner"></div></div>';
      return;
    }

    if (this.state.error) {
      this.root.innerHTML = `<div class="hk-error">${this.state.error}</div>`;
      return;
    }

    // Header
    if (this.state.company) {
      const header = document.createElement('div');
      header.className = 'hk-header';
      if (this.state.company.logo) {
        header.innerHTML += `<img class="hk-header-logo" src="${this.state.company.logo}" alt="${this.state.company.name}" />`;
      }
      header.innerHTML += `<span class="hk-header-title">Careers at ${this.state.company.name}</span>`;
      header.innerHTML += `<span class="hk-header-count">${this.state.filteredJobs.length} open position${this.state.filteredJobs.length !== 1 ? 's' : ''}</span>`;
      this.root.appendChild(header);
    }

    // Detail view
    if (this.state.view === 'detail' && this.state.selectedJob) {
      this.root.appendChild(
        renderJobDetail(
          this.state.selectedJob,
          () => {
            this.state.view = 'list';
            this.state.selectedJob = null;
            this.render();
          },
          (job) => this.handleApply(job)
        )
      );
      return;
    }

    // Filters
    const showFilters = this.config.showFilters !== false && this.state.jobs.length > 3;
    const showSearch = this.config.showSearch !== false;
    if (showFilters || showSearch) {
      this.root.appendChild(
        renderFilters(
          this.state.jobs,
          this.state.filters,
          showSearch,
          (filters) => this.handleFilterChange(filters)
        )
      );
    }

    // Job list or empty state
    if (this.state.filteredJobs.length === 0) {
      const hasActiveFilters = !!(
        this.state.filters.search ||
        this.state.filters.department ||
        this.state.filters.location ||
        this.state.filters.type
      );
      this.root.appendChild(renderEmptyState(hasActiveFilters));
    } else {
      const layout = this.config.layout || 'cards';
      this.root.appendChild(
        renderJobList(
          this.state.filteredJobs,
          layout,
          (job) => {
            this.state.view = 'detail';
            this.state.selectedJob = job;
            this.render();
          },
          (job) => this.handleApply(job)
        )
      );
    }
  }

  private handleFilterChange(filters: FilterState): void {
    this.state.filters = filters;
    this.state.filteredJobs = applyFilters(this.state.jobs, filters);
    this.render();
  }

  private handleApply(job: Job): void {
    if (!this.shadowRoot || !this.config) return;
    openApplyModal(job, this.config.companyId, this.shadowRoot);
  }

  destroy(): void {
    // Remove JSON-LD
    const jsonLd = document.querySelector('script[data-hirekit-jobs-jsonld]');
    if (jsonLd) jsonLd.remove();

    this.root = null;
    this.shadowRoot = null;
    this.config = null;
  }
}

if (typeof window !== 'undefined') {
  (window as any).HireKitJobs = new HireKitJobs();
}
