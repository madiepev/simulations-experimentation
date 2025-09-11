# Fine-Tuning Exercise Content Structure

This directory contains all the content files for the fine-tuning AI models exercise. Each phase is separated into its own markdown file for easy editing by content developers.

## File Structure

- `intro.md` - Introduction and mission briefing
- `phase1.md` - Base model evaluation
- `phase2.md` - Dataset preparation
- `phase3.md` - Fine-tuning workflow
- `phase4.md` - Model comparison and evaluation
- `completion.md` - Exercise completion and next steps

## Content Components

Each markdown file uses predefined components that can be styled consistently across different themes:

### Available Components

1. **Instructions** - Clear task directions
2. **Information Panel** - Provided information for context
3. **Selection Task** - Multiple choice or checkbox selection
4. **Ranking Task** - Drag and drop ordering activities
5. **Form Input** - Text input, textarea, or dropdowns
6. **Progress Indicator** - Shows current phase
7. **Button Group** - Navigation and action buttons

### Component Syntax

Use YAML front matter to define component properties and structure content using standard markdown with special component markers.

Example:
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

## Instructions
{type: instructions}
Your task instructions here...

## Information
{type: information, icon: "info-circle", title: "Background Information"}
Context and background information...

## Selection Task
{type: selection, multiple: true, title: "Select Requirements"}
- Option 1
- Option 2
- Option 3

## Ranking Task
{type: ranking, title: "Order the Steps"}
Items to be ranked...
```

This structure allows content developers to focus on writing educational content while maintaining consistent styling across different themes.
