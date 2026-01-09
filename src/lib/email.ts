import { Resend } from 'resend';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const sendPasswordResetEmail = async (email: string, resetToken: string, returnError = false) => {
  if (!resend) {
    const error = 'Resend API key not configured. Required environment variable: RESEND_API_KEY';
    console.error(error);
    if (returnError) throw new Error(error);
    return false;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://www.ladderfox.com';
  const resetUrl = `${appUrl}/auth/reset-password?token=${resetToken}`;
  
  // Use noreply@ladderfox.com if EMAIL_FROM is set and domain is verified
  // Otherwise fall back to onboarding@resend.dev
  const requestedFrom = process.env.EMAIL_FROM;
  const useFromEmail = requestedFrom && requestedFrom.includes('@ladderfox.com')
    ? requestedFrom
    : (requestedFrom || 'onboarding@resend.dev');

  console.log('Attempting to send password reset email via Resend:', {
    to: email,
    from: useFromEmail,
    domainVerified: useFromEmail.includes('@ladderfox.com'),
  });

  try {
    const { data, error } = await resend.emails.send({
      from: useFromEmail,
      to: email,
      subject: 'Reset Your LadderFox Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">LadderFox</h1>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
              <p>You requested to reset your password for your LadderFox account.</p>
              <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="color: #667eea; word-break: break-all; font-size: 12px;">${resetUrl}</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't request this password reset, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} LadderFox. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
      text: `
        Reset Your LadderFox Password
        
        You requested to reset your password for your LadderFox account.
        
        Click this link to reset your password (expires in 1 hour):
        ${resetUrl}
        
        If you didn't request this password reset, you can safely ignore this email.
        
        © ${new Date().getFullYear()} LadderFox. All rights reserved.
      `,
    });

    if (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
        error: JSON.stringify(error, null, 2),
      };
      console.error('Resend API error:', errorDetails);
      if (returnError) {
        throw new Error(`Resend API error: ${error.message} (Status: ${error.statusCode || 'unknown'})`);
      }
      return false;
    }

    if (!data) {
      const error = 'Resend returned no data and no error - unexpected response';
      console.error(error);
      if (returnError) throw new Error(error);
      return false;
    }

    console.log('Password reset email sent successfully via Resend:', {
      id: data.id,
      to: email,
      from: useFromEmail,
    });
    return true;
  } catch (error: any) {
    const errorDetails = {
      error: error.message,
      stack: error.stack,
      name: error.name,
      to: email,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
    };
    console.error('Error sending password reset email via Resend:', errorDetails);
    if (returnError) {
      throw error;
    }
    return false;
  }
};
