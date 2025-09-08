# Ollama Setup Guide

This guide explains how to set up DeepSite with Ollama for local AI model execution.

## Prerequisites

1. Ollama installed on your system
2. Node.js 18+ and npm
3. (Optional) Ollama Turbo API Proxy for cloud acceleration

## Setup Instructions

### Option 1: Regular Ollama (Recommended)

#### 1. Install Ollama

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Or download from https://ollama.com/download
```

#### 2. Pull Models

```bash
# Pull any models you want to use
ollama pull deepseek-v3:latest
ollama pull llama3.2:latest
ollama pull qwen2.5-coder:latest
ollama pull mistral:latest
ollama pull codellama:latest
```

#### 3. Configure DeepSite

Create a `.env.local` file in the DeepSite root directory:

```env
# Point to your Ollama endpoint (default)
OLLAMA_API_URL=http://localhost:11434

# Optional: MongoDB for project storage
MONGODB_URI=mongodb://localhost:27017/deepsite

# Optional: Rate limiting
MAX_REQUESTS_PER_IP=100
```

### Option 2: Ollama Turbo API Proxy

If you have an Ollama Turbo subscription for cloud acceleration:

#### 1. Setup Ollama Turbo API Proxy

```bash
# Clone the Ollama Turbo API Proxy
git clone https://github.com/micheleminardidev/Ollama-Turbo-API-Proxy.git
cd Ollama-Turbo-API-Proxy

# Follow the proxy setup instructions in its README
# Configure it to use your Ollama Turbo subscription
```

#### 2. Configure DeepSite

Update your `.env.local` to point to the proxy:

```env
# Point to your Ollama Turbo API Proxy endpoint
OLLAMA_API_URL=http://localhost:8080  # Or wherever your proxy runs

# Optional settings same as above
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Run DeepSite

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Features

### Dynamic Model Selection

DeepSite automatically detects all models available in your Ollama installation. The model dropdown will show:
- All locally installed Ollama models
- Model sizes and modification dates
- Automatic refresh every 30 seconds

### Supported Models

Any model that works with Ollama is supported, including:
- DeepSeek V3
- Llama 3.2
- Qwen 2.5 Coder
- Mistral
- Code Llama
- Custom models

### Model Management

```bash
# List available models
ollama list

# Pull a new model
ollama pull model-name:tag

# Remove a model
ollama rm model-name:tag
```

## Troubleshooting

### Connection Issues

If you can't connect to Ollama:

1. Verify Ollama is running: `ollama serve`
2. Check the `OLLAMA_API_URL` in your `.env.local` file
3. Ensure Ollama is accessible at the configured endpoint

### Models Not Showing

If models don't appear in the dropdown:

1. Verify models are installed: `ollama list`
2. Check the browser console for API errors
3. Ensure the `/api/models` endpoint is accessible

### Slow Performance

For better performance:

1. Use smaller models for faster responses
2. Consider using Ollama Turbo API Proxy for cloud acceleration
3. Ensure adequate RAM for the model size

## Architecture

- **No External Authentication**: The app runs without requiring Hugging Face or other external auth services
- **Dynamic Model Detection**: Automatically discovers and lists all available Ollama models
- **Local AI Processing**: All AI processing happens through your Ollama instance
- **Simple Setup**: No complex OAuth or API key management required