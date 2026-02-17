export interface JobsWidgetConfig {
  companyId: string;
  containerId?: string;
  layout?: 'cards' | 'list';
  theme?: 'light' | 'dark';
  primaryColor?: string;
  showFilters?: boolean;
  showSearch?: boolean;
}

export interface Job {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  type: string | null;
  department: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  createdAt: string;
}

export interface CompanyInfo {
  name: string;
  logo: string | null;
  primaryColor: string;
}

export interface JobsApiResponse {
  company: CompanyInfo;
  jobs: Job[];
}

export interface FilterState {
  search: string;
  department: string;
  location: string;
  type: string;
}

export type View = 'list' | 'detail';

export interface WidgetState {
  jobs: Job[];
  filteredJobs: Job[];
  company: CompanyInfo | null;
  filters: FilterState;
  view: View;
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
}
