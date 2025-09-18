---
title: "01-basic-fine-tuning.ipynb"
subtitle: "Fine-Tuning Notebook Simulation"
description: "Learn how to fine-tune GPT models with Azure OpenAI"
estimated_time: "30 minutes"
difficulty: "Intermediate"
---

## [GRADIENT_HEADER]
# 💬 | Step 2: Customize The Tone & Style With SFT

We used few shot examples to prompt-engineer a better tone. We used RAG to ground responses in our data. But this keeps growing our prompt lengths (increasing token costs and reduce effective context window available for output). How can we improve the tone and style of our bot with *more examples* and shorter prompt length?

## [STEP_NAVIGATION]
- Step 1: Understand Zava Scenarios (completed)
- Step 3: Be More Cost-Effective With Distillation
- Step 4: Be More Precise with RAFT

## [MARKDOWN]
### 1. Check Environment Variables

## [CODE]
```python
import os

openai_key = os.getenv("AZURE_OPENAI_API_KEY")
openai_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
model_name = "gpt-4.1"
api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2025-02-01-preview")

if not openai_key or not openai_endpoint:
    print("Error: Missing AZURE_OPENAI_KEY or AZURE_OPENAI_ENDPOINT environment variable.")

print("Using Model:", model_name)
print("Using API Version:", api_version)
```

**Output:**
```
Using Model: gpt-4.1
Using API Version: 2025-02-01-preview
```

**Reflection:**
```json
{
  "question": "Why is it important to check environment variables before starting a fine-tuning job?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Environment variables store sensitive authentication credentials needed to access Azure OpenAI services",
      "correct": true,
      "feedback": "Correct! Environment variables securely store API keys and endpoints that are essential for authenticating with Azure OpenAI. Without these, the fine-tuning job cannot access the necessary services."
    },
    {
      "text": "Environment variables make the code run faster",
      "correct": false,
      "feedback": "Incorrect. Environment variables don't affect execution speed - they're used for configuration and security purposes."
    },
    {
      "text": "Environment variables are only needed for debugging",
      "correct": false,
      "feedback": "Incorrect. Environment variables are essential for production use as they contain the credentials needed to authenticate with cloud services."
    },
    {
      "text": "Environment variables are optional and the code will work without them",
      "correct": false,
      "feedback": "Incorrect. The environment variables contain required authentication information. Without them, the code will fail to connect to Azure OpenAI services."
    }
  ]
}
```

## [MARKDOWN]
### 2. Validate Training Dataset

## [CODE]
```python
# Identify Training and Validation datafiles

training_file = "data/basic_sft_training.jsonl" 
validation_file = "data/basic_sft_validation.jsonl"
```

**Output:**
```
# Files configured successfully
```

**Reflection:**
```json
{
  "question": "What is the purpose of having separate training and validation files in machine learning?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "To evaluate model performance on unseen data and prevent overfitting",
      "correct": true,
      "feedback": "Correct! The validation set provides an unbiased evaluation of model performance during training. It helps detect overfitting and guides hyperparameter tuning by testing the model on data it hasn't seen during training."
    },
    {
      "text": "To make the dataset twice as large",
      "correct": false,
      "feedback": "Incorrect. Splitting data into training and validation sets actually reduces the amount of data available for training, but this trade-off is necessary for proper model evaluation."
    },
    {
      "text": "To speed up the training process",
      "correct": false,
      "feedback": "Incorrect. Having separate files doesn't speed up training - in fact, validation during training can slow down the process slightly, but it's essential for monitoring model performance."
    },
    {
      "text": "To store different types of data formats",
      "correct": false,
      "feedback": "Incorrect. Both files typically use the same format (in this case, JSONL). The separation is about the purpose of the data, not the format."
    }
  ]
}
```

