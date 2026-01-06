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

// GET /api/admin/question-configs
export async function GET() {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configurations = await prisma.questionConfiguration.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { type: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(configurations);
  } catch (error) {
    console.error('Error fetching question configurations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/question-configs
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, type, questions, flowConfig, isActive, isDefault } = body;

    // Validate required fields
    if (!name || !type || !questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If this is a default configuration, unset other defaults of the same type
    if (isDefault) {
      await prisma.questionConfiguration.updateMany({
        where: { type, isDefault: true },
        data: { isDefault: false }
      });
    }

    // Create new configuration
    const configuration = await prisma.questionConfiguration.create({
      data: {
        name,
        description,
        type,
        questions,
        flowConfig,
        isActive: isActive ?? true,
        isDefault: isDefault ?? false,
        createdBy: 'admin@admin.com', // You might want to get this from session
        version: 1
      }
    });

    // Create version record
    await prisma.questionConfigVersion.create({
      data: {
        configId: configuration.id,
        version: 1,
        questions,
        changes: { type: 'initial_creation', description: 'Initial configuration creation' },
        createdBy: 'admin@admin.com'
      }
    });

    return NextResponse.json(configuration, { status: 201 });
  } catch (error) {
    console.error('Error creating question configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
