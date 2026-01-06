const fs = require('fs');
const path = require('path');

console.log('🧪 Simple Flow Designer Test...\n');

// Test 1: Check if components exist
console.log('1. Testing component files...');
const components = [
  'src/components/flow/FlowEditor.tsx',
  'src/components/panels/NodePalette.tsx',
  'src/components/panels/PropertiesPanel.tsx',
  'src/components/nodes/QuestionNode.tsx',
  'src/components/nodes/StartNode.tsx',
  'src/components/nodes/EndNode.tsx',
  'src/stores/flowStore.ts',
  'src/types/flow.ts'
];

let allComponentsExist = true;
components.forEach(component => {
  const exists = fs.existsSync(path.join(__dirname, '..', component));
  console.log(`   ${component}: ${exists ? '✅ Exists' : '❌ Missing'}`);
  if (!exists) allComponentsExist = false;
});

// Test 2: Check package.json for dependencies
console.log('\n2. Testing dependencies...');
try {
  const packageJson = require('../package.json');
  const hasReactFlow = packageJson.dependencies && packageJson.dependencies.reactflow;
  const hasZustand = packageJson.dependencies && packageJson.dependencies.zustand;
  const hasImmer = packageJson.dependencies && packageJson.dependencies.immer;
  
  console.log(`   React Flow: ${hasReactFlow ? '✅ Installed' : '❌ Missing'}`);
  console.log(`   Zustand: ${hasZustand ? '✅ Installed' : '❌ Missing'}`);
  console.log(`   Immer: ${hasImmer ? '✅ Installed' : '❌ Missing'}`);
  
  if (hasReactFlow && hasZustand && hasImmer) {
    console.log('   ✅ All required dependencies are installed');
  } else {
    console.log('   ❌ Missing required dependencies');
  }
} catch (error) {
  console.log('   ❌ Could not check dependencies:', error.message);
}

// Test 3: Check if server is running
console.log('\n3. Testing server status...');
const net = require('net');
const testConnection = () => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      console.log('   ✅ Server is running on port 3000');
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.log('   ❌ Server connection timeout');
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      console.log('   ❌ Server not accessible');
      resolve(false);
    });
    
    socket.connect(3000, 'localhost');
  });
};

testConnection().then(() => {
  console.log('\n🎉 Flow Designer Test Complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. Open http://localhost:3000/adminx in your browser');
  console.log('2. Login with admin@admin.com');
  console.log('3. Click "Flow Designer" button');
  console.log('4. Verify no infinite loop errors occur');
  console.log('5. Test drag & drop functionality');
  
  if (allComponentsExist) {
    console.log('\n✅ All components are ready!');
  } else {
    console.log('\n⚠️  Some components are missing. Please check the file structure.');
  }
});