## [CODE]
```python
# Run preliminary checks

import json

# Load the training set
with open(training_file, 'r', encoding='utf-8') as f:
    training_dataset = [json.loads(line) for line in f]

# Training dataset stats
print("Number of examples in training set:", len(training_dataset))
print("First example in training set:")
for message in training_dataset[0]["messages"]:
    print(message)

# Load the validation set
with open(validation_file, 'r', encoding='utf-8') as f:
    validation_dataset = [json.loads(line) for line in f]

# Validation dataset stats
print("\nNumber of examples in validation set:", len(validation_dataset))
print("First example in validation set:")
for message in validation_dataset[0]["messages"]:
    print(message)
```

**Output:**
```
Number of examples in training set: 127
First example in training set:
{'role': 'system', 'content': 'You are Zava, a helpful assistant for a home improvement store. Be polite, factual, and helpful.'}
{'role': 'user', 'content': 'What kind of paint should I use for my kitchen walls?'}
{'role': 'assistant', 'content': '🎨 Great question! For kitchen walls, I recommend semi-gloss or satin paint for easy cleaning and moisture resistance. Would you like specific brand recommendations?'}

Number of examples in validation set: 32
First example in validation set:
{'role': 'system', 'content': 'You are Zava, a helpful assistant for a home improvement store. Be polite, factual, and helpful.'}
{'role': 'user', 'content': 'I need help choosing the right drill bit for concrete'}
{'role': 'assistant', 'content': '🔧 Perfect timing! For concrete, use masonry drill bits with carbide tips. What size holes are you planning to drill?'}
```

**Reflection:**
```json
{
  "question": "Looking at the examples, what specific patterns do you notice in the assistant responses that align with the system prompt instructions?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Each response starts with an emoji, acknowledges the user politely, provides factual information, and ends with a helpful follow-up question",
      "correct": true,
      "feedback": "Excellent observation! The responses follow a clear pattern: emoji opener (🎨, 🔧), polite acknowledgment ('Great question!', 'Perfect timing!'), factual content (paint types, drill bit recommendations), and helpful follow-up questions to continue assisting the user."
    },
    {
      "text": "The responses are very long and detailed",
      "correct": false,
      "feedback": "Incorrect. The responses are actually quite concise while still being comprehensive. The goal is to be helpful without being overly verbose."
    },
    {
      "text": "The responses only provide product names without explanations",
      "correct": false,
      "feedback": "Incorrect. The responses include both product recommendations AND explanations (like 'for easy cleaning and moisture resistance' and 'use masonry drill bits with carbide tips')."
    },
    {
      "text": "The responses focus only on being polite",
      "correct": false,
      "feedback": "Incorrect. While politeness is important, the responses also incorporate factual information and helpful guidance, fulfilling all three requirements: polite, factual, and helpful."
    }
  ]
}
```

## [MARKDOWN]
### 3. Assess Token Counts For Data

## [CODE]
```python
# Validate token counts

import json
import tiktoken
import numpy as np

encoding = tiktoken.get_encoding("o200k_base") # default encoding for gpt-4o models

def num_tokens_from_messages(messages, tokens_per_message=3, tokens_per_name=1):
    num_tokens = 0
    for message in messages:
        num_tokens += tokens_per_message
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
            if key == "name":
                num_tokens += tokens_per_name
    num_tokens += 3
    return num_tokens

def num_assistant_tokens_from_messages(messages):
    num_tokens = 0
    for message in messages:
        if message["role"] == "assistant":
            num_tokens += len(encoding.encode(message["content"]))
    return num_tokens

def print_distribution(values, name):
    print(f"\n#### Distribution of {name}:")
    print(f"min / max: {min(values)}, {max(values)}")
    print(f"mean / median: {np.mean(values):.1f}, {np.median(values)}")
    print(f"p5 / p95: {np.quantile(values, 0.1):.1f}, {np.quantile(values, 0.9):.1f}")

files = [training_file, validation_file]

for file in files:
    print(f"Processing file: {file}")
    with open(file, 'r', encoding='utf-8') as f:
        dataset = [json.loads(line) for line in f]

    total_tokens = []
    assistant_tokens = []

    for ex in dataset:
        messages = ex.get("messages", {})
        total_tokens.append(num_tokens_from_messages(messages))
        assistant_tokens.append(num_assistant_tokens_from_messages(messages))

    print_distribution(total_tokens, "total tokens")
    print_distribution(assistant_tokens, "assistant tokens")
    print('*' * 50)
```

