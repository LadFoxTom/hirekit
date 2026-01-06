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

// GET /api/admin/ab-tests
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const abTests = await prisma.aBTest.findMany({
      include: {
        configA: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        configB: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(abTests);
  } catch (error) {
    console.error('Error fetching A/B tests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ab-tests
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, configAId, configBId, trafficSplit, startDate, endDate, isActive } = body;

    // Validate required fields
    if (!name || !configAId || !configBId) {
      return NextResponse.json(
        { error: 'Name, configAId, and configBId are required' },
        { status: 400 }
      );
    }

    // Validate traffic split
    if (trafficSplit < 0 || trafficSplit > 100) {
      return NextResponse.json(
        { error: 'Traffic split must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Check if configurations exist
    const configA = await prisma.questionConfiguration.findUnique({
      where: { id: configAId }
    });

    const configB = await prisma.questionConfiguration.findUnique({
      where: { id: configBId }
    });

    if (!configA || !configB) {
      return NextResponse.json(
        { error: 'One or both configurations not found' },
        { status: 404 }
      );
    }

    // Get session for createdBy
    const session = await getServerSession(authOptions);
    
    // Create A/B test
    const abTest = await prisma.aBTest.create({
      data: {
        name,
        description,
        configAId,
        configBId,
        trafficSplit: trafficSplit || 50,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: session?.user?.email
      },
      include: {
        configA: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        configB: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    return NextResponse.json(abTest, { status: 201 });
  } catch (error) {
    console.error('Error creating A/B test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
