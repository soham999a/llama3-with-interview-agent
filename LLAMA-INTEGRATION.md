# Llama Integration for Interview Agent

This document explains how the Interview Agent application has been modified to use Llama 3 (via Ollama) instead of Google Gemini API.

## Overview

The Interview Agent previously used Google Gemini API for two main functions:
1. Generating interview questions based on job role, experience level, and tech stack
2. Analyzing interview transcripts and providing detailed feedback

This integration replaces Gemini API with Llama 3, an open-source large language model that can be self-hosted using Ollama, eliminating API costs and usage limitations.

## Prerequisites

- Node.js (v16+)
- Ollama (for running Llama models locally)
- At least 16GB RAM
- GPU recommended for better performance (NVIDIA with 8GB+ VRAM)

## Setup Instructions

### 1. Install Ollama

Ollama is a tool for running large language models locally.

1. Download and install Ollama from [https://ollama.ai/](https://ollama.ai/)
2. Start Ollama

### 2. Download Llama 3 Model

```bash
# Pull the Llama 3 model
ollama pull llama3
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```
# Ollama Configuration
OLLAMA_ENDPOINT=http://localhost:11434/api/generate
LLAMA_QUESTION_MODEL=llama3
LLAMA_FEEDBACK_MODEL=llama3
```

### 4. Install Dependencies

```bash
npm install axios
```

## Implementation Details

### 1. Llama Adapter

A new adapter (`lib/llama-adapter.ts`) has been created to replace the Google AI SDK. This adapter:
- Provides the same interface as the Google AI SDK
- Handles communication with the Ollama API
- Includes robust error handling and JSON parsing

### 2. Question Generation

The question generation endpoint (`app/api/vapi/generate/route.ts`) has been updated to:
- Use the Llama adapter instead of Google AI SDK
- Send prompts to the Llama 3 model
- Parse and format the responses

### 3. Feedback Generation

The feedback generation function (`lib/actions/general.action.ts`) has been updated to:
- Use the Llama adapter instead of Google AI SDK
- Include a detailed JSON schema in the prompt
- Handle and fix any JSON formatting issues

## Performance Considerations

- Llama 3 models require significant RAM and CPU/GPU resources
- First-time responses may be slower as the model loads into memory
- Consider implementing caching for common questions to improve performance
- Add timeout handling for long-running requests

## Comparison with Gemini API

| Feature | Gemini API | Llama 3 |
|---------|------------|---------|
| Cost | Pay per token | Free (self-hosted) |
| Hosting | Cloud-based | Self-hosted |
| Rate Limits | Yes | No |
| Setup Complexity | Low | Medium |
| Hardware Requirements | None | High |
| Output Quality | High | Comparable |
| Maintenance | None | Required |

## Troubleshooting

### Common Issues

1. **Model Not Found Error**:
   - Make sure Ollama is running
   - Verify that you've pulled the llama3 model with `ollama pull llama3`

2. **JSON Parsing Errors**:
   - The adapter includes robust JSON fixing capabilities
   - Check the raw response in the logs for debugging

3. **Slow Responses**:
   - First request may be slow as the model loads into memory
   - Consider using a smaller model if performance is an issue

4. **Out of Memory Errors**:
   - Increase your system's swap space
   - Consider using a smaller model or running on a machine with more RAM

## Future Improvements

1. **Caching**: Implement caching for common questions and responses
2. **Model Optimization**: Fine-tune the model for interview-specific tasks
3. **Parallel Processing**: Handle multiple requests efficiently
4. **Fallback Mechanism**: Add fallback to cloud APIs when local processing fails
