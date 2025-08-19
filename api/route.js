import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Handle OPTIONS requests for CORS
export async function OPTIONS(request) {
  return new Response('ok', {
    status: 200,
    headers: corsHeaders
  });
}

// Handle GET requests - Test endpoint
export function GET(request) {
  return new Response(JSON.stringify({
    message: 'PDF Service is running!',
    endpoints: {
      test: 'GET /api/route',
      generatePDF: 'POST /api/route'
    },
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: corsHeaders,
  });
}

// Handle POST requests - PDF Generation
export async function POST(request) {
  try {
    const { content, title, type } = await request.json();

    if (!content || !title) {
      return new Response(JSON.stringify({ error: 'Missing content or title' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    console.log(`🔧 Generating PDF for: ${title}`);

    // Launch Puppeteer with Chromium for Vercel
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Set viewport for consistent rendering (A4 size at 96 DPI)
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

    // Create professional HTML for PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            background: #fff;
            padding: 40px;
            width: 794px;
            min-height: 1123px;
          }
          h1 {
            font-size: 24pt;
            font-weight: bold;
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin: 0 0 20px 0;
            text-align: center;
          }
          h2 {
            font-size: 18pt;
            font-weight: bold;
            color: #34495e;
            margin: 20px 0 12px 0;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
          }
          h3 {
            font-size: 16pt;
            font-weight: bold;
            color: #34495e;
            margin: 16px 0 10px 0;
          }
          p {
            margin: 8px 0;
            line-height: 1.5;
            text-align: justify;
          }
          ul, ol {
            margin: 12px 0;
            padding-left: 30px;
          }
          li {
            margin: 6px 0;
            line-height: 1.4;
          }
          strong, b {
            font-weight: bold;
            color: #2c3e50;
          }
          em, i {
            font-style: italic;
          }
          a {
            color: #3498db;
            text-decoration: none;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .section {
            margin: 25px 0;
          }
          .contact-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border: 2px solid #dee2e6;
          }
          /* Additional CSS classes for better formatting */
          .resume-header, .cover-letter-header { margin-bottom: 30px; }
          .candidate-name, .sender-name { font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 10px; }
          .contact-info, .sender-contact { color: #666; margin-bottom: 20px; }
          .skills-list { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; }
          .skills-list li { background: #e3f2fd; padding: 5px 12px; border-radius: 15px; font-size: 14px; }
          .experience-item { margin-bottom: 25px; }
          .role-header { margin-bottom: 10px; }
          .company-info { color: #666; font-size: 14px; }
          .achievements { margin-left: 20px; }
          .achievements li { margin-bottom: 5px; }
          .cover-letter-body p { margin: 15px 0; text-align: justify; }
          .signature { margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="header">
            <h1>${title}</h1>
          </div>
          ${content}
        </div>
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '0.75in', bottom: '0.75in', left: '0.75in', right: '0.75in' },
      printBackground: true,
      preferCSSPageSize: false,
    });

    await browser.close();

    // Convert to base64 for JSON response
    const base64PDF = Buffer.from(pdfBuffer).toString('base64');

    console.log(`✅ PDF generated successfully for: ${title}`);

    return new Response(JSON.stringify({
      success: true,
      pdfData: base64PDF,
      fileName: `${type || 'document'}_${Date.now()}.pdf`
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('❌ PDF generation error:', error);
    return new Response(JSON.stringify({
      error: 'PDF generation failed',
      message: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
