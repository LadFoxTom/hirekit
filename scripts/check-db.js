const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking QuestionConfiguration data...');

db.all("SELECT id, name, type, questions FROM QuestionConfiguration LIMIT 3", (err, rows) => {
  if (err) {
    console.error('Error getting data:', err);
    db.close();
    return;
  }
  
  console.log('\nQuestionConfiguration data:');
  rows.forEach((row, index) => {
    console.log(`\n${index + 1}. Configuration: ${row.name} (${row.type})`);
    console.log(`   ID: ${row.id}`);
    
    try {
      const questions = JSON.parse(row.questions);
      console.log(`   Questions count: ${questions.length}`);
      
      // Show first few questions with their content
      questions.slice(0, 3).forEach((q, qIndex) => {
        console.log(`   Question ${qIndex + 1}:`);
        console.log(`     ID: ${q.id}`);
        console.log(`     TextKey: ${q.textKey}`);
        console.log(`     Text: ${q.text || 'NULL'}`);
        console.log(`     Options: ${q.options ? JSON.stringify(q.options) : 'NULL'}`);
        console.log(`     Placeholder: ${q.placeholder || 'NULL'}`);
        console.log(`     HelpText: ${q.helpText || 'NULL'}`);
      });
    } catch (parseError) {
      console.log(`   Error parsing questions JSON: ${parseError.message}`);
      console.log(`   Raw questions data: ${row.questions}`);
    }
  });
  
  db.close();
});
