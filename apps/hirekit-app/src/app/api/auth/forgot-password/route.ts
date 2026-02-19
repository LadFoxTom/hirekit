import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database-hirekit';
import { randomBytes } from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Always return success to prevent email enumeration
    const successResponse = NextResponse.json({
      message: 'If an account exists with that email, a password reset link has been sent.',
    });

    const user = await db.user.findUnique({ where: { email } });
    if (!user) return successResponse;

    // Delete any existing tokens for this email
    await db.passwordResetToken.deleteMany({ where: { email } });

    // Create new token
    const token = randomBytes(32).toString('hex');
    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    await sendPasswordResetEmail(email, token);

    return successResponse;
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
