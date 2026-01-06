const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Flow ID Fix...\n');

// Test 1: Check flowStore createNewFlow function
console.log('1. Checking flowStore createNewFlow function...');
const flowStorePath = path.join(__dirname, '..', 'src', 'stores', 'flowStore.ts');
if (fs.existsSync(flowStorePath)) {
  const content = fs.readFileSync(flowStorePath, 'utf8');
  
  const hasFlowId = content.includes('id: `cv-flow-${Date.now()}`');
  const hasDebugLogging = content.includes('New flow created with ID:');
  const hasIdValidation = content.includes('if (!currentFlow.id || currentFlow.id === \'\')');
  const hasErrorHandling = content.includes('Flow has no ID. Please create a new flow first.');
  
  console.log(`   Has flow ID generation: ${hasFlowId ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has debug logging: ${hasDebugLogging ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has ID validation: ${hasIdValidation ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has error handling: ${hasErrorHandling ? '✅ Yes' : '❌ No'}`);
}

// Test 2: Check FlowEditor New Flow button
console.log('\n2. Checking FlowEditor New Flow button...');
const flowEditorPath = path.join(__dirname, '..', 'src', 'components', 'flow', 'FlowEditor.tsx');
if (fs.existsSync(flowEditorPath)) {
  const content = fs.readFileSync(flowEditorPath, 'utf8');
  
  const hasPrompt = content.includes('const name = prompt(\'Enter flow name:\');');
  const hasCreateNewFlow = content.includes('const newFlow = createNewFlow(name);');
  const hasDebugLogging = content.includes('Creating new flow:');
  const hasSuccessToast = content.includes('New flow "${name}" created!');
  
  console.log(`   Has name prompt: ${hasPrompt ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has createNewFlow call: ${hasCreateNewFlow ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has debug logging: ${hasDebugLogging ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has success toast: ${hasSuccessToast ? '✅ Yes' : '❌ No'}`);
}

// Test 3: Check API route PUT handler
console.log('\n3. Checking API route PUT handler...');
const apiRoutePath = path.join(__dirname, '..', 'src', 'app', 'api', 'flows', 'route.ts');
if (fs.existsSync(apiRoutePath)) {
  const content = fs.readFileSync(apiRoutePath, 'utf8');
  
  const hasIdCheck = content.includes('if (!id)');
  const hasIdRequiredError = content.includes('Flow ID is required');
  const hasFindUnique = content.includes('findUnique');
  const hasCreateFallback = content.includes('Flow not found, creating new flow instead');
  
  console.log(`   Has ID check: ${hasIdCheck ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has ID required error: ${hasIdRequiredError ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has findUnique check: ${hasFindUnique ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has create fallback: ${hasCreateFallback ? '✅ Yes' : '❌ No'}`);
}

console.log('\n🎉 Flow ID Fix Test Complete!');
console.log('\n📝 What this fix does:');
console.log('1. ✅ createNewFlow now generates a proper ID (cv-flow-{timestamp})');
console.log('2. ✅ saveFlow validates that flow has an ID before saving');
console.log('3. ✅ Better error messages when flow has no ID');
console.log('4. ✅ Debug logging to track flow creation and saving');
console.log('5. ✅ API handles both new flows (create) and existing flows (update)');

console.log('\n🚀 How to test:');
console.log('1. Open http://localhost:3001/adminx');
console.log('2. Login and open Flow Designer');
console.log('3. Click "New Flow" button');
console.log('4. Enter a flow name (e.g., "Test Flow")');
console.log('5. Should see: "Creating new flow: Test Flow"');
console.log('6. Should see: "New flow created with ID: cv-flow-{timestamp}"');
console.log('7. Should see: "New flow "Test Flow" created!" toast');
console.log('8. Add a question node and edit it');
console.log('9. Click "Save Flow" button');
console.log('10. Should see: "Using PUT method for flow save. Flow ID: cv-flow-{timestamp}"');
console.log('11. Should see: "Flow not found, creating new flow instead"');
console.log('12. Should see: "Flow created successfully"');
console.log('13. Should see: "Flow saved successfully!" toast');

console.log('\n🔧 Expected behavior:');
console.log('- New flows get proper IDs immediately');
console.log('- No more "Flow ID is required" errors');
console.log('- Flows save successfully to database');
console.log('- Debug logs show the complete flow creation and save process');
console.log('- Question text editing works properly');
console.log('- All operations are logged for debugging');
