import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    // Even if user doesn't exist, return the same message
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, a reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Store token in database using VerificationToken model
    // Delete any existing tokens for this email first
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create new token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires,
      },
    });

    // Log configuration before sending
    console.log('Password reset request - Configuration:', {
      hasResendKey: !!process.env.RESEND_API_KEY,
      fromEmail: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      userEmail: email,
    });

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      console.error('❌ Failed to send password reset email to:', email);
      console.error('Check Vercel function logs above for detailed Resend API error');
      // Still return success to prevent email enumeration
      // But log the error for debugging
    } else {
      console.log('✅ Password reset email sent successfully to:', email);
    }

    return NextResponse.json({
      message: 'If an account exists with this email, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: 'If an account exists with this email, a reset link has been sent.',
    });
  }
}

