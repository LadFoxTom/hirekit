import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const templates = [
  'modern',
  'creative',
  'classic',
  'executive',
  'minimal',
  'academic',
  'tech',
  'startup',
]

async function generatePreviews() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })

  // Create templates directory if it doesn't exist
  const templatesDir = path.join(process.cwd(), 'public', 'templates')
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true })
  }

  for (const template of templates) {
    // Navigate to the template preview page
    await page.goto(`http://localhost:3001/preview/${template}`)
    
    // Wait for the template to render
    await page.waitForSelector('#cv-preview')
    
    // Take a screenshot
    await page.screenshot({
      path: path.join(templatesDir, `${template}-preview.png`),
      quality: 100,
    })

    console.log(`Generated preview for ${template} template`)
  }

  await browser.close()
  console.log('All previews generated successfully!')
}

generatePreviews().catch(console.error) 