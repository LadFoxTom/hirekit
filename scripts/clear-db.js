const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new sqlite3.Database(dbPath);

console.log('Clearing QuestionConfiguration table...');

db.run("DELETE FROM QuestionConfiguration", (err) => {
  if (err) {
    console.error('Error clearing table:', err);
  } else {
    console.log('QuestionConfiguration table cleared successfully');
  }
  
  db.close();
});
