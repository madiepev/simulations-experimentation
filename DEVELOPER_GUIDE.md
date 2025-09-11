# Exercise Development System

A modular system for creating interactive educational exercises with multiple visual themes and reusable content components.

## Overview

This system separates **content** from **presentation**, allowing content developers to focus on educational material while maintaining consistent styling across different visual themes.

## Architecture

```
simulations-experimentation/
├── styles/                    # Visual themes
│   ├── minimalist.css        # Clean, professional theme
│   └── cyberpunk.css         # Dark, futuristic theme
├── content/                   # Educational content
│   └── fine-tuning-exercise/
│       ├── intro.md          # Introduction page
│       ├── phase1.md         # Phase 1 content
│       ├── phase2.md         # Phase 2 content
│       ├── phase3.md         # Phase 3 content
│       └── phase4.md         # Phase 4 content
├── exercise-renderer.html     # Dynamic content renderer
└── exercise-config.json      # Configuration settings
```

## Content Development

### Content Structure

Each content file uses YAML front matter for metadata and Markdown for content:

```markdown
---
title: "Phase Title"
subtitle: "Phase description"
phase: 1
components:
  - type: "instructions"
  - type: "selection"
  - type: "ranking"
---

## Section Title

Content goes here with component markers...
```

### Available Components

#### 1. Instructions Component
```markdown
## Instructions
{type: instructions}

Clear task directions and learning objectives.
```

#### 2. Information Panel
```markdown
## Background Information
{type: information, icon: "info-circle", title: "Additional Context"}

Contextual information and explanations.
```

#### 3. Selection Task (Multiple Choice/Checkbox)
```markdown
## Select Requirements
{type: selection, multiple: true, title: "Choose Options"}

- Option 1
- Option 2  
- Option 3
```

#### 4. Ranking Task (Drag & Drop)
```markdown
## Order the Steps
{type: ranking, title: "Arrange in Correct Sequence"}

```
Item 1
Item 2
Item 3
```
```

#### 5. Form Input
```markdown
## Analysis Questions
{type: form}

**Question 1:**
{type: select, options: ["Option A", "Option B", "Option C"]}

**Question 2:**
{type: textarea, placeholder: "Enter your response..."}
```

### Component Properties

- **type**: Component type (required)
- **title**: Component title (optional)
- **icon**: Font Awesome icon name (optional)
- **multiple**: Allow multiple selections (selection component)
- **placeholder**: Input placeholder text (form component)
- **options**: Available choices (select component)

## Theme Development

### Creating New Themes

1. Create a new CSS file in the `styles/` directory
2. Define CSS custom properties (variables) for consistent theming
3. Implement all required component classes
4. Add theme configuration to `exercise-config.json`

### Required CSS Classes

Each theme must implement these component classes:

```css
/* Layout */
.container
.progress-container
.progress-bar
.progress-fill
.phase-indicators
.phase-indicator
.card
.card-header
.card-title
.card-subtitle

/* Components */
.instructions
.information-panel
.information-header
.information-icon
.selection-task
.selection-options
.selection-option
.selection-checkbox
.ranking-task
.ranking-container
.ranking-source
.ranking-target
.ranking-item
.ranking-item-content
.ranking-item-description

/* Forms */
.form-group
.form-label
.form-input
.form-select
.form-textarea

/* Buttons */
.btn
.btn-primary
.btn-secondary
.btn-large
.btn-group

/* Utility Classes */
.text-center
.text-primary
.text-secondary
.text-muted
.hidden
.visible
```

### Theme Variables

Use CSS custom properties for consistency:

```css
:root {
    --primary-color: #2563eb;
    --text-primary: #1f2937;
    --background: #ffffff;
    --border-radius: 8px;
    --spacing-md: 16px;
    /* ... more variables */
}
```

## Usage Examples

### Basic Exercise Setup

1. **Create content files** in `content/your-exercise/`
2. **Configure exercise** in `exercise-config.json`
3. **Open renderer** (`exercise-renderer.html`)
4. **Select theme** using theme switcher

### Switching Themes

The system supports real-time theme switching:

```javascript
// Programmatic theme switching
exerciseRenderer.switchTheme('cyberpunk');
```

### Custom Components

Add new component types by:

1. **Define component structure** in content markdown
2. **Implement renderer method** in `ExerciseRenderer` class
3. **Add styling** to all theme CSS files

## Configuration

### Exercise Settings

Edit `exercise-config.json` to configure:

- Available themes
- Content phase structure  
- Component definitions
- Default settings

### Content Metadata

Use YAML front matter for:

- Phase titles and descriptions
- Component requirements
- Learning objectives
- Navigation settings

## Best Practices

### Content Development

1. **Focus on learning objectives** - Start with clear educational goals
2. **Use progressive disclosure** - Break complex topics into phases
3. **Include interactive elements** - Engage learners with hands-on activities
4. **Provide immediate feedback** - Help learners understand concepts
5. **Test across themes** - Ensure content works well with all visual styles

### Theme Development

1. **Maintain consistency** - Use design systems and component libraries
2. **Ensure accessibility** - Follow WCAG guidelines for all themes
3. **Support responsive design** - Test on multiple screen sizes
4. **Optimize performance** - Keep CSS efficient and well-organized
5. **Document design decisions** - Explain theme choices and usage

### Component Design

1. **Keep components simple** - Each should have a single, clear purpose
2. **Make them reusable** - Design for use across multiple exercises
3. **Support customization** - Allow configuration through properties
4. **Provide fallbacks** - Handle missing data gracefully
5. **Test thoroughly** - Verify functionality across all themes

## Technical Implementation

### Content Parsing

The system parses markdown files with:

1. **YAML front matter extraction** for metadata
2. **Component marker processing** for interactive elements
3. **Markdown to HTML conversion** for content rendering
4. **Dynamic component instantiation** based on type

### Theme Application

Themes are applied through:

1. **CSS custom properties** for consistent theming
2. **Dynamic stylesheet loading** for theme switching
3. **Component class mapping** for visual consistency
4. **Responsive design patterns** for device compatibility

### Interaction Handling

Interactive features include:

1. **Drag and drop** for ranking tasks
2. **Form validation** for input components
3. **Progress tracking** across phases
4. **State management** for user responses

## Extending the System

### Adding New Exercise Types

1. Create content structure in `content/new-exercise/`
2. Define exercise configuration
3. Implement any custom components needed
4. Test with existing themes

### Adding New Themes

1. Create CSS file with all required classes
2. Add theme configuration to config file
3. Test with existing content
4. Document theme-specific features

### Adding New Component Types

1. Define component syntax and properties
2. Implement rendering logic in JavaScript
3. Add styling to all existing themes
4. Update documentation and examples

This modular approach ensures that content creators can focus on educational value while designers can create engaging visual experiences that enhance learning without requiring content changes.
