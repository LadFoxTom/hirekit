import { NextRequest, NextResponse } from 'next/server';
import { pdfQueue } from '@/lib/pdf-queue';
import { rateLimiter } from '../../../lib/rate-limiter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimiter.check(ip, 'pdf_generation');
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        },
        { status: 429 }
      );
    }

    // Get user session for usage tracking
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const { cvData, fileName, priority = 'normal' } = await request.json();
    
    if (!cvData) {
      return NextResponse.json(
        { error: 'CV data is required' },
        { status: 400 }
      );
    }

    console.log('Queuing PDF generation for:', fileName, 'Priority:', priority);

    // Add job to queue
    const jobId = await pdfQueue.addJob(cvData, fileName || 'cv', {
      priority: priority as 'high' | 'normal' | 'low',
      userId,
      maxRetries: 3
    });

    // For high priority requests, wait for completion
    if (priority === 'high') {
      try {
        const result = await pdfQueue.waitForResult(jobId, 30000);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error || 'PDF generation failed' },
            { status: 500 }
          );
        }

        return new NextResponse(new Uint8Array(result.buffer || new ArrayBuffer(0)), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName || 'cv'}.pdf"`,
            'X-Processing-Time': result.processingTime.toString(),
          },
        });
      } catch (error) {
        console.error('High priority PDF generation failed:', error);
        return NextResponse.json(
          { error: 'PDF generation timeout or failed' },
          { status: 500 }
        );
      }
    }

    // For normal/low priority, return job ID for polling
    return NextResponse.json({
      jobId,
      message: 'PDF generation queued',
      estimatedWaitTime: pdfQueue.getQueueStats().queueLength * 10000 // Rough estimate
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// New endpoint to check job status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const result = await pdfQueue.getResult(jobId);
    
    if (!result) {
      return NextResponse.json(
        { status: 'processing' },
        { status: 202 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { 
          status: 'failed',
          error: result.error 
        },
        { status: 500 }
      );
    }

    return new NextResponse(new Uint8Array(result.buffer || new ArrayBuffer(0)), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cv.pdf"`,
        'X-Processing-Time': result.processingTime.toString(),
      },
    });

  } catch (error) {
    console.error('PDF status check error:', error);
    return NextResponse.json({ 
      error: 'Failed to check PDF status'
    }, { status: 500 });
  }
} 