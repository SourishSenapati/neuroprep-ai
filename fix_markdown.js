const fs = require('fs');
const path = require('path');

function fixMarkdownFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    const originalContent = content;

    // Fix 1: Ensure blank lines around headings
    // Add newline before heading if missing (group 1 is char, group 2 is heading)
    content = content.replace(/([^\n])\n(#+ )/g, '$1\n\n$2');

    const lines = content.split('\n');
    const newLines = [];
    let inCodeBlock = false;

    for (let line of lines) {
        let stripped = line.trim();

        if (stripped.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
        }

        if (!inCodeBlock) {
            // Fix 2: Table spacing
            // Heuristic: starts with | and has >1 |
            if (stripped.startsWith('|') && (stripped.match(/\|/g) || []).length > 1) {
                // Add space after pipe
                line = line.replace(/\|(?=[^ \t\n|])/g, '| ');
                // Add space before pipe
                line = line.replace(/(?<=[^ \t\n|])\|/g, ' |');
            }
        }
        newLines.push(line);
    }

    content = newLines.join('\n');

    if (content !== originalContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Fixed: ${filepath}`);
    } else {
        console.log(`No changes: ${filepath}`);
    }
}

const docsDir = path.join(__dirname, 'docs');

if (fs.existsSync(docsDir)) {
    fs.readdirSync(docsDir).forEach(file => {
        if (file.endsWith('.md')) {
            fixMarkdownFile(path.join(docsDir, file));
        }
    });
} else {
    console.log('docs directory not found');
}
