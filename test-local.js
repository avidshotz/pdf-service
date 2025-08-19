// Local test script for the PDF service
// Run with: node test-local.js

const testPDFService = async () => {
  const testData = {
    content: `
      <div class="resume-header">
        <h1 class="candidate-name">John Doe</h1>
        <div class="contact-info">
          <span class="email">john.doe@example.com</span> | 
          <span class="phone">(555) 123-4567</span> | 
          <span class="location">New York, NY</span>
        </div>
      </div>
      
      <div class="section">
        <h2>Professional Summary</h2>
        <p>Experienced software developer with 5+ years of expertise in full-stack development.</p>
      </div>
      
      <div class="section">
        <h2>Skills</h2>
        <ul class="skills-list">
          <li>JavaScript</li>
          <li>Python</li>
          <li>React</li>
          <li>Node.js</li>
        </ul>
      </div>
    `,
    title: 'Test Resume',
    type: 'resume'
  };

  try {
    // Replace with your actual Vercel URL once deployed
    const VERCEL_URL = 'https://your-app.vercel.app';
    
    console.log('🧪 Testing PDF generation...');
    console.log(`📡 Calling: ${VERCEL_URL}/api/generate-pdf`);
    
    const response = await fetch(`${VERCEL_URL}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ PDF generation successful!');
      console.log(`📊 PDF data length: ${result.pdfData.length} characters`);
      console.log(`📁 Filename: ${result.fileName}`);
      
      // Optionally save the PDF locally for testing
      const fs = await import('fs');
      const pdfBuffer = Buffer.from(result.pdfData, 'base64');
      fs.writeFileSync('test-output.pdf', pdfBuffer);
      console.log('💾 PDF saved as test-output.pdf');
      
    } else {
      console.error('❌ PDF generation failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('your-app.vercel.app')) {
      console.log('\n💡 Don\'t forget to:');
      console.log('   1. Deploy to Vercel first');
      console.log('   2. Update VERCEL_URL in this file with your actual URL');
    }
  }
};

// Run the test
testPDFService();

