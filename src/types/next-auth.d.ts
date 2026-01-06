import NextAuth, { DefaultSession } from "next-auth"

// Extend the default session and user types

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      firstName?: string
      lastName?: string
      image?: string | null
      subscription?: {
        plan: string
        status: string
        currentPeriodEnd?: string
      }
      phone?: string
      address?: string
      city?: string
      state?: string
      postalCode?: string
      country?: string
      avatarUrl?: string
      jobTitle?: string
      company?: string
      linkedinUrl?: string
      websiteUrl?: string
      bio?: string
      language?: string
      dateOfBirth?: string
      gender?: string
    } & DefaultSession["user"]
  }
} 