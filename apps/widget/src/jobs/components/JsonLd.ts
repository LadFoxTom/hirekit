import type { Job, CompanyInfo } from '../types';

export function injectJsonLd(jobs: Job[], company: CompanyInfo): void {
  // Remove any existing HireKit JSON-LD
  const existing = document.querySelector('script[data-hirekit-jobs-jsonld]');
  if (existing) existing.remove();

  if (jobs.length === 0) return;

  const jobPostings = jobs.map((job) => {
    const posting: Record<string, any> = {
      '@type': 'JobPosting',
      title: job.title,
      datePosted: job.createdAt.split('T')[0],
      hiringOrganization: {
        '@type': 'Organization',
        name: company.name,
        ...(company.logo ? { logo: company.logo } : {}),
      },
    };

    if (job.description) {
      posting.description = job.description;
    }

    if (job.location) {
      posting.jobLocation = {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: job.location,
        },
      };
    }

    if (job.type) {
      const typeMap: Record<string, string> = {
        'full-time': 'FULL_TIME',
        'part-time': 'PART_TIME',
        contract: 'CONTRACTOR',
        internship: 'INTERN',
        freelance: 'CONTRACTOR',
      };
      posting.employmentType = typeMap[job.type] || job.type.toUpperCase();
    }

    if (job.salaryMin || job.salaryMax) {
      posting.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: job.salaryCurrency || 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          ...(job.salaryMin && job.salaryMax
            ? { minValue: job.salaryMin, maxValue: job.salaryMax, unitText: 'YEAR' }
            : job.salaryMin
              ? { value: job.salaryMin, unitText: 'YEAR' }
              : { value: job.salaryMax, unitText: 'YEAR' }),
        },
      };
    }

    return posting;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': jobPostings,
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-hirekit-jobs-jsonld', '');
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
