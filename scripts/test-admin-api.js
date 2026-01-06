const fetch = require('node-fetch');

async function testAdminAPI() {
  try {
    console.log('Testing admin API endpoint...');
    
    const response = await fetch('http://localhost:3002/api/admin/question-configs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:');
      console.log(JSON.stringify(data, null, 2));
      
      // Check if questions have text content
      if (data && data.length > 0) {
        const config = data[0];
        console.log('\nFirst configuration:', config.name);
        console.log('Questions count:', config.questions.length);
        
        if (config.questions.length > 0) {
          const firstQuestion = config.questions[0];
          console.log('\nFirst question:');
          console.log('ID:', firstQuestion.id);
          console.log('TextKey:', firstQuestion.textKey);
          console.log('Text:', firstQuestion.text);
          console.log('Placeholder:', firstQuestion.placeholder);
          console.log('HelpText:', firstQuestion.helpText);
        }
      }
    } else {
      console.log('Error response:', await response.text());
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAdminAPI();
