import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const company = await db.company.findUnique({
    where: { id: ctx.companyId },
    select: { slug: true, name: true },
  });

  await db.branding.upsert({
    where: { companyId: ctx.companyId },
    create: {
      companyId: ctx.companyId,
      primaryColor: data.primaryColor,
    },
    update: {
      primaryColor: data.primaryColor,
    },
  });

  await db.cVTemplate.upsert({
    where: { companyId: ctx.companyId },
    create: {
      companyId: ctx.companyId,
      templateType: data.template,
      sections: data.sections,
    },
    update: {
      templateType: data.template,
      sections: data.sections,
    },
  });

  await db.landingPage.upsert({
    where: { companyId: ctx.companyId },
    create: {
      companyId: ctx.companyId,
      domain: `${company?.slug || ctx.companyId}.hirekit.io`,
      title: `Apply at ${company?.name || ctx.companyName}`,
      successMessage: 'Thank you! We received your application.',
    },
    update: {},
  });

  return NextResponse.json({ success: true, companyId: ctx.companyId });
}
