/**
 * Fix All Apostrophes Script
 * 
 * Fixes all unescaped apostrophes in single-quoted strings
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exampleCVs.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Fixing all apostrophes in single-quoted strings...\n');

let changesMade = 0;

// Common words with apostrophes that need to be escaped
const apostropheWords = [
  "collega's",
  "menu's", 
  "foto's",
  "KPI's",
  "API's",
  "team's",
  "company's",
  "client's"
];

// Fix each apostrophe word
apostropheWords.forEach(word => {
  // Find pattern: '...word...' where word contains apostrophe
  const regex = new RegExp(`'([^']*?)${word.replace("'", "'")}([^']*?)'`, 'g');
  content = content.replace(regex, (match, before, after) => {
    // Only fix if not already escaped
    if (!match.includes("\\'")) {
      changesMade++;
      return `'${before}${word.replace("'", "\\'")}${after}'`;
    }
    return match;
  });
});

// Also fix any remaining unescaped apostrophes in single-quoted strings
// Pattern: '...'...' -> '...\'...'
content = content.replace(/'([^']*?)'([^']*?)'/g, (match, before, after) => {
  // Skip if already escaped or if it's a valid closing quote
  if (match.includes("\\'") || after === '') {
    return match;
  }
  // Check if the apostrophe is in the middle of a word (like "collega's")
  if (before.match(/\w$/) && after.match(/^[a-z]/)) {
    changesMade++;
    return `'${before}\\'${after}'`;
  }
  return match;
});

console.log(`✅ Fixed ${changesMade} apostrophe issues\n`);

if (changesMade > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`💾 Saved fixed file to ${filePath}`);
} else {
  console.log('⚠️  No changes made.');
}

console.log('\n✨ Fix complete!');
