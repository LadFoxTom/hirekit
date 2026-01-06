import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function getPrisma() {
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }
  
  if (!globalForPrisma.prisma) {
    try {
      const { PrismaClient } = require('@prisma/client')
      globalForPrisma.prisma = new PrismaClient()
      console.log('✅ Prisma client initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Prisma client:', error)
      throw error
    }
  }
  return globalForPrisma.prisma
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const flowId = searchParams.get('flowId');

    if (!flowId) {
      return NextResponse.json({ error: 'Flow ID is required' }, { status: 400 });
    }

    const prisma = getPrisma();
    
    const flow = await prisma.flow.findUnique({
      where: { id: flowId }
    });

    if (!flow) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }

    // Analyze the flow data structure
    const analysis = {
      flowId: flow.id,
      flowName: flow.name,
      hasData: !!flow.data,
      dataType: typeof flow.data,
      dataKeys: flow.data ? Object.keys(flow.data) : [],
      hasNodes: !!(flow.data && flow.data.nodes),
      hasEdges: !!(flow.data && flow.data.edges),
      nodeCount: flow.data?.nodes?.length || 0,
      edgeCount: flow.data?.edges?.length || 0,
      nodesStructure: flow.data?.nodes ? flow.data.nodes.map((node: any) => ({
        id: node.id,
        type: node.type,
        hasData: !!node.data,
        dataKeys: node.data ? Object.keys(node.data) : []
      })) : [],
      rawData: flow.data
    };

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error: any) {
    console.error('Error diagnosing flow:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { flowId, action } = body;

    if (!flowId) {
      return NextResponse.json({ error: 'Flow ID is required' }, { status: 400 });
    }

    const prisma = getPrisma();
    
    const flow = await prisma.flow.findUnique({
      where: { id: flowId }
    });

    if (!flow) {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
    }

    if (action === 'fix_structure') {
      // Fix the flow data structure if it's missing nodes/edges
      let fixedData = flow.data;
      
      if (!flow.data || !flow.data.nodes || !flow.data.edges) {
        // Import the basic CV flow structure
        const { BASIC_CV_FLOW } = require('@/data/basicCVFlow');
        
        fixedData = {
          id: flow.id,
          name: flow.name,
          description: flow.description || 'Basic CV Builder Flow',
          version: '1.0.0',
          nodes: BASIC_CV_FLOW.nodes,
          edges: BASIC_CV_FLOW.edges,
          variables: BASIC_CV_FLOW.variables || [],
          settings: BASIC_CV_FLOW.settings || {}
        };

        // Update the flow with fixed data
        const updatedFlow = await prisma.flow.update({
          where: { id: flowId },
          data: {
            data: fixedData,
            updatedAt: new Date()
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Flow structure fixed successfully',
          flow: updatedFlow
        });
      } else {
        return NextResponse.json({
          success: true,
          message: 'Flow structure is already correct',
          flow: flow
        });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error fixing flow:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
