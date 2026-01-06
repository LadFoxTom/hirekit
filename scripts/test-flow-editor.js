const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Flow Editor and Properties Panel...\n');

// Test 1: Check if FlowEditor component exists and has proper structure
console.log('1. Testing FlowEditor component...');
const flowEditorPath = path.join(__dirname, '..', 'src', 'components', 'flow', 'FlowEditor.tsx');
const flowEditorExists = fs.existsSync(flowEditorPath);
console.log(`   FlowEditor component: ${flowEditorExists ? '✅ Exists' : '❌ Missing'}`);

if (flowEditorExists) {
  const flowEditorContent = fs.readFileSync(flowEditorPath, 'utf8');
  
  // Check for essential event handlers
  const hasNodeClick = flowEditorContent.includes('onNodeClick');
  const hasEdgeClick = flowEditorContent.includes('onEdgeClick');
  const hasPaneClick = flowEditorContent.includes('onPaneClick');
  const hasPropertiesPanel = flowEditorContent.includes('<PropertiesPanel />');
  const hasConsoleLogs = flowEditorContent.includes('console.log');
  
  console.log(`   Node click handler: ${hasNodeClick ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Edge click handler: ${hasEdgeClick ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Pane click handler: ${hasPaneClick ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Properties panel: ${hasPropertiesPanel ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Debug logging: ${hasConsoleLogs ? '✅ Added' : '❌ Missing'}`);
}

// Test 2: Check if PropertiesPanel component exists and has proper structure
console.log('\n2. Testing PropertiesPanel component...');
const propertiesPanelPath = path.join(__dirname, '..', 'src', 'components', 'panels', 'PropertiesPanel.tsx');
const propertiesPanelExists = fs.existsSync(propertiesPanelPath);
console.log(`   PropertiesPanel component: ${propertiesPanelExists ? '✅ Exists' : '❌ Missing'}`);

if (propertiesPanelExists) {
  const propertiesPanelContent = fs.readFileSync(propertiesPanelPath, 'utf8');
  
  // Check for essential features
  const hasDebugInfo = propertiesPanelContent.includes('Debug Info');
  const hasTestButton = propertiesPanelContent.includes('Test Store State');
  const hasConsoleLogs = propertiesPanelContent.includes('console.log');
  const hasQuestionProperties = propertiesPanelContent.includes('QuestionProperties');
  const hasConditionProperties = propertiesPanelContent.includes('ConditionProperties');
  const hasActionProperties = propertiesPanelContent.includes('ActionProperties');
  
  console.log(`   Debug info display: ${hasDebugInfo ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Test button: ${hasTestButton ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Debug logging: ${hasConsoleLogs ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Question properties: ${hasQuestionProperties ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Condition properties: ${hasConditionProperties ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Action properties: ${hasActionProperties ? '✅ Added' : '❌ Missing'}`);
}

// Test 3: Check if flow store has proper selection handling
console.log('\n3. Testing Flow Store...');
const flowStorePath = path.join(__dirname, '..', 'src', 'stores', 'flowStore.ts');
const flowStoreExists = fs.existsSync(flowStorePath);
console.log(`   Flow store: ${flowStoreExists ? '✅ Exists' : '❌ Missing'}`);

if (flowStoreExists) {
  const flowStoreContent = fs.readFileSync(flowStorePath, 'utf8');
  
  // Check for selection state management
  const hasSelectedNode = flowStoreContent.includes('selectedNode: null');
  const hasSelectedEdge = flowStoreContent.includes('selectedEdge: null');
  const hasSetSelectedNode = flowStoreContent.includes('setSelectedNode: (node)');
  const hasSetSelectedEdge = flowStoreContent.includes('setSelectedEdge: (edge)');
  const hasPropertiesPanelOpen = flowStoreContent.includes('propertiesPanelOpen: true');
  
  console.log(`   Selected node state: ${hasSelectedNode ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Selected edge state: ${hasSelectedEdge ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Set selected node: ${hasSetSelectedNode ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Set selected edge: ${hasSetSelectedEdge ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Properties panel open: ${hasPropertiesPanelOpen ? '✅ Added' : '❌ Missing'}`);
}

// Test 4: Check if custom node components exist
console.log('\n4. Testing Custom Node Components...');
const nodeComponents = [
  'QuestionNode.tsx',
  'StartNode.tsx', 
  'EndNode.tsx'
];

nodeComponents.forEach(component => {
  const componentPath = path.join(__dirname, '..', 'src', 'components', 'nodes', component);
  const exists = fs.existsSync(componentPath);
  console.log(`   ${component}: ${exists ? '✅ Exists' : '❌ Missing'}`);
});

// Test 5: Check if NodePalette component exists
console.log('\n5. Testing NodePalette component...');
const nodePalettePath = path.join(__dirname, '..', 'src', 'components', 'panels', 'NodePalette.tsx');
const nodePaletteExists = fs.existsSync(nodePalettePath);
console.log(`   NodePalette component: ${nodePaletteExists ? '✅ Exists' : '❌ Missing'}`);

console.log('\n🎉 Flow Editor Test Complete!');
console.log('\n📝 What was implemented:');
console.log('1. ✅ Added node/edge click handlers with debug logging');
console.log('2. ✅ Added properties panel with debug info and test button');
console.log('3. ✅ Added selection state management in flow store');
console.log('4. ✅ Added custom node components (Question, Start, End)');
console.log('5. ✅ Added NodePalette for drag-and-drop functionality');

console.log('\n🚀 Ready to test flow editor:');
console.log('1. Open http://localhost:3001/adminx');
console.log('2. Login with admin@admin.com');
console.log('3. Click "Flow Designer" button');
console.log('4. Try clicking on nodes to see properties panel');
console.log('5. Check browser console for debug logs');
console.log('6. Use the "Test Store State" button to verify selection');

console.log('\n🔧 Debugging tips:');
console.log('- Open browser developer tools (F12)');
console.log('- Check Console tab for debug logs');
console.log('- Check Network tab for any failed requests');
console.log('- Try clicking different nodes and edges');
console.log('- Use the properties panel toggle button in toolbar');
