import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database-hirekit';

// GET: validate scheduling link and return available info
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const link = await db.schedulingLink.findUnique({
    where: { token: params.token },
    include: {
      company: { select: { name: true } },
    },
  });

  if (!link || link.expiresAt < new Date() || link.bookedAt) {
    return NextResponse.json({ error: 'Link expired or already booked' }, { status: 404 });
  }

  return NextResponse.json({
    title: link.title,
    companyName: link.company.name,
    duration: link.duration,
    availableFrom: link.availableFrom,
    availableTo: link.availableTo,
  });
}

// POST: candidate books a time slot
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const link = await db.schedulingLink.findUnique({
    where: { token: params.token },
    include: { company: { select: { name: true } } },
  });

  if (!link || link.expiresAt < new Date() || link.bookedAt) {
    return NextResponse.json({ error: 'Link expired or already booked' }, { status: 400 });
  }

  const { startTime, timezone = 'UTC' } = await request.json();

  if (!startTime) {
    return NextResponse.json({ error: 'Start time is required' }, { status: 400 });
  }

  const start = new Date(startTime);
  const end = new Date(start.getTime() + link.duration * 60000);

  // Validate within available window
  if (start < link.availableFrom || end > link.availableTo) {
    return NextResponse.json({ error: 'Selected time is outside available window' }, { status: 400 });
  }

  // Create interview if linked to an application
  if (link.applicationId) {
    const app = await db.application.findUnique({
      where: { id: link.applicationId },
      select: { email: true, name: true },
    });

    if (app) {
      await db.interview.create({
        data: {
          companyId: link.companyId,
          applicationId: link.applicationId,
          scheduledBy: 'candidate',
          interviewers: link.interviewerIds,
          candidateEmail: app.email,
          title: link.title,
          startTime: start,
          endTime: end,
          timezone,
          status: 'confirmed',
        },
      });
    }
  }

  // Mark link as booked
  await db.schedulingLink.update({
    where: { id: link.id },
    data: { bookedAt: new Date() },
  });

  return NextResponse.json({ success: true, startTime: start, endTime: end });
}
