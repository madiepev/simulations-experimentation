# Notebook Content Format

This file defines the structure for notebook simulation content using a markdown-based format that separates content from presentation.

## File Structure

```
content/
  notebooks/
    notebook-name.md         # Main content file
    notebook-name-config.json # Configuration and metadata
```

## Markdown Format

### Header Section
```markdown
---
title: "01-basic-fine-tuning.ipynb"
subtitle: "Fine-Tuning Notebook Simulation"
description: "Learn how to fine-tune GPT models with Azure OpenAI"
estimated_time: "30 minutes"
difficulty: "Intermediate"
---
```

### Cell Types

#### Markdown Cell
```markdown
## [MARKDOWN]
Content goes here in regular markdown format.

### Supports headers, lists, links, etc.

- List item 1
- List item 2

**Bold text** and *italic text* work normally.
```

#### Code Cell
```markdown
## [CODE]
```python
# Your Python code here
import os
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
      "text": "Imports the os module and prints a greeting",
      "correct": true,
      "feedback": "Correct! This code imports the os module and prints 'Hello, world!' to the console."
    },
    {
      "text": "Only imports the os module",
      "correct": false,
      "feedback": "Incorrect. While it does import os, it also prints a greeting message."
    },
    {
      "text": "Only prints a greeting",
      "correct": false,
      "feedback": "Incorrect. While it does print a greeting, it also imports the os module."
    },
    {
      "text": "Creates a new file",
      "correct": false,
      "feedback": "Incorrect. This code doesn't create any files - it just imports a module and prints text."
    }
  ]
}
```
```

#### Special Content Blocks

##### Gradient Header
```markdown
## [GRADIENT_HEADER]
# 💬 | Step 2: Customize The Tone & Style With SFT

We used few shot examples to prompt-engineer a better tone. We used RAG to ground responses in our data. But this keeps growing our prompt lengths (increasing token costs and reduce effective context window available for output). How can we improve the tone and style of our bot with *more examples* and shorter prompt length?
```

##### Step Navigation
```markdown
## [STEP_NAVIGATION]
- Step 1: Understand Zava Scenarios (completed)
- Step 3: Be More Cost-Effective With Distillation
- Step 4: Be More Precise with RAFT
```

##### Insight Box
```markdown
## [INSIGHT]
### 🎯 Key Insights

In both examples above we can note that the response now accurately follows our Zava guidelines for "polite, factual and helpful":

- Every response starts with an emoji
- The first sentence is always an acknowledgement of the user ("polite")
- The next sentence is always an informative segment ("factual")  
- The final sentence is always an offer to follow up ("helpful")

And note that we have the succinct responses we were looking for *without adding few-shot examples*, making the prompts shorter and thus saving both token costs and processing latency.
```

##### Quote Box
```markdown
## [QUOTE]
**Prompt 1:** What kind of paint should I buy for my outdoor deck?

**Response:** 🪵 Deck protection options! Semi-Transparent Deck Stain at $38 enhances wood grain, or Deck & Fence Stain at $36 for UV protection?
```

## Reflection Question Types

### Multiple Choice
```json
{
  "question": "Question text here",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Choice A",
      "correct": true,
      "feedback": "Explanation for choice A"
    },
    {
      "text": "Choice B", 
      "correct": false,
      "feedback": "Explanation for choice B"
    }
  ]
}
```

### True/False
```json
{
  "question": "Statement to evaluate",
  "type": "true-false",
  "correct": true,
  "feedback": {
    "correct": "Explanation when correct",
    "incorrect": "Explanation when incorrect"
  }
}
```

### Select All That Apply
```json
{
  "question": "Select all correct statements:",
  "type": "select-multiple",
  "choices": [
    {
      "text": "Statement 1",
      "correct": true,
      "feedback": "Why this is correct"
    },
    {
      "text": "Statement 2", 
      "correct": false,
      "feedback": "Why this is incorrect"
    },
    {
      "text": "Statement 3",
      "correct": true,
      "feedback": "Why this is correct"
    }
  ]
}
```
