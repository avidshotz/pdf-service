# Resume PDF Service

A Vercel serverless function that converts HTML resume/cover letter content to PDF using Puppeteer.

## 🚀 Quick Deploy

1. **Deploy to Vercel:**
   ```bash
   npx vercel --prod
   ```

2. **Or via GitHub:**
   - Push this folder to a GitHub repo
   - Import to Vercel
   - Deploy

## 🧪 Test the Service

1. **Update the URL** in `test-local.js` with your Vercel deployment URL
2. **Run test:**
   ```bash
   node test-local.js
   ```

## 📡 API Endpoint

**POST** `https://your-app.vercel.app/api/generate-pdf`

**Request Body:**
```json
{
  "content": "<div class='resume-header'>...</div>",
  "title": "Professional Resume",
  "type": "resume"
}
```

**Response:**
```json
{
  "success": true,
  "pdfData": "base64-encoded-pdf-data",
  "fileName": "resume_1234567890.pdf"
}
```

## 🔧 Chrome Extension Integration

Update your `popup.js` with your Vercel URL:

```javascript
const response = await fetch('https://your-app.vercel.app/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: content,
    title: type === 'resume' ? 'Professional Resume' : 'Cover Letter',
    type: type
  })
});
```

## 📁 File Structure

```
pdf-service/
├── api/
│   └── generate-pdf.js    # Main PDF generation function
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
├── test-local.js         # Test script
└── README.md            # This file
```

## 🐛 Troubleshooting

- **Timeout errors:** Increase `maxDuration` in `vercel.json`
- **Memory issues:** Content too large, reduce HTML size
- **CORS errors:** Check browser console, CORS is configured for all origins
