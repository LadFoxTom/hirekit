import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured, skipping email to:', to);
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      ...(text && { text }),
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return false;
    }

    console.log('[Email] Sent:', { id: data?.id, to, subject });
    return true;
  } catch (err) {
    console.error('[Email] Failed to send:', err);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: email,
    subject: 'Reset Your HireKit Password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: #4F46E5; color: white; font-weight: bold; font-size: 18px; padding: 8px 16px; border-radius: 8px;">H</div>
          <span style="font-size: 24px; font-weight: 800; color: #4F46E5; margin-left: 8px; vertical-align: middle;">HireKit</span>
        </div>
        <h2 style="color: #1E293B; font-size: 20px; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="color: #64748B; font-size: 15px; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password. This link expires in 1 hour.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Reset Password</a>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
        <p style="color: #94A3B8; font-size: 13px; margin-top: 8px;">Or copy this link: ${resetUrl}</p>
      </div>
    `,
    text: `Reset your HireKit password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: email,
    subject: 'Verify Your HireKit Email',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: #4F46E5; color: white; font-weight: bold; font-size: 18px; padding: 8px 16px; border-radius: 8px;">H</div>
          <span style="font-size: 24px; font-weight: 800; color: #4F46E5; margin-left: 8px; vertical-align: middle;">HireKit</span>
        </div>
        <h2 style="color: #1E293B; font-size: 20px; margin-bottom: 16px;">Verify Your Email</h2>
        <p style="color: #64748B; font-size: 15px; line-height: 1.6;">Please verify your email address to complete your HireKit account setup.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Verify Email</a>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">Or copy this link: ${verifyUrl}</p>
      </div>
    `,
    text: `Verify your HireKit email: ${verifyUrl}`,
  });
}

export async function sendInviteEmail(email: string, token: string, companyName: string, inviterName: string) {
  const inviteUrl = `${APP_URL}/auth/accept-invite?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: email,
    subject: `You've been invited to join ${companyName} on HireKit`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: #4F46E5; color: white; font-weight: bold; font-size: 18px; padding: 8px 16px; border-radius: 8px;">H</div>
          <span style="font-size: 24px; font-weight: 800; color: #4F46E5; margin-left: 8px; vertical-align: middle;">HireKit</span>
        </div>
        <h2 style="color: #1E293B; font-size: 20px; margin-bottom: 16px;">You're Invited!</h2>
        <p style="color: #64748B; font-size: 15px; line-height: 1.6;">${inviterName} has invited you to join <strong>${companyName}</strong> on HireKit. Click below to accept the invitation.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Accept Invitation</a>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">This invitation expires in 7 days.</p>
        <p style="color: #94A3B8; font-size: 13px; margin-top: 8px;">Or copy this link: ${inviteUrl}</p>
      </div>
    `,
    text: `${inviterName} has invited you to join ${companyName} on HireKit.\n\nAccept: ${inviteUrl}\n\nThis invitation expires in 7 days.`,
  });
}

export async function sendCandidateEmailRaw({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  return sendEmail({
    to,
    subject,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="color: #1E293B; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${body}</div>
      </div>
    `,
    text: body,
  });
}

export async function sendInterviewEmail({
  to,
  candidateName,
  companyName,
  title,
  startTime,
  endTime,
  timezone,
  location,
  meetingLink,
  schedulingUrl,
}: {
  to: string;
  candidateName: string;
  companyName: string;
  title: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  location?: string | null;
  meetingLink?: string | null;
  schedulingUrl?: string | null;
}) {
  const dateStr = startTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: timezone });
  const timeStr = `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone })}`;

  const locationHtml = location ? `<p style="color: #64748B; font-size: 14px;"><strong>Location:</strong> ${location}</p>` : '';
  const linkHtml = meetingLink ? `<p style="color: #64748B; font-size: 14px;"><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #4F46E5;">${meetingLink}</a></p>` : '';
  const scheduleHtml = schedulingUrl ? `
    <div style="text-align: center; margin: 24px 0;">
      <a href="${schedulingUrl}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">Choose Your Time Slot</a>
    </div>
  ` : '';

  return sendEmail({
    to,
    subject: `Interview: ${title} at ${companyName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background: #4F46E5; color: white; font-weight: bold; font-size: 18px; padding: 8px 16px; border-radius: 8px;">H</div>
          <span style="font-size: 24px; font-weight: 800; color: #4F46E5; margin-left: 8px; vertical-align: middle;">HireKit</span>
        </div>
        <h2 style="color: #1E293B; font-size: 20px; margin-bottom: 16px;">Interview Scheduled</h2>
        <p style="color: #64748B; font-size: 15px; line-height: 1.6;">Hi ${candidateName},</p>
        <p style="color: #64748B; font-size: 15px; line-height: 1.6;">Your interview with <strong>${companyName}</strong> has been scheduled:</p>
        <div style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="color: #1E293B; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">${title}</p>
          <p style="color: #64748B; font-size: 14px; margin: 4px 0;"><strong>Date:</strong> ${dateStr}</p>
          <p style="color: #64748B; font-size: 14px; margin: 4px 0;"><strong>Time:</strong> ${timeStr} (${timezone})</p>
          ${locationHtml}
          ${linkHtml}
        </div>
        ${scheduleHtml}
        <p style="color: #94A3B8; font-size: 13px; margin-top: 24px;">Good luck!</p>
      </div>
    `,
    text: `Interview Scheduled: ${title} at ${companyName}\nDate: ${dateStr}\nTime: ${timeStr} (${timezone})${location ? `\nLocation: ${location}` : ''}${meetingLink ? `\nMeeting Link: ${meetingLink}` : ''}${schedulingUrl ? `\nChoose your time slot: ${schedulingUrl}` : ''}`,
  });
}
