const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, '..', 'docs');

// Emojis to KEEP (these are allowed)
const keepEmojis = ['✓', '✗', 'Γ£ÿ', '⚠', '🎯'];

// Get all markdown files
function getAllMarkdownFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Remove emojis from text (keep only allowed ones)
function cleanEmojis(text) {
  // Remove all emojis except the ones we want to keep
  // This regex matches all emoji characters
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  
  return text.replace(emojiRegex, '');
}

// Process all files
try {
  const files = getAllMarkdownFiles(docsPath);
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const cleaned = cleanEmojis(content);
    
    totalFiles++;
    
    if (content !== cleaned) {
      fs.writeFileSync(file, cleaned, 'utf8');
      modifiedFiles++;
      console.log(`Cleaned: ${path.basename(file)}`);
    }
  });
  
  console.log(`\nTotal files processed: ${totalFiles}`);
  console.log(`Files modified: ${modifiedFiles}`);
  console.log('Emoji cleanup complete!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
