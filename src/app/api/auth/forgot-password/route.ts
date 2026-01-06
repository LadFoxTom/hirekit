import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual password reset logic
    // For now, just return success to prevent email enumeration
    // In production, you would:
    // 1. Check if user exists
    // 2. Generate a reset token
    // 3. Send email with reset link
    // 4. Store token in database with expiry

    console.log(`Password reset requested for: ${email}`);

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      message: 'If an account exists with this email, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}

