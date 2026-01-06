import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as XLSX from 'xlsx';

// Helper function to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== 'admin@admin.com') {
    return false;
  }
  return true;
}

// POST /api/admin/analytics/export-excel
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { period, data } = await request.json();

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ['CV Builder Analytics Report'],
      [''],
      ['Period', period],
      ['Report Generated', new Date().toLocaleString()],
      [''],
      ['Summary Statistics'],
      ['Metric', 'Value'],
      ['Total CVs Created', data.summary.totalCVs],
      ['Total Users', data.summary.totalUsers],
      ['Active Configurations', data.summary.activeConfigs],
      ['Date Range Start', data.summary.dateRange.start ? new Date(data.summary.dateRange.start).toLocaleDateString() : 'All Time'],
      ['Date Range End', new Date(data.summary.dateRange.end).toLocaleDateString()]
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // CV Template Statistics sheet
    const cvTemplateData = [
      ['CV Template Usage Statistics'],
      [''],
      ['Template', 'Count', 'Percentage']
    ];

    const totalCVs = data.cvStats.reduce((sum: number, stat: any) => sum + stat.count, 0);
    data.cvStats.forEach((stat: any) => {
      const percentage = totalCVs > 0 ? ((stat.count / totalCVs) * 100).toFixed(2) : '0.00';
      cvTemplateData.push([stat.template, stat.count, `${percentage}%`]);
    });

    const cvTemplateSheet = XLSX.utils.aoa_to_sheet(cvTemplateData);
    XLSX.utils.book_append_sheet(workbook, cvTemplateSheet, 'CV Templates');

    // Question Configuration Statistics sheet
    const questionConfigData = [
      ['Question Configuration Performance'],
      [''],
      ['Config Name', 'Type', 'Total Questions', 'Enabled Questions', 'Disabled Questions', 'Enabled %', 'Is Default', 'Last Updated']
    ];

    data.questionStats.forEach((stat: any) => {
      questionConfigData.push([
        stat.configName,
        stat.configType,
        stat.totalQuestions,
        stat.enabledQuestions,
        stat.disabledQuestions,
        `${stat.enabledPercentage}%`,
        stat.isDefault ? 'Yes' : 'No',
        new Date(stat.lastUpdated).toLocaleDateString()
      ]);
    });

    const questionConfigSheet = XLSX.utils.aoa_to_sheet(questionConfigData);
    XLSX.utils.book_append_sheet(workbook, questionConfigSheet, 'Question Configs');

    // User Activity sheet
    const userActivityData = [
      ['User Registration Activity'],
      [''],
      ['Date', 'New Users', 'Cumulative Total']
    ];

    let cumulativeTotal = 0;
    data.userActivity.forEach((activity: any) => {
      cumulativeTotal += activity.newUsers;
      userActivityData.push([
        new Date(activity.date).toLocaleDateString(),
        activity.newUsers,
        cumulativeTotal
      ]);
    });

    const userActivitySheet = XLSX.utils.aoa_to_sheet(userActivityData);
    XLSX.utils.book_append_sheet(workbook, userActivitySheet, 'User Activity');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="cv-builder-analytics-${period}-${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });
  } catch (error) {
    console.error('Error exporting analytics to Excel:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
