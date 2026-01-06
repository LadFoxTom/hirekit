// Test script for complete flow execution
console.log('Testing complete flow execution...\n');

// Mock flow data (from user's JSON)
const mockFlow = {
  nodes: [
    {
      id: "9kmtnsb0p",
      type: "start",
      data: { label: "Start", description: "Flow begins here" }
    },
    {
      id: "kncxlauu9",
      type: "question",
      data: { question: "A of B?", variableName: "ab" }
    },
    {
      id: "8av61o3hh",
      type: "condition",
      data: {
        condition: {
          operator: "or",
          rules: [
            {
              field: "ab",
              operator: "equals",
              value: "A"
            }
          ]
        }
      }
    },
    {
      id: "4btmas1cc",
      type: "question",
      data: { question: "Wrm A", variableName: "wrma" }
    },
    {
      id: "xi0wdyxhn",
      type: "question",
      data: { question: "Wrm B?", variableName: "wrmb" }
    }
  ],
  edges: [
    {
      source: "9kmtnsb0p",
      target: "kncxlauu9"
    },
    {
      source: "kncxlauu9",
      target: "8av61o3hh"
    },
    {
      source: "8av61o3hh",
      sourceHandle: "true",
      target: "4btmas1cc"
    },
    {
      source: "8av61o3hh",
      sourceHandle: "false",
      target: "xi0wdyxhn"
    }
  ]
};

// Function to evaluate condition rules
const evaluateCondition = (condition, flowState) => {
  if (!condition || !condition.rules || condition.rules.length === 0) {
    return true;
  }

  const operator = condition.operator || 'and';
  const results = condition.rules.map((rule) => {
    const fieldValue = flowState[rule.field];
    const ruleValue = rule.value;

    switch (rule.operator) {
      case 'equals':
        return String(fieldValue).trim().toLowerCase() === String(ruleValue).trim().toLowerCase();
      case 'not_equals':
        return String(fieldValue).trim().toLowerCase() !== String(ruleValue).trim().toLowerCase();
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

  return operator === 'and' 
    ? results.every(result => result === true)
    : results.some(result => result === true);
};

// Function to find next node (copied from ChatTestWindow)
const findNextNode = (currentNodeId, flowState) => {
  const currentNode = mockFlow.nodes.find(node => node.id === currentNodeId);
  if (!currentNode) return null;

  console.log(`Finding next node from: ${currentNode.type} (${currentNodeId})`);

  if (currentNode.type === 'condition') {
    const condition = currentNode.data?.condition;
    const isConditionTrue = evaluateCondition(condition, flowState);
    
    const targetHandle = isConditionTrue ? 'true' : 'false';
    console.log(`  Condition evaluated to: ${isConditionTrue} (${targetHandle})`);
    
    const edge = mockFlow.edges.find(edge => 
      edge.source === currentNodeId && edge.sourceHandle === targetHandle
    );
    
    if (edge) {
      const nextNode = mockFlow.nodes.find(node => node.id === edge.target);
      console.log(`  Next node: ${nextNode.data.question || nextNode.data.label}`);
      return nextNode;
    }
  } else {
    const edge = mockFlow.edges.find(edge => edge.source === currentNodeId);
    if (edge) {
      const nextNode = mockFlow.nodes.find(node => node.id === edge.target);
      console.log(`  Next node: ${nextNode.data.question || nextNode.data.label}`);
      return nextNode;
    }
  }
  
  return null;
};

// Test scenarios
const testScenarios = [
  {
    name: 'User responds "A"',
    userInput: 'A',
    expectedPath: ['Start', 'A of B?', 'Wrm A'],
    expectedConditionResult: true
  },
  {
    name: 'User responds "B"',
    userInput: 'B',
    expectedPath: ['Start', 'A of B?', 'Wrm B?'],
    expectedConditionResult: false
  }
];

// Run flow simulation
testScenarios.forEach((scenario, index) => {
  console.log(`\n=== Test Scenario ${index + 1}: ${scenario.name} ===`);
  
  let flowState = {};
  let currentNodeId = "9kmtnsb0p"; // Start node
  let actualPath = [];
  
  // Step 1: Start to first question
  let node = mockFlow.nodes.find(n => n.id === currentNodeId);
  actualPath.push(node.data.label);
  console.log(`1. ${node.data.label}`);
  
  // Step 2: First question
  currentNodeId = "kncxlauu9";
  node = mockFlow.nodes.find(n => n.id === currentNodeId);
  actualPath.push(node.data.question);
  console.log(`2. ${node.data.question}`);
  
  // Step 3: Store user input
  flowState[node.data.variableName] = scenario.userInput;
  console.log(`   User input: "${scenario.userInput}"`);
  console.log(`   Flow state:`, flowState);
  
  // Step 4: Condition evaluation
  currentNodeId = "8av61o3hh";
  node = mockFlow.nodes.find(n => n.id === currentNodeId);
  const condition = node.data.condition;
  const conditionResult = evaluateCondition(condition, flowState);
  console.log(`3. Condition evaluation: ${conditionResult} (expected: ${scenario.expectedConditionResult})`);
  
  // Step 5: Find next node based on condition
  const nextNode = findNextNode(currentNodeId, flowState);
  if (nextNode) {
    actualPath.push(nextNode.data.question);
    console.log(`4. Next question: ${nextNode.data.question}`);
  }
  
  // Verify results
  const conditionCorrect = conditionResult === scenario.expectedConditionResult;
  const pathCorrect = JSON.stringify(actualPath) === JSON.stringify(scenario.expectedPath);
  
  console.log(`\nResults:`);
  console.log(`  Condition evaluation: ${conditionCorrect ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Flow path: ${pathCorrect ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Expected path: [${scenario.expectedPath.join(' → ')}]`);
  console.log(`  Actual path: [${actualPath.join(' → ')}]`);
});

console.log('\n=== Flow execution tests completed! ===');
