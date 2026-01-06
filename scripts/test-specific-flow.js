// Test script for the specific flow condition evaluation
console.log('Testing specific flow condition evaluation...\n');

// Function to evaluate condition rules (copied from ChatTestWindow)
const evaluateCondition = (condition, flowState) => {
  if (!condition || !condition.rules || condition.rules.length === 0) {
    return true; // No rules means always true
  }

  const operator = condition.operator || 'and';
  console.log('Evaluating condition with operator:', operator);
  
  const results = condition.rules.map((rule) => {
    const fieldValue = flowState[rule.field];
    const ruleValue = rule.value;

    console.log(`  Rule: ${rule.field} ${rule.operator} ${ruleValue}`);
    console.log(`  Field value: "${fieldValue}"`);

    let result = false;
    switch (rule.operator) {
      case 'equals':
        result = String(fieldValue).trim().toLowerCase() === String(ruleValue).trim().toLowerCase();
        break;
      case 'not_equals':
        result = String(fieldValue).trim().toLowerCase() !== String(ruleValue).trim().toLowerCase();
        break;
      case 'contains':
        result = String(fieldValue).includes(String(ruleValue));
        break;
      case 'greater_than':
        result = Number(fieldValue) > Number(ruleValue);
        break;
      case 'less_than':
        result = Number(fieldValue) < Number(ruleValue);
        break;
      case 'starts_with':
        result = String(fieldValue).toLowerCase().startsWith(String(ruleValue).toLowerCase());
        break;
      case 'ends_with':
        result = String(fieldValue).toLowerCase().endsWith(String(ruleValue).toLowerCase());
        break;
      case 'is_empty':
        result = !fieldValue || String(fieldValue).trim() === '';
        break;
      case 'is_not_empty':
        result = fieldValue && String(fieldValue).trim() !== '';
        break;
      case 'in_list':
        const listValues = String(ruleValue).split(',').map(v => v.trim().toLowerCase());
        result = listValues.includes(String(fieldValue).trim().toLowerCase());
        break;
      case 'not_in_list':
        const notListValues = String(ruleValue).split(',').map(v => v.trim().toLowerCase());
        result = !notListValues.includes(String(fieldValue).trim().toLowerCase());
        break;
      default:
        result = false;
    }
    
    console.log(`  Rule result: ${result}`);
    return result;
  });

  const finalResult = operator === 'and' 
    ? results.every(result => result === true)
    : results.some(result => result === true);
    
  console.log(`  Final result (${operator}): ${finalResult}`);
  return finalResult;
};

// Test the specific condition from the user's flow
const userCondition = {
  "operator": "or",
  "rules": [
    {
      "id": "rule-1756741128632",
      "field": "ab",
      "operator": "equals",
      "value": "A"
    }
  ]
};

console.log('Testing user flow condition:');
console.log('Condition:', JSON.stringify(userCondition, null, 2));

// Test cases
const testCases = [
  {
    name: 'User responds "A" - should be TRUE',
    flowState: { ab: 'A' },
    expected: true
  },
  {
    name: 'User responds "B" - should be FALSE',
    flowState: { ab: 'B' },
    expected: false
  },
  {
    name: 'User responds "a" (lowercase) - should be FALSE',
    flowState: { ab: 'a' },
    expected: false
  },
  {
    name: 'User responds "C" - should be FALSE',
    flowState: { ab: 'C' },
    expected: false
  }
];

// Run tests
testCases.forEach((test, index) => {
  console.log(`\nTest ${index + 1}: ${test.name}`);
  console.log('Flow state:', test.flowState);
  const result = evaluateCondition(userCondition, test.flowState);
  const passed = result === test.expected;
  console.log(`Result: ${result}, Expected: ${test.expected} - ${passed ? '✅ PASS' : '❌ FAIL'}`);
});

console.log('\nCondition evaluation tests completed!');
