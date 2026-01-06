'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

// User interface
export interface User {
  id?: string
  email: string
  name?: string  // Keep for backward compatibility
  firstName?: string
  lastName?: string
  subscription?: {
    plan: string
    status: string
    currentPeriodEnd?: string
    cancelAtPeriodEnd?: boolean
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
  createdAt?: string
}

// Context interface
interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  signup: (email: string, password: string, name?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (callbackUrl?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  subscription?: User['subscription']
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  signup: async () => {},
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
  isAuthenticated: false,
})

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Provider component
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)

  const isLoading = status === 'loading'
  const user = session?.user ? {
    email: session.user.email as string,
    name: session.user.name as string,
    ...(session.user.id && { id: session.user.id as string }),
    ...(session.user.firstName && { firstName: session.user.firstName as string }),
    ...(session.user.lastName && { lastName: session.user.lastName as string }),
    ...(session.user.subscription && { subscription: session.user.subscription as User['subscription'] }),
    ...(session.user.phone && { phone: session.user.phone as string }),
    ...(session.user.address && { address: session.user.address as string }),
    ...(session.user.city && { city: session.user.city as string }),
    ...(session.user.state && { state: session.user.state as string }),
    ...(session.user.postalCode && { postalCode: session.user.postalCode as string }),
    ...(session.user.country && { country: session.user.country as string }),
    ...(session.user.avatarUrl && { avatarUrl: session.user.avatarUrl as string }),
    ...(session.user.jobTitle && { jobTitle: session.user.jobTitle as string }),
    ...(session.user.company && { company: session.user.company as string }),
    ...(session.user.linkedinUrl && { linkedinUrl: session.user.linkedinUrl as string }),
    ...(session.user.websiteUrl && { websiteUrl: session.user.websiteUrl as string }),
    ...(session.user.bio && { bio: session.user.bio as string }),
    ...(session.user.language && { language: session.user.language as string }),
    ...(session.user.dateOfBirth && { dateOfBirth: session.user.dateOfBirth as string }),
    ...(session.user.gender && { gender: session.user.gender as string }),
  } : null

  // Signup function
  const signup = async (email: string, password: string, name?: string) => {
    setError(null)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Signup failed')
      }

      // After successful signup, log the user in
      await login(email, password)
    } catch (err) {
      console.error('Signup error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
      throw err
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during login')
      throw err
    }
  }

  // Google login function
  const loginWithGoogle = async (callbackUrl?: string) => {
    setError(null)
    try {
      await signIn('google', callbackUrl ? { callbackUrl } : undefined)
    } catch (err) {
      console.error('Google login error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during Google login')
      throw err
    }
  }

  // Logout function
  const logout = async () => {
    setError(null)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (err) {
      console.error('Logout error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during logout')
    }
  }

  // Refresh user data function
  const refreshUser = async () => {
    try {
      // Force NextAuth to refresh the session
      await fetch('/api/auth/session', { method: 'GET' })
      // The session will be automatically updated by NextAuth
    } catch (err) {
      console.error('Error refreshing user data:', err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signup,
        login,
        loginWithGoogle,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        subscription: user?.subscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 