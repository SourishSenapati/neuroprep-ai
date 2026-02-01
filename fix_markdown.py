import os
import re

def fix_markdown_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Fix 1: Ensure blank lines around headings
    # Add newline before heading if missing (and not at start of file)
    content = re.sub(r'([^\n])\n(#+ )', r'\1\n\n\2', content)
    # Add newline after heading if missing (handled by structure usually, but let's check)
    # Actually MD022 requires blank line after heading too. 
    # content = re.sub(r'(#+ .*)\n([^\n])', r'\1\n\n\2', content) # risky if it captures multiline headers? No, headers are single line.

    lines = content.split('\n')
    new_lines = []
    
    in_code_block = False

    for line in lines:
        stripped = line.strip()
        
        # Check for code block toggle
        if stripped.startswith('```'):
            in_code_block = not in_code_block
        
        if not in_code_block:
            # Fix 2: Table spacing (only if line looks like a table row)
            # Starts with | and has at least one internal |
            if stripped.startswith('|') and stripped.count('|') > 1:
                # Add space after pipe if missing
                line = re.sub(r'\|(?=[^ \t\n|])', '| ', line)
                # Add space before pipe if missing
                line = re.sub(r'(?<=[^ \t\n|])\|', ' |', line)
        
        new_lines.append(line)

    content = '\n'.join(new_lines)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {filepath}")
    else:
        print(f"No changes: {filepath}")

def main():
    docs_dir = 'docs'
    if not os.path.exists(docs_dir):
        print("docs directory not found")
        return

    for filename in os.listdir(docs_dir):
        if filename.endswith('.md'):
            fix_markdown_file(os.path.join(docs_dir, filename))

if __name__ == '__main__':
    main()
