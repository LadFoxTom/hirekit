import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CVService } from '@/lib/db'

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

    // Get user's CVs using the service
    const cvs = await CVService.getUserCVs(session.user.id)

    return NextResponse.json({ cvs })
  } catch (error) {
    console.error('Error fetching CVs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CVs' },
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
    
    console.log('[API POST /cv] Received request:', {
      hasContent: !!body.content,
      contentType: typeof body.content,
      contentKeys: body.content ? Object.keys(body.content) : [],
      fullName: body.content?.fullName,
      title: body.title,
      template: body.template
    })
    
    // Basic validation
    if (!body.content || typeof body.content !== 'object') {
      console.error('[API POST /cv] Invalid content:', body.content)
      return NextResponse.json(
        { error: 'Invalid CV data' },
        { status: 400 }
      )
    }

    // Extract chat history if provided
    const chatHistory = body.chatHistory ? {
      messages: body.chatHistory.messages || [],
      questionIndex: body.chatHistory.questionIndex || 0,
      accountDataPreference: body.chatHistory.accountDataPreference || null
    } : undefined

    // Create CV using the service
    const cv = await CVService.createCV(
      session.user.id,
      body.title || 'My CV',
      body.content,
      body.template || 'modern',
      chatHistory
    )

    console.log('[API POST /cv] ✅ CV created successfully:', {
      id: cv.id,
      contentStored: typeof cv.content,
      contentLength: cv.content?.length
    })

    return NextResponse.json({ 
      cv,
      message: 'CV saved successfully' 
    })
  } catch (error) {
    console.error('[API POST /cv] Error:', error)
    
    // Handle specific database errors
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'CV with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create CV' },
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
    const { id, chatHistory, content, title, template, ...otherData } = body

    console.log('[API PUT /cv] Received update request:', {
      id,
      hasContent: !!content,
      contentKeys: content ? Object.keys(content) : [],
      hasChatHistory: !!chatHistory,
      hasTitle: !!title
    })

    if (!id) {
      return NextResponse.json(
        { error: 'CV ID is required' },
        { status: 400 }
      )
    }

    // Check ownership
    const existingCV = await CVService.getCV(id, session.user.id)

    if (!existingCV) {
      return NextResponse.json(
        { error: 'CV not found or access denied' },
        { status: 404 }
      )
    }

    // Only update content if it was actually provided and is not empty
    // This prevents chat history updates from wiping out CV content
    let updateData = existingCV.content // Start with existing content
    
    if (content && typeof content === 'object' && Object.keys(content).length > 0) {
      // New content provided - use it
      updateData = content
      console.log('[API PUT /cv] Updating content with new data:', Object.keys(content))
    } else if (content) {
      // Empty content was explicitly provided - this is suspicious, log it
      console.warn('[API PUT /cv] Ignoring empty content update to preserve existing data')
    } else {
      // No content provided (e.g., just updating chat history) - keep existing
      console.log('[API PUT /cv] No content in request - preserving existing content')
    }

    // Prepare chat history data if provided
    const chatHistoryData = chatHistory ? {
      messages: chatHistory.messages || [],
      questionIndex: chatHistory.questionIndex || 0,
      accountDataPreference: chatHistory.accountDataPreference || null
    } : undefined

    // Update CV using the service with the validated content
    const updatedCV = await CVService.updateCV(id, session.user.id, updateData, chatHistoryData)

    return NextResponse.json({ 
      cv: updatedCV,
      message: 'CV updated successfully' 
    })
  } catch (error) {
    console.error('[API PUT /cv] Error:', error)
    return NextResponse.json(
      { error: 'Failed to update CV' },
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
        { error: 'CV ID is required' },
        { status: 400 }
      )
    }

    // Check ownership
    const existingCV = await CVService.getCV(id, session.user.id)

    if (!existingCV) {
      return NextResponse.json(
        { error: 'CV not found or access denied' },
        { status: 404 }
      )
    }

    // Delete CV using the service
    await CVService.deleteCV(id, session.user.id)

    return NextResponse.json({ 
      message: 'CV deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting CV:', error)
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    )
  }
} 