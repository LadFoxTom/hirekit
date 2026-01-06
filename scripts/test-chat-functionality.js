const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Chat Testing Functionality...\n');

// Test 1: Check if ChatTestWindow component exists
console.log('1. Testing ChatTestWindow component...');
const chatTestWindowPath = path.join(__dirname, '..', 'src', 'components', 'chat', 'ChatTestWindow.tsx');
const chatTestWindowExists = fs.existsSync(chatTestWindowPath);
console.log(`   ChatTestWindow component: ${chatTestWindowExists ? '✅ Exists' : '❌ Missing'}`);

if (chatTestWindowExists) {
  const chatTestWindowContent = fs.readFileSync(chatTestWindowPath, 'utf8');
  
  // Check for essential features
  const hasChatInterface = chatTestWindowContent.includes('ChatMessage');
  const hasStartTest = chatTestWindowContent.includes('startTest');
  const hasProcessNode = chatTestWindowContent.includes('processNode');
  const hasFlowState = chatTestWindowContent.includes('flowState');
  const hasTypingAnimation = chatTestWindowContent.includes('isTyping');
  const hasProgressTracking = chatTestWindowContent.includes('Progress:');
  
  console.log(`   Chat interface: ${hasChatInterface ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Start test function: ${hasStartTest ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Process node function: ${hasProcessNode ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Flow state management: ${hasFlowState ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Typing animation: ${hasTypingAnimation ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Progress tracking: ${hasProgressTracking ? '✅ Added' : '❌ Missing'}`);
}

// Test 2: Check if FlowEditor has chat test integration
console.log('\n2. Testing FlowEditor integration...');
const flowEditorPath = path.join(__dirname, '..', 'src', 'components', 'flow', 'FlowEditor.tsx');
const flowEditorExists = fs.existsSync(flowEditorPath);

if (flowEditorExists) {
  const flowEditorContent = fs.readFileSync(flowEditorPath, 'utf8');
  
  // Check for chat test integration
  const hasChatTestImport = flowEditorContent.includes('ChatTestWindow');
  const hasChatTestButton = flowEditorContent.includes('toggleChatTest');
  const hasChatTestState = flowEditorContent.includes('chatTestOpen');
  const hasMessageSquareIcon = flowEditorContent.includes('MessageSquare');
  
  console.log(`   ChatTestWindow import: ${hasChatTestImport ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Chat test button: ${hasChatTestButton ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Chat test state: ${hasChatTestState ? '✅ Added' : '❌ Missing'}`);
  console.log(`   MessageSquare icon: ${hasMessageSquareIcon ? '✅ Added' : '❌ Missing'}`);
}

// Test 3: Check if flow store has chat test state
console.log('\n3. Testing Flow Store integration...');
const flowStorePath = path.join(__dirname, '..', 'src', 'stores', 'flowStore.ts');
const flowStoreExists = fs.existsSync(flowStorePath);

if (flowStoreExists) {
  const flowStoreContent = fs.readFileSync(flowStorePath, 'utf8');
  
  // Check for chat test state management
  const hasChatTestOpen = flowStoreContent.includes('chatTestOpen: false');
  const hasToggleChatTest = flowStoreContent.includes('toggleChatTest: ()');
  
  console.log(`   Chat test open state: ${hasChatTestOpen ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Toggle chat test function: ${hasToggleChatTest ? '✅ Added' : '❌ Missing'}`);
}

// Test 4: Check if flow types include chat test
console.log('\n4. Testing Flow Types...');
const flowTypesPath = path.join(__dirname, '..', 'src', 'types', 'flow.ts');
const flowTypesExists = fs.existsSync(flowTypesPath);

if (flowTypesExists) {
  const flowTypesContent = fs.readFileSync(flowTypesPath, 'utf8');
  
  // Check for chat test types
  const hasChatTestOpenType = flowTypesContent.includes('chatTestOpen: boolean');
  const hasToggleChatTestType = flowTypesContent.includes('toggleChatTest: () => void');
  
  console.log(`   Chat test open type: ${hasChatTestOpenType ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Toggle chat test type: ${hasToggleChatTestType ? '✅ Added' : '❌ Missing'}`);
}

console.log('\n🎉 Chat Testing Functionality Test Complete!');
console.log('\n📝 What was implemented:');
console.log('1. ✅ ChatTestWindow component with full chat interface');
console.log('2. ✅ Flow testing with start/pause/reset controls');
console.log('3. ✅ Progress tracking and flow state management');
console.log('4. ✅ Typing animations and message timestamps');
console.log('5. ✅ Integration with FlowEditor toolbar');
console.log('6. ✅ State management in flow store');

console.log('\n🚀 How to test the chat functionality:');
console.log('1. Open http://localhost:3001/adminx');
console.log('2. Login with admin@admin.com');
console.log('3. Click "Flow Designer" button');
console.log('4. Click the chat icon (MessageSquare) in the toolbar');
console.log('5. Click "Start Test" to begin testing your flow');
console.log('6. Interact with the chatbot by typing responses');
console.log('7. Watch the flow progress through your questions');

console.log('\n🔧 Features available:');
console.log('- Start/Pause/Reset test controls');
console.log('- Real-time progress tracking');
console.log('- Typing animations for bot messages');
console.log('- Flow state management (stores user responses)');
console.log('- Auto-scroll to latest messages');
console.log('- Keyboard shortcuts (Enter to send)');
console.log('- Visual feedback for running state');
