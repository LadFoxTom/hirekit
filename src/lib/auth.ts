import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import type { SessionStrategy } from 'next-auth';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

// Ensure environment variables are available
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not defined');
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // For development, allow admin login
        if (credentials.email === 'admin@admin.com' && credentials.password === 'admin') {
          // Check if user exists in database, create if not
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: 'Admin User',
              }
            });
          }
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }
        
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user || !user.password) {
          return null;
        }
        
        // Verify password
        const isValid = await compare(credentials.password, user.password);
        
        if (!isValid) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as SessionStrategy, // Use JWT for credentials compatibility
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (!user?.email) return false;
      
      // For OAuth providers, use PrismaAdapter to create account
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        });
        
        if (existingUser) {
          // User exists - check if Google account is already linked
          const hasGoogleAccount = existingUser.accounts.some(
            (acc: any) => acc.provider === 'google'
          );
          
          if (!hasGoogleAccount && account.providerAccountId) {
            // Link Google account to existing user
            try {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type || 'oauth',
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  id_token: account.id_token,
                  refresh_token: account.refresh_token,
                  scope: account.scope,
                  session_state: account.session_state,
                  token_type: account.token_type,
                }
              });
            } catch (error) {
              // Account might already exist, that's okay
              console.log('Account linking:', error);
            }
          }
        } else {
          // Create user if doesn't exist (for OAuth)
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || null,
              image: user.image || null,
            }
          });
        }
      }
      
      // For credentials, user already exists in database
      return true;
    },
    async jwt({ token, user, account }: any) {
      // Initial sign in - user object is available
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      // For OAuth, fetch user from database to get full user data
      if (account?.provider === 'google' && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.image = dbUser.image;
        }
      }
      
      return token;
    },
    async session({ session, token }: any) {
      // With JWT sessions, token contains the user data
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // If redirecting to login page, go to home instead
      if (url.includes('/auth/login') || url === baseUrl + '/auth/login') {
        return baseUrl;
      }
      // Allow relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow same-origin URLs
      if (new URL(url).origin === baseUrl) return url;
      // Default to home page
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/error',
  },
}; 