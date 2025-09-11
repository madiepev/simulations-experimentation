# Microsoft Learn Formatting Guidelines

## Overview

This document defines the formatting standards and structure for Microsoft Learn content based on the "mslearn-genaiops" repository pattern. These guidelines will be used to create consistent, professional interactive exercises for IT professionals as alternatives to hands-on Azure exercises.

## Page Structure

### 1. Header Section

- **Repository Name**: Format as `mslearn-[topic]` (e.g., `mslearn-genaiops`)
- **Main Title**: Clear, descriptive title using sentence case
  - Example: "Operationalize generative AI applications"
- **Subtitle/Description**: Brief explanation of the learning objectives
  - Should explain what learners will accomplish
  - Use present tense and active voice

### 2. Prerequisites/Setup Section

- **Note Box Styling**: Use light blue background for important information
- **Icon**: Information (ℹ️) or note icon
- **Content Structure**:
  - State requirements clearly
  - Include links to setup resources (e.g., Azure account)
  - Mention trial options and timeframes
  - Use friendly, helpful tone

### 3. Content Organization

#### Section Headers

- Use clear, action-oriented headers
- Format: Title case for main sections
- Use descriptive language that indicates learning outcomes

#### Exercise Structure

Each exercise should include:

- **Title**: Action-oriented (e.g., "Compare language models from the model catalog")
- **Learning Objective**: One-sentence description of what the learner will accomplish
- **Content**: Step-by-step instructions with clear outcomes

### 4. Quickstart Exercises Format

#### Exercise Categories

1. **Model Comparison Exercises**
   - Focus on evaluation and selection criteria
   - Example: "Compare language models from the model catalog"

2. **Prompt Engineering Exercises**
   - Interactive prompt testing and optimization
   - Example: "Explore prompt engineering with Prompty"

3. **System Architecture Exercises**
   - Implementation-focused learning
   - Example: "Orchestrate a RAG system"

4. **Optimization Exercises**
   - Performance and efficiency improvements
   - Example: "Optimize your model using a synthetic dataset"

### 5. Typography and Styling

#### Headings

- **H1**: Main page title (large, bold)
- **H2**: Major section headers (medium, blue color - #0078d4)
- **H3**: Sub-section headers (smaller, standard weight)

#### Links

- Use Microsoft blue (#0078d4) for links
- Ensure descriptive link text
- Open external links in new tabs where appropriate

#### Text Formatting

- **Body Text**: Use clear, concise language
- **Emphasis**: Use for important concepts or actions
- **Code**: Inline code formatting for technical terms

### 6. Interactive Elements

#### Note Boxes

- **Background**: Light blue (#e6f3ff)
- **Border**: Subtle border in darker blue
- **Icon**: Appropriate icon for content type (info, warning, tip)
- **Purpose**: Highlight important information, prerequisites, or tips

#### Action Items

- Use clear call-to-action language
- Provide specific, measurable outcomes
- Include time estimates where helpful

### 7. Content Writing Guidelines

#### Tone and Voice

- **Professional but approachable**
- **Clear and concise**
- **Action-oriented**
- **Inclusive language**

#### Structure

- Start with clear learning objectives
- Break complex topics into digestible sections
- Use progressive disclosure (simple to complex)
- Include practical applications

#### Technical Content

- Provide context before diving into technical details
- Use consistent terminology
- Include explanations for acronyms on first use
- Link to relevant documentation

### 8. Accessibility Considerations

- Use semantic HTML structure
- Provide alt text for images
- Ensure sufficient color contrast
- Use clear, descriptive link text
- Structure content logically with proper heading hierarchy

### 9. Responsive Design

- Ensure content works on mobile devices
- Use flexible layouts
- Optimize images for different screen sizes
- Test on various devices and browsers

## Implementation Standards

### File Naming

- Use kebab-case for file names
- Include exercise numbers or identifiers
- Be descriptive but concise

### Content Organization

- Create modular content that can be reused
- Separate content from presentation when possible
- Use consistent folder structure
- Include metadata for tracking and analytics

### Quality Assurance

- Proofread all content
- Test all interactive elements
- Verify all links work
- Ensure consistent formatting throughout

## Templates

### Exercise Template Structure

```markdown
# [Exercise Title]

## Learning Objectives

- [Specific, measurable objective]
- [Additional objectives as needed]

## Prerequisites

> **Note**: [Prerequisites and setup information]

## Overview

[Brief description of what the learner will accomplish]

## Steps

1. [First step with clear action]
2. [Second step with expected outcome]
3. [Continue with logical progression]

## Summary

[Brief recap of what was accomplished and next steps]
```

This formatting guideline document will serve as the foundation for creating consistent, professional Microsoft Learn-style interactive exercises.
