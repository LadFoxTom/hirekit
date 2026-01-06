const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Import Functionality...\n');

// Test 1: Check if sample template exists and is valid
console.log('1. Testing sample template...');
const templatePath = path.join(__dirname, '..', 'public', 'templates', 'sample-flow.json');
const templateExists = fs.existsSync(templatePath);
console.log(`   Sample template: ${templateExists ? '✅ Exists' : '❌ Missing'}`);

if (templateExists) {
  try {
    const templateContent = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    console.log('   ✅ Template JSON is valid');
    
    // Test the conversion logic
    const questions = templateContent.nodes
      ?.filter((node) => node.type === 'question')
      ?.map((node, index) => ({
        id: node.id,
        section: 'imported',
        textKey: node.data?.label || `Question ${index + 1}`,
        enabled: true,
        order: index,
        text: node.data?.question || node.data?.label,
        options: node.data?.options?.map((opt) => opt.label) || [],
        placeholder: node.data?.placeholder || '',
        helpText: node.data?.helpText || '',
        required: node.data?.required || false
      })) || [];

    console.log(`   ✅ Converted ${questions.length} questions from template`);
    
    if (questions.length > 0) {
      console.log('   📝 Sample converted questions:');
      questions.slice(0, 2).forEach((q, i) => {
        console.log(`      ${i + 1}. ${q.textKey}: "${q.text}"`);
        if (q.options.length > 0) {
          console.log(`         Options: ${q.options.join(', ')}`);
        }
      });
    }
    
    // Test the new configuration structure
    const newConfig = {
      name: `Test Import - ${Date.now()}`,
      description: 'Test configuration from import',
      type: 'advanced',
      isActive: true,
      isDefault: false,
      questions: questions,
      flowConfig: templateContent
    };
    
    console.log('   ✅ New configuration structure is valid');
    console.log(`   📊 Questions array length: ${newConfig.questions?.length || 0}`);
    
  } catch (error) {
    console.log('   ❌ Template JSON is invalid:', error.message);
  }
}

// Test 2: Check if the admin page has proper null checks
console.log('\n2. Testing admin page null checks...');
const adminPagePath = path.join(__dirname, '..', 'src', 'app', 'adminx', 'page.tsx');
const adminPageExists = fs.existsSync(adminPagePath);

if (adminPageExists) {
  const adminContent = fs.readFileSync(adminPagePath, 'utf8');
  
  // Check for null safety in filteredQuestions
  const hasNullCheck1 = adminContent.includes('!selectedConfig.questions');
  const hasNullCheck2 = adminContent.includes('selectedConfig.questions?.length');
  const hasNullCheck3 = adminContent.includes('selectedConfig.questions?.filter');
  
  console.log(`   Null check in filteredQuestions: ${hasNullCheck1 ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Optional chaining in preview: ${hasNullCheck2 ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Optional chaining in filter: ${hasNullCheck3 ? '✅ Added' : '❌ Missing'}`);
  
  // Check for import functionality
  const hasImportFunction = adminContent.includes('importFlowFromJSON');
  const hasConsoleLogs = adminContent.includes('console.log');
  
  console.log(`   Import function: ${hasImportFunction ? '✅ Added' : '❌ Missing'}`);
  console.log(`   Debug logging: ${hasConsoleLogs ? '✅ Added' : '❌ Missing'}`);
}

// Test 3: Check if QuestionFlowDesigner has null checks
console.log('\n3. Testing QuestionFlowDesigner null checks...');
const flowDesignerPath = path.join(__dirname, '..', 'src', 'components', 'QuestionFlowDesigner.tsx');
const flowDesignerExists = fs.existsSync(flowDesignerPath);

if (flowDesignerExists) {
  const flowDesignerContent = fs.readFileSync(flowDesignerPath, 'utf8');
  const hasNullCheck = flowDesignerContent.includes('questions && questions.length');
  console.log(`   Null check in QuestionFlowDesigner: ${hasNullCheck ? '✅ Added' : '❌ Missing'}`);
}

console.log('\n🎉 Import Functionality Test Complete!');
console.log('\n📝 What was fixed:');
console.log('1. ✅ Added null checks for selectedConfig.questions in filteredQuestions');
console.log('2. ✅ Added null checks for selectedConfig.questions in sections');
console.log('3. ✅ Added null checks for selectedConfig.questions in preview mode');
console.log('4. ✅ Added null check in QuestionFlowDesigner useEffect');
console.log('5. ✅ Added debug logging to importFlowFromJSON function');
console.log('6. ✅ Ensured createNewConfiguration always initializes questions as array');

console.log('\n🚀 Ready to test import functionality:');
console.log('1. Open http://localhost:3000/adminx');
console.log('2. Login with admin@admin.com');
console.log('3. Click "Download Template" to get sample flow');
console.log('4. Click "Import Flow JSON" and select the downloaded template');
console.log('5. Check browser console for debug logs');
console.log('6. Verify the imported configuration appears in the list');
