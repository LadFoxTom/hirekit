const fs = require('fs');
const path = require('path');

console.log('🔍 Flow System Debug Test...\n');

// Test 1: Check if all required files exist
console.log('1. Checking file existence...');
const files = [
  'src/stores/flowStore.ts',
  'src/app/api/flows/route.ts',
  'src/components/panels/PropertiesPanel.tsx',
  'src/components/flow/FlowEditor.tsx',
  'prisma/schema.prisma'
];

files.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`   ${file}: ${exists ? '✅ Exists' : '❌ Missing'}`);
});

// Test 2: Check flowStore for critical functions
console.log('\n2. Checking flowStore functions...');
const flowStorePath = path.join(__dirname, '..', 'src', 'stores', 'flowStore.ts');
if (fs.existsSync(flowStorePath)) {
  const content = fs.readFileSync(flowStorePath, 'utf8');
  
  const hasSaveFlow = content.includes('saveFlow: async () =>');
  const hasUpdateNode = content.includes('updateNode: (id, updates) =>');
  const hasCreateNewFlow = content.includes('createNewFlow: (name: string');
  const hasUpdateCurrentFlowNodesAndEdges = content.includes('updateCurrentFlowNodesAndEdges');
  const hasErrorHandling = content.includes('throw new Error');
  
  console.log(`   saveFlow function: ${hasSaveFlow ? '✅ Found' : '❌ Missing'}`);
  console.log(`   updateNode function: ${hasUpdateNode ? '✅ Found' : '❌ Missing'}`);
  console.log(`   createNewFlow function: ${hasCreateNewFlow ? '✅ Found' : '❌ Missing'}`);
  console.log(`   updateCurrentFlowNodesAndEdges: ${hasUpdateCurrentFlowNodesAndEdges ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Error handling: ${hasErrorHandling ? '✅ Found' : '❌ Missing'}`);
}

// Test 3: Check API route
console.log('\n3. Checking API route...');
const apiRoutePath = path.join(__dirname, '..', 'src', 'app', 'api', 'flows', 'route.ts');
if (fs.existsSync(apiRoutePath)) {
  const content = fs.readFileSync(apiRoutePath, 'utf8');
  
  const hasFlowModel = content.includes('prisma.flow.');
  const hasDataField = content.includes('data: data');
  const hasErrorDetails = content.includes('details: error.message');
  const hasLogging = content.includes('console.log');
  
  console.log(`   Uses Flow model: ${hasFlowModel ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has data field: ${hasDataField ? '✅ Yes' : '❌ No'}`);
  console.log(`   Error details: ${hasErrorDetails ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has logging: ${hasLogging ? '✅ Yes' : '❌ No'}`);
}

// Test 4: Check PropertiesPanel
console.log('\n4. Checking PropertiesPanel...');
const propertiesPanelPath = path.join(__dirname, '..', 'src', 'components', 'panels', 'PropertiesPanel.tsx');
if (fs.existsSync(propertiesPanelPath)) {
  const content = fs.readFileSync(propertiesPanelPath, 'utf8');
  
  const hasSaveButton = content.includes('Save Flow');
  const hasUpdateNode = content.includes('updateNode(node.id');
  const hasErrorHandling = content.includes('toast.error');
  const hasDebugLogging = content.includes('console.log');
  
  console.log(`   Save Flow button: ${hasSaveButton ? '✅ Found' : '❌ Missing'}`);
  console.log(`   updateNode calls: ${hasUpdateNode ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Error handling: ${hasErrorHandling ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Debug logging: ${hasDebugLogging ? '✅ Found' : '❌ Missing'}`);
}

// Test 5: Check FlowEditor
console.log('\n5. Checking FlowEditor...');
const flowEditorPath = path.join(__dirname, '..', 'src', 'components', 'flow', 'FlowEditor.tsx');
if (fs.existsSync(flowEditorPath)) {
  const content = fs.readFileSync(flowEditorPath, 'utf8');
  
  const hasNewFlowButton = content.includes('New Flow');
  const hasCreateNewFlow = content.includes('createNewFlow(name)');
  const hasSyncMechanism = content.includes('updateCurrentFlowNodesAndEdges');
  const hasDebugLogging = content.includes('console.log');
  
  console.log(`   New Flow button: ${hasNewFlowButton ? '✅ Found' : '❌ Missing'}`);
  console.log(`   createNewFlow calls: ${hasCreateNewFlow ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Sync mechanism: ${hasSyncMechanism ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Debug logging: ${hasDebugLogging ? '✅ Found' : '❌ Missing'}`);
}

console.log('\n🔍 Debug Test Complete!');
console.log('\n📝 Next Steps:');
console.log('1. Open browser console (F12)');
console.log('2. Go to http://localhost:3001/adminx');
console.log('3. Login and open Flow Designer');
console.log('4. Click "New Flow" button');
console.log('5. Add a question node');
console.log('6. Edit the question text');
console.log('7. Click "Save Flow" button');
console.log('8. Check console for debug messages');

console.log('\n🐛 Expected Debug Messages:');
console.log('- "Creating new flow: [name]"');
console.log('- "New flow created: [object]"');
console.log('- "Updating flow with nodes: X edges: Y"');
console.log('- "Save Flow button clicked"');
console.log('- "Current flow before save: [object]"');
console.log('- "Saving flow: [object]"');
console.log('- "Flow saved successfully: [object]"');

console.log('\n❌ If you see errors:');
console.log('- "No current flow to save" → Need to create flow first');
console.log('- "No current flow to update" → Flow not initialized');
console.log('- API errors → Check server console for details');
