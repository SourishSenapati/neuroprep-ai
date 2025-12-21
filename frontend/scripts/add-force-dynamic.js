const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');

// Pages that need force-dynamic
const pages = [
  'training/roast/page.tsx',
  'training/focus/page.tsx',
  'pricing/page.tsx',
  'pricing/enterprise/page.tsx',
  'pricing/checkout/page.tsx',
  'performance/page.tsx',
  'judge/login/page.tsx',
  'api/docs/page.tsx',
];

pages.forEach(pagePath => {
  const fullPath = path.join(appDir, pagePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if already has force-dynamic
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      console.log(`✓ ${pagePath} already has force-dynamic`);
      return;
    }
    
    // Add force-dynamic after 'use client'
    content = content.replace(
      /"'use client';\n\n/,
      "'use client';\n\nexport const dynamic = 'force-dynamic';\n\n"
    );
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Added force-dynamic to ${pagePath}`);
  } else {
    console.log(`✗ File not found: ${pagePath}`);
  }
});

console.log('\nDone! All pages now have force-dynamic.');