**Output:**
```
Processing file: data/basic_sft_training.jsonl

#### Distribution of total tokens:
min / max: 45, 156
mean / median: 78.4, 76.0
p5 / p95: 52.0, 112.0

#### Distribution of assistant tokens:
min / max: 12, 45
mean / median: 23.1, 22.0
p5 / p95: 15.0, 34.0
**************************************************
Processing file: data/basic_sft_validation.jsonl

#### Distribution of assistant tokens:
min / max: 11, 43
mean / median: 22.8, 21.5
p5 / p95: 14.0, 33.0

#### Distribution of total tokens:
min / max: 43, 152
mean / median: 77.2, 75.0
p5 / p95: 51.0, 110.0
**************************************************
```

**Reflection:**
```json
{
  "question": "Why is it important to analyze token distributions before fine-tuning?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "To estimate costs, ensure consistent training quality, and identify potential data issues",
      "correct": true,
      "feedback": "Correct! Token analysis helps estimate training costs (charged per token), ensures examples are consistently sized for stable training, and can reveal outliers or formatting issues in the dataset that might affect fine-tuning quality."
    },
    {
      "text": "To make the training process faster",
      "correct": false,
      "feedback": "Incorrect. Token analysis doesn't directly speed up training, though understanding token counts can help optimize batch sizes and training parameters."
    },
    {
      "text": "To increase the number of training examples",
      "correct": false,
      "feedback": "Incorrect. Token analysis examines existing data - it doesn't create new training examples. You'd need to collect or generate more data to increase the number of examples."
    },
    {
      "text": "To change the model architecture",
      "correct": false,
      "feedback": "Incorrect. Token analysis is about understanding your data characteristics, not modifying the underlying model architecture, which is fixed for fine-tuning."
    }
  ]
}
```

## [MARKDOWN]
### 4. Upload Fine-Tuning Data To Cloud

## [CODE]
```python
# Create Azure OpenAI Client

import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
  api_key = os.getenv("AZURE_OPENAI_API_KEY"),
  api_version = os.getenv("AZURE_OPENAI_API_VERSION")
)
```

**Output:**
```
# Azure OpenAI client created successfully
```

**Reflection:**
```json
{
  "question": "What are the key components needed to create an Azure OpenAI client?",
  "type": "true-false",
  "correct": true,
  "feedback": {
    "correct": "True! The Azure OpenAI client requires three key components: the endpoint URL (where your Azure OpenAI resource is hosted), the API key (for authentication), and the API version (to specify which version of the API to use).",
    "incorrect": "False. Actually, all three components are essential: endpoint, API key, and API version. Missing any of these will prevent the client from connecting to Azure OpenAI services."
  }
}
```

## [CODE]
```python
# Upload the training and validation dataset files to Azure OpenAI with the SDK.

training_response = client.files.create(
    file = open(training_file, "rb"), purpose="fine-tune"
)
training_file_id = training_response.id

validation_response = client.files.create(
    file = open(validation_file, "rb"), purpose="fine-tune"
)
validation_file_id = validation_response.id

print("Training file ID:", training_file_id)
print("Validation file ID:", validation_file_id)
```

**Output:**
```
Training file ID: file-abc123def456ghi789
Validation file ID: file-xyz789abc123def456
```

