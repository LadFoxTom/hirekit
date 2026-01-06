import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Use the existing database service pattern
function getPrisma() {
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }
  
  if (!globalForPrisma.prisma) {
    const { PrismaClient } = require('@prisma/client')
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // For system flows, allow access without authentication
    const isSystemFlow = id === 'basic_cv_flow' || id === 'advanced_cv_flow';
    
    if (!isSystemFlow && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = getPrisma();
    
    if (id) {
      // Get specific flow
      const flow = await prisma.flow.findUnique({
        where: { id: id }
      });

      if (!flow) {
        return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
      }

      return NextResponse.json(flow);
    } else {
      // Get all flows (including system flows)
      const flows = await prisma.flow.findMany({
        where: { 
          isActive: true
        },
        orderBy: { updatedAt: 'desc' }
      });

      return NextResponse.json(flows);
    }
  } catch (error: any) {
    console.error('Error fetching flows:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('POST request body:', JSON.stringify(body, null, 2));
    const { name, description, data } = body;

    if (!name || !data) {
      return NextResponse.json({ error: 'Name and data are required' }, { status: 400 });
    }

    const prisma = getPrisma();
    console.log('Creating flow with name:', name);

    const flow = await prisma.flow.create({
      data: {
        name,
        description: description || '',
        data: data,
        createdBy: session.user.email
      }
    });

    console.log('Flow created successfully:', flow);
    return NextResponse.json(flow);
  } catch (error: any) {
    console.error('Error creating flow:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Allow system flows to be updated without authentication
    const body = await request.json();
    console.log('PUT request body:', JSON.stringify(body, null, 2));
    const { id, name, description, data, isLive, mappingConfig } = body;
    
    // For system flows (basic_cv_flow, advanced_cv_flow), allow updates without auth
    const isSystemFlow = id === 'basic_cv_flow' || id === 'advanced_cv_flow';
    
    if (!isSystemFlow && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Flow ID is required' }, { status: 400 });
    }

    const prisma = getPrisma();
    console.log('Updating flow with ID:', id);

    // First check if the flow exists (without createdBy constraint for system flows)
    const existingFlow = await prisma.flow.findUnique({
      where: { 
        id: id
      }
    });

    if (!existingFlow) {
      console.log('Flow not found, creating new flow instead');
      // If flow doesn't exist, create it instead
      // Serialize data to ensure it's JSON-compatible for Prisma
      const serializedData = data ? JSON.parse(JSON.stringify(data)) as any : null;
      const serializedMappingConfig = mappingConfig ? JSON.parse(JSON.stringify(mappingConfig)) as any : null;
      
      const newFlow = await prisma.flow.create({
        data: {
          id: id, // Use the provided ID
          name,
          description: description || '',
          data: serializedData,
          isLive: isLive || false,
          mappingConfig: serializedMappingConfig,
          createdBy: session?.user?.email || 'system'
        }
      });
      console.log('Flow created successfully:', newFlow);
      return NextResponse.json(newFlow);
    }

    // Update existing flow (without createdBy constraint for system flows)
    // Serialize data to ensure it's JSON-compatible for Prisma
    const serializedData = data ? JSON.parse(JSON.stringify(data)) as any : existingFlow.data;
    const serializedMappingConfig = mappingConfig ? JSON.parse(JSON.stringify(mappingConfig)) as any : existingFlow.mappingConfig;
    
    const flow = await prisma.flow.update({
      where: { 
        id: id
      },
      data: {
        name: name || existingFlow.name, // Use existing name if not provided
        description: description || existingFlow.description,
        data: serializedData,
        isLive: isLive !== undefined ? isLive : existingFlow.isLive,
        mappingConfig: serializedMappingConfig,
        updatedAt: new Date()
      }
    });

    console.log('Flow updated successfully:', flow);
    return NextResponse.json(flow);
  } catch (error: any) {
    console.error('Error updating flow:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Flow ID is required' }, { status: 400 });
    }

    const prisma = getPrisma();
    await prisma.flow.delete({
      where: { 
        id: id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting flow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
