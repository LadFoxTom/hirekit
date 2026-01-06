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

// PUT /api/admin/question-configs/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, description, type, questions, flowConfig, isActive, isDefault } = body;

    // Validate required fields
    if (!name || !type || !questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current configuration
    const currentConfig = await prisma.questionConfiguration.findUnique({
      where: { id }
    });

    if (!currentConfig) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    // If this is a default configuration, unset other defaults of the same type
    if (isDefault) {
      await prisma.questionConfiguration.updateMany({
        where: { 
          type, 
          isDefault: true,
          id: { not: id } // Exclude current config
        },
        data: { isDefault: false }
      });
    }

    // Update configuration
    const updatedConfig = await prisma.questionConfiguration.update({
      where: { id },
      data: {
        name,
        description,
        type,
        questions,
        flowConfig,
        isActive: isActive ?? currentConfig.isActive,
        isDefault: isDefault ?? currentConfig.isDefault,
        version: { increment: 1 }
      }
    });

    // Create version record
    await prisma.questionConfigVersion.create({
      data: {
        configId: id,
        version: updatedConfig.version,
        questions,
        changes: { 
          type: 'update', 
          description: 'Configuration updated',
          previousVersion: currentConfig.version
        },
        createdBy: 'admin@admin.com'
      }
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Error updating question configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/question-configs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if configuration exists and is not default
    const config = await prisma.questionConfiguration.findUnique({
      where: { id }
    });

    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    if (config.isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete default configuration' },
        { status: 400 }
      );
    }

    // Delete configuration (versions will be deleted due to cascade)
    await prisma.questionConfiguration.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting question configuration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
