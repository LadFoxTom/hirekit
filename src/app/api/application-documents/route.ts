import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ApplicationDocumentService, JobApplicationService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const applicationId = searchParams.get('applicationId')
    const type = searchParams.get('type')

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
    }

    // Verify the application belongs to the user
    const application = await JobApplicationService.getJobApplication(applicationId, session.user.id)
    if (!application) {
      return NextResponse.json({ error: 'Application not found or access denied' }, { status: 404 })
    }

    let documents
    if (type) {
      documents = await ApplicationDocumentService.getDocumentsByType(applicationId, type)
    } else {
      documents = await ApplicationDocumentService.getApplicationDocuments(applicationId)
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Error fetching application documents:', error)
    return NextResponse.json({ error: 'Failed to fetch application documents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.applicationId || !body.title || !body.type) {
      return NextResponse.json({ error: 'Application ID, title, and type are required' }, { status: 400 })
    }

    // Verify the application belongs to the user
    const application = await JobApplicationService.getJobApplication(body.applicationId, session.user.id)
    if (!application) {
      return NextResponse.json({ error: 'Application not found or access denied' }, { status: 404 })
    }

    const document = await ApplicationDocumentService.createApplicationDocument(body.applicationId, {
      type: body.type,
      title: body.title,
      description: body.description,
      cvId: body.cvId,
      letterId: body.letterId,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileSize: body.fileSize,
      mimeType: body.mimeType,
    })

    return NextResponse.json({ document, message: 'Application document created successfully' })
  } catch (error) {
    console.error('Error creating application document:', error)
    return NextResponse.json({ error: 'Failed to create application document' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { id, applicationId, ...updateData } = body
    if (!id || !applicationId) {
      return NextResponse.json({ error: 'Document ID and Application ID are required' }, { status: 400 })
    }

    // Verify the application belongs to the user
    const application = await JobApplicationService.getJobApplication(applicationId, session.user.id)
    if (!application) {
      return NextResponse.json({ error: 'Application not found or access denied' }, { status: 404 })
    }

    const updatedDocument = await ApplicationDocumentService.updateApplicationDocument(id, applicationId, updateData)
    return NextResponse.json({ document: updatedDocument, message: 'Application document updated successfully' })
  } catch (error) {
    console.error('Error updating application document:', error)
    return NextResponse.json({ error: 'Failed to update application document' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { id, applicationId } = body
    if (!id || !applicationId) {
      return NextResponse.json({ error: 'Document ID and Application ID are required' }, { status: 400 })
    }

    // Verify the application belongs to the user
    const application = await JobApplicationService.getJobApplication(applicationId, session.user.id)
    if (!application) {
      return NextResponse.json({ error: 'Application not found or access denied' }, { status: 404 })
    }

    await ApplicationDocumentService.deleteApplicationDocument(id, applicationId)
    return NextResponse.json({ message: 'Application document deleted successfully' })
  } catch (error) {
    console.error('Error deleting application document:', error)
    return NextResponse.json({ error: 'Failed to delete application document' }, { status: 500 })
  }
} 