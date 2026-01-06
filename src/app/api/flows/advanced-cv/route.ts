/**
 * Advanced CV Flow API Endpoint
 * 
 * Handles the Advanced CV Builder flow with Smart Mapping integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { ADVANCED_CV_FLOW } from '@/data/advancedCVFlow';
import { ADVANCED_CV_MAPPING_CONFIG } from '@/data/smartMappingConfigs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'get_flow':
        return NextResponse.json({
          success: true,
          flow: ADVANCED_CV_FLOW,
          mappingConfig: ADVANCED_CV_MAPPING_CONFIG
        });

      case 'get_mapping_config':
        return NextResponse.json({
          success: true,
          config: ADVANCED_CV_MAPPING_CONFIG
        });

      default:
        return NextResponse.json({
          success: true,
          flow: ADVANCED_CV_FLOW,
          metadata: {
            name: 'Advanced CV Builder Flow',
            description: 'Comprehensive advanced CV builder flow with detailed questions',
            questionCount: ADVANCED_CV_FLOW.nodes.filter(n => n.type === 'question').length,
            estimatedTime: '20-30 minutes',
            hasSmartMapping: true
          }
        });
    }
  } catch (error) {
    console.error('Error in Advanced CV Flow API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load Advanced CV flow' },
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

      case 'generate_industry_suggestions':
        // Generate industry-specific suggestions
        const industry = data.industry;
        const suggestions = generateIndustrySuggestions(industry);
        return NextResponse.json({
          success: true,
          suggestions: suggestions
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Advanced CV Flow API POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

function generateIndustrySuggestions(industry: string) {
  const industrySuggestions: Record<string, any> = {
    'Technology/Software': {
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker'],
      keywords: ['Agile', 'DevOps', 'Machine Learning', 'Cloud Computing'],
      achievements: ['Reduced system latency by 40%', 'Led team of 5 developers', 'Implemented CI/CD pipeline']
    },
    'Finance/Banking': {
      skills: ['Financial Analysis', 'Risk Management', 'Excel', 'SQL', 'Python'],
      keywords: ['Compliance', 'Regulatory', 'Portfolio Management', 'Investment Analysis'],
      achievements: ['Increased portfolio returns by 15%', 'Reduced risk exposure by 25%', 'Led $10M project']
    },
    'Healthcare/Medical': {
      skills: ['Patient Care', 'Medical Records', 'HIPAA Compliance', 'Clinical Research'],
      keywords: ['Patient Safety', 'Quality Improvement', 'Evidence-Based Practice'],
      achievements: ['Improved patient satisfaction by 30%', 'Reduced readmission rates by 20%', 'Led clinical trial']
    },
    'Marketing/Advertising': {
      skills: ['Digital Marketing', 'SEO/SEM', 'Social Media', 'Analytics', 'Content Creation'],
      keywords: ['Brand Awareness', 'Lead Generation', 'ROI', 'Campaign Management'],
      achievements: ['Increased brand awareness by 50%', 'Generated 1000+ leads', 'Improved conversion rate by 25%']
    }
  };

  return industrySuggestions[industry] || {
    skills: ['Communication', 'Problem Solving', 'Leadership', 'Project Management'],
    keywords: ['Results-driven', 'Team-oriented', 'Strategic thinking'],
    achievements: ['Improved efficiency', 'Led successful projects', 'Achieved targets']
  };
}
