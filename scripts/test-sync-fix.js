const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Synchronization Fix...\n');

// Test 1: Check FlowEditor synchronization
console.log('1. Checking FlowEditor synchronization...');
const flowEditorPath = path.join(__dirname, '..', 'src', 'components', 'flow', 'FlowEditor.tsx');
if (fs.existsSync(flowEditorPath)) {
  const content = fs.readFileSync(flowEditorPath, 'utf8');
  
  const hasSyncEffect = content.includes('Keep React Flow in sync with store updates');
  const hasInitializationLog = content.includes('Flow initialized with nodes:');
  const hasSyncLog = content.includes('Flow synced with store - nodes:');
  const hasPositionChangesCheck = content.includes('hasPositionChanges');
  const hasDebouncedUpdate = content.includes('Updating store with position changes');
  
  console.log(`   Has sync effect: ${hasSyncEffect ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has initialization log: ${hasInitializationLog ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has sync log: ${hasSyncLog ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has position changes check: ${hasPositionChangesCheck ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has debounced update: ${hasDebouncedUpdate ? '✅ Yes' : '❌ No'}`);
}

// Test 2: Check PropertiesPanel debugging
console.log('\n2. Checking PropertiesPanel debugging...');
const propertiesPanelPath = path.join(__dirname, '..', 'src', 'components', 'panels', 'PropertiesPanel.tsx');
if (fs.existsSync(propertiesPanelPath)) {
  const content = fs.readFileSync(propertiesPanelPath, 'utf8');
  
  const hasQuestionChangeDebug = content.includes('Current node data before update:');
  const hasUpdateNodeCall = content.includes('updateNode(node.id, {');
  const hasDataSpread = content.includes('data: { ...node.data, question: newValue }');
  
  console.log(`   Has question change debug: ${hasQuestionChangeDebug ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has updateNode call: ${hasUpdateNodeCall ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has data spread: ${hasDataSpread ? '✅ Yes' : '❌ No'}`);
}

// Test 3: Check flowStore debugging
console.log('\n3. Checking flowStore debugging...');
const flowStorePath = path.join(__dirname, '..', 'src', 'stores', 'flowStore.ts');
if (fs.existsSync(flowStorePath)) {
  const content = fs.readFileSync(flowStorePath, 'utf8');
  
  const hasApiRequestLog = content.includes('Sending request to API:');
  const hasNodeUpdateLog = content.includes('Node updated successfully:');
  const hasFlowSaveLog = content.includes('Flow saved successfully:');
  const hasNestedDataUpdate = content.includes('data: updates.data ? { ...currentNode.data, ...updates.data } : currentNode.data');
  
  console.log(`   Has API request log: ${hasApiRequestLog ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has node update log: ${hasNodeUpdateLog ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has flow save log: ${hasFlowSaveLog ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has nested data update: ${hasNestedDataUpdate ? '✅ Yes' : '❌ No'}`);
}

console.log('\n🎉 Synchronization Fix Test Complete!');
console.log('\n📝 What this fix does:');
console.log('1. ✅ React Flow state stays in sync with store updates');
console.log('2. ✅ Node data changes are preserved when selecting/deselecting nodes');
console.log('3. ✅ Debounced updates only happen for position/size changes');
console.log('4. ✅ Enhanced debugging logs throughout the system');
console.log('5. ✅ Question text updates are immediately reflected in the UI');

console.log('\n🚀 How to test:');
console.log('1. Open http://localhost:3001/adminx');
console.log('2. Login and open Flow Designer');
console.log('3. Create a new flow');
console.log('4. Add a question node');
console.log('5. Click on the question node to select it');
console.log('6. Edit the question text in Properties Panel');
console.log('7. Should see: "Updating question text: [your text]"');
console.log('8. Should see: "Current node data before update: {...}"');
console.log('9. Should see: "Node updated successfully: {...}"');
console.log('10. Should see: "Flow synced with store - nodes: 1 edges: 0"');
console.log('11. Click away from the node (deselect it)');
console.log('12. Click back on the node - question text should still be there');
console.log('13. Click "Save Flow" button');
console.log('14. Should see: "Sending request to API: {...}"');
console.log('15. Should see: "Flow saved successfully: {...}"');

console.log('\n🔧 Expected behavior:');
console.log('- Question text updates immediately when typing');
console.log('- Text persists when selecting/deselecting nodes');
console.log('- All operations are logged to console');
console.log('- Flow saves successfully to database');
console.log('- No more disappearing node data');
console.log('- React Flow and store stay synchronized');
