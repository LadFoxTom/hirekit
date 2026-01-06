import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CVService } from '@/lib/db'

// Force dynamic rendering to prevent build-time database access
export const dynamic = 'force-dynamic'

// GET /api/cv/[id] - Get specific CV
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[API GET CV] Fetching CV:', params.id, 'for user:', session.user.id)
    
    const cv = await CVService.getCV(params.id, session.user.id)
    
    if (!cv) {
      console.log('[API GET CV] CV not found')
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }
    
    console.log('[API GET CV] Found CV:', {
      id: cv.id,
      title: cv.title,
      hasContent: !!cv.content,
      contentType: typeof cv.content,
      contentKeys: cv.content && typeof cv.content === 'object' ? Object.keys(cv.content) : 'N/A'
    })
    
    return NextResponse.json({ cv })
  } catch (error) {
    console.error('[API GET CV] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/cv/[id] - Update CV
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Extract the content field (which is the actual CV data)
    const cvContent = body.content || body
    
    // Also update title and template if provided
    const cv = await CVService.updateCV(params.id, session.user.id, cvContent)
    
    // Parse the content back for the response
    const parsedCV = {
      ...cv,
      content: typeof cv.content === 'string' ? JSON.parse(cv.content) : cv.content
    }
    
    return NextResponse.json({ cv: parsedCV, message: 'CV updated successfully' })
  } catch (error) {
    console.error('Error updating CV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/cv/[id] - Delete CV
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await CVService.deleteCV(params.id, session.user.id)
    
    return NextResponse.json({ message: 'CV deleted successfully' })
  } catch (error) {
    console.error('Error deleting CV:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 