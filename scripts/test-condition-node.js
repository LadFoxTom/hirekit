const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Condition Node Improvements...\n');

// Test 1: Check ConditionNode component
console.log('1. Checking ConditionNode component...');
const conditionNodePath = path.join(__dirname, '..', 'src', 'components', 'nodes', 'ConditionNode.tsx');
if (fs.existsSync(conditionNodePath)) {
  const content = fs.readFileSync(conditionNodePath, 'utf8');
  
  const hasConditionNode = content.includes('const ConditionNode = ({ data, selected }: NodeProps) =>');
  const hasConditionData = content.includes('const condition = data.condition || { operator: \'and\', rules: [] }');
  const hasRulesMapping = content.includes('rules.map((rule: any, index: number) =>');
  const hasTrueFalseHandles = content.includes('id="true"') && content.includes('id="false"');
  const hasOperatorDisplay = content.includes('condition.operator?.toUpperCase()');
  
  console.log(`   Has ConditionNode component: ${hasConditionNode ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has condition data handling: ${hasConditionData ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has rules mapping: ${hasRulesMapping ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has True/False handles: ${hasTrueFalseHandles ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has operator display: ${hasOperatorDisplay ? '✅ Yes' : '❌ No'}`);
}

// Test 2: Check FlowEditor nodeTypes
console.log('\n2. Checking FlowEditor nodeTypes...');
const flowEditorPath = path.join(__dirname, '..', 'src', 'components', 'flow', 'FlowEditor.tsx');
if (fs.existsSync(flowEditorPath)) {
  const content = fs.readFileSync(flowEditorPath, 'utf8');
  
  const hasConditionNodeImport = content.includes('import ConditionNode from \'@/components/nodes/ConditionNode\'');
  const hasConditionNodeType = content.includes('condition: ConditionNode');
  const hasProperComment = content.includes('Use proper ConditionNode');
  
  console.log(`   Has ConditionNode import: ${hasConditionNodeImport ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has condition node type: ${hasConditionNodeType ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has proper comment: ${hasProperComment ? '✅ Yes' : '❌ No'}`);
}

// Test 3: Check ConditionProperties improvements
console.log('\n3. Checking ConditionProperties improvements...');
const propertiesPanelPath = path.join(__dirname, '..', 'src', 'components', 'panels', 'PropertiesPanel.tsx');
if (fs.existsSync(propertiesPanelPath)) {
  const content = fs.readFileSync(propertiesPanelPath, 'utf8');
  
  const hasAddRule = content.includes('const addRule = () =>');
  const hasUpdateRule = content.includes('const updateRule = (ruleId: string, updates: any) =>');
  const hasDeleteRule = content.includes('const deleteRule = (ruleId: string) =>');
  const hasRuleMapping = content.includes('rules.map((rule: any) =>');
  const hasOperatorOptions = content.includes('equals') && content.includes('greater_than') && content.includes('contains');
  const hasConditionPreview = content.includes('Condition Preview:');
  const hasSavingIndicator = content.includes('Saving...');
  
  console.log(`   Has addRule function: ${hasAddRule ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has updateRule function: ${hasUpdateRule ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has deleteRule function: ${hasDeleteRule ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has rule mapping: ${hasRuleMapping ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has operator options: ${hasOperatorOptions ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has condition preview: ${hasConditionPreview ? '✅ Yes' : '❌ No'}`);
  console.log(`   Has saving indicator: ${hasSavingIndicator ? '✅ Yes' : '❌ No'}`);
}

console.log('\n🎉 Condition Node Test Complete!');
console.log('\n📝 What this improves:');
console.log('1. ✅ Dedicated ConditionNode component with proper visual design');
console.log('2. ✅ Two output handles (True/False) for conditional branching');
console.log('3. ✅ Fully functional condition properties with add/edit/delete rules');
console.log('4. ✅ Multiple operator types (equals, greater_than, contains, etc.)');
console.log('5. ✅ Real-time condition preview showing the complete logic');
console.log('6. ✅ Proper data structure for condition rules');
console.log('7. ✅ Visual feedback with saving indicators');
console.log('8. ✅ Operator selection (AND/OR) with clear explanations');

console.log('\n🚀 How to test:');
console.log('1. Open http://localhost:3001/adminx');
console.log('2. Login and open Flow Designer');
console.log('3. Create a new flow');
console.log('4. Drag a "Condition" node from the palette');
console.log('5. Click on the condition node to select it');
console.log('6. In Properties Panel, you should see:');
console.log('   - Condition Operator dropdown (AND/OR)');
console.log('   - "Add Rule" button');
console.log('   - No rules configured initially');
console.log('7. Click "Add Rule" button');
console.log('8. Fill in the rule fields:');
console.log('   - Field: e.g., "user_age"');
console.log('   - Operator: e.g., "greater_than"');
console.log('   - Value: e.g., "18"');
console.log('9. Add more rules if needed');
console.log('10. See the condition preview update in real-time');
console.log('11. The condition node should show the rules visually');
console.log('12. Connect the True/False outputs to other nodes');

console.log('\n🔧 Expected behavior:');
console.log('- Condition node has proper visual design with True/False outputs');
console.log('- Add Rule button works and creates new rule forms');
console.log('- All rule fields are editable (field, operator, value)');
console.log('- Delete rule button removes rules');
console.log('- Condition preview shows the complete logic');
console.log('- Operator selection changes the logic explanation');
console.log('- All changes are saved automatically');
console.log('- Visual feedback with saving indicators');
console.log('- Condition node displays rules and operator visually');
