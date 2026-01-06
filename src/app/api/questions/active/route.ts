/**
 * Active Questions API Endpoint
 * 
 * Returns active question configurations for different flow types
 */

import { NextRequest, NextResponse } from 'next/server';
import { BASIC_CV_FLOW } from '@/data/basicCVFlow';
import { ADVANCED_CV_FLOW } from '@/data/advancedCVFlow';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    console.log('📋 Questions API called with type:', type);

    let questions = [];
    let flowName = '';
    let flowDescription = '';

    switch (type) {
      case 'basic':
        questions = BASIC_CV_FLOW.nodes
          .filter(node => node.type === 'question')
          .map(node => {
            const data = node.data as any; // Flow nodes may have extended data properties
            return {
              id: node.id,
              text: data?.text || data?.question || data?.label || 'Question',
              type: data?.type || data?.questionType || 'text',
              variableName: data?.variableName || node.id,
              validation: data?.validation || {},
              required: data?.required !== false,
              placeholder: data?.placeholder || '',
              options: data?.options || []
            };
          });
        flowName = 'Basic CV Builder';
        flowDescription = 'Essential questions for quick CV creation';
        break;

      case 'advanced':
        questions = ADVANCED_CV_FLOW.nodes
          .filter(node => node.type === 'question')
          .map(node => {
            const data = node.data as any; // Flow nodes may have extended data properties
            return {
              id: node.id,
              text: data?.text || data?.question || data?.label || 'Question',
              type: data?.type || data?.questionType || 'text',
              variableName: data?.variableName || node.id,
              validation: data?.validation || {},
              required: data?.required !== false,
              placeholder: data?.placeholder || '',
              options: data?.options || []
            };
          });
        flowName = 'Advanced CV Builder';
        flowDescription = 'Comprehensive questions for detailed CV creation';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter. Use "basic" or "advanced"' },
          { status: 400 }
        );
    }

    console.log(`✅ Returning ${questions.length} questions for ${type} flow`);

    return NextResponse.json({
      success: true,
      type,
      flowName,
      flowDescription,
      questions,
      questionCount: questions.length,
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Questions API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to load questions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}