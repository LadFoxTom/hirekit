import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser, hasPermission } from '@/lib/company';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx || !hasPermission(ctx.role, 'admin')) {
    return NextResponse.json({ error: 'Admin role required' }, { status: 403 });
  }

  const { role } = await request.json();
  const validRoles = ['member', 'hiring_manager', 'admin'];

  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  // Prevent changing owner role
  const member = await db.companyUser.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
  });
  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }
  if (member.role === 'owner') {
    return NextResponse.json({ error: 'Cannot change owner role' }, { status: 400 });
  }

  await db.companyUser.update({
    where: { id: params.id },
    data: { role },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx || !hasPermission(ctx.role, 'admin')) {
    return NextResponse.json({ error: 'Admin role required' }, { status: 403 });
  }

  const member = await db.companyUser.findFirst({
    where: { id: params.id, companyId: ctx.companyId },
  });
  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }
  if (member.role === 'owner') {
    return NextResponse.json({ error: 'Cannot remove owner' }, { status: 400 });
  }

  await db.companyUser.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
