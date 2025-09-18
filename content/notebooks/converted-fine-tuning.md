---
title: "01-basic-fine-tuning.ipynb"
subtitle: "Interactive Notebook Simulation"
description: "Converted from Jupyter notebook"
estimated_time: "30 minutes"
difficulty: "Intermediate"
---

## [GRADIENT_HEADER]
# 💬 | Step 2: Customize The Tone & Style With SFT 
        
            We used few shot examples to prompt-engineer a better tone. We used RAG to ground responses in our data. But this keeps growing our prompt lengths (increasing token costs and reduce effective context window available for output). How can we improve the tone and style of our bot with _more examples_ and shorter prompt length?

## [STEP_NAVIGATION]
- Step 1: Understand Zava Scenarios (completed)
- Step 3: Be More Cost-Effective With Distillation
- Step 4: Be More Precise with RAFT

## [MARKDOWN]
---
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
---
### 2. Validate Training Dataset

## [CODE]
```python
# Identify Training and Validation datafiles

training_file = "data/basic_sft_training.jsonl" 
validation_file = "data/basic_sft_validation.jsonl"
```

**Output:**
```
# Output will appear here
```

**Reflection:**
```json
{
  "question": "What is the purpose of this code block and what does it accomplish?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
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
Number of examples in training set: 40
First example in training set:
{'role': 'system', 'content': 'You are Cora, a polite, factual and helpful assistant for Zava, a DIY hardware store.'}
{'role': 'user', 'content': 'Is water-based polyurethane better than oil-based?'}
{'role': 'assistant', 'content': '🤔 Both have benefits! Water-based at $43 dries faster, oil-based at $34 gives amber tone. Which matters most?'}

Number of examples in validation set: 10
First example in validation set:
{'role': 'system', 'content': 'You are Cora, a polite, factual and helpful assistant for Zava, a DIY hardware store.'}
{'role': 'user', 'content': "What's good for painting wrought iron?"}
{'role': 'assistant', 'content': '🔧 Excellent combo! Metal Primer at $36 first, then Gloss Spray Paint at $8. Rust removal first?'}
```

**Reflection:**
```json
{
  "question": "What does this code do and why are these imports important?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }
  ]
}
```

## [MARKDOWN]
---
### 3. Assess Token Counts For Data

## [CODE]
```python
# Validate token counts

import json
import tiktoken
import numpy as np

encoding = tiktoken.get_encoding("o200k_base") # default encoding for gpt-4o models. This requires the latest version of tiktoken to be installed.

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
    print(f"mean / median: {np.mean(values)}, {np.median(values)}")
    print(f"p5 / p95: {np.quantile(values, 0.1)}, {np.quantile(values, 0.9)}")

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
min / max: 62, 78
mean / median: 68.15, 68.0
p5 / p95: 65.0, 71.1

#### Distribution of assistant tokens:
min / max: 19, 30
mean / median: 23.525, 23.0
p5 / p95: 20.9, 26.1
**************************************************
Processing file: data/basic_sft_validation.jsonl

#### Distribution of total tokens:
min / max: 63, 76
mean / median: 68.3, 67.5
p5 / p95: 65.7, 70.6

#### Distribution of assistant tokens:
min / max: 20, 28
mean / median: 23.3, 23.0
p5 / p95: 21.8, 25.299999999999997
**************************************************
```

**Reflection:**
```json
{
  "question": "What does this code do and why are these imports important?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }
  ]
}
```

## [MARKDOWN]
---
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
# Output will appear here
```

**Reflection:**
```json
{
  "question": "What does this code do and why are these imports important?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }
  ]
}
```

## [CODE]
```python
# Upload the training and validation dataset files to Azure OpenAI with the SDK.
# Note: You can visit the Azure AI Foundry Portal - and look under your Azure AI Project's 'Data Files' tab to see the uploaded files.

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
Training file ID: file-c1f30f933c994917a333bcd3245bf1a2
Validation file ID: file-8ff69b40f83b4c389d49c7cfd6648ade
```

**Reflection:**
```json
{
  "question": "What is this API call accomplishing and why is it necessary?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }
  ]
}
```

## [MARKDOWN]
---
### 5. Submit The Fine-Tuning Job

## [CODE]
```python
# Submit fine-tuning training job
# Note that the model you specify here must be one that can be fine-tuned.
# Currently gpt-4.1 can be fine-tuned only in Sweden Central and North Central US
# See: https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/fine-tuning?tabs=azure-openai&pivots=programming-language-python#prerequisites
response = client.fine_tuning.jobs.create(
    training_file=training_file_id,
    validation_file=validation_file_id,
    model="gpt-4.1-2025-04-14", # Enter base model name. Note that in Azure OpenAI the model name contains dashes and cannot contain dot/period characters.
    seed = 105  # seed parameter controls reproducibility of the fine-tuning job. If no seed is specified one will be generated automatically.
)

job_id = response.id

# You can use the job ID to monitor the status of the fine-tuning job.
# The fine-tuning job will take some time to start and complete.
print("Job ID:", response.id)
print("Status:", response.id)
print(response.model_dump_json(indent=2))
```

**Output:**
```
Job ID: ftjob-966a5a930e6d4404884f52441e7688c8
Status: ftjob-966a5a930e6d4404884f52441e7688c8
{
  "id": "ftjob-966a5a930e6d4404884f52441e7688c8",
  "created_at": 1756781454,
  "error": null,
  "fine_tuned_model": null,
  "finished_at": null,
  "hyperparameters": {
    "batch_size": -1,
    "learning_rate_multiplier": 2.0,
    "n_epochs": -1
  },
  "model": "gpt-4.1-2025-04-14",
  "object": "fine_tuning.job",
  "organization_id": null,
  "result_files": null,
  "seed": 105,
  "status": "pending",
  "trained_tokens": null,
  "training_file": "file-c1f30f933c994917a333bcd3245bf1a2",
  "validation_file": "file-8ff69b40f83b4c389d49c7cfd6648ade",
  "estimated_finish": 1756782534,
  "integrations": null,
  "metadata": null,
  "method": null
}
```

**Reflection:**
```json
{
  "question": "What is this API call accomplishing and why is it necessary?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }
  ]
}
```

## [MARKDOWN]
---

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

# If the job isn't done yet, poll it every 10 seconds.
while status not in ["succeeded", "failed"]:
    time.sleep(10)

    response = client.fine_tuning.jobs.retrieve(job_id)
    print(response.model_dump_json(indent=2))
    print("Elapsed time: {} minutes {} seconds".format(int((time.time() - start_time) // 60), int((time.time() - start_time) % 60)))
    status = response.status
    print(f'Status: {status}')
    clear_output(wait=True)

print(f'Fine-tuning job {job_id} finished with status: {status}')

# List all fine-tuning jobs for this resource.
print('Checking other fine-tune jobs for this resource.')
response = client.fine_tuning.jobs.list()
print(f'Found {len(response.data)} fine-tune jobs.')
```

**Output:**
```
Fine-tuning job ftjob-966a5a930e6d4404884f52441e7688c8 finished with status: succeeded
Checking other fine-tune jobs for this resource.
Found 7 fine-tune jobs.
```

**Reflection:**
```json
{
  "question": "What does this code do and why are these imports important?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }
  ]
}
```

## [MARKDOWN]
---

### 7. List Fine-Tuning Events

## [CODE]
```python
response = client.fine_tuning.jobs.list_events(fine_tuning_job_id=job_id, limit=10)
print(response.model_dump_json(indent=2))
```

**Output:**
```
{
  "data": [
    {
      "id": "ftevent-bed5f4d0a6be40819e57128d9e02e38f",
      "created_at": 1756785464,
      "level": "info",
      "message": "Training tokens billed: 8000",
      "object": "fine_tuning.job.event",
      "data": null,
      "type": "message"
    },
    {
      "id": "ftevent-82fe89561abf40e49885a58907069382",
      "created_at": 1756785464,
      "level": "info",
      "message": "Completed results file: file-0c148cb0d4f74fa68cf94e9ce9649037",
      "object": "fine_tuning.job.event",
      "data": null,
      "type": "message"
    },
    {
      "id": "ftevent-a726e160a70a4521bb6764c5b3f98214",
      "created_at": 1756785463,
      "level": "info",
      "message": "Model Evaluation Passed.",
      "object": "fine_tuning.job.event",
      "data": null,
      "type": "message"
    },
    {
      "id": "ftevent-e8f18633896644b38e66504fed92ce8e",
      "created_at": 1756785455,
      "level": "info",
      "message": "Job succeeded.",
      "object": "fine_tuning.job.event",
      "data": null,
      "type": "message"
    },
    {
      "id": "ftevent-008dde9d09d6b42008dde9d09d6b4200",
      "created_at": 1756783636,
      "level": "info",
      "message": "Step 120: training loss=1.0537992715835571",
      "object": "fine_tuning.job.event",
      "data": {
        "step": 120,
        "train_loss": 1.0537992715835571,
        "train_mean_token_accuracy": 0.6190476417541504,
        "valid_loss": 1.059517822265625,
        "valid_mean_token_accuracy": 0.68,
        "full_valid_loss": 1.2260964284301274,
        "full_valid_mean_token_accuracy": 0.6798418972332015
      },
      "type": "metrics"
    },
    {
      "id": "ftevent-008dde9d0977561008dde9d097756100",
      "created_at": 1756783626,
      "level": "info",
      "message": "Step 110: training loss=0.992326557636261",
      "object": "fine_tuning.job.event",
      "data": {
        "step": 110,
        "train_loss": 0.992326557636261,
        "train_mean_token_accuracy": 0.739130437374115,
        "valid_loss": 2.476991946880634,
        "valid_mean_token_accuracy": 0.5384615384615384
      },
      "type": "metrics"
    },
    {
      "id": "ftevent-008dde9d0917f80008dde9d0917f8000",
      "created_at": 1756783616,
      "level": "info",
      "message": "Step 100: training loss=0.8933090567588806",
      "object": "fine_tuning.job.event",
      "data": {
        "step": 100,
        "train_loss": 0.8933090567588806,
        "train_mean_token_accuracy": 0.739130437374115,
        "valid_loss": 1.0277214813232423,
        "valid_mean_token_accuracy": 0.64
      },
      "type": "metrics"
    },
    {
      "id": "ftevent-008dde9d08b899f008dde9d08b899f00",
      "created_at": 1756783606,
      "level": "info",
      "message": "Step 90: training loss=1.266113042831421",
      "object": "fine_tuning.job.event",
      "data": {
        "step": 90,
        "train_loss": 1.266113042831421,
        "train_mean_token_accuracy": 0.6521739363670349,
        "valid_loss": 1.5176541010538738,
        "valid_mean_token_accuracy": 0.5416666666666666
      },
      "type": "metrics"
    },
    {
      "id": "ftevent-008dde9d08593be008dde9d08593be00",
      "created_at": 1756783596,
      "level": "info",
      "message": "Step 80: training loss=1.271457314491272",
      "object": "fine_tuning.job.event",
      "data": {
        "step": 80,
        "train_loss": 1.271457314491272,
        "train_mean_token_accuracy": 0.7200000286102295,
        "valid_loss": 1.3890651420310691,
        "valid_mean_token_accuracy": 0.6666666666666666,
        "full_valid_loss": 1.2668834354566492,
        "full_valid_mean_token_accuracy": 0.6482213438735178
      },
      "type": "metrics"
    },
    {
      "id": "ftevent-008dde9d07f9ddd008dde9d07f9ddd00",
      "created_at": 1756783586,
      "level": "info",
      "message": "Step 70: training loss=1.4114105701446533",
      "object": "fine_tuning.job.event",
      "data": {
        "step": 70,
        "train_loss": 1.4114105701446533,
        "train_mean_token_accuracy": 0.5600000023841858,
        "valid_loss": 1.480299289409931,
        "valid_mean_token_accuracy": 0.6923076923076923
      },
      "type": "metrics"
    }
  ],
  "has_more": true,
  "object": "list"
}
```

**Reflection:**
```json
{
  "question": "What is this API call accomplishing and why is it necessary?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }
  ]
}
```

## [MARKDOWN]
---

## [MARKDOWN]
### 8. List Fine-Tuning Checkpoints

## [CODE]
```python
response = client.fine_tuning.jobs.checkpoints.list(job_id)
print(response.model_dump_json(indent=2))
```

**Output:**
```
{
  "data": [
    {
      "id": "ftchkpt-f0d5c6ec941149a4bc93ff4e5186fda0",
      "created_at": 1756784151,
      "fine_tuned_model_checkpoint": "gpt-4.1-2025-04-14.ft-966a5a930e6d4404884f52441e7688c8",
      "fine_tuning_job_id": "ftjob-966a5a930e6d4404884f52441e7688c8",
      "metrics": {
        "full_valid_loss": 1.2260964284301274,
        "full_valid_mean_token_accuracy": 0.6798418972332015,
        "step": 120.0,
        "train_loss": 1.0537992715835571,
        "train_mean_token_accuracy": 0.6190476417541504,
        "valid_loss": 1.059517822265625,
        "valid_mean_token_accuracy": 0.68
      },
      "object": "fine_tuning.job.checkpoint",
      "step_number": 120
    },
    {
      "id": "ftchkpt-ac5ed19b948645c28d5b19a87dffa789",
      "created_at": 1756783956,
      "fine_tuned_model_checkpoint": "gpt-4.1-2025-04-14.ft-966a5a930e6d4404884f52441e7688c8:ckpt-step-80",
      "fine_tuning_job_id": "ftjob-966a5a930e6d4404884f52441e7688c8",
      "metrics": {
        "full_valid_loss": 1.2668834354566492,
        "full_valid_mean_token_accuracy": 0.6482213438735178,
        "step": 80.0,
        "train_loss": 1.271457314491272,
        "train_mean_token_accuracy": 0.7200000286102295,
        "valid_loss": 1.3890651420310691,
        "valid_mean_token_accuracy": 0.6666666666666666
      },
      "object": "fine_tuning.job.checkpoint",
      "step_number": 80
    },
    {
      "id": "ftchkpt-95fdfaf31ded4e1fbd90cb8b4b4df12e",
      "created_at": 1756783768,
      "fine_tuned_model_checkpoint": "gpt-4.1-2025-04-14.ft-966a5a930e6d4404884f52441e7688c8:ckpt-step-40",
      "fine_tuning_job_id": "ftjob-966a5a930e6d4404884f52441e7688c8",
      "metrics": {
        "full_valid_loss": 1.781834651358985,
        "full_valid_mean_token_accuracy": 0.5612648221343873,
        "step": 40.0,
        "train_loss": 1.9471086263656616,
        "train_mean_token_accuracy": 0.5600000023841858,
        "valid_loss": 1.1534371058146158,
        "valid_mean_token_accuracy": 0.7
      },
      "object": "fine_tuning.job.checkpoint",
      "step_number": 40
    }
  ],
  "has_more": false,
  "object": "list"
}
```

**Reflection:**
```json
{
  "question": "What is this API call accomplishing and why is it necessary?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }
  ]
}
```

## [MARKDOWN]
---

## [MARKDOWN]
### 9. Retrieve Fine-Tuned Model Name

## [CODE]
```python
# Retrieve fine_tuned_model name

response = client.fine_tuning.jobs.retrieve(job_id)

print(response.model_dump_json(indent=2))
fine_tuned_model = response.fine_tuned_model
```

**Output:**
```
{
  "id": "ftjob-966a5a930e6d4404884f52441e7688c8",
  "created_at": 1756781454,
  "error": null,
  "fine_tuned_model": "gpt-4.1-2025-04-14.ft-966a5a930e6d4404884f52441e7688c8",
  "finished_at": 1756785464,
  "hyperparameters": {
    "batch_size": 1,
    "learning_rate_multiplier": 2.0,
    "n_epochs": 3
  },
  "model": "gpt-4.1-2025-04-14",
  "object": "fine_tuning.job",
  "organization_id": null,
  "result_files": [
    "file-0c148cb0d4f74fa68cf94e9ce9649037"
  ],
  "seed": 105,
  "status": "succeeded",
  "trained_tokens": 10440,
  "training_file": "file-c1f30f933c994917a333bcd3245bf1a2",
  "validation_file": "file-8ff69b40f83b4c389d49c7cfd6648ade",
  "estimated_finish": 1756783104,
  "integrations": null,
  "metadata": null,
  "method": null
}
```

**Reflection:**
```json
{
  "question": "What is this API call accomplishing and why is it necessary?",
  "type": "multiple-choice",
  "choices": [
    {
      "text": "Option A",
      "correct": true,
      "feedback": "Correct! [Add explanation here]"
    },
    {
      "text": "Option B",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option C",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    },
    {
      "text": "Option D",
      "correct": false,
      "feedback": "Incorrect. [Add explanation here]"
    }
  ]
}
```

## [MARKDOWN]
---

### 10. Deploy Fine-Tuned Model For Testing

For now - we deployed this manually from the Azure AI Foundry Portal - using the **developer tier** which allows us to test our fine-tuned model for the cost of just inferencing. Once we deploy it, we can try it out

## [MARKDOWN]
> Prompt 1: What kind of paint should I buy for my outdoor deck?

```txt
🪵 Deck protection options! Semi-Transparent Deck Stain at 38 enhances wood grain, or Deck & Fence Stain at 36 for UV protection?
```

## [MARKDOWN]
> Prompt 2: I'm painting over rust - what spray paint should I use?

👍 Right choice! Rust Prevention Spray at $13 applies directly over rust with long-lasting protection. Primer recommendation?

## [MARKDOWN]
**Insights**

In both the examples above we can note that the response now accurately follows our Zava guidelines for "polite, factual and helpful"
- Every response starts with an emoji
- The first sentence is always an acknowledgement of the user ("polite")
- The next sentence is always an informative segment ("factual")
- The final senteance is always an offer to follow up ("helpful")

And note that we have the succinct responses we were looking for _without adding few-shot examples_, making the prompts shorter and thus saving both token costs and processing latency.

## [MARKDOWN]
---
### Teardown

Once you are done with this lab, don't forget to tear down the infrastructure. The developer tier model will be torn down automatically (after 24 hours?) but it is better to proactively delete the resource group and release all model quota.

## [STEP_NAVIGATION]
Next: Be More Cost-Effective With Distillation

## [MARKDOWN]

