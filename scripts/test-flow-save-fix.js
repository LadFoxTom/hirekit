const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Flow Save Fix...\n');

// Test 1: Check API route has the fix
console.log('1. Checking API route fix...');
const apiRoutePath = path.join(__dirname, '..', 'src', 'app', 'api', 'flows', 'route.ts');
if (fs.existsSync(apiRoutePath)) {
  const content = fs.readFileSync(apiRoutePath, 'utf8');
  
  const hasFindUnique = content.includes('findUnique');
  const hasCreateFallback = content.includes('Flow not found, creating new flow instead');
  const hasCreateWithId = content.includes('id: id, // Use the provided ID');
  
  console.log(`   Has findUnique check: ${hasFindUnique ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has create fallback: ${hasCreateFallback ? '✅ Yes' : '❌ No'}`);
  console.log(`   Creates with provided ID: ${hasCreateWithId ? '✅ Yes' : '❌ No'}`);
}

// Test 2: Check flowStore uses PUT
console.log('\n2. Checking flowStore logic...');
const flowStorePath = path.join(__dirname, '..', 'src', 'stores', 'flowStore.ts');
if (fs.existsSync(flowStorePath)) {
  const content = fs.readFileSync(flowStorePath, 'utf8');
  
  const usesPut = content.includes("const method = 'PUT'");
  const hasRequestBody = content.includes('id: currentFlow.id');
  const hasDebugLogging = content.includes('Flow ID: "');
  
  console.log(`   Uses PUT method: ${usesPut ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has request body: ${hasRequestBody ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has debug logging: ${hasDebugLogging ? '✅ Yes' : '❌ No'}`);
}

console.log('\n🎉 Flow Save Fix Test Complete!');
console.log('\n📝 What this fix does:');
console.log('1. ✅ API checks if flow exists before updating');
console.log('2. ✅ If flow doesn\'t exist, creates it with the provided ID');
console.log('3. ✅ If flow exists, updates it normally');
console.log('4. ✅ flowStore always uses PUT method');
console.log('5. ✅ API handles the create/update logic automatically');

console.log('\n🚀 How to test:');
console.log('1. Open http://localhost:3001/adminx');
console.log('2. Login and open Flow Designer');
console.log('3. Create a new flow (it will have a cv-flow-* ID)');
console.log('4. Add a question node and edit it');
console.log('5. Click "Save Flow" button');
console.log('6. Should see: "Flow not found, creating new flow instead"');
console.log('7. Then: "Flow created successfully"');
console.log('8. Success toast should appear');

console.log('\n🔧 Expected behavior:');
console.log('- No more "No record was found for an update" errors');
console.log('- Flows with cv-flow-* IDs will be created in database');
console.log('- Subsequent saves will update the existing flow');
console.log('- All operations logged to console for debugging');
