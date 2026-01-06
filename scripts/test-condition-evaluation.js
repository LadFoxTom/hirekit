// Test script for condition evaluation logic
console.log('Testing condition evaluation logic...\n');

// Function to evaluate condition rules (copied from ChatTestWindow)
const evaluateCondition = (condition, flowState) => {
  if (!condition || !condition.rules || condition.rules.length === 0) {
    return true; // No rules means always true
  }

  const operator = condition.operator || 'and';
  const results = condition.rules.map((rule) => {
    const fieldValue = flowState[rule.field];
    const ruleValue = rule.value;

    console.log(`  Evaluating rule: ${rule.field} ${rule.operator} ${ruleValue}`);
    console.log(`  Field value: "${fieldValue}"`);

    switch (rule.operator) {
      case 'equals':
        const equalsResult = String(fieldValue).trim().toLowerCase() === String(ruleValue).trim().toLowerCase();
        console.log(`  Result: ${equalsResult}`);
        return equalsResult;
      case 'not_equals':
        return fieldValue !== ruleValue;
      case 'contains':
        return String(fieldValue).includes(String(ruleValue));
      case 'greater_than':
        return Number(fieldValue) > Number(ruleValue);
      case 'less_than':
        return Number(fieldValue) < Number(ruleValue);
      case 'starts_with':
        return String(fieldValue).toLowerCase().startsWith(String(ruleValue).toLowerCase());
      case 'ends_with':
        return String(fieldValue).toLowerCase().endsWith(String(ruleValue).toLowerCase());
      case 'is_empty':
        return !fieldValue || String(fieldValue).trim() === '';
      case 'is_not_empty':
        return fieldValue && String(fieldValue).trim() !== '';
      case 'in_list':
        const listValues = String(ruleValue).split(',').map(v => v.trim().toLowerCase());
        return listValues.includes(String(fieldValue).trim().toLowerCase());
      case 'not_in_list':
        const notListValues = String(ruleValue).split(',').map(v => v.trim().toLowerCase());
        return !notListValues.includes(String(fieldValue).trim().toLowerCase());
      default:
        return false;
    }
  });

  const finalResult = operator === 'and' 
    ? results.every(result => result === true)
    : results.some(result => result === true);
    
  console.log(`  Final result (${operator}): ${finalResult}\n`);
  return finalResult;
};

// Test cases based on the JSON flow
const testCases = [
  {
    name: 'Test 1: hay equals "good" - should be TRUE',
    condition: {
      operator: 'and',
      rules: [
        {
          id: 'rule-1756738400902',
          field: 'hay',
          operator: 'equals',
          value: 'good'
        }
      ]
    },
    flowState: { hay: 'good' },
    expected: true
  },
  {
    name: 'Test 2: hay equals "good" but hay is "bad" - should be FALSE',
    condition: {
      operator: 'and',
      rules: [
        {
          id: 'rule-1756738400902',
          field: 'hay',
          operator: 'equals',
          value: 'good'
        }
      ]
    },
    flowState: { hay: 'bad' },
    expected: false
  },
  {
    name: 'Test 3: hay equals "good" but hay is "BAD" (case sensitive) - should be FALSE',
    condition: {
      operator: 'and',
      rules: [
        {
          id: 'rule-1756738400902',
          field: 'hay',
          operator: 'equals',
          value: 'good'
        }
      ]
    },
    flowState: { hay: 'BAD' },
    expected: false
  },
  {
    name: 'Test 4: Multiple rules with AND - both must be true',
    condition: {
      operator: 'and',
      rules: [
        {
          field: 'hay',
          operator: 'equals',
          value: 'good'
        },
        {
          field: 'name',
          operator: 'equals',
          value: 'john'
        }
      ]
    },
    flowState: { hay: 'good', name: 'john' },
    expected: true
  },
  {
    name: 'Test 5: Multiple rules with AND - one false',
    condition: {
      operator: 'and',
      rules: [
        {
          field: 'hay',
          operator: 'equals',
          value: 'good'
        },
        {
          field: 'name',
          operator: 'equals',
          value: 'john'
        }
      ]
    },
    flowState: { hay: 'good', name: 'jane' },
    expected: false
  }
];

// Run tests
testCases.forEach((test, index) => {
  console.log(`Test ${index + 1}: ${test.name}`);
  const result = evaluateCondition(test.condition, test.flowState);
  const passed = result === test.expected;
  console.log(`Result: ${result}, Expected: ${test.expected} - ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('---');
});

console.log('Condition evaluation tests completed!');
