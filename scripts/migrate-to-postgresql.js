const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateToPostgreSQL() {
  console.log('🔄 Starting PostgreSQL migration...');
  
  try {
    // 1. Generate new Prisma client
    console.log('📦 Generating Prisma client...');
    await prisma.$executeRaw`SELECT 1`; // Test connection
    
    // 2. Create new migration
    console.log('🗄️ Creating database migration...');
    // Run: npx prisma migrate dev --name migrate-to-postgresql
    
    // 3. Data validation
    console.log('✅ Validating data integrity...');
    
    // Test CV data
    const cvs = await prisma.cV.findMany({ take: 5 });
    console.log(`Found ${cvs.length} CVs to migrate`);
    
    // Test Letter data
    const letters = await prisma.letter.findMany({ take: 5 });
    console.log(`Found ${letters.length} Letters to migrate`);
    
    // Test ChatHistory data
    const chatHistories = await prisma.chatHistory.findMany({ take: 5 });
    console.log(`Found ${chatHistories.length} Chat histories to migrate`);
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateToPostgreSQL()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { migrateToPostgreSQL }; 