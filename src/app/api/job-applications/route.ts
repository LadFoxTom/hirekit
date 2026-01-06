import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { JobApplicationService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    let applications
    if (status) {
      applications = await JobApplicationService.getApplicationsByStatus(session.user.id, status)
    } else if (priority) {
      applications = await JobApplicationService.getApplicationsByPriority(session.user.id, priority)
    } else {
      applications = await JobApplicationService.getUserJobApplications(session.user.id)
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching job applications:', error)
    return NextResponse.json({ error: 'Failed to fetch job applications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.title) {
      return NextResponse.json({ error: 'Application title is required' }, { status: 400 })
    }

    const application = await JobApplicationService.createJobApplication(session.user.id, {
      title: body.title,
      status: body.status || 'applied',
      priority: body.priority || 'medium',
      appliedDate: body.appliedDate ? new Date(body.appliedDate) : undefined,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      salary: body.salary,
      notes: body.notes,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      followUpDate: body.followUpDate ? new Date(body.followUpDate) : undefined,
      interviewDate: body.interviewDate ? new Date(body.interviewDate) : undefined,
      offerDate: body.offerDate ? new Date(body.offerDate) : undefined,
      rejectionDate: body.rejectionDate ? new Date(body.rejectionDate) : undefined,
      jobPostingId: body.jobPostingId,
    })

    return NextResponse.json({ application, message: 'Job application created successfully' })
  } catch (error) {
    console.error('Error creating job application:', error)
    return NextResponse.json({ error: 'Failed to create job application' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body
    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
    }

    const existingApplication = await JobApplicationService.getJobApplication(id, session.user.id)
    if (!existingApplication) {
      return NextResponse.json({ error: 'Application not found or access denied' }, { status: 404 })
    }

    // Convert date strings to Date objects if provided
    const processedUpdates = { ...updateData }
    if (updateData.appliedDate) processedUpdates.appliedDate = new Date(updateData.appliedDate)
    if (updateData.deadline) processedUpdates.deadline = new Date(updateData.deadline)
    if (updateData.followUpDate) processedUpdates.followUpDate = new Date(updateData.followUpDate)
    if (updateData.interviewDate) processedUpdates.interviewDate = new Date(updateData.interviewDate)
    if (updateData.offerDate) processedUpdates.offerDate = new Date(updateData.offerDate)
    if (updateData.rejectionDate) processedUpdates.rejectionDate = new Date(updateData.rejectionDate)

    const updatedApplication = await JobApplicationService.updateJobApplication(id, session.user.id, processedUpdates)
    return NextResponse.json({ application: updatedApplication, message: 'Job application updated successfully' })
  } catch (error) {
    console.error('Error updating job application:', error)
    return NextResponse.json({ error: 'Failed to update job application' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 })
    }

    const existingApplication = await JobApplicationService.getJobApplication(id, session.user.id)
    if (!existingApplication) {
      return NextResponse.json({ error: 'Application not found or access denied' }, { status: 404 })
    }

    await JobApplicationService.deleteJobApplication(id, session.user.id)
    return NextResponse.json({ message: 'Job application deleted successfully' })
  } catch (error) {
    console.error('Error deleting job application:', error)
    return NextResponse.json({ error: 'Failed to delete job application' }, { status: 500 })
  }
} 