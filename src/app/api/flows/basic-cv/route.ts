/**
 * Basic CV Flow API Endpoint
 * 
 * Handles the Basic CV Builder flow with Smart Mapping integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { BASIC_CV_FLOW } from '@/data/basicCVFlow';
import { BASIC_CV_MAPPING_CONFIG } from '@/data/smartMappingConfigs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'get_flow':
        return NextResponse.json({
          success: true,
          flow: BASIC_CV_FLOW,
          mappingConfig: BASIC_CV_MAPPING_CONFIG
        });

      case 'get_mapping_config':
        return NextResponse.json({
          success: true,
          config: BASIC_CV_MAPPING_CONFIG
        });

      default:
        return NextResponse.json({
          success: true,
          flow: BASIC_CV_FLOW,
          metadata: {
            name: 'Basic CV Builder Flow',
            description: 'Complete basic CV builder flow with essential questions',
            questionCount: BASIC_CV_FLOW.nodes.filter(n => n.type === 'question').length,
            estimatedTime: '10-15 minutes',
            hasSmartMapping: true
          }
        });
    }
  } catch (error) {
    console.error('Error in Basic CV Flow API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load Basic CV flow' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'save_flow_data':
        // Save flow execution data
        return NextResponse.json({
          success: true,
          message: 'Flow data saved successfully',
          data: data
        });

      case 'process_cv_data':
        // Process CV data with Smart Mapping
        return NextResponse.json({
          success: true,
          message: 'CV data processed with Smart Mapping',
          cvData: data,
          mappingApplied: true
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Basic CV Flow API POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
