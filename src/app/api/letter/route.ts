import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LetterService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's letters
    const letters = await LetterService.getUserLetters(session.user.id)

    return NextResponse.json({ letters })
  } catch (error) {
    console.error('Error fetching letters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch letters' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    
    // Basic validation
    if (!body.content || typeof body.content !== 'object') {
      return NextResponse.json(
        { error: 'Invalid letter data' },
        { status: 400 }
      )
    }

    // Create letter using the service
    const letter = await LetterService.createLetter(
      session.user.id,
      body.title || 'My Letter',
      body.content,
      body.template || 'professional',
      body.cvText // Pass CV text if provided
    )

    return NextResponse.json({ 
      letter,
      message: 'Letter saved successfully' 
    })
  } catch (error) {
    console.error('Error creating letter:', error)
    
    // Handle specific database errors
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'Letter with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create letter' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Letter ID is required' },
        { status: 400 }
      )
    }

    // Check ownership
    const existingLetter = await LetterService.getLetter(id, session.user.id)

    if (!existingLetter) {
      return NextResponse.json(
        { error: 'Letter not found or access denied' },
        { status: 404 }
      )
    }

    // Update letter using the service
    const updatedLetter = await LetterService.updateLetter(id, session.user.id, updateData)

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

export async function DELETE(request: NextRequest) {
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
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Letter ID is required' },
        { status: 400 }
      )
    }

    // Check ownership
    const existingLetter = await LetterService.getLetter(id, session.user.id)

    if (!existingLetter) {
      return NextResponse.json(
        { error: 'Letter not found or access denied' },
        { status: 404 }
      )
    }

    // Delete letter using the service
    await LetterService.deleteLetter(id, session.user.id)

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