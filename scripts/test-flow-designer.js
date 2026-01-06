const fetch = require('node-fetch');

async function testFlowDesigner() {
  console.log('🧪 Testing Flow Designer Components...\n');

  try {
    // Test 1: Check if admin page loads
    console.log('1. Testing admin page accessibility...');
    const adminResponse = await fetch('http://localhost:3000/adminx');
    console.log(`   Admin page status: ${adminResponse.status}`);
    
    if (adminResponse.status === 200) {
      console.log('   ✅ Admin page is accessible');
    } else {
      console.log('   ⚠️  Admin page returned non-200 status');
    }

    // Test 2: Check if API endpoints are available
    console.log('\n2. Testing API endpoints...');
    const apiResponse = await fetch('http://localhost:3000/api/admin/question-configs');
    console.log(`   API status: ${apiResponse.status}`);
    
    if (apiResponse.status === 401) {
      console.log('   ✅ API is protected (requires authentication)');
    } else if (apiResponse.status === 200) {
      console.log('   ⚠️  API returned data (might be public)');
    } else {
      console.log('   ❌ API endpoint issue');
    }

    // Test 3: Check if React Flow dependencies are available
    console.log('\n3. Testing React Flow dependencies...');
    try {
      const packageJson = require('../package.json');
      const hasReactFlow = packageJson.dependencies && packageJson.dependencies.reactflow;
      const hasZustand = packageJson.dependencies && packageJson.dependencies.zustand;
      
      console.log(`   React Flow: ${hasReactFlow ? '✅ Installed' : '❌ Missing'}`);
      console.log(`   Zustand: ${hasZustand ? '✅ Installed' : '❌ Missing'}`);
      
      if (hasReactFlow && hasZustand) {
        console.log('   ✅ All required dependencies are installed');
      } else {
        console.log('   ❌ Missing required dependencies');
      }
    } catch (error) {
      console.log('   ❌ Could not check dependencies');
    }

    // Test 4: Check if components exist
    console.log('\n4. Testing component files...');
    const fs = require('fs');
    const path = require('path');
    
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
    
    components.forEach(component => {
      const exists = fs.existsSync(path.join(__dirname, '..', component));
      console.log(`   ${component}: ${exists ? '✅ Exists' : '❌ Missing'}`);
    });

    console.log('\n🎉 Flow Designer Test Complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Open http://localhost:3000/adminx in your browser');
    console.log('2. Login with admin@admin.com');
    console.log('3. Click "Flow Designer" button');
    console.log('4. Verify no infinite loop errors occur');
    console.log('5. Test drag & drop functionality');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFlowDesigner();
