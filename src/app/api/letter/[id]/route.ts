import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LetterService } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get specific letter
    const letter = await LetterService.getLetter(params.id, session.user.id)

    if (!letter) {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ letter })
  } catch (error) {
    console.error('Error fetching letter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch letter' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Check ownership
    const existingLetter = await LetterService.getLetter(params.id, session.user.id)

    if (!existingLetter) {
      return NextResponse.json(
        { error: 'Letter not found or access denied' },
        { status: 404 }
      )
    }

    // Update letter using the service
    const updatedLetter = await LetterService.updateLetter(params.id, session.user.id, body)

    return NextResponse.json({ 
      letter: updatedLetter,
      message: 'Letter updated successfully' 
    })
  } catch (error) {
    console.error('Error updating letter:', error)
    return NextResponse.json(
      { error: 'Failed to update letter' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check ownership
    const existingLetter = await LetterService.getLetter(params.id, session.user.id)

    if (!existingLetter) {
      return NextResponse.json(
        { error: 'Letter not found or access denied' },
        { status: 404 }
      )
    }

    // Delete letter using the service
    await LetterService.deleteLetter(params.id, session.user.id)

    return NextResponse.json({ 
      message: 'Letter deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting letter:', error)
    return NextResponse.json(
      { error: 'Failed to delete letter' },
      { status: 500 }
    )
  }
} 