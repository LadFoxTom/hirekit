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

    // Try to send email with error details
    try {
      const emailSent = await sendPasswordResetEmail(email, testToken, true);

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
          message: 'Email function returned false but no error was thrown.',
          config: {
            hasApiKey: true,
            apiKeyPrefix: `${apiKeyPrefix}...`,
            hasFrom: !!process.env.EMAIL_FROM,
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          },
        }, { status: 500 });
      }
    } catch (emailError: any) {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email.',
        error: emailError.message,
        errorDetails: emailError.toString(),
        config: {
          hasApiKey: true,
          apiKeyPrefix: `${apiKeyPrefix}...`,
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          domainVerified: (process.env.EMAIL_FROM || '').includes('@ladderfox.com'),
        },
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
