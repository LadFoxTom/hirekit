import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import { logActivity } from '@/lib/activity';

// POST - Widget submits an application (no auth required)
export async function POST(request: NextRequest) {
  const companyId = request.headers.get('X-Company-ID');
  if (!companyId) {
    return NextResponse.json(
      { error: 'Missing X-Company-ID header' },
      { status: 400 }
    );
  }

  let body: { cvData: Record<string, unknown>; jobId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.cvData) {
    return NextResponse.json({ error: 'Missing cvData' }, { status: 400 });
  }

  const company = await db.company.findUnique({
    where: { id: companyId },
  });
  if (!company) {
    return NextResponse.json({ error: 'Invalid company' }, { status: 404 });
  }

  if (body.jobId) {
    const job = await db.job.findFirst({
      where: { id: body.jobId, companyId },
    });
    if (!job) {
      return NextResponse.json({ error: 'Invalid job' }, { status: 404 });
    }
  }

  const cvData = body.cvData as Record<string, any>;
  const email =
    cvData.contact?.email || cvData.email || '';
  const name = cvData.fullName || cvData.name || null;
  const phone = cvData.contact?.phone || cvData.phone || null;

  // Email is optional — chat builder may not collect it early

  const application = await db.application.create({
    data: {
      companyId,
      jobId: body.jobId || null,
      cvData: body.cvData as any,
      email,
      name,
      phone,
      status: 'new',
    },
  });

  logActivity({
    companyId,
    applicationId: application.id,
    type: 'application_created',
    data: { name: application.name, email: application.email, jobId: body.jobId || null },
    performedBy: null,
  });

  return NextResponse.json(
    { success: true, applicationId: application.id },
    { status: 201 }
  );
}

// GET - Dashboard lists applications (auth required)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { companyId: ctx.companyId };
  if (status && status !== 'all') {
    where.status = status;
  }

  const [applications, total] = await Promise.all([
    db.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { job: { select: { id: true, title: true } } },
    }),
    db.application.count({ where }),
  ]);

  return NextResponse.json({
    applications,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
