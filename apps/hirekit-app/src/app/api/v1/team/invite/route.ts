import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { randomBytes } from 'crypto';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';
import { getCompanyForUser, hasPermission } from '@/lib/company';
import { sendInviteEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = await getCompanyForUser(session.user.id);
  if (!ctx) {
    return NextResponse.json({ error: 'No company' }, { status: 404 });
  }

  if (!hasPermission(ctx.role, 'admin')) {
    return NextResponse.json({ error: 'Admin role required' }, { status: 403 });
  }

  const { email, role } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const validRoles = ['member', 'hiring_manager', 'admin'];
  const inviteRole = validRoles.includes(role) ? role : 'member';

  // Check if already a member
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    const existingMember = await db.companyUser.findFirst({
      where: { companyId: ctx.companyId, userId: existingUser.id },
    });
    if (existingMember) {
      return NextResponse.json({ error: 'User is already a team member' }, { status: 400 });
    }
  }

  // Check for existing pending invite
  const existingInvite = await db.invitation.findFirst({
    where: { companyId: ctx.companyId, email, accepted: false },
  });
  if (existingInvite) {
    await db.invitation.delete({ where: { id: existingInvite.id } });
  }

  const token = randomBytes(32).toString('hex');
  await db.invitation.create({
    data: {
      companyId: ctx.companyId,
      email,
      role: inviteRole,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600000), // 7 days
      invitedBy: session.user.id,
    },
  });

  await sendInviteEmail(email, token, ctx.companyName, session.user.name || 'A team member');

  return NextResponse.json({ success: true }, { status: 201 });
}
