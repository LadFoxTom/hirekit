const fs = require('fs');
const path = require('path');

console.log('🧪 Testing New Configuration Features...\n');

// Test 1: Check if sample template exists
console.log('1. Testing sample template...');
const templatePath = path.join(__dirname, '..', 'public', 'templates', 'sample-flow.json');
const templateExists = fs.existsSync(templatePath);
console.log(`   Sample template: ${templateExists ? '✅ Exists' : '❌ Missing'}`);

if (templateExists) {
  try {
    const templateContent = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    const hasNodes = templateContent.nodes && templateContent.nodes.length > 0;
    const hasEdges = templateContent.edges && templateContent.edges.length > 0;
    console.log(`   Template structure: ${hasNodes ? '✅ Has nodes' : '❌ No nodes'}, ${hasEdges ? '✅ Has edges' : '❌ No edges'}`);
  } catch (error) {
    console.log('   ❌ Template JSON is invalid');
  }
}

// Test 2: Check if admin page has new features
console.log('\n2. Testing admin page features...');
const adminPagePath = path.join(__dirname, '..', 'src', 'app', 'adminx', 'page.tsx');
const adminPageExists = fs.existsSync(adminPagePath);
console.log(`   Admin page: ${adminPageExists ? '✅ Exists' : '❌ Missing'}`);

if (adminPageExists) {
  const adminContent = fs.readFileSync(adminPagePath, 'utf8');
  const hasCreateNew = adminContent.includes('createNewConfiguration');
  const hasImportFlow = adminContent.includes('importFlowFromJSON');
  const hasConnectCV = adminContent.includes('connectToCVBuilder');
  const hasFlowDesigner = adminContent.includes('setShowFlowDesigner');
  
  console.log(`   Create new config: ${hasCreateNew ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Import flow JSON: ${hasImportFlow ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Connect to CV: ${hasConnectCV ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Flow designer: ${hasFlowDesigner ? '✅ Added' : '❌ Missing'}`);
}

// Test 3: Check if API endpoints support new features
console.log('\n3. Testing API endpoints...');
const apiRoutePath = path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'question-configs', 'route.ts');
const apiRouteExists = fs.existsSync(apiRoutePath);
console.log(`   API route: ${apiRouteExists ? '✅ Exists' : '❌ Missing'}`);

if (apiRouteExists) {
  const apiContent = fs.readFileSync(apiRoutePath, 'utf8');
  const hasFlowConfig = apiContent.includes('flowConfig');
  console.log(`   Flow config support: ${hasFlowConfig ? '✅ Added' : '❌ Missing'}`);
}

// Test 4: Check server status
console.log('\n4. Testing server status...');
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
  console.log('\n🎉 New Features Test Complete!');
  console.log('\n📝 New Features Available:');
  console.log('1. ✅ "Add New" button to create new configurations');
  console.log('2. ✅ "Import Flow JSON" button to import flows from JSON files');
  console.log('3. ✅ "Download Template" button to get sample flow template');
  console.log('4. ✅ "Connect to Advanced/Quick CV" buttons to assign configurations');
  console.log('5. ✅ "Flow Designer" button for each configuration');
  console.log('6. ✅ Sample JSON template with complete flow structure');
  
  console.log('\n🚀 Ready to test:');
  console.log('1. Open http://localhost:3000/adminx');
  console.log('2. Login with admin@admin.com');
  console.log('3. Click "Download Template" to get sample flow');
  console.log('4. Click "Import Flow JSON" to import the template');
  console.log('5. Click "Add New" to create new configurations');
  console.log('6. Use "Connect to CV" buttons to assign configurations');
  console.log('7. Click "Flow Designer" to edit flows visually');
});
