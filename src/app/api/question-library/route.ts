/**
 * Question Library API
 * 
 * Manages saved questions and question templates that can be reused across flows
 */

import { NextRequest, NextResponse } from 'next/server';

interface QuestionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  questionType: 'text' | 'textarea' | 'select' | 'multiple' | 'conditional';
  content: {
    text: string;
    placeholder?: string;
    options?: string[];
    conditions?: any[];
  };
  variableName: string;
  validation?: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  tags: string[];
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for demo (in production, use database)
const questionTemplates = new Map<string, QuestionTemplate>();

// Initialize with some default templates
const defaultTemplates: QuestionTemplate[] = [
  {
    id: 'personal_name',
    name: 'Full Name',
    description: 'Collects the user\'s full name',
    category: 'Personal Information',
    questionType: 'text',
    content: {
      text: 'What is your full name?',
      placeholder: 'Enter your full name'
    },
    variableName: 'fullName',
    validation: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    tags: ['personal', 'name', 'basic'],
    usageCount: 0,
    createdBy: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'personal_email',
    name: 'Email Address',
    description: 'Collects the user\'s email address',
    category: 'Personal Information',
    questionType: 'text',
    content: {
      text: 'What is your email address?',
      placeholder: 'your.email@example.com'
    },
    variableName: 'email',
    validation: {
      required: true,
      pattern: '^[^@]+@[^@]+\\.[^@]+$'
    },
    tags: ['personal', 'contact', 'email'],
    usageCount: 0,
    createdBy: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'professional_title',
    name: 'Professional Title',
    description: 'Collects the user\'s current job title or desired position',
    category: 'Professional Information',
    questionType: 'text',
    content: {
      text: 'What is your current job title or desired position?',
      placeholder: 'e.g., Senior Software Engineer'
    },
    variableName: 'title',
    validation: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    tags: ['professional', 'title', 'job'],
    usageCount: 0,
    createdBy: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'experience_summary',
    name: 'Experience Summary',
    description: 'Collects a summary of the user\'s work experience',
    category: 'Professional Information',
    questionType: 'textarea',
    content: {
      text: 'Tell me about your work experience. Include your current and previous roles, key responsibilities, and achievements.',
      placeholder: 'Describe your work experience...'
    },
    variableName: 'experienceSummary',
    validation: {
      required: true,
      minLength: 50,
      maxLength: 1000
    },
    tags: ['professional', 'experience', 'work'],
    usageCount: 0,
    createdBy: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'skills_technical',
    name: 'Technical Skills',
    description: 'Collects the user\'s technical skills',
    category: 'Skills',
    questionType: 'multiple',
    content: {
      text: 'What are your technical skills? Select all that apply.',
      options: [
        'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
        'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django',
        'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS', 'Azure',
        'Docker', 'Kubernetes', 'Git', 'Linux', 'Machine Learning',
        'Data Science', 'DevOps', 'Mobile Development'
      ]
    },
    variableName: 'technicalSkills',
    validation: {
      required: true
    },
    tags: ['skills', 'technical', 'programming'],
    usageCount: 0,
    createdBy: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'education_degree',
    name: 'Education Level',
    description: 'Collects the user\'s highest level of education',
    category: 'Education',
    questionType: 'select',
    content: {
      text: 'What is your highest level of education?',
      options: [
        'High School Diploma',
        'Associate Degree',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'Doctorate (PhD)',
        'Professional Degree',
        'Other'
      ]
    },
    variableName: 'educationLevel',
    validation: {
      required: true
    },
    tags: ['education', 'degree', 'qualification'],
    usageCount: 0,
    createdBy: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initialize default templates
defaultTemplates.forEach(template => {
  questionTemplates.set(template.id, template);
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');

    let templates = Array.from(questionTemplates.values());

    // Filter by category
    if (category) {
      templates = templates.filter(t => t.category === category);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      templates = templates.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.content.text.toLowerCase().includes(searchLower)
      );
    }

    // Filter by tags
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim());
      templates = templates.filter(t => 
        tagList.some(tag => t.tags.includes(tag))
      );
    }

    // Sort by usage count (most used first)
    templates.sort((a, b) => b.usageCount - a.usageCount);

    return NextResponse.json({
      success: true,
      templates,
      categories: Array.from(new Set(Array.from(questionTemplates.values()).map(t => t.category)))
    });
  } catch (error) {
    console.error('Question library API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case 'create_template':
        return await createTemplate(data);
      
      case 'update_template':
        return await updateTemplate(data);
      
      case 'delete_template':
        return await deleteTemplate(data);
      
      case 'use_template':
        return await applyTemplate(data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Question library API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createTemplate(data: {
  name: string;
  description: string;
  category: string;
  questionType: string;
  content: any;
  variableName: string;
  validation?: any;
  tags: string[];
}): Promise<NextResponse> {
  const template: QuestionTemplate = {
    id: `template_${Date.now()}`,
    name: data.name,
    description: data.description,
    category: data.category,
    questionType: data.questionType as any,
    content: data.content,
    variableName: data.variableName,
    validation: data.validation,
    tags: data.tags,
    usageCount: 0,
    createdBy: 'User', // In production, get from session
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  questionTemplates.set(template.id, template);

  return NextResponse.json({
    success: true,
    template
  });
}

async function updateTemplate(data: {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  questionType?: string;
  content?: any;
  variableName?: string;
  validation?: any;
  tags?: string[];
}): Promise<NextResponse> {
  const template = questionTemplates.get(data.id);
  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  }

  // Validate and cast questionType to ensure it's a valid union type
  const validQuestionTypes = ['text', 'textarea', 'select', 'multiple', 'conditional'] as const;
  const questionType = data.questionType && validQuestionTypes.includes(data.questionType as any)
    ? (data.questionType as QuestionTemplate['questionType'])
    : template.questionType;

  const updatedTemplate: QuestionTemplate = {
    ...template,
    ...data,
    questionType,
    updatedAt: new Date().toISOString()
  };

  questionTemplates.set(data.id, updatedTemplate);

  return NextResponse.json({
    success: true,
    template: updatedTemplate
  });
}

async function deleteTemplate(data: { id: string }): Promise<NextResponse> {
  const template = questionTemplates.get(data.id);
  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  }

  questionTemplates.delete(data.id);

  return NextResponse.json({
    success: true,
    message: 'Template deleted successfully'
  });
}

async function applyTemplate(data: { id: string }): Promise<NextResponse> {
  const template = questionTemplates.get(data.id);
  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    );
  }

  // Increment usage count
  template.usageCount++;
  template.updatedAt = new Date().toISOString();
  questionTemplates.set(data.id, template);

  return NextResponse.json({
    success: true,
    template
  });
}
