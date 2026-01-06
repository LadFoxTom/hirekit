const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupUATDatabase() {
  console.log('🚀 Setting up UAT database...');

  try {
    // Create test users
    console.log('Creating test users...');
    const testUsers = await Promise.all([
      prisma.user.upsert({
        where: { email: 'test1@uat.ladderfox.com' },
        update: {},
        create: {
          email: 'test1@uat.ladderfox.com',
          name: 'Test User 1',
          firstName: 'Test',
          lastName: 'User',
          language: 'en'
        }
      }),
      prisma.user.upsert({
        where: { email: 'test2@uat.ladderfox.com' },
        update: {},
        create: {
          email: 'test2@uat.ladderfox.com',
          name: 'Test User 2',
          firstName: 'Test',
          lastName: 'User',
          language: 'nl'
        }
      }),
      prisma.user.upsert({
        where: { email: 'admin@uat.ladderfox.com' },
        update: {},
        create: {
          email: 'admin@uat.ladderfox.com',
          name: 'UAT Admin',
          firstName: 'UAT',
          lastName: 'Admin',
          language: 'en'
        }
      })
    ]);

    console.log(`✅ Created ${testUsers.length} test users`);

    // Create test CVs using raw SQL to avoid Prisma client issues
    console.log('Creating test CVs...');
    const cv1 = await prisma.$executeRaw`
      INSERT INTO "CV" (id, title, content, template, "isPublic", "userId", "createdAt", "updatedAt")
      VALUES (
        ${`cv_${Date.now()}_1`},
        'Test Professional CV',
        '{"personalInfo":{"name":"John Doe","email":"john.doe@example.com","phone":"+31 6 12345678","location":"Amsterdam, Netherlands"},"experience":[{"title":"Software Engineer","company":"Tech Company","startDate":"2022-01","endDate":"2023-12","description":"Developed web applications using React and Node.js"}],"education":[{"degree":"Bachelor of Computer Science","institution":"University of Amsterdam","startDate":"2018-09","endDate":"2022-06"}]}',
        'professional',
        false,
        ${testUsers[0].id},
        NOW(),
        NOW()
      )
    `;

    const cv2 = await prisma.$executeRaw`
      INSERT INTO "CV" (id, title, content, template, "isPublic", "userId", "createdAt", "updatedAt")
      VALUES (
        ${`cv_${Date.now()}_2`},
        'Test Creative CV',
        '{"personalInfo":{"name":"Jane Smith","email":"jane.smith@example.com","phone":"+31 6 87654321","location":"Rotterdam, Netherlands"},"experience":[{"title":"UX Designer","company":"Design Studio","startDate":"2021-03","endDate":"2023-11","description":"Designed user interfaces and user experiences"}],"education":[{"degree":"Master of Design","institution":"Design Academy","startDate":"2019-09","endDate":"2021-06"}]}',
        'creative',
        false,
        ${testUsers[1].id},
        NOW(),
        NOW()
      )
    `;

    console.log('✅ Created 2 test CVs');

    // Create test cover letters
    console.log('Creating test cover letters...');
    const letter1 = await prisma.$executeRaw`
      INSERT INTO "Letter" (id, title, content, template, "userId", "createdAt", "updatedAt")
      VALUES (
        ${`letter_${Date.now()}_1`},
        'Test Cover Letter - Software Engineer',
        '{"recipient":"Hiring Manager","company":"Tech Company","position":"Senior Software Engineer","body":"I am writing to express my interest in the Senior Software Engineer position..."}',
        'professional',
        ${testUsers[0].id},
        NOW(),
        NOW()
      )
    `;

    const letter2 = await prisma.$executeRaw`
      INSERT INTO "Letter" (id, title, content, template, "userId", "createdAt", "updatedAt")
      VALUES (
        ${`letter_${Date.now()}_2`},
        'Test Cover Letter - UX Designer',
        '{"recipient":"Design Director","company":"Creative Agency","position":"UX Designer","body":"I am excited to apply for the UX Designer position..."}',
        'creative',
        ${testUsers[1].id},
        NOW(),
        NOW()
      )
    `;

    console.log('✅ Created 2 test cover letters');

    // Create test job applications
    console.log('Creating test job applications...');
    const app1 = await prisma.$executeRaw`
      INSERT INTO "JobApplication" (id, title, company, position, status, "appliedDate", notes, "userId", "createdAt", "updatedAt")
      VALUES (
        ${`app_${Date.now()}_1`},
        'Software Engineer at TechCorp',
        'TechCorp',
        'Software Engineer',
        'APPLIED',
        '2024-01-15',
        '{"message":"Applied through LinkedIn"}',
        ${testUsers[0].id},
        NOW(),
        NOW()
      )
    `;

    const app2 = await prisma.$executeRaw`
      INSERT INTO "JobApplication" (id, title, company, position, status, "appliedDate", notes, "userId", "createdAt", "updatedAt")
      VALUES (
        ${`app_${Date.now()}_2`},
        'UX Designer at DesignStudio',
        'DesignStudio',
        'UX Designer',
        'INTERVIEW',
        '2024-01-10',
        '{"message":"First interview scheduled"}',
        ${testUsers[1].id},
        NOW(),
        NOW()
      )
    `;

    console.log('✅ Created 2 test job applications');

    console.log('🎉 UAT database setup completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('- test1@uat.ladderfox.com (Test User 1)');
    console.log('- test2@uat.ladderfox.com (Test User 2)');
    console.log('- admin@uat.ladderfox.com (UAT Admin)');
    console.log('\n🔑 All accounts can use any password for testing');

  } catch (error) {
    console.error('❌ Error setting up UAT database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupUATDatabase(); 