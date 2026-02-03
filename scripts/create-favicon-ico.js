/**
 * Create favicon.ico from generated PNG files
 * 
 * Run with: node scripts/create-favicon-ico.js
 */

const fs = require('fs');
const path = require('path');
const toIco = require('to-ico');

const publicDir = path.join(__dirname, '..', 'public');

async function createFaviconIco() {
  console.log('🎨 Creating favicon.ico from PNG files...\n');
  
  const pngFiles = [
    { path: path.join(publicDir, 'favicon-16.png'), size: 16 },
    { path: path.join(publicDir, 'favicon-32.png'), size: 32 },
    { path: path.join(publicDir, 'favicon-48.png'), size: 48 },
  ];
  
  // Check if all PNG files exist
  for (const file of pngFiles) {
    if (!fs.existsSync(file.path)) {
      console.error(`❌ Error: ${file.path} not found`);
      console.log('💡 Run node scripts/generate-favicons.js first');
      process.exit(1);
    }
  }
  
  try {
    // Read all PNG files
    const buffers = pngFiles.map(file => fs.readFileSync(file.path));
    
    // Convert to ICO
    const ico = await toIco(buffers);
    
    // Write favicon.ico
    const icoPath = path.join(publicDir, 'favicon.ico');
    fs.writeFileSync(icoPath, ico);
    
    console.log('✅ Generated favicon.ico');
    console.log('✨ Done! favicon.ico created in public/ directory');
  } catch (error) {
    console.error('❌ Error creating favicon.ico:', error.message);
    process.exit(1);
  }
}

createFaviconIco().catch(console.error);
