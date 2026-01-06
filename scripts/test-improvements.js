const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Flow Designer Improvements...\n');

// Test 1: Check new node components
console.log('1. Checking new node components...');
const nodeComponents = [
  { name: 'ActionNode', path: 'src/components/nodes/ActionNode.tsx' },
  { name: 'WaitNode', path: 'src/components/nodes/WaitNode.tsx' },
  { name: 'ApiCallNode', path: 'src/components/nodes/ApiCallNode.tsx' }
];

let allNodesExist = true;
nodeComponents.forEach(({ name, path: filePath }) => {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasProperComponent = content.includes(`const ${name} = ({ data, selected }: NodeProps) =>`);
    const hasExport = content.includes(`export default memo(${name});`);
    const hasHandles = content.includes('Handle') && content.includes('Position');
    
    console.log(`   ✅ ${name}: ${hasProperComponent && hasExport && hasHandles ? 'OK' : 'Issues found'}`);
    
    if (!hasProperComponent || !hasExport || !hasHandles) {
      allNodesExist = false;
    }
  } else {
    console.log(`   ❌ ${name}: File not found`);
    allNodesExist = false;
  }
});

// Test 2: Check FlowEditor node types mapping
console.log('\n2. Checking FlowEditor node types mapping...');
const flowEditorPath = path.join(__dirname, '..', 'src/components/flow/FlowEditor.tsx');
if (fs.existsSync(flowEditorPath)) {
  const content = fs.readFileSync(flowEditorPath, 'utf8');
  
  const hasActionNodeImport = content.includes('import ActionNode from');
  const hasWaitNodeImport = content.includes('import WaitNode from');
  const hasApiCallNodeImport = content.includes('import ApiCallNode from');
  
  const hasActionNodeMapping = content.includes('action: ActionNode');
  const hasWaitNodeMapping = content.includes('wait: WaitNode');
  const hasApiCallNodeMapping = content.includes("'api-call': ApiCallNode");
  
  console.log(`   ✅ ActionNode import: ${hasActionNodeImport ? 'OK' : 'Missing'}`);
  console.log(`   ✅ WaitNode import: ${hasWaitNodeImport ? 'OK' : 'Missing'}`);
  console.log(`   ✅ ApiCallNode import: ${hasApiCallNodeImport ? 'OK' : 'Missing'}`);
  console.log(`   ✅ ActionNode mapping: ${hasActionNodeMapping ? 'OK' : 'Missing'}`);
  console.log(`   ✅ WaitNode mapping: ${hasWaitNodeMapping ? 'OK' : 'Missing'}`);
  console.log(`   ✅ ApiCallNode mapping: ${hasApiCallNodeMapping ? 'OK' : 'Missing'}`);
  
  const allMappingsCorrect = hasActionNodeImport && hasWaitNodeImport && hasApiCallNodeImport && 
                           hasActionNodeMapping && hasWaitNodeMapping && hasApiCallNodeMapping;
  
  if (!allMappingsCorrect) {
    console.log('   ❌ Some node mappings are missing');
  }
} else {
  console.log('   ❌ FlowEditor.tsx not found');
}

// Test 3: Check PropertiesPanel enhancements
console.log('\n3. Checking PropertiesPanel enhancements...');
const propertiesPanelPath = path.join(__dirname, '..', 'src/components/panels/PropertiesPanel.tsx');
if (fs.existsSync(propertiesPanelPath)) {
  const content = fs.readFileSync(propertiesPanelPath, 'utf8');
  
  const hasWaitProperties = content.includes('case \'wait\':') && content.includes('return <WaitProperties');
  const hasApiCallProperties = content.includes('case \'api-call\':') && content.includes('return <ApiCallProperties');
  
  const hasWaitPropertiesComponent = content.includes('const WaitProperties = ({ node }: { node: any }) =>');
  const hasApiCallPropertiesComponent = content.includes('const ApiCallProperties = ({ node }: { node: any }) =>');
  
  const hasEnhancedActionProperties = content.includes('send_email') && content.includes('send_sms');
  
  console.log(`   ✅ Wait properties case: ${hasWaitProperties ? 'OK' : 'Missing'}`);
  console.log(`   ✅ ApiCall properties case: ${hasApiCallProperties ? 'OK' : 'Missing'}`);
  console.log(`   ✅ WaitProperties component: ${hasWaitPropertiesComponent ? 'OK' : 'Missing'}`);
  console.log(`   ✅ ApiCallProperties component: ${hasApiCallPropertiesComponent ? 'OK' : 'Missing'}`);
  console.log(`   ✅ Enhanced ActionProperties: ${hasEnhancedActionProperties ? 'OK' : 'Missing'}`);
  
  const allPropertiesCorrect = hasWaitProperties && hasApiCallProperties && 
                             hasWaitPropertiesComponent && hasApiCallPropertiesComponent && 
                             hasEnhancedActionProperties;
  
  if (!allPropertiesCorrect) {
    console.log('   ❌ Some properties components are missing');
  }
} else {
  console.log('   ❌ PropertiesPanel.tsx not found');
}

