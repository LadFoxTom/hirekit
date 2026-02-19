import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser } from '@/lib/company';
import crypto from 'crypto';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  const webhooks = await db.webhook.findMany({
    where: { companyId: ctx.companyId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(webhooks);
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

  const body = await request.json();
  const { url, events } = body;

  if (!url || !events || !Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ error: 'URL and events are required' }, { status: 400 });
  }

  const secret = crypto.randomBytes(32).toString('hex');

  const webhook = await db.webhook.create({
    data: {
      companyId: ctx.companyId,
      url,
      events,
      secret,
      active: true,
    },
  });

  return NextResponse.json(webhook, { status: 201 });
}
