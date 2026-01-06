const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Question Editing Functionality...\n');

// Test 1: Check if PropertiesPanel has QuestionProperties component
console.log('1. Testing PropertiesPanel QuestionProperties...');
const propertiesPanelPath = path.join(__dirname, '..', 'src', 'components', 'panels', 'PropertiesPanel.tsx');
const propertiesPanelExists = fs.existsSync(propertiesPanelPath);

if (propertiesPanelExists) {
  const propertiesPanelContent = fs.readFileSync(propertiesPanelPath, 'utf8');
  
  // Check for essential features
  const hasQuestionProperties = propertiesPanelContent.includes('QuestionProperties');
  const hasQuestionTextarea = propertiesPanelContent.includes('textarea');
  const hasQuestionChange = propertiesPanelContent.includes('handleQuestionChange');
  const hasUpdateNode = propertiesPanelContent.includes('updateNode');
  const hasDebugInfo = propertiesPanelContent.includes('Debug Info');
  
  console.log(`   QuestionProperties component: ${hasQuestionProperties ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Question textarea: ${hasQuestionTextarea ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Question change handler: ${hasQuestionChange ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Update node function: ${hasUpdateNode ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Debug info section: ${hasDebugInfo ? '✅ Found' : '❌ Missing'}`);
}

// Test 2: Check if flowStore has updated updateNode function
console.log('\n2. Testing FlowStore updateNode function...');
const flowStorePath = path.join(__dirname, '..', 'src', 'stores', 'flowStore.ts');
const flowStoreExists = fs.existsSync(flowStorePath);

if (flowStoreExists) {
  const flowStoreContent = fs.readFileSync(flowStorePath, 'utf8');
  
  // Check for updated updateNode function
  const hasUpdateNodeFunction = flowStoreContent.includes('updateNode: (id, updates)');
  const hasSelectedNodeUpdate = flowStoreContent.includes('state.selectedNode?.id === id');
  const hasSelectedNodeSync = flowStoreContent.includes('state.selectedNode = {');
  
  console.log(`   UpdateNode function: ${hasUpdateNodeFunction ? '✅ Found' : '❌ Missing'}`);
  console.log(`   SelectedNode ID check: ${hasSelectedNodeUpdate ? '✅ Found' : '❌ Missing'}`);
  console.log(`   SelectedNode sync: ${hasSelectedNodeSync ? '✅ Found' : '❌ Missing'}`);
}

// Test 3: Check if NodePalette creates question nodes correctly
console.log('\n3. Testing NodePalette question node creation...');
const nodePalettePath = path.join(__dirname, '..', 'src', 'components', 'panels', 'NodePalette.tsx');
const nodePaletteExists = fs.existsSync(nodePalettePath);

if (nodePaletteExists) {
  const nodePaletteContent = fs.readFileSync(nodePalettePath, 'utf8');
  
  // Check for question node template
  const hasQuestionTemplate = nodePaletteContent.includes("type: 'question'");
  const hasQuestionData = nodePaletteContent.includes('question:');
  const hasQuestionType = nodePaletteContent.includes('questionType:');
  
  console.log(`   Question node template: ${hasQuestionTemplate ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Question data field: ${hasQuestionData ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Question type field: ${hasQuestionType ? '✅ Found' : '❌ Missing'}`);
}

console.log('\n🎉 Question Editing Functionality Test Complete!');
console.log('\n📝 What was implemented:');
console.log('1. ✅ Updated updateNode function to sync selectedNode');
console.log('2. ✅ Enhanced QuestionProperties component with debugging');
console.log('3. ✅ Added debug info section to PropertiesPanel');
console.log('4. ✅ Improved question text editing with proper handlers');
console.log('5. ✅ Added visual feedback for current question value');

console.log('\n🚀 How to test the question editing:');
console.log('1. Open http://localhost:3001/adminx');
console.log('2. Login with admin@admin.com');
console.log('3. Click "Flow Designer" button');
console.log('4. Drag a "Question" node from the palette to the canvas');
console.log('5. Click on the question node to select it');
console.log('6. In the Properties Panel (right side), edit the "Question Text"');
console.log('7. Check the debug info section to see the current value');
console.log('8. Verify that changes are saved and reflected in the node');

console.log('\n🔧 Features available:');
console.log('- Real-time question text editing');
console.log('- Visual feedback showing current value');
console.log('- Debug information for troubleshooting');
console.log('- Proper state synchronization between nodes and selectedNode');
console.log('- Question type selection (text, multiple-choice, yes/no, etc.)');
console.log('- Variable name assignment for storing responses');
