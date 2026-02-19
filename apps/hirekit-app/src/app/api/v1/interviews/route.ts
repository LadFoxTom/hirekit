import { NextResponse } from 'next/server';
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

  const interviews = await db.interview.findMany({
    where: {
      companyId: ctx.companyId,
      startTime: { gte: new Date() },
      status: { in: ['scheduled', 'confirmed'] },
    },
    include: {
      application: {
        select: { name: true, email: true },
      },
    },
    orderBy: { startTime: 'asc' },
    take: 20,
  });

  return NextResponse.json({ interviews });
}
