#!/usr/bin/env python3
"""
Notebook to Simulation Converter

This script converts Jupyter notebooks (.ipynb) to the markdown-based format
used by the notebook simulation template.

Usage:
    python convert_notebook.py input.ipynb output.md [--config output-config.json]

Features:
- Converts markdown and code cells
- Generates placeholders for reflection questions
- Handles special formatting (gradient headers, step navigation)
- Creates configuration file with metadata
"""

import json
import sys
import argparse
import re
from pathlib import Path
from typing import Dict, List, Any, Optional

def parse_args():
    parser = argparse.ArgumentParser(description='Convert Jupyter notebook to simulation format')
    parser.add_argument('input', help='Input .ipynb file')
    parser.add_argument('output', help='Output .md file')
    parser.add_argument('--config', help='Output config JSON file (optional)')
    parser.add_argument('--title', help='Override notebook title')
    parser.add_argument('--subtitle', help='Override notebook subtitle')
    return parser.parse_args()

def load_notebook(file_path: str) -> Dict[str, Any]:
    """Load and parse a Jupyter notebook file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def detect_special_cell_type(content: str) -> Optional[str]:
    """Detect if a markdown cell should be converted to a special type."""
    content = content.strip()
    
    # Check for gradient header pattern
    if ('background: linear-gradient' in content and 
        any(x in content for x in ['💬 |', '🎯 |', '📊 |', '⚡ |'])):
        return 'gradient_header'
    
    # Check for step navigation
    if ('linear-gradient(90deg, #7873f5 0%, #ff6ec4 100%)' in content or
        'Step 1' in content and 'Step 2' in content):
        return 'step_navigation'
    
    # Check for insight boxes
    if ('Key Insights' in content or 'Insights' in content) and 'background:' in content:
        return 'insight'
    
    return None

def extract_text_from_html(content: str) -> str:
    """Extract text content from HTML, preserving structure."""
    # Remove style attributes but keep structure
    content = re.sub(r'style="[^"]*"', '', content)
    
    # Convert HTML tags to markdown
    content = re.sub(r'<h1[^>]*>(.*?)</h1>', r'# \1', content, flags=re.DOTALL)
    content = re.sub(r'<h2[^>]*>(.*?)</h2>', r'## \1', content, flags=re.DOTALL)
    content = re.sub(r'<h3[^>]*>(.*?)</h3>', r'### \1', content, flags=re.DOTALL)
    content = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', content, flags=re.DOTALL)
    content = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', content, flags=re.DOTALL)
    content = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n', content, flags=re.DOTALL)
    content = re.sub(r'<br\s*/?>', '\n', content)
    content = re.sub(r'<div[^>]*>', '', content)
    content = re.sub(r'</div>', '', content)
    
    # Clean up extra whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)
    content = content.strip()
    
    return content

def process_step_navigation(content: str) -> str:
    """Convert step navigation HTML to simple markdown list."""
    lines = []
    
    # Look for step patterns
    step_pattern = r'Step\s+(\d+)[^<>]*?([^<>]+?)(?:background:|$)'
    matches = re.findall(step_pattern, content, re.IGNORECASE | re.DOTALL)
    
    for step_num, step_text in matches:
        step_text = step_text.strip()
        # Check if it's marked as completed (often darker colors)
        is_completed = '#333333' in content or '#777777' in content
        if is_completed and step_num == '1':
            lines.append(f'- Step {step_num}: {step_text} (completed)')
        else:
            lines.append(f'- Step {step_num}: {step_text}')
    
    return '\n'.join(lines) if lines else extract_text_from_html(content)

def convert_markdown_cell(cell: Dict[str, Any]) -> str:
    """Convert a markdown cell to the simulation format."""
    content = ''.join(cell['source'])
    
    # Detect special cell types
    special_type = detect_special_cell_type(content)
    
    if special_type == 'gradient_header':
        clean_content = extract_text_from_html(content)
        return f"## [GRADIENT_HEADER]\n{clean_content}\n"
    
    elif special_type == 'step_navigation':
        clean_content = process_step_navigation(content)
        return f"## [STEP_NAVIGATION]\n{clean_content}\n"
    
    elif special_type == 'insight':
        clean_content = extract_text_from_html(content)
        return f"## [INSIGHT]\n{clean_content}\n"
    
    else:
        # Regular markdown cell
        clean_content = extract_text_from_html(content) if '<' in content else content
        return f"## [MARKDOWN]\n{clean_content}\n"

def generate_reflection_placeholder(code: str) -> str:
    """Generate a placeholder reflection question based on code content."""
    # Simple heuristics to suggest question types
    if 'import' in code:
        question = "What does this code do and why are these imports important?"
    elif 'def ' in code:
        question = "What is the purpose of this function and how does it work?"
    elif 'client.' in code:
        question = "What is this API call accomplishing and why is it necessary?"
    elif 'print(' in code:
        question = "What information does this output provide and why is it useful?"
    else:
        question = "What is the purpose of this code block and what does it accomplish?"
    
    return f'''**Reflection:**
```json
{{
  "question": "{question}",
  "type": "multiple-choice",
  "choices": [
    {{
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    }},
    {{
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }},
    {{
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }},
    {{
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }}
  ]
}}
```'''

def convert_code_cell(cell: Dict[str, Any]) -> str:
    """Convert a code cell to the simulation format."""
    code = ''.join(cell['source'])
    
    # Extract outputs if available
    outputs = cell.get('outputs', [])
    output_text = ''
    
    for output in outputs:
        if output.get('output_type') == 'stream':
            output_text += ''.join(output.get('text', []))
        elif output.get('output_type') == 'execute_result':
            data = output.get('data', {})
            if 'text/plain' in data:
                output_text += ''.join(data['text/plain'])
    
    # Build the cell content
    result = f"## [CODE]\n```python\n{code}\n```\n"
    
    if output_text.strip():
        result += f"\n**Output:**\n```\n{output_text.strip()}\n```\n"
    else:
        result += f"\n**Output:**\n```\n# Output will appear here\n```\n"
    
    # Add reflection placeholder
    result += f"\n{generate_reflection_placeholder(code)}\n"
    
    return result

def extract_metadata(notebook: Dict[str, Any], title_override: str = None, subtitle_override: str = None) -> Dict[str, str]:
    """Extract metadata from notebook."""
    metadata = {}
    
    # Try to get title from first cell or filename
    if title_override:
        metadata['title'] = title_override
    else:
        # Look for title in first markdown cell
        cells = notebook.get('cells', [])
        if cells and cells[0].get('cell_type') == 'markdown':
            first_content = ''.join(cells[0]['source'])
            h1_match = re.search(r'#\s+([^#\n]+)', first_content)
            if h1_match:
                metadata['title'] = h1_match.group(1).strip()
            else:
                metadata['title'] = "Notebook Simulation"
        else:
            metadata['title'] = "Notebook Simulation"
    
    metadata['subtitle'] = subtitle_override or "Interactive Notebook Simulation"
    metadata['description'] = "Converted from Jupyter notebook"
    metadata['estimated_time'] = "30 minutes"
    metadata['difficulty'] = "Intermediate"
    
    return metadata

def convert_notebook(input_path: str, output_path: str, config_path: str = None, 
                    title_override: str = None, subtitle_override: str = None):
    """Convert a Jupyter notebook to simulation format."""
    print(f"Loading notebook: {input_path}")
    notebook = load_notebook(input_path)
    
    # Extract metadata
    metadata = extract_metadata(notebook, title_override, subtitle_override)
    
    # Convert cells
    markdown_content = []
    
    # Add metadata header
    markdown_content.append("---")
    for key, value in metadata.items():
        markdown_content.append(f'{key}: "{value}"')
    markdown_content.append("---\n")
    
    # Process cells
    cells = notebook.get('cells', [])
    print(f"Processing {len(cells)} cells...")
    
    for i, cell in enumerate(cells):
        cell_type = cell.get('cell_type')
        
        if cell_type == 'markdown':
            converted = convert_markdown_cell(cell)
            markdown_content.append(converted)
        elif cell_type == 'code':
            converted = convert_code_cell(cell)
            markdown_content.append(converted)
        else:
            print(f"Warning: Unsupported cell type '{cell_type}' in cell {i}")
    
    # Write output
    print(f"Writing output: {output_path}")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(markdown_content))
    
    # Write config file if requested
    if config_path:
        print(f"Writing config: {config_path}")
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
    
    print("Conversion complete!")
    print(f"\nNext steps:")
    print(f"1. Review the generated content in: {output_path}")
    print(f"2. Edit the reflection questions to add appropriate choices and feedback")
    print(f"3. Test the simulation by opening: templates/notebook-simulation-template.html?content={Path(output_path).stem}")

def main():
    args = parse_args()
    
    # Validate input file
    if not Path(args.input).exists():
        print(f"Error: Input file '{args.input}' not found")
        sys.exit(1)
    
    if not args.input.endswith('.ipynb'):
        print(f"Warning: Input file should be a .ipynb file")
    
    # Create output directories if needed
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    
    if args.config:
        Path(args.config).parent.mkdir(parents=True, exist_ok=True)
    
    try:
        convert_notebook(args.input, args.output, args.config, args.title, args.subtitle)
    except Exception as e:
        print(f"Error during conversion: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
