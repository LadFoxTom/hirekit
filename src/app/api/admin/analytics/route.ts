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

// GET /api/admin/analytics
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, all

    // Calculate date range
    const now = new Date();
    let startDate: Date | null = null;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = null;
        break;
    }

    // Get CV creation statistics
    const cvStats = await prisma.cV.groupBy({
      by: ['template'],
      where: startDate ? {
        createdAt: {
          gte: startDate
        }
      } : undefined,
      _count: {
        template: true
      }
    });

    // Get question configuration usage
    const configUsage = await prisma.questionConfiguration.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        type: true,
        isDefault: true,
        questions: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Calculate question statistics
    const questionStats = configUsage.map(config => {
      const questions = config.questions as any[];
      const enabledQuestions = questions.filter(q => q.enabled);
      const disabledQuestions = questions.filter(q => !q.enabled);
      
      return {
        configId: config.id,
        configName: config.name,
        configType: config.type,
        isDefault: config.isDefault,
        totalQuestions: questions.length,
        enabledQuestions: enabledQuestions.length,
        disabledQuestions: disabledQuestions.length,
        enabledPercentage: Math.round((enabledQuestions.length / questions.length) * 100),
        lastUpdated: config.updatedAt
      };
    });

    // Get user activity
    const userActivity = await prisma.user.groupBy({
      by: ['createdAt'],
      where: startDate ? {
        createdAt: {
          gte: startDate
        }
      } : undefined,
      _count: {
        id: true
      }
    });

    // Calculate summary statistics
    const totalCVs = cvStats.reduce((sum, stat) => sum + stat._count.template, 0);
    const totalUsers = userActivity.reduce((sum, stat) => sum + stat._count.id, 0);
    const activeConfigs = configUsage.filter(config => config.isDefault).length;

    return NextResponse.json({
      period,
      summary: {
        totalCVs,
        totalUsers,
        activeConfigs,
        dateRange: {
          start: startDate,
          end: now
        }
      },
      cvStats: cvStats.map(stat => ({
        template: stat.template,
        count: stat._count.template
      })),
      questionStats,
      userActivity: userActivity.map(activity => ({
        date: activity.createdAt,
        newUsers: activity._count.id
      }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
