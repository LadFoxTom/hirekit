const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupUATUsers() {
  console.log('🚀 Setting up UAT test users...');

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
    console.log('🎉 UAT test users setup completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('- test1@uat.ladderfox.com (Test User 1)');
    console.log('- test2@uat.ladderfox.com (Test User 2)');
    console.log('- admin@uat.ladderfox.com (UAT Admin)');
    console.log('\n🔑 All accounts can use any password for testing');

  } catch (error) {
    console.error('❌ Error setting up UAT users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupUATUsers(); 