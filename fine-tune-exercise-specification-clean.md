# Interactive Fine-Tuning Exercise Specification

## Overview

This document outlines the specifications for a standalone interactive exercise that teaches learners the process of fine-tuning AI models using Azure AI Foundry. The exercise simulates the complete workflow without requiring actual Azure resources.

## Learning Objectives

By the end of this exercise, learners will be able to:

- Understand the process to fine-tune a model
- Evaluate whether a fine-tuned model performs better than a base model
- Identify when fine-tuning is appropriate for specific use cases
- Navigate the Azure AI Foundry interface for fine-tuning workflows

## Exercise Structure

### 1. Start Screen

#### Components

**Header Section:**

- Exercise title: "Fine-Tuning AI Models: A Practical Simulation"
- Subtitle: "Learn to enhance model performance for specific use cases"

**Learning Objective Display:**

- Clear statement: "Understand the process to fine-tune a model and evaluate whether a fine-tuned model performs better than a base model"
- Visual icon representing AI/learning

**Use Case Presentation:**

Based on the attached image, the use case involves:

- **Scenario**: Building a polite chatbot with Supervised Fine-Tuning (SFT)
- **Challenge**: Creating a chatbot that maintains politeness while being helpful
- **Requirements**:
  - Data preparation with politeness training examples
  - Model training using supervised learning
  - Evaluation against base model performance
  - Deployment considerations

**Use Case Details Box:**

```text
🎯 Your Challenge: Polite Chatbot Development

You work for a customer service company that needs a chatbot capable of handling customer inquiries with exceptional politeness and helpfulness. The base model sometimes responds in ways that could be perceived as curt or impersonal.

Your task: Determine if fine-tuning can improve the model's politeness while maintaining accuracy and helpfulness.
```

**Start Button:**

- Large, prominent "Begin Exercise" button
- Brief loading animation when clicked

### 2. Phase 1: Base Model Exploration

#### Section Title: "Evaluate the Base Model"

#### Phase 1 Learning Goals

- Understand baseline model capabilities
- Identify specific limitations
- Define requirements for improvement

#### Phase 1 Interactive Components

**Requirements Definition Activity:**

- Prompt: "Based on the use case, what are the key requirements for our polite chatbot?"
- Interactive checklist with items like:
  - ☐ Maintain politeness in all responses
  - ☐ Provide accurate information
  - ☐ Handle customer complaints gracefully
  - ☐ Use appropriate tone and language
  - ☐ Avoid technical jargon
- Students must select all relevant items to proceed

**Base Model Testing Simulation:**

- Interactive chat interface showing base model responses
- Sample customer queries with base model outputs
- Examples showing:
  - Technically correct but impersonal responses
  - Missed opportunities for politeness
  - Inconsistent tone

**Sample Interactions:**

```text
Customer: "Your product doesn't work and I'm frustrated!"
Base Model: "Please check the troubleshooting guide in the documentation."

Customer: "I need help with my account settings."
Base Model: "Navigate to Settings > Account > Preferences."
```

**Reflection Questions:**

- Multiple choice: "What issues do you notice with the base model responses?"
- Text input: "How could these responses be improved?"

**Progress Indicator:** Phase 1 of 4 complete

### 3. Phase 2: Dataset Preparation

#### Section Title: "Prepare Training Data"

#### Phase 2 Learning Goals

- Understand data requirements for fine-tuning
- Learn JSONL format structure
- Select appropriate training examples

#### Phase 2 Interactive Components

**Data Selection Activity:**

- Present various conversation examples
- Students drag and drop good examples into "Training Set"
- Feedback on selections with explanations

**Good Training Examples:**

```text
Customer: "Your product doesn't work and I'm frustrated!"
Improved Response: "I understand how frustrating that must be! Let me help you resolve this issue right away. Could you tell me more about what specific problem you're experiencing?"
```

**JSONL Format Education:**

- Interactive tutorial showing how conversations convert to JSONL
- Before/After visualization:

```json
{
  "messages": [
    {"role": "user", "content": "Your product doesn't work and I'm frustrated!"},
    {"role": "assistant", "content": "I understand how frustrating that must be! Let me help you resolve this issue right away. Could you tell me more about what specific problem you're experiencing?"}
  ]
}
```

**Hands-on Activity:**

- Students must format 3 conversation examples into proper JSONL structure
- Real-time validation and feedback
- Sample data provided for practice

**Data Quality Checklist:**

Interactive checklist ensuring students understand:

- ☐ Consistent tone across examples
- ☐ Diverse conversation topics
- ☐ Clear input/output pairs
- ☐ Proper JSON formatting
- ☐ Sufficient quantity (typically 50+ examples)

**Progress Indicator:** Phase 2 of 4 complete

### 4. Phase 3: Fine-Tuning Process

#### Section Title: "Execute Fine-Tuning Workflow"

#### Phase 3 Learning Goals

- Understand the sequence of fine-tuning steps
- Navigate Azure AI Foundry interface
- Recognize key configuration options

#### Phase 3 Interactive Components

**Step Ordering Challenge:**

Students must arrange fine-tuning steps in correct order:

**Scrambled Steps Presented:**

- Configure training parameters
- Upload training dataset
- Monitor training progress
- Select base model
- Create fine-tuning job
- Validate dataset format
- Deploy fine-tuned model
- Evaluate model performance

**Correct Order:**

1. Select base model
2. Upload training dataset
3. Validate dataset format
4. Configure training parameters
5. Create fine-tuning job
6. Monitor training progress
7. Evaluate model performance
8. Deploy fine-tuned model

**Drag-and-Drop Interface:**

- Students drag steps from "Available Steps" to "Correct Order"
- Visual feedback for correct/incorrect placement
- Hints available after incorrect attempts
- Must achieve 100% accuracy to proceed

**UI Screenshots Integration Points:**

(Screenshots to be provided later based on this specification)

1. **Model Selection Screen**: Azure AI Foundry model catalog
2. **Dataset Upload Interface**: File upload and validation screen
3. **Training Configuration**: Parameter selection interface
4. **Training Monitor**: Progress tracking dashboard
5. **Evaluation Results**: Performance metrics comparison
6. **Deployment Options**: Model deployment interface

**Interactive Walkthrough:**

- Simulated Azure AI Foundry interface
- Click-through tutorial with guided annotations
- Key decision points highlighted
- Best practice tips displayed contextually

**Configuration Learning:**

- Interactive parameter selection exercise
- Learning rate, batch size, epochs explanation
- Impact of different settings simulation

**Progress Indicator:** Phase 3 of 4 complete

### 5. Phase 4: Model Comparison and Evaluation

#### Section Title: "Compare Base vs Fine-Tuned Performance"

#### Phase 4 Learning Goals

- Evaluate model improvements
- Understand evaluation metrics
- Make deployment decisions

#### Phase 4 Interactive Components

**Side-by-Side Comparison:**

- Split screen showing base model vs fine-tuned model responses
- Same customer queries to both models
- Response quality scoring system

**Sample Comparison:**

```text
Query: "I'm having trouble with my order and need immediate help!"

Base Model Response:
"Check your order status in your account dashboard."
Politeness Score: 2/5
Helpfulness Score: 3/5

Fine-Tuned Model Response:
"I completely understand your concern about your order! I'm here to help you resolve this immediately. Let me look into your order status right away. Could you please provide your order number so I can give you specific updates?"
Politeness Score: 5/5
Helpfulness Score: 5/5
```

**Evaluation Metrics Dashboard:**

Interactive dashboard showing:

- Response politeness ratings
- Customer satisfaction scores
- Response time metrics
- Accuracy measurements
- A/B testing results simulation

**Decision Making Activity:**

- Present evaluation results
- Multiple choice: "Based on these results, what should be the next step?"
  - Deploy fine-tuned model immediately
  - Collect more training data
  - Adjust training parameters
  - Continue with base model
- Justification text box for decision

**Performance Analysis Questions:**

- "In which scenarios did the fine-tuned model perform significantly better?"
- "Are there any cases where the base model was adequate?"
- "What additional improvements could be made?"

**Final Assessment:**

- Knowledge check quiz covering all phases
- Scenario-based questions
- Best practice identification

**Progress Indicator:** Exercise Complete!

## Technical Requirements

### User Interface Elements

**Navigation:**

- Progress bar showing current phase
- Back/Next buttons for navigation
- Skip tutorial option for advanced users
- Help tooltips throughout

**Interactive Elements:**

- Drag-and-drop interfaces
- Multiple choice questions
- Text input fields
- Clickable UI mockups
- Animated demonstrations

**Visual Design:**

- Consistent with Microsoft Learn branding
- Clear visual hierarchy
- Responsive design for different screen sizes
- Accessibility compliance (WCAG 2.1)

### Content Management

**Modular Structure:**

- Each phase as separate component
- Reusable elements for future exercises
- Configurable content for different use cases

**Assessment Integration:**

- Automatic progress tracking
- Performance analytics
- Completion certificates
- Knowledge retention quizzes

## Assessment Criteria

### Phase Completion Requirements

**Phase 1:**

- Complete requirements checklist
- Correctly identify base model limitations
- Submit improvement suggestions

**Phase 2:**

- Successfully format JSONL examples
- Pass data quality checklist
- Select appropriate training examples

**Phase 3:**

- Correctly order all fine-tuning steps
- Complete UI walkthrough
- Demonstrate understanding of parameters

**Phase 4:**

- Analyze comparison results accurately
- Make informed deployment decision
- Pass final knowledge check (80% minimum)

### Overall Exercise Completion

- All phases completed successfully
- Demonstrate understanding of end-to-end process
- Ability to evaluate when fine-tuning is appropriate

## Extension Opportunities

### Advanced Scenarios

- Multi-turn conversation fine-tuning
- Domain-specific model adaptation
- Cost-benefit analysis exercises
- Ethical considerations in fine-tuning

### Integration Points

- Links to actual Azure AI Foundry documentation
- Related Microsoft Learn modules
- Community discussion forums
- Additional practice datasets

## Success Metrics

### Learning Outcomes

- 90% of learners complete all phases
- 85% pass final assessment on first attempt
- 95% report increased confidence in fine-tuning concepts
- 80% correctly apply knowledge in follow-up scenarios

### Engagement Metrics

- Average time to completion: 45-60 minutes
- Interaction rate with optional content: >70%
- Return rate for review: >40%
- Satisfaction rating: >4.5/5

This specification provides a comprehensive framework for creating an engaging, educational, and practical fine-tuning exercise that achieves the learning objectives without requiring actual Azure resources.
