import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BASIC_CV_FLOW } from '@/data/basicCVFlow';
import { ADVANCED_CV_FLOW } from '@/data/advancedCVFlow';

const prisma = new PrismaClient();

// GET /api/flows/by-target?targetUrl=/quick-cv&flowType=basic
// This endpoint is public and doesn't require authentication
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('targetUrl');
    const flowType = searchParams.get('flowType');

    if (!targetUrl) {
      return NextResponse.json({ error: 'targetUrl parameter is required' }, { status: 400 });
    }

    console.log('Fetching flow for targetUrl:', targetUrl, 'flowType:', flowType);

    
    // First try to find a live flow for the target URL
    let flow = await prisma.flow.findFirst({
      where: { 
        targetUrl: targetUrl,
        isLive: true,
        isActive: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    // If no live flow found, try to find by flowType
    if (!flow && flowType) {
      flow = await prisma.flow.findFirst({
        where: { 
          flowType: flowType,
          isActive: true
        },
        orderBy: { updatedAt: 'desc' }
      });
    }

    // If still no flow found, try to find any active flow for the target URL
    if (!flow) {
      flow = await prisma.flow.findFirst({
        where: { 
          targetUrl: targetUrl,
          isActive: true
        },
        orderBy: { updatedAt: 'desc' }
      });
    }

    if (!flow) {
      console.log('No flow found for targetUrl:', targetUrl, 'flowType:', flowType);
      return NextResponse.json({ error: 'No active flow found for the specified target' }, { status: 404 });
    }

    console.log('Found flow:', flow.id, flow.name);

    // If the flow doesn't have data, populate it from static definitions
    if (!flow.data || Object.keys(flow.data).length === 0) {
      console.log('Flow has no data, populating from static definitions...');
      
      let staticFlowData = null;
      if (flow.id === 'basic_cv_flow' || flowType === 'basic') {
        staticFlowData = BASIC_CV_FLOW;
      } else if (flow.id === 'advanced_cv_flow' || flowType === 'advanced') {
        staticFlowData = ADVANCED_CV_FLOW;
      }

      if (staticFlowData) {
        // Update the flow in database with the static data
        // Serialize the data to ensure it's JSON-compatible for Prisma
        const serializedData = JSON.parse(JSON.stringify(staticFlowData)) as any;
        await prisma.flow.update({
          where: { id: flow.id },
          data: {
            data: serializedData,
            updatedAt: new Date()
          }
        });
        
        // Return the flow with populated data
        return NextResponse.json({
          ...flow,
          data: staticFlowData
        });
      }
    }

    return NextResponse.json(flow);
  } catch (error: any) {
    console.error('Error fetching flow by target:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
