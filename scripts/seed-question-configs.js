const { PrismaClient } = require('@prisma/client');
const { CV_QUESTIONS } = require('../src/types/questions');
const { SIMPLIFIED_CV_QUESTIONS } = require('../src/types/questions-simplified');

const prisma = new PrismaClient();

async function seedQuestionConfigurations() {
  try {
    console.log('Seeding question configurations...');

    // Create default advanced configuration
    const defaultAdvanced = await prisma.questionConfiguration.upsert({
      where: { name: 'Default Advanced' },
      update: {},
      create: {
        name: 'Default Advanced',
        description: 'Default advanced CV builder questions',
        type: 'advanced',
        isActive: true,
        isDefault: true,
        questions: CV_QUESTIONS.map((q, index) => ({
          id: q.id,
          section: q.section,
          textKey: q.textKey,
          enabled: true,
          order: index,
          optional: q.optional,
          phase: q.phase,
        })),
        createdBy: 'admin@admin.com',
        version: 1
      }
    });

    console.log('Created advanced configuration:', defaultAdvanced.id);

    // Create default simplified configuration
    const defaultSimplified = await prisma.questionConfiguration.upsert({
      where: { name: 'Default Simplified' },
      update: {},
      create: {
        name: 'Default Simplified',
        description: 'Default simplified CV builder questions',
        type: 'simplified',
        isActive: true,
        isDefault: true,
        questions: SIMPLIFIED_CV_QUESTIONS.map((q, index) => ({
          id: q.id,
          section: q.section,
          textKey: q.textKey,
          enabled: true,
          order: index,
          required: q.required,
        })),
        createdBy: 'admin@admin.com',
        version: 1
      }
    });

    console.log('Created simplified configuration:', defaultSimplified.id);

    // Create version records
    await prisma.questionConfigVersion.createMany({
      data: [
        {
          configId: defaultAdvanced.id,
          version: 1,
          questions: defaultAdvanced.questions,
          changes: { type: 'initial_creation', description: 'Initial configuration creation' },
          createdBy: 'admin@admin.com'
        },
        {
          configId: defaultSimplified.id,
          version: 1,
          questions: defaultSimplified.questions,
          changes: { type: 'initial_creation', description: 'Initial configuration creation' },
          createdBy: 'admin@admin.com'
        }
      ],
      skipDuplicates: true
    });

    console.log('Question configurations seeded successfully!');
  } catch (error) {
    console.error('Error seeding question configurations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedQuestionConfigurations();
