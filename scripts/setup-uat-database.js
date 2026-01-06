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

    // Create test CVs
    console.log('Creating test CVs...');
    const testCVs = await Promise.all([
      prisma.cV.create({
        data: {
          userId: testUsers[0].id,
          title: 'Test Professional CV',
          content: {
            personalInfo: {
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '+31 6 12345678',
              location: 'Amsterdam, Netherlands'
            },
            experience: [
              {
                title: 'Software Engineer',
                company: 'Tech Company',
                startDate: '2022-01',
                endDate: '2023-12',
                description: 'Developed web applications using React and Node.js'
              }
            ],
            education: [
              {
                degree: 'Bachelor of Computer Science',
                institution: 'University of Amsterdam',
                startDate: '2018-09',
                endDate: '2022-06'
              }
            ]
          },
          template: 'professional',
          isPublic: false
        }
      }),
      prisma.cV.create({
        data: {
          userId: testUsers[1].id,
          title: 'Test Creative CV',
          content: {
            personalInfo: {
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
              phone: '+31 6 87654321',
              location: 'Rotterdam, Netherlands'
            },
            experience: [
              {
                title: 'UX Designer',
                company: 'Design Studio',
                startDate: '2021-03',
                endDate: '2023-11',
                description: 'Designed user interfaces and user experiences'
              }
            ],
            education: [
              {
                degree: 'Master of Design',
                institution: 'Design Academy',
                startDate: '2019-09',
                endDate: '2021-06'
              }
            ]
          },
          template: 'creative',
          isPublic: false
        }
      })
    ]);

    console.log(`✅ Created ${testCVs.length} test CVs`);

    // Create test cover letters
    console.log('Creating test cover letters...');
    const testLetters = await Promise.all([
      prisma.letter.create({
        data: {
          userId: testUsers[0].id,
          title: 'Test Cover Letter - Software Engineer',
          content: {
            recipient: 'Hiring Manager',
            company: 'Tech Company',
            position: 'Senior Software Engineer',
            body: 'I am writing to express my interest in the Senior Software Engineer position...'
          },
          template: 'professional'
        }
      }),
      prisma.letter.create({
        data: {
          userId: testUsers[1].id,
          title: 'Test Cover Letter - UX Designer',
          content: {
            recipient: 'Design Director',
            company: 'Creative Agency',
            position: 'UX Designer',
            body: 'I am excited to apply for the UX Designer position...'
          },
          template: 'creative'
        }
      })
    ]);

    console.log(`✅ Created ${testLetters.length} test cover letters`);

    // Create test job applications
    console.log('Creating test job applications...');
    const testApplications = await Promise.all([
      prisma.jobApplication.create({
        data: {
          userId: testUsers[0].id,
          title: 'Software Engineer at TechCorp',
          company: 'TechCorp',
          position: 'Software Engineer',
          status: 'APPLIED',
          appliedDate: new Date('2024-01-15'),
          notes: { message: 'Applied through LinkedIn' }
        }
      }),
      prisma.jobApplication.create({
        data: {
          userId: testUsers[1].id,
          title: 'UX Designer at DesignStudio',
          company: 'DesignStudio',
          position: 'UX Designer',
          status: 'INTERVIEW',
          appliedDate: new Date('2024-01-10'),
          notes: { message: 'First interview scheduled' }
        }
      })
    ]);

    console.log(`✅ Created ${testApplications.length} test job applications`);

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