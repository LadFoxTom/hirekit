const fetch = require('node-fetch');

async function testAdminAPI() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('Testing Admin API endpoints...\n');

  try {
    // Test 1: Check if admin page is accessible
    console.log('1. Testing admin page accessibility...');
    const pageResponse = await fetch(`${baseUrl}/adminx`);
    console.log(`   Status: ${pageResponse.status}`);
    console.log(`   OK: ${pageResponse.ok}\n`);

    // Test 2: Test question configs endpoint (should return 401 without auth)
    console.log('2. Testing question configs endpoint (unauthorized)...');
    const configsResponse = await fetch(`${baseUrl}/api/admin/question-configs`);
    console.log(`   Status: ${configsResponse.status}`);
    console.log(`   Expected: 401 (Unauthorized)`);
    console.log(`   Actual: ${configsResponse.status}\n`);

    // Test 3: Test active questions endpoint
    console.log('3. Testing active questions endpoint...');
    const activeResponse = await fetch(`${baseUrl}/api/questions/active?type=advanced`);
    console.log(`   Status: ${activeResponse.status}`);
    if (activeResponse.ok) {
      const data = await activeResponse.json();
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    } else {
      console.log(`   Error: ${activeResponse.statusText}`);
    }
    console.log('');

    // Test 4: Test simplified questions endpoint
    console.log('4. Testing simplified questions endpoint...');
    const simplifiedResponse = await fetch(`${baseUrl}/api/questions/active?type=simplified`);
    console.log(`   Status: ${simplifiedResponse.status}`);
    if (simplifiedResponse.ok) {
      const data = await simplifiedResponse.json();
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    } else {
      console.log(`   Error: ${simplifiedResponse.statusText}`);
    }

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testAdminAPI();
