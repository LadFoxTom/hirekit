import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { JobPostingService } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const jobPostings = await JobPostingService.getUserJobPostings(session.user.id)
    return NextResponse.json({ jobPostings })
  } catch (error) {
    console.error('Error fetching job postings:', error)
    return NextResponse.json({ error: 'Failed to fetch job postings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.title || !body.company) {
      return NextResponse.json({ error: 'Job title and company are required' }, { status: 400 })
    }

    const jobPosting = await JobPostingService.createJobPosting(session.user.id, {
      title: body.title,
      company: body.company,
      location: body.location,
      description: body.description,
      requirements: body.requirements,
      salary: body.salary,
      jobType: body.jobType,
      remote: body.remote || false,
      source: body.source,
      sourceUrl: body.sourceUrl,
      jobId: body.jobId,
    })

    return NextResponse.json({ jobPosting, message: 'Job posting created successfully' })
  } catch (error) {
    console.error('Error creating job posting:', error)
    return NextResponse.json({ error: 'Failed to create job posting' }, { status: 500 })
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
      return NextResponse.json({ error: 'Job posting ID is required' }, { status: 400 })
    }

    const existingJobPosting = await JobPostingService.getJobPosting(id, session.user.id)
    if (!existingJobPosting) {
      return NextResponse.json({ error: 'Job posting not found or access denied' }, { status: 404 })
    }

    const updatedJobPosting = await JobPostingService.updateJobPosting(id, session.user.id, updateData)
    return NextResponse.json({ jobPosting: updatedJobPosting, message: 'Job posting updated successfully' })
  } catch (error) {
    console.error('Error updating job posting:', error)
    return NextResponse.json({ error: 'Failed to update job posting' }, { status: 500 })
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
      return NextResponse.json({ error: 'Job posting ID is required' }, { status: 400 })
    }

    const existingJobPosting = await JobPostingService.getJobPosting(id, session.user.id)
    if (!existingJobPosting) {
      return NextResponse.json({ error: 'Job posting not found or access denied' }, { status: 404 })
    }

    await JobPostingService.deleteJobPosting(id, session.user.id)
    return NextResponse.json({ message: 'Job posting deleted successfully' })
  } catch (error) {
    console.error('Error deleting job posting:', error)
    return NextResponse.json({ error: 'Failed to delete job posting' }, { status: 500 })
  }
} 