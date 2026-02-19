import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const company = await db.company.findUnique({
    where: { id: ctx.companyId },
    include: {
      branding: true,
      cvTemplate: true,
      landingPage: true,
      jobListingConfig: true,
    },
  });

  if (!company) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  return NextResponse.json({
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
    },
    branding: company.branding || {
      primaryColor: '#4F46E5',
      secondaryColor: '#F8FAFC',
      fontFamily: 'Inter',
      showCompanyName: true,
      logoUrl: null,
    },
    sections: company.cvTemplate?.sections || {
      personalInfo: { enabled: true },
      experience: { enabled: true, min: 1, max: 10 },
      education: { enabled: true, min: 0, max: 5 },
      skills: { enabled: true },
    },
    templateType: company.cvTemplate?.templateType || 'classic',
    landingPage: company.landingPage
      ? {
          successMessage: company.landingPage.successMessage,
          redirectUrl: company.landingPage.redirectUrl,
          widgetType: company.landingPage.widgetType || 'form',
        }
      : {
          successMessage: 'Thank you! Your application has been submitted.',
          redirectUrl: null,
          widgetType: 'form',
        },
    jobListingConfig: company.jobListingConfig
      ? {
          templateId: company.jobListingConfig.templateId,
          showFilters: company.jobListingConfig.showFilters,
          showSearch: company.jobListingConfig.showSearch,
          customTemplateCSS: company.jobListingConfig.customTemplateCSS,
          customTemplateName: company.jobListingConfig.customTemplateName,
          customFontUrl: company.jobListingConfig.customFontUrl,
          customLayout: company.jobListingConfig.customLayout,
          customSourceUrl: company.jobListingConfig.customSourceUrl,
        }
      : {
          templateId: 'simple',
          showFilters: true,
          showSearch: true,
          customTemplateCSS: null,
          customTemplateName: null,
          customFontUrl: null,
          customLayout: null,
          customSourceUrl: null,
        },
  });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const company = await db.company.findUnique({
    where: { id: ctx.companyId },
    select: { slug: true, name: true },
  });

  const body = await request.json();

  if (body.branding) {
    await db.branding.upsert({
      where: { companyId: ctx.companyId },
      create: {
        companyId: ctx.companyId,
        primaryColor: body.branding.primaryColor || '#4F46E5',
        secondaryColor: body.branding.secondaryColor || '#F8FAFC',
        fontFamily: body.branding.fontFamily || 'Inter',
        showCompanyName: body.branding.showCompanyName ?? true,
        logoUrl: body.branding.logoUrl || null,
      },
      update: {
        primaryColor: body.branding.primaryColor,
        secondaryColor: body.branding.secondaryColor,
        fontFamily: body.branding.fontFamily,
        showCompanyName: body.branding.showCompanyName,
        logoUrl: body.branding.logoUrl,
      },
    });
  }

  if (body.sections || body.templateType) {
    await db.cVTemplate.upsert({
      where: { companyId: ctx.companyId },
      create: {
        companyId: ctx.companyId,
        sections: body.sections || {
          personalInfo: { enabled: true },
          experience: { enabled: true, min: 1, max: 10 },
          education: { enabled: true, min: 0, max: 5 },
          skills: { enabled: true },
        },
        templateType: body.templateType || 'classic',
      },
      update: {
        ...(body.sections && { sections: body.sections }),
        ...(body.templateType && { templateType: body.templateType }),
      },
    });
  }

  if (body.landingPage) {
    await db.landingPage.upsert({
      where: { companyId: ctx.companyId },
      create: {
        companyId: ctx.companyId,
        domain: `${company?.slug || ctx.companyId}.hirekit.io`,
        title: `Apply at ${ctx.companyName}`,
        successMessage: body.landingPage.successMessage || 'Thank you! Your application has been submitted.',
        redirectUrl: body.landingPage.redirectUrl || null,
        widgetType: body.landingPage.widgetType || 'form',
      },
      update: {
        successMessage: body.landingPage.successMessage,
        redirectUrl: body.landingPage.redirectUrl,
        ...(body.landingPage.widgetType && { widgetType: body.landingPage.widgetType }),
      },
    });
  }

  if (body.jobListingConfig) {
    await db.jobListingConfig.upsert({
      where: { companyId: ctx.companyId },
      create: {
        companyId: ctx.companyId,
        templateId: body.jobListingConfig.templateId || 'simple',
        showFilters: body.jobListingConfig.showFilters ?? true,
        showSearch: body.jobListingConfig.showSearch ?? true,
        customTemplateCSS: body.jobListingConfig.customTemplateCSS || null,
        customTemplateName: body.jobListingConfig.customTemplateName || null,
        customFontUrl: body.jobListingConfig.customFontUrl || null,
        customLayout: body.jobListingConfig.customLayout || null,
        customSourceUrl: body.jobListingConfig.customSourceUrl || null,
        customDesignTokens: body.jobListingConfig.customDesignTokens || null,
      },
      update: {
        ...(body.jobListingConfig.templateId !== undefined && { templateId: body.jobListingConfig.templateId }),
        ...(body.jobListingConfig.showFilters !== undefined && { showFilters: body.jobListingConfig.showFilters }),
        ...(body.jobListingConfig.showSearch !== undefined && { showSearch: body.jobListingConfig.showSearch }),
        ...(body.jobListingConfig.customTemplateCSS !== undefined && { customTemplateCSS: body.jobListingConfig.customTemplateCSS }),
        ...(body.jobListingConfig.customTemplateName !== undefined && { customTemplateName: body.jobListingConfig.customTemplateName }),
        ...(body.jobListingConfig.customFontUrl !== undefined && { customFontUrl: body.jobListingConfig.customFontUrl }),
        ...(body.jobListingConfig.customLayout !== undefined && { customLayout: body.jobListingConfig.customLayout }),
        ...(body.jobListingConfig.customSourceUrl !== undefined && { customSourceUrl: body.jobListingConfig.customSourceUrl }),
        ...(body.jobListingConfig.customDesignTokens !== undefined && { customDesignTokens: body.jobListingConfig.customDesignTokens }),
      },
    });
  }

  return NextResponse.json({ success: true });
}
