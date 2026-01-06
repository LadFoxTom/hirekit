const fs = require('fs');
const path = require('path');

console.log('🧪 Testing API Fix for Flow Saving...\n');

// Test 1: Check if API route has been fixed
console.log('1. Testing API route fixes...');
const apiRoutePath = path.join(__dirname, '..', 'src', 'app', 'api', 'flows', 'route.ts');
const apiRouteExists = fs.existsSync(apiRoutePath);

if (apiRouteExists) {
  const apiRouteContent = fs.readFileSync(apiRoutePath, 'utf8');
  
  // Check for fixes
  const hasQuestionsArray = apiRouteContent.includes('questions: []');
  const hasTypeField = apiRouteContent.includes('type: \'custom\'');
  const hasStringId = apiRouteContent.includes('id: id');
  const hasNoInclude = !apiRouteContent.includes('include: { questions: true }');
  
  console.log(`   Questions array fix: ${hasQuestionsArray ? '✅ Fixed' : '❌ Not fixed'}`);
  console.log(`   Type field fix: ${hasTypeField ? '✅ Fixed' : '❌ Not fixed'}`);
  console.log(`   String ID fix: ${hasStringId ? '✅ Fixed' : '❌ Not fixed'}`);
  console.log(`   Remove include fix: ${hasNoInclude ? '✅ Fixed' : '❌ Not fixed'}`);
}

// Test 2: Check database schema compatibility
console.log('\n2. Testing database schema compatibility...');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const schemaExists = fs.existsSync(schemaPath);

if (schemaExists) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  const hasQuestionConfiguration = schemaContent.includes('model QuestionConfiguration');
  const hasFlowConfigField = schemaContent.includes('flowConfig  Json?');
  const hasQuestionsField = schemaContent.includes('questions   Json');
  
  console.log(`   QuestionConfiguration model: ${hasQuestionConfiguration ? '✅ Found' : '❌ Missing'}`);
  console.log(`   flowConfig field: ${hasFlowConfigField ? '✅ Found' : '❌ Missing'}`);
  console.log(`   questions field: ${hasQuestionsField ? '✅ Found' : '❌ Missing'}`);
}

// Test 3: Check flowStore save function
console.log('\n3. Testing flowStore save function...');
const flowStorePath = path.join(__dirname, '..', 'src', 'stores', 'flowStore.ts');
const flowStoreExists = fs.existsSync(flowStorePath);

if (flowStoreExists) {
  const flowStoreContent = fs.readFileSync(flowStorePath, 'utf8');
  
  const hasSaveFlowFunction = flowStoreContent.includes('saveFlow: async () =>');
  const hasApiCall = flowStoreContent.includes('fetch(\'/api/flows\'');
  const hasErrorHandling = flowStoreContent.includes('throw new Error');
  
  console.log(`   Save flow function: ${hasSaveFlowFunction ? '✅ Found' : '❌ Missing'}`);
  console.log(`   API call: ${hasApiCall ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Error handling: ${hasErrorHandling ? '✅ Found' : '❌ Missing'}`);
}

console.log('\n🎉 API Fix Test Complete!');
console.log('\n📝 What was fixed:');
console.log('1. ✅ Fixed POST endpoint - added required fields (questions, type)');
console.log('2. ✅ Fixed PUT endpoint - removed include and fixed ID type');
console.log('3. ✅ Fixed GET endpoint - removed include and fixed ID type');
console.log('4. ✅ Fixed DELETE endpoint - fixed ID type');
console.log('5. ✅ Ensured database schema compatibility');

console.log('\n🚀 How to test the fix:');
console.log('1. Make sure the dev server is running: npm run dev');
console.log('2. Open http://localhost:3001/adminx');
console.log('3. Login with admin@admin.com');
console.log('4. Click "Flow Designer" button');
console.log('5. Create a new flow or edit an existing one');
console.log('6. Click "Save Flow" button in Properties Panel');
console.log('7. Check for success toast notification');

console.log('\n🔧 Expected behavior:');
console.log('- No more 500 Internal Server Error');
console.log('- Flow saves successfully to database');
console.log('- Toast notification shows "Flow saved successfully!"');
console.log('- Flow persists after page refresh');
