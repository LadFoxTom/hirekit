import type { Job, FilterState } from '../types';

function getUniqueValues(jobs: Job[], key: keyof Job): string[] {
  const values = new Set<string>();
  for (const job of jobs) {
    const val = job[key];
    if (typeof val === 'string' && val) values.add(val);
  }
  return Array.from(values).sort();
}

function buildSelect(
  label: string,
  options: string[],
  value: string,
  onChange: (val: string) => void
): HTMLSelectElement {
  const select = document.createElement('select');
  select.className = 'hk-select';

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = label;
  select.appendChild(defaultOpt);

  for (const opt of options) {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt;
    if (opt === value) option.selected = true;
    select.appendChild(option);
  }

  select.addEventListener('change', () => onChange(select.value));
  return select;
}

export function renderFilters(
  jobs: Job[],
  filters: FilterState,
  showSearch: boolean,
  onChange: (filters: FilterState) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'hk-filters';

  if (showSearch) {
    const search = document.createElement('input');
    search.type = 'text';
    search.className = 'hk-search';
    search.placeholder = 'Search jobs...';
    search.value = filters.search;
    search.addEventListener('input', () => {
      onChange({ ...filters, search: search.value });
    });
    container.appendChild(search);
  }

  const departments = getUniqueValues(jobs, 'department');
  if (departments.length > 1) {
    container.appendChild(
      buildSelect('All Departments', departments, filters.department, (val) =>
        onChange({ ...filters, department: val })
      )
    );
  }

  const locations = getUniqueValues(jobs, 'location');
  if (locations.length > 1) {
    container.appendChild(
      buildSelect('All Locations', locations, filters.location, (val) =>
        onChange({ ...filters, location: val })
      )
    );
  }

  const types = getUniqueValues(jobs, 'type');
  if (types.length > 1) {
    container.appendChild(
      buildSelect('All Types', types, filters.type, (val) =>
        onChange({ ...filters, type: val })
      )
    );
  }

  return container;
}

export function applyFilters(jobs: Job[], filters: FilterState): Job[] {
  return jobs.filter((job) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const searchable = [job.title, job.department, job.location, job.type, job.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    if (filters.department && job.department !== filters.department) return false;
    if (filters.location && job.location !== filters.location) return false;
    if (filters.type && job.type !== filters.type) return false;
    return true;
  });
}
