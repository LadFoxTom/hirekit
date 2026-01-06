import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering since this route uses authentication
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Use NextAuth to get the session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required to download CV', success: false },
        { status: 401 }
      )
    }

    // If we reach here, the user is authenticated
    // In a real app, you might generate a PDF here or handle other download logic

    return NextResponse.json({
      message: 'Download authorized',
      success: true
    })
  } catch (error) {
    console.error('Download authorization error:', error)
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    )
  }
} 