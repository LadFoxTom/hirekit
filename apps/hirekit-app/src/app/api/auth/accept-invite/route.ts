import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@repo/database-hirekit';

export async function POST(request: NextRequest) {
  try {
    const { token, name, password } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const invitation = await db.invitation.findUnique({ where: { token } });

    if (!invitation || invitation.accepted || invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 });
    }

    // Check if user already exists
    let user = await db.user.findUnique({ where: { email: invitation.email } });

    if (!user) {
      // New user - require name and password
      if (!name || !password) {
        return NextResponse.json({ error: 'Name and password are required for new accounts' }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      user = await db.user.create({
        data: {
          name,
          email: invitation.email,
          passwordHash,
          emailVerified: new Date(), // Email verified via invite
        },
      });
    }

    // Create company user (ignore if already exists)
    await db.companyUser.create({
      data: {
        companyId: invitation.companyId,
        userId: user.id,
        role: invitation.role,
      },
    }).catch(() => {});

    // Mark invitation as accepted
    await db.invitation.update({
      where: { id: invitation.id },
      data: { accepted: true },
    });

    return NextResponse.json({ success: true, email: user.email });
  } catch (error) {
    console.error('Accept invite error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
