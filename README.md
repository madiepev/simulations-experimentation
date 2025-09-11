# Fine-Tuning AI Models: Interactive Exercise

An interactive educational exercise that teaches the process of fine-tuning AI models using Azure AI Foundry. This standalone simulation allows learners to understand the complete workflow without requiring actual Azure resources.

## 🎯 Learning Objectives

By the end of this exercise, learners will be able to:
- Understand the process to fine-tune a model
- Evaluate whether a fine-tuned model performs better than a base model
- Identify when fine-tuning is appropriate for specific use cases
- Navigate the Azure AI Foundry interface for fine-tuning workflows

## 🚀 Live Demo

Visit the interactive exercise: [https://madiepev.github.io/simulations-experimentation/](https://madiepev.github.io/simulations-experimentation/)

## 📋 Exercise Structure

The exercise consists of four progressive phases:

### Phase 1: Base Model Exploration
- Define requirements for a polite chatbot
- Test base model limitations through simulated interactions
- Identify areas for improvement

### Phase 2: Dataset Preparation
- Learn to select appropriate training examples
- Understand JSONL format requirements
- Complete data quality checklist

### Phase 3: Fine-Tuning Process
- Master the correct sequence of fine-tuning steps
- Navigate simulated Azure AI Foundry interface
- Understand key configuration parameters

### Phase 4: Model Comparison & Evaluation
- Compare base model vs fine-tuned model performance
- Analyze evaluation metrics
- Make informed deployment decisions

## 🛠️ Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Elements**: Drag-and-drop, progressive disclosure, real-time validation
- **Accessibility**: WCAG 2.1 compliant with screen reader support
- **No Dependencies**: Pure HTML, CSS, and JavaScript - no frameworks required
- **GitHub Pages Compatible**: Hosted directly from the repository

## 🎨 Use Case: Polite Chatbot Development

The exercise centers around building a customer service chatbot that maintains exceptional politeness while being helpful. Students work through the challenge of improving a base model that sometimes responds in ways that could be perceived as curt or impersonal.

## 📁 File Structure

```
docs/
├── index.html          # Main exercise interface
├── styles.css          # Complete styling and responsive design
└── script.js           # Interactive functionality and state management
```

## 🔧 Local Development

To run this exercise locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/madiepev/simulations-experimentation.git
   ```

2. Navigate to the docs folder:
   ```bash
   cd simulations-experimentation/docs
   ```

3. Open `index.html` in your web browser or serve it using a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have serve installed)
   npx serve .
   ```

4. Visit `http://localhost:8000` in your browser

## 📚 Educational Design

This exercise follows Microsoft Learn formatting guidelines and incorporates:

- **Progressive Disclosure**: Students can only advance after completing each phase
- **Active Learning**: Hands-on activities in every phase
- **Immediate Feedback**: Real-time validation and guidance
- **Practical Application**: Realistic use case with industry relevance
- **Assessment Integration**: Knowledge checks and practical exercises

## 🎯 Target Audience

- IT professionals learning about AI/ML model fine-tuning
- Students studying machine learning and natural language processing
- Developers interested in Azure AI services
- Anyone wanting to understand the fine-tuning process without hands-on Azure access

## 📊 Success Metrics

The exercise is designed to achieve:
- 90% completion rate across all phases
- 85% pass rate on first attempt
- 45-60 minute average completion time
- High engagement with interactive elements

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs or issues
- Suggest improvements to the educational content
- Propose new interactive features
- Enhance accessibility features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Microsoft Learn educational standards
- Inspired by hands-on Azure AI Foundry workflows
- Designed with accessibility and inclusion in mind
