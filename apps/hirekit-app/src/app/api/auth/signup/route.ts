import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { db } from '@repo/database-hirekit';
import { sendVerificationEmail } from '@/lib/email';
import { seedDefaultEmailTemplates } from '@/lib/seed-templates';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, companyName } = await request.json();

    if (!name || !email || !password || !companyName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        ownedCompanies: {
          create: {
            name: companyName,
            slug,
          },
        },
      },
      include: { ownedCompanies: true },
    });

    // Seed default email templates for the new company
    if (user.ownedCompanies[0]) {
      seedDefaultEmailTemplates(user.ownedCompanies[0].id).catch((err) => {
        console.error('Failed to seed email templates:', err);
      });
    }

    // Send verification email
    const token = randomBytes(32).toString('hex');
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours
      },
    });
    sendVerificationEmail(email, token).catch((err) => {
      console.error('Failed to send verification email:', err);
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
