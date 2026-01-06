import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

// Helper function to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== 'admin@admin.com') {
    return false;
  }
  return true;
}

// POST /api/admin/question-configs/export-template
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { configId, format = 'excel' } = await request.json();

    // Get the configuration
    const config = await prisma.questionConfiguration.findUnique({
      where: { id: configId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1
        }
      }
    });

    if (!config) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 });
    }

    const questions = config.questions as any[];
    const latestVersion = config.versions[0];

    // Create comprehensive template data
    const templateData = [
      ['CV Builder Question Configuration Template'],
      [''],
      ['Configuration Details'],
      ['Name', config.name],
      ['Description', config.description || ''],
      ['Type', config.type],
      ['Is Default', config.isDefault ? 'Yes' : 'No'],
      ['Is Active', config.isActive ? 'Yes' : 'No'],
      ['Version', config.version],
      ['Created At', config.createdAt.toLocaleDateString()],
      ['Last Updated', config.updatedAt.toLocaleDateString()],
      [''],
      ['Question Configuration'],
      ['ID', 'Section', 'Text Key', 'Order', 'Enabled', 'Required', 'Optional', 'Phase', 'Logic', 'Dependencies', 'Conditions', 'Help Text', 'Placeholder', 'Validation Rules', 'Default Value', 'Options', 'Notes']
    ];

    // Add each question with comprehensive details
    questions.forEach((question, index) => {
      // Get conditional logic for this question
      const conditionalLogic = getConditionalLogic(question.id, config.id);
      const dependencies = getDependencies(question.id, config.id);
      
      templateData.push([
        question.id,
        question.section || '',
        question.textKey || '',
        question.order || index,
        question.enabled ? 'Yes' : 'No',
        question.required ? 'Yes' : 'No',
        question.optional ? 'Yes' : 'No',
        question.phase || '',
        conditionalLogic,
        dependencies,
        getConditionsText(question.conditions),
        question.helpText || '',
        question.placeholder || '',
        getValidationRules(question.validation),
        question.defaultValue || '',
        getOptionsText(question.options),
        question.notes || ''
      ]);
    });

    // Add version history
    if (latestVersion) {
      templateData.push(['']);
      templateData.push(['Version History']);
      templateData.push(['Version', 'Changes', 'Created By', 'Created At']);
      templateData.push([
        latestVersion.version,
        latestVersion.changes ? JSON.stringify(latestVersion.changes) : '',
        latestVersion.createdBy || '',
        latestVersion.createdAt.toLocaleDateString()
      ]);
    }

    // Add metadata sheet
    const metadataData = [
      ['Configuration Metadata'],
      [''],
      ['Field', 'Description', 'Example'],
      ['ID', 'Unique identifier for the question', 'fullName'],
      ['Section', 'Grouping category for the question', 'personal'],
      ['Text Key', 'Translation key for the question text', 'cv.questions.fullName'],
      ['Order', 'Display order in the question flow', '1'],
      ['Enabled', 'Whether the question is active', 'Yes/No'],
      ['Required', 'Whether the question is mandatory', 'Yes/No'],
      ['Optional', 'Whether the question can be skipped', 'Yes/No'],
      ['Phase', 'Question flow phase', 'intro'],
      ['Logic', 'Conditional logic for showing the question', 'IF hasExperience = true'],
      ['Dependencies', 'Questions this depends on', 'experience,education'],
      ['Conditions', 'Specific conditions for display', 'field=experience AND value=yes'],
      ['Help Text', 'Additional guidance for users', 'Enter your full legal name'],
      ['Placeholder', 'Input placeholder text', 'John Doe'],
      ['Validation Rules', 'Input validation requirements', 'required,minLength:2'],
      ['Default Value', 'Pre-filled value', ''],
      ['Options', 'Available choices for selection', 'Yes,No,Maybe'],
      ['Notes', 'Internal notes for administrators', 'Consider making this optional']
    ];

    if (format === 'csv') {
      // Export as CSV
      const csvContent = templateData.map(row => 
        row.map(cell => `"${cell || ''}"`).join(',')
      ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      return new NextResponse(blob, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${config.name.replace(/\s+/g, '_')}_template.csv"`
        }
      });
    } else {
      // Export as Excel
      const workbook = XLSX.utils.book_new();

      // Main template sheet
      const templateSheet = XLSX.utils.aoa_to_sheet(templateData);
      XLSX.utils.book_append_sheet(workbook, templateSheet, 'Question Template');

      // Metadata sheet
      const metadataSheet = XLSX.utils.aoa_to_sheet(metadataData);
      XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');

      // Instructions sheet
      const instructionsData = [
        ['Instructions for External Evaluation'],
        [''],
        ['This template contains all question configuration details for the CV Builder.'],
        [''],
        ['How to use this template:'],
        ['1. Review the "Question Template" sheet for all question details'],
        ['2. Check the "Metadata" sheet for field descriptions'],
        ['3. Modify questions as needed (enable/disable, reorder, add logic)'],
        ['4. Save and return the file for import'],
        [''],
        ['Important Notes:'],
        ['- Do not change the ID field unless you know what you are doing'],
        ['- The Order field determines the question sequence'],
        ['- Logic and Conditions use simple if-then statements'],
        ['- Dependencies list questions that must be answered first'],
        ['- Validation Rules follow standard formats (required, minLength, etc.)'],
        [''],
        ['Logic Examples:'],
        ['- IF hasExperience = true THEN show experienceQuestions'],
        ['- IF educationLevel = "university" THEN show universityQuestions'],
        ['- IF country = "US" THEN show usSpecificQuestions'],
        [''],
        ['Validation Examples:'],
        ['- required: Question must be answered'],
        ['- minLength:3: Minimum 3 characters'],
        ['- email: Must be valid email format'],
        ['- phone: Must be valid phone number'],
        ['- url: Must be valid URL format']
      ];

      const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${config.name.replace(/\s+/g, '_')}_template.xlsx"`
        }
      });
    }
  } catch (error) {
    console.error('Error exporting question template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function getConditionalLogic(questionId: string, configId: string): string {
  // This would query the ConditionalQuestion table
  // For now, return a placeholder
  return '';
}

function getDependencies(questionId: string, configId: string): string {
  // This would query the QuestionDependency table
  // For now, return a placeholder
  return '';
}

function getConditionsText(conditions: any): string {
  if (!conditions) return '';
  if (Array.isArray(conditions)) {
    return conditions.map((condition: any) => 
      `${condition.field} ${condition.operator} ${condition.value}`
    ).join(' AND ');
  }
  return JSON.stringify(conditions);
}

function getValidationRules(validation: any): string {
  if (!validation) return '';
  if (Array.isArray(validation)) {
    return validation.join(', ');
  }
  return JSON.stringify(validation);
}

function getOptionsText(options: any): string {
  if (!options) return '';
  if (Array.isArray(options)) {
    return options.join(', ');
  }
  return JSON.stringify(options);
}