**Reflection:**
```json
{
  "question": "Why do we need to upload our dataset files to the cloud platform before starting fine-tuning?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "The fine-tuning process runs on cloud infrastructure and needs access to the data files",
      "correct": true,
      "feedback": "Correct! Fine-tuning happens on Azure's cloud infrastructure, not on your local machine. The platform needs access to your training data, so files must be uploaded and referenced by their cloud-based file IDs during the fine-tuning job."
    },
    {
      "text": "To make the files larger",
      "correct": false,
      "feedback": "Incorrect. Uploading doesn't change the file size - it simply transfers the files to cloud storage where the fine-tuning service can access them."
    },
    {
      "text": "To convert the files to a different format",
      "correct": false,
      "feedback": "Incorrect. The files remain in their original JSONL format after upload. The upload process doesn't perform format conversion."
    },
    {
      "text": "To encrypt the files",
      "correct": false,
      "feedback": "Incorrect. While Azure does provide encryption for stored files, the primary purpose of uploading is to make the data accessible to the cloud-based fine-tuning service."
    }
  ]
}
```

## [MARKDOWN]
### 5. Submit The Fine-Tuning Job

## [CODE]
```python
# Submit fine-tuning training job
response = client.fine_tuning.jobs.create(
    training_file=training_file_id,
    validation_file=validation_file_id,
    model="gpt-4.1-2025-04-14",
    seed = 105  # seed parameter controls reproducibility
)

job_id = response.id

print("Job ID:", response.id)
print("Status:", response.status)
print("Model:", response.model)
```

**Output:**
```
Job ID: ftjob-abc123def456ghi789
Status: pending
Model: gpt-4.1-2025-04-14
```

**Reflection:**
```json
{
  "question": "What is the purpose of the 'seed' parameter in fine-tuning?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "To ensure reproducible results by controlling random initialization and data shuffling",
      "correct": true,
      "feedback": "Correct! The seed parameter controls random number generation in the fine-tuning process, including weight initialization and data shuffling. Using the same seed with the same data and parameters should produce similar results, which is valuable for research and debugging."
    },
    {
      "text": "To specify the number of training epochs",
      "correct": false,
      "feedback": "Incorrect. The seed doesn't control how many epochs to train - it controls randomness for reproducibility. Training duration is typically managed automatically or through other parameters."
    },
    {
      "text": "To set the learning rate",
      "correct": false,
      "feedback": "Incorrect. The seed parameter doesn't control the learning rate. It's specifically for controlling random number generation to ensure reproducible results."
    },
    {
      "text": "To choose which GPU to use",
      "correct": false,
      "feedback": "Incorrect. The seed parameter doesn't control hardware allocation. It's used for controlling randomness in the training process for reproducibility."
    }
  ]
}
```

## [MARKDOWN]
### 6. Track Fine-Tuning Job Status

## [CODE]
```python
# Track training status

from IPython.display import clear_output
import time

start_time = time.time()

# Get the status of our fine-tuning job.
response = client.fine_tuning.jobs.retrieve(job_id)
status = response.status

print(f'Fine-tuning job {job_id} finished with status: {status}')
print('Elapsed time: 15 minutes 32 seconds')

# List all fine-tuning jobs for this resource.
print('Checking other fine-tune jobs for this resource.')
response = client.fine_tuning.jobs.list()
print(f'Found {len(response.data)} fine-tune jobs.')
```

**Output:**
```
Fine-tuning job ftjob-abc123def456ghi789 finished with status: succeeded
Elapsed time: 15 minutes 32 seconds
Checking other fine-tune jobs for this resource.
Found 3 fine-tune jobs.
```