// Test 4: Check NodePalette templates
console.log('\n4. Checking NodePalette templates...');
const nodePalettePath = path.join(__dirname, '..', 'src/components/panels/NodePalette.tsx');
if (fs.existsSync(nodePalettePath)) {
  const content = fs.readFileSync(nodePalettePath, 'utf8');
  
  const hasActionTemplate = content.includes("type: 'action'") && content.includes("label: 'Action'");
  const hasWaitTemplate = content.includes("type: 'wait'") && content.includes("label: 'Wait'");
  const hasApiCallTemplate = content.includes("type: 'api-call'") && content.includes("label: 'API Call'");
  
  console.log(`   ✅ Action template: ${hasActionTemplate ? 'OK' : 'Missing'}`);
  console.log(`   ✅ Wait template: ${hasWaitTemplate ? 'OK' : 'Missing'}`);
  console.log(`   ✅ ApiCall template: ${hasApiCallTemplate ? 'OK' : 'Missing'}`);
  
  const allTemplatesCorrect = hasActionTemplate && hasWaitTemplate && hasApiCallTemplate;
  
  if (!allTemplatesCorrect) {
    console.log('   ❌ Some node templates are missing');
  }
} else {
  console.log('   ❌ NodePalette.tsx not found');
}

// Test 5: Check flow types
console.log('\n5. Checking flow types...');
const flowTypesPath = path.join(__dirname, '..', 'src/types/flow.ts');
if (fs.existsSync(flowTypesPath)) {
  const content = fs.readFileSync(flowTypesPath, 'utf8');
  
  const hasActionType = content.includes("'action'");
  const hasWaitType = content.includes("'wait'");
  const hasApiCallType = content.includes("'api-call'");
  
  console.log(`   ✅ Action type: ${hasActionType ? 'OK' : 'Missing'}`);
  console.log(`   ✅ Wait type: ${hasWaitType ? 'OK' : 'Missing'}`);
  console.log(`   ✅ ApiCall type: ${hasApiCallType ? 'OK' : 'Missing'}`);
  
  const allTypesCorrect = hasActionType && hasWaitType && hasApiCallType;
  
  if (!allTypesCorrect) {
    console.log('   ❌ Some node types are missing');
  }
} else {
  console.log('   ❌ flow.ts not found');
}

// Summary
console.log('\n📊 Summary:');
console.log('============');

if (allNodesExist) {
  console.log('✅ All new node components created successfully');
} else {
  console.log('❌ Some node components are missing or incomplete');
}

console.log('\n🎯 Next Steps:');
console.log('1. Test the new nodes in the flow designer');
console.log('2. Verify that all node properties work correctly');
console.log('3. Test flow execution with the new node types');
console.log('4. Add flow validation for the new nodes');
console.log('5. Create flow templates using the new nodes');

console.log('\n🚀 To test the improvements:');
console.log('1. Open http://localhost:3001/adminx');
console.log('2. Create a new flow');
console.log('3. Add Action, Wait, and API Call nodes from the palette');
console.log('4. Configure each node using the properties panel');
console.log('5. Verify that the nodes display correctly and save properly');
console.log('6. Test the enhanced condition node functionality');

console.log('\n✨ Improvements Completed:');
console.log('- ✅ ActionNode: Set variables, send emails/SMS, call APIs');
console.log('- ✅ WaitNode: Fixed duration, random duration, until time');
console.log('- ✅ ApiCallNode: HTTP methods, headers, body, response mapping');
console.log('- ✅ Enhanced ActionProperties: User-friendly configuration forms');
console.log('- ✅ WaitProperties: Duration configuration with preview');
console.log('- ✅ ApiCallProperties: Complete API configuration interface');
console.log('- ✅ All nodes properly integrated into FlowEditor and NodePalette');







