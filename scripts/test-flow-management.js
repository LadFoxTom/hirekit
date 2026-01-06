// Test script for flow management functionality
console.log('Testing Flow Management Implementation...\n');

// Test 1: Check if admin page has flow management tabs
console.log('1. Testing Admin Page Flow Management Tabs...');
const adminPagePath = './src/app/adminx/page.tsx';
const fs = require('fs');

if (fs.existsSync(adminPagePath)) {
  const content = fs.readFileSync(adminPagePath, 'utf8');
  
  const hasFlowManagementTab = content.includes('Flow Management');
  const hasFlowListState = content.includes('showFlowList');
  const hasFlowsState = content.includes('flows, setFlows');
  const hasLoadFlowsFunction = content.includes('loadFlows');
  const hasOpenFlowFunction = content.includes('openFlow');
  const hasDeleteFlowFunction = content.includes('deleteFlow');
  
  console.log(`   Flow Management Tab: ${hasFlowManagementTab ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Flow List State: ${hasFlowListState ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Flows State: ${hasFlowsState ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Load Flows Function: ${hasLoadFlowsFunction ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Open Flow Function: ${hasOpenFlowFunction ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Delete Flow Function: ${hasDeleteFlowFunction ? '✅ Added' : '❌ Missing'}`);
} else {
  console.log('   ❌ Admin page not found');
}

// Test 2: Check if QuestionFlowDesigner supports existing flows
console.log('\n2. Testing QuestionFlowDesigner Existing Flow Support...');
const questionFlowDesignerPath = './src/components/QuestionFlowDesigner.tsx';

if (fs.existsSync(questionFlowDesignerPath)) {
  const content = fs.readFileSync(questionFlowDesignerPath, 'utf8');
  
  const hasExistingFlowProp = content.includes('existingFlow?: any');
  const hasExistingFlowLogic = content.includes('existingFlow && !isInitialized');
  const hasImportFlowCall = content.includes('importFlow(JSON.stringify(existingFlow.data))');
  
  console.log(`   Existing Flow Prop: ${hasExistingFlowProp ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Existing Flow Logic: ${hasExistingFlowLogic ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Import Flow Call: ${hasImportFlowCall ? '✅ Added' : '❌ Missing'}`);
} else {
  console.log('   ❌ QuestionFlowDesigner not found');
}

// Test 3: Check if FlowEditor has load flow functionality
console.log('\n3. Testing FlowEditor Load Flow Functionality...');
const flowEditorPath = './src/components/flow/FlowEditor.tsx';

if (fs.existsSync(flowEditorPath)) {
  const content = fs.readFileSync(flowEditorPath, 'utf8');
  
  const hasLoadFlowButton = content.includes('Load Flow');
  const hasLoadFlowFunction = content.includes('loadFlow');
  const hasLoadFlowImport = content.includes('loadFlow,');
  
  console.log(`   Load Flow Button: ${hasLoadFlowButton ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Load Flow Function: ${hasLoadFlowFunction ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Load Flow Import: ${hasLoadFlowImport ? '✅ Added' : '❌ Missing'}`);
} else {
  console.log('   ❌ FlowEditor not found');
}

// Test 4: Check if flow store has loadFlow function
console.log('\n4. Testing Flow Store Load Flow Function...');
const flowStorePath = './src/stores/flowStore.ts';

if (fs.existsSync(flowStorePath)) {
  const content = fs.readFileSync(flowStorePath, 'utf8');
  
  const hasLoadFlowFunction = content.includes('loadFlow: async (id: string)');
  const hasLoadFlowsFunction = content.includes('loadFlows: async ()');
  
  console.log(`   Load Flow Function: ${hasLoadFlowFunction ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Load Flows Function: ${hasLoadFlowsFunction ? '✅ Added' : '❌ Missing'}`);
} else {
  console.log('   ❌ Flow store not found');
}

console.log('\n=== Flow Management Tests Completed ===');
console.log('\nNext Steps:');
console.log('1. Open http://localhost:3000/adminx in your browser');
console.log('2. Click on the "Flow Management" tab');
console.log('3. Try creating a new flow or opening an existing one');
console.log('4. Test the flow designer with existing flows');