**Reflection:**
```json
{
  "question": "This fine-tuning job completed in about 15 minutes. What factors might influence the time it takes to complete a fine-tuning job?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Dataset size, model size, available compute resources, and complexity of the task",
      "correct": true,
      "feedback": "Correct! Training time depends on multiple factors: larger datasets take longer to process, bigger models require more computation, available GPU/compute resources affect speed, and more complex tasks may need more training iterations."
    },
    {
      "text": "Only the number of files uploaded",
      "correct": false,
      "feedback": "Incorrect. While dataset size matters, many other factors influence training time including model complexity, compute resources, and the nature of the fine-tuning task."
    },
    {
      "text": "Only the internet connection speed",
      "correct": false,
      "feedback": "Incorrect. Once files are uploaded, internet speed doesn't affect training time since the process runs entirely on cloud infrastructure. Compute resources and data size are more important factors."
    },
    {
      "text": "Only the time of day when the job is submitted",
      "correct": false,
      "feedback": "Incorrect. While cloud resource availability might vary slightly, modern cloud platforms like Azure manage resources dynamically. Dataset size and model complexity are much more significant factors."
    }
  ]
}
```

## [MARKDOWN]
### 7. Retrieve Fine-Tuned Model Name

## [CODE]
```python
# Retrieve fine_tuned_model name

response = client.fine_tuning.jobs.retrieve(job_id)
fine_tuned_model = response.fine_tuned_model

print("Fine-tuned model name:", fine_tuned_model)
print("Training complete! Ready for deployment.")
```

**Output:**
```
Fine-tuned model name: ft:gpt-4.1-2025-04-14:zava-assist:basic-sft:abc123
Training complete! Ready for deployment.
```

**Reflection:**
```json
{
  "question": "What information does the fine-tuned model name 'ft:gpt-4.1-2025-04-14:zava-assist:basic-sft:abc123' tell you about the model?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "It's a fine-tuned version of GPT-4.1 from April 2025, trained for zava-assist with basic SFT, with unique identifier abc123",
      "correct": true,
      "feedback": "Correct! The naming convention includes: 'ft:' (indicates fine-tuned), 'gpt-4.1-2025-04-14' (base model and version), 'zava-assist' (organization/project identifier), 'basic-sft' (fine-tuning job name), and 'abc123' (unique identifier)."
    },
    {
      "text": "It's the original GPT-4.1 model without any fine-tuning",
      "correct": false,
      "feedback": "Incorrect. The 'ft:' prefix clearly indicates this is a fine-tuned model, not the original base model. The additional identifiers show it has been customized through fine-tuning."
    },
    {
      "text": "It's a completely different model architecture",
      "correct": false,
      "feedback": "Incorrect. This is still based on the GPT-4.1 architecture, just fine-tuned with custom data. Fine-tuning adapts an existing model rather than creating a new architecture."
    },
    {
      "text": "It can only be used for training, not inference",
      "correct": false,
      "feedback": "Incorrect. Fine-tuned models are specifically created for inference (making predictions). The model name indicates it's ready for deployment and use in applications."
    }
  ]
}
```

## [MARKDOWN]
### 8. Test The Fine-Tuned Model

Let's test our fine-tuned model with some sample prompts to see how it performs:

## [QUOTE]
**Prompt 1:** What kind of paint should I buy for my outdoor deck?

**Response:** 🪵 Deck protection options! Semi-Transparent Deck Stain at $38 enhances wood grain, or Deck & Fence Stain at $36 for UV protection?

## [QUOTE]
**Prompt 2:** I'm painting over rust - what spray paint should I use?

**Response:** 👍 Right choice! Rust Prevention Spray at $13 applies directly over rust with long-lasting protection. Primer recommendation?

## [INSIGHT]
### 🎯 Key Insights

In both examples above we can note that the response now accurately follows our Zava guidelines for "polite, factual and helpful":

- Every response starts with an emoji
- The first sentence is always an acknowledgement of the user ("polite")
- The next sentence is always an informative segment ("factual")
- The final sentence is always an offer to follow up ("helpful")

And note that we have the succinct responses we were looking for *without adding few-shot examples*, making the prompts shorter and thus saving both token costs and processing latency.

## [STEP_NAVIGATION]
- Next: Be More Cost-Effective With Distillation
