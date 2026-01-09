import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email';

// Test endpoint to verify email configuration
// Only use this for debugging - remove in production or protect with admin auth
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Log environment variables (without exposing API key)
    console.log('Email Configuration Check (Resend):', {
      hasApiKey: !!process.env.RESEND_API_KEY,
      hasFrom: !!process.env.EMAIL_FROM,
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    });

    // Generate a test token
    const testToken = 'test-token-' + Date.now();

    // Check if Resend is configured
    const hasApiKey = !!process.env.RESEND_API_KEY;
    const apiKeyPrefix = process.env.RESEND_API_KEY?.substring(0, 3) || 'not set';
    
    if (!hasApiKey) {
      return NextResponse.json({
        success: false,
        message: 'RESEND_API_KEY environment variable is not set',
        config: {
          hasApiKey: false,
          hasFrom: !!process.env.EMAIL_FROM,
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        },
      }, { status: 500 });
    }

    // Try to send email
    const emailSent = await sendPasswordResetEmail(email, testToken);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully. Check your inbox and spam folder.',
        config: {
          hasApiKey: true,
          apiKeyPrefix: `${apiKeyPrefix}...`,
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email. Check Vercel function logs for detailed error information.',
        config: {
          hasApiKey: true,
          apiKeyPrefix: `${apiKeyPrefix}...`,
          hasFrom: !!process.env.EMAIL_FROM,
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        },
        instructions: 'Check Vercel deployment logs for detailed Resend API error messages',
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
