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
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const templates = await db.emailTemplate.findMany({
    where: { companyId: ctx.companyId },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ templates });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const { name, subject, body, trigger } = await request.json();

  if (!name || !subject || !body) {
    return NextResponse.json({ error: 'Name, subject, and body are required' }, { status: 400 });
  }

  const template = await db.emailTemplate.create({
    data: {
      companyId: ctx.companyId,
      name,
      subject,
      body,
      trigger: trigger || null,
    },
  });

  return NextResponse.json({ template }, { status: 201 });
}
