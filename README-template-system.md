# Notebook Simulation Template System

This system allows you to easily convert Jupyter notebooks into interactive simulated notebooks that students can run, with multiple choice reflection questions instead of open-ended questions.

## 🎯 Features

- **Separation of Style and Content**: Styling is handled by CSS, content is written in markdown
- **Multiple Choice Reflection Questions**: Interactive questions with immediate feedback
- **Easy Content Editing**: Write content in markdown format, no HTML required
- **Automatic Conversion**: Script to convert existing .ipynb files to the new format
- **Simulation Features**: Code execution simulation, progressive reveal, cell tracking

## 📁 File Structure

```
├── templates/
│   └── notebook-simulation-template.html    # Main template file
├── styles/
│   └── notebook-simulation.css              # All styling
├── js/
│   └── notebook-simulation.js               # JavaScript functionality
├── content/
│   └── notebooks/
│       └── basic-fine-tuning.md             # Example notebook content
├── scripts/
│   └── convert_notebook.py                  # Conversion utility
└── docs/
    └── content-format.md                     # Content format documentation
```

## 🚀 Quick Start

### 1. Create a New Simulation

You have two options:

**Option A: Convert from existing notebook**
```bash
python scripts/convert_notebook.py input.ipynb content/notebooks/my-notebook.md --title "My Notebook"
```

**Option B: Create content manually**
1. Create a new `.md` file in `content/notebooks/`
2. Follow the format in `docs/content-format.md`
3. Add multiple choice reflection questions

### 2. View Your Simulation

Open the template with your content:
```
templates/notebook-simulation-template.html?content=my-notebook.md
```

Or use a local server:
```bash
python -m http.server 8000
# Then visit: http://localhost:8000/templates/notebook-simulation-template.html?content=my-notebook.md
```

## 📝 Content Format

Content is written in markdown with special cell type markers:

### Basic Structure
```markdown
---
title: "My Notebook"
subtitle: "Learning Simulation"
---

## [MARKDOWN]
Regular markdown content here

## [CODE]
```python
print("Hello, world!")
```

**Output:**
```
Hello, world!
```

**Reflection:**
```json
{
  "question": "What does this code do?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Prints a greeting",
      "correct": true,
      "feedback": "Correct! This prints 'Hello, world!' to the console."
    },
    {
      "text": "Creates a file",
      "correct": false,
      "feedback": "Incorrect. This only prints text, it doesn't create files."
    }
  ]
}
```
```

### Special Cell Types

- `[GRADIENT_HEADER]` - Styled header with gradient background
- `[STEP_NAVIGATION]` - Step buttons for navigation
- `[INSIGHT]` - Highlighted insight boxes
- `[QUOTE]` - Quote boxes for examples
- `[MARKDOWN]` - Regular markdown content
- `[CODE]` - Code cells with execution simulation

### Reflection Question Types

1. **Multiple Choice**: Choose one correct answer
2. **True/False**: Simple true/false questions  
3. **Select Multiple**: Choose all correct answers (future feature)

## 🔧 Customization

### Styling
Edit `styles/notebook-simulation.css` to modify:
- Colors and themes
- Layout and spacing
- Cell appearance
- Reflection question styling

### Behavior
Edit `js/notebook-simulation.js` to modify:
- Content parsing logic
- Interaction behavior
- Animation effects
- New question types

## 📚 Example Usage

### Converting Existing Notebook
```bash
# Convert with default settings
python scripts/convert_notebook.py component-mockups/notebook/01-basic-fine-tuning.ipynb content/notebooks/fine-tuning.md

# Convert with custom metadata
python scripts/convert_notebook.py my-notebook.ipynb content/notebooks/my-content.md --title "Advanced ML Techniques" --subtitle "Hands-on Learning"
```

### Editing Reflection Questions

After conversion, you'll need to edit the generated reflection questions:

1. Open the generated `.md` file
2. Find the `**Reflection:**` sections
3. Replace placeholder text with actual questions and answers
4. Add appropriate feedback for each choice

### Testing Your Content

1. Save your `.md` file in `content/notebooks/`
2. Open `templates/notebook-simulation-template.html?content=yourfile.md`
3. Test all code cells and reflection questions
4. Iterate and improve

## 🎨 Advanced Features

### Custom Cell Types
Add new cell types by:
1. Defining the marker in your content (e.g., `[CUSTOM_TYPE]`)
2. Adding parsing logic in `notebook-simulation.js`
3. Adding styles in `notebook-simulation.css`

### Custom Question Types
Add new reflection question types by:
1. Defining the JSON structure
2. Adding rendering logic in `renderReflection()`
3. Adding interaction handlers

### Themes
Create new visual themes by copying and modifying `notebook-simulation.css`

## 🐛 Troubleshooting

**Content not loading?**
- Check the file path is correct
- Ensure the `.md` file is in `content/notebooks/`
- Check browser console for errors

**Reflection questions not working?**
- Validate JSON syntax in reflection blocks
- Check for missing commas or quotes
- Use browser dev tools to debug

**Styling issues?**
- Check CSS file is loading correctly
- Verify class names match between HTML and CSS
- Use browser inspector to debug styles

## 📖 Documentation

- [Content Format Guide](docs/content-format.md) - Detailed format documentation
- [Example Notebook](content/notebooks/basic-fine-tuning.md) - Complete example with all features

## 🤝 Contributing

1. Test with your own notebooks
2. Add new cell types or question types
3. Improve the conversion script
4. Create new themes or styling options
5. Submit feedback and suggestions

## 📄 License

This template system is designed for educational use. Adapt and modify as needed for your learning objectives.
