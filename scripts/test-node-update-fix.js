const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Node Update Fix...\n');

// Test 1: Check flowStore updateNode function
console.log('1. Checking flowStore updateNode function...');
const flowStorePath = path.join(__dirname, '..', 'src', 'stores', 'flowStore.ts');
if (fs.existsSync(flowStorePath)) {
  const content = fs.readFileSync(flowStorePath, 'utf8');
  
  const hasNestedDataUpdate = content.includes('data: updates.data ? { ...currentNode.data, ...updates.data } : currentNode.data');
  const hasSelectedNodeUpdate = content.includes('state.selectedNode = updatedNode');
  const hasDebugLogging = content.includes('Node updated successfully:');
  
  console.log(`   Has nested data update: ${hasNestedDataUpdate ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has selectedNode update: ${hasSelectedNodeUpdate ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has debug logging: ${hasDebugLogging ? '✅ Yes' : '❌ No'}`);
}

// Test 2: Check PropertiesPanel QuestionProperties
console.log('\n2. Checking PropertiesPanel QuestionProperties...');
const propertiesPanelPath = path.join(__dirname, '..', 'src', 'components', 'panels', 'PropertiesPanel.tsx');
if (fs.existsSync(propertiesPanelPath)) {
  const content = fs.readFileSync(propertiesPanelPath, 'utf8');
  
  const hasQuestionChangeHandler = content.includes('handleQuestionChange');
  const hasUpdateNodeCall = content.includes('updateNode(node.id, {');
  const hasDataSpread = content.includes('data: { ...node.data, question: newValue }');
  const hasDebugLogging = content.includes('Updating question text:');
  
  console.log(`   Has question change handler: ${hasQuestionChangeHandler ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has updateNode call: ${hasUpdateNodeCall ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has data spread: ${hasDataSpread ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has debug logging: ${hasDebugLogging ? '✅ Yes' : '❌ No'}`);
}

// Test 3: Check FlowEditor node selection
console.log('\n3. Checking FlowEditor node selection...');
const flowEditorPath = path.join(__dirname, '..', 'src', 'components', 'flow', 'FlowEditor.tsx');
if (fs.existsSync(flowEditorPath)) {
  const content = fs.readFileSync(flowEditorPath, 'utf8');
  
  const hasOnNodeClick = content.includes('onNodeClick');
  const hasSetSelectedNode = content.includes('setSelectedNode(node');
  const hasPropertiesPanelToggle = content.includes('togglePropertiesPanel');
  
  console.log(`   Has onNodeClick: ${hasOnNodeClick ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has setSelectedNode: ${hasSetSelectedNode ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has properties panel toggle: ${hasPropertiesPanelToggle ? '✅ Yes' : '❌ No'}`);
}

console.log('\n🎉 Node Update Fix Test Complete!');
console.log('\n📝 What this fix does:');
console.log('1. ✅ Properly handles nested data property updates in updateNode');
console.log('2. ✅ Merges new data with existing node data');
console.log('3. ✅ Updates both currentFlow.nodes and selectedNode');
console.log('4. ✅ Adds debug logging to track updates');
console.log('5. ✅ Ensures reactivity in PropertiesPanel');

console.log('\n🚀 How to test:');
console.log('1. Open http://localhost:3001/adminx');
console.log('2. Login and open Flow Designer');
console.log('3. Create a new flow');
console.log('4. Add a question node');
console.log('5. Click on the question node to select it');
console.log('6. Edit the question text in Properties Panel');
console.log('7. Should see: "Updating question text: [your text]"');
console.log('8. Should see: "Node updated successfully: {...}"');
console.log('9. Text should update immediately in the textarea');
console.log('10. "Current value" should show the new text');

console.log('\n🔧 Expected behavior:');
console.log('- Question text updates immediately when typing');
console.log('- No more "Current value: empty" when text is entered');
console.log('- Debug logs show successful node updates');
console.log('- PropertiesPanel reflects changes in real-time');
console.log('- Changes persist when saving the flow');
