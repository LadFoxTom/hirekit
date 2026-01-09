import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Log token for debugging (first and last few chars only for security)
    console.log('Reset password attempt:', {
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 8),
      tokenSuffix: token.substring(token.length - 8),
    });

    // Try to find the verification token (handle both encoded and non-encoded)
    let verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    // If not found, try URL decoding (in case token was encoded in the URL)
    if (!verificationToken) {
      try {
        const decodedToken = decodeURIComponent(token);
        if (decodedToken !== token) {
          console.log('Token appears to be URL encoded, trying decoded version');
          verificationToken = await prisma.verificationToken.findUnique({
            where: { token: decodedToken },
          });
        }
      } catch (e) {
        // decodeURIComponent can throw if token is malformed, ignore
        console.log('Could not decode token:', e);
      }
    }

    if (!verificationToken) {
      // Log recent tokens for debugging
      const recentTokens = await prisma.verificationToken.findMany({
        where: {
          expires: {
            gte: new Date(), // Only non-expired tokens
          },
        },
        orderBy: {
          expires: 'desc',
        },
        take: 5,
      });
      
      console.error('Token not found in database:', {
        searchedTokenLength: token.length,
        searchedTokenPrefix: token.substring(0, 10),
        recentTokensCount: recentTokens.length,
        recentTokenExamples: recentTokens.slice(0, 2).map(t => ({
          identifier: t.identifier,
          tokenLength: t.token.length,
          tokenPrefix: t.token.substring(0, 10),
          expires: t.expires,
        })),
      });
      
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new password reset.' },
        { status: 400 }
      );
    }

    // Find user by email (identifier)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the used token (use the actual token that was found)
    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });

    return NextResponse.json({
      message: 'Password has been reset successfully',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while resetting password' },
      { status: 500 }
    );
  }
}
