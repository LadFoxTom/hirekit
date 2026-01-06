const fs = require('fs');
const path = require('path');

console.log('🧪 Testing API Working...\n');

// Test 1: Check if Prisma client has Flow model
console.log('1. Checking Prisma client...');
try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  // Check if flow property exists
  const hasFlowModel = typeof prisma.flow !== 'undefined';
  console.log(`   Flow model exists: ${hasFlowModel ? '✅ Yes' : '❌ No'}`);
  
  if (hasFlowModel) {
    console.log(`   Flow model methods: ${Object.keys(prisma.flow).join(', ')}`);
  }
  
  prisma.$disconnect();
} catch (error) {
  console.log(`   Error: ${error.message}`);
}

// Test 2: Check API route syntax
console.log('\n2. Checking API route syntax...');
const apiRoutePath = path.join(__dirname, '..', 'src', 'app', 'api', 'flows', 'route.ts');
if (fs.existsSync(apiRoutePath)) {
  const content = fs.readFileSync(apiRoutePath, 'utf8');
  
  const hasGetPrisma = content.includes('function getPrisma()');
  const hasFlowOperations = content.includes('prisma.flow.');
  const hasErrorHandling = content.includes('catch (error: any)');
  
  console.log(`   getPrisma function: ${hasGetPrisma ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Flow operations: ${hasFlowOperations ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Error handling: ${hasErrorHandling ? '✅ Found' : '❌ Missing'}`);
}

// Test 3: Check database schema
console.log('\n3. Checking database schema...');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  const content = fs.readFileSync(schemaPath, 'utf8');
  
  const hasFlowModel = content.includes('model Flow {');
  const hasDataField = content.includes('data        Json');
  const hasCreatedByField = content.includes('createdBy   String?');
  
  console.log(`   Flow model in schema: ${hasFlowModel ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Data field: ${hasDataField ? '✅ Found' : '❌ Missing'}`);
  console.log(`   CreatedBy field: ${hasCreatedByField ? '✅ Found' : '❌ Missing'}`);
}

console.log('\n🎉 API Test Complete!');
console.log('\n📝 What to test now:');
console.log('1. Make sure dev server is running: npm run dev');
console.log('2. Open http://localhost:3001/adminx');
console.log('3. Login with admin@admin.com');
console.log('4. Open Flow Designer');
console.log('5. Click "New Flow" and create a test flow');
console.log('6. Add a question node');
console.log('7. Edit the question text');
console.log('8. Click "Save Flow" button');
console.log('9. Check for success message');

console.log('\n🔧 If it still doesn\'t work:');
console.log('- Check browser console for errors');
console.log('- Check server console for API errors');
console.log('- The Flow model should now be available in Prisma client');
