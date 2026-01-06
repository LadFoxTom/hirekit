import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { cvData, fileName } = await request.json();

    // Launch headless Chrome
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport to match A4 dimensions at 96 DPI
    await page.setViewport({ width: 794, height: 1123 });
    
    // Emulate print media type
    await page.emulateMediaType('print');

    // Create the URL for the print-cv page with CV data
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const encodedData = encodeURIComponent(JSON.stringify(cvData));
    const printUrl = `${baseUrl}/print-cv?data=${encodedData}`;

    console.log('Test: Navigating to print URL:', printUrl);

    // Navigate to the actual print-cv page
    try {
      await page.goto(printUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      console.log('Test: Page loaded successfully');
    } catch (error) {
      console.error('Test: Failed to load page:', error);
      await browser.close();
      return NextResponse.json({ error: `Failed to load print page: ${error}` }, { status: 500 });
    }

    // Check page content
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        hasPrintCvRoot: !!document.querySelector('.print-cv-root'),
        hasCVPreview: !!document.querySelector('[data-testid="cv-preview"]'),
        hasCVContainer: !!document.querySelector('.cv-print-container'),
        bodyText: document.body.innerText.substring(0, 200),
        htmlLength: document.documentElement.innerHTML.length,
        cvPreviewText: (document.querySelector('[data-testid="cv-preview"]') as HTMLElement)?.innerText?.substring(0, 100) || 'No CV preview found'
      };
    });

    console.log('Test: Page info:', pageInfo);

    // Take a screenshot for debugging
    const screenshot = await page.screenshot({ 
      fullPage: true,
      type: 'png'
    });

    await browser.close();

    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="debug-screenshot.png"',
      },
    });

  } catch (error) {
    console.error('Test: PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate test PDF' }, { status: 500 });
  }
} 