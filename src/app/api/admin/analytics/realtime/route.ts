import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== 'admin@admin.com') {
    return false;
  }
  return true;
}

// GET /api/admin/analytics/realtime
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate time windows
    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get active users (users who created CVs in the last 24 hours)
    const activeUsersResult = await prisma.cV.findMany({
      where: {
        createdAt: {
          gte: last24Hours
        }
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    });
    const activeUsers = activeUsersResult.length;

    // Get current sessions (users who created CVs in the last 5 minutes)
    const currentSessionsResult = await prisma.cV.findMany({
      where: {
        createdAt: {
          gte: last5Minutes
        }
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    });
    const currentSessions = currentSessionsResult.length;

    // Calculate completion rate (CVs completed vs started in last hour)
    const cvStartedLastHour = await prisma.cV.count({
      where: {
        createdAt: {
          gte: lastHour
        }
      }
    });

    const cvCompletedLastHour = await prisma.cV.count({
      where: {
        createdAt: {
          gte: lastHour
        },
        // Assuming a CV is "completed" if it has a template and basic data
        template: {
          not: null
        }
      }
    });

    const completionRate = cvStartedLastHour > 0 
      ? Math.round((cvCompletedLastHour / cvStartedLastHour) * 100)
      : 0;

    // Calculate error rate (this would typically come from error logs)
    // For now, we'll simulate this based on incomplete CVs
    const incompleteCVs = await prisma.cV.count({
      where: {
        createdAt: {
          gte: lastHour
        },
        template: null
      }
    });

    const errorRate = cvStartedLastHour > 0 
      ? Math.round((incompleteCVs / cvStartedLastHour) * 100)
      : 0;

    return NextResponse.json({
      activeUsers,
      currentSessions,
      completionRate,
      errorRate,
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
