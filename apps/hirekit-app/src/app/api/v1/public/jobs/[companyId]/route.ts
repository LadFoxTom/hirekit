import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database-hirekit';

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params;

  const company = await db.company.findUnique({
    where: { id: companyId },
    include: {
      branding: true,
      jobs: {
        where: { active: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          type: true,
          department: true,
          salaryMin: true,
          salaryMax: true,
          salaryCurrency: true,
          createdAt: true,
        },
      },
    },
  });

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const response = NextResponse.json({
    company: {
      name: company.name,
      logo: company.branding?.logoUrl || null,
      primaryColor: company.branding?.primaryColor || '#4F46E5',
    },
    jobs: company.jobs,
  });

  response.headers.set(
    'Cache-Control',
    'public, max-age=60, stale-while-revalidate=300'
  );

  return response;
}
