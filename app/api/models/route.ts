import { NextResponse } from "next/server";

// Custom models that are always available (disabled - use only real Ollama models)
const CUSTOM_MODELS: any[] = [
  // Removed fake models - only show actually installed Ollama models
];

// Llama API models that are always available if API key is configured
const LLAMA_MODELS = [
  // Latest Llama 4 Models (2025)
  {
    value: "Llama-4-Maverick-17B-128E-Instruct-FP8",
    label: "Llama 4 Maverick 17B (Latest)",
    provider: "llama",
    isThinker: true,
  },
  {
    value: "Llama-4-Scout-8B-64E-Instruct-FP8",
    label: "Llama 4 Scout 8B (Latest)",
    provider: "llama",
  },
  // Llama 3.1 Models
  {
    value: "llama3.1-405b-instruct",
    label: "Llama 3.1 405B Instruct",
    provider: "llama",
  },
  {
    value: "llama3.1-70b-instruct",
    label: "Llama 3.1 70B Instruct",
    provider: "llama",
  },
  {
    value: "llama3.1-8b-instruct",
    label: "Llama 3.1 8B Instruct",
    provider: "llama",
  },
  // Llama 3.2 Models
  {
    value: "llama3.2-90b-instruct",
    label: "Llama 3.2 90B Instruct",
    provider: "llama",
  },
  {
    value: "llama3.2-11b-instruct",
    label: "Llama 3.2 11B Instruct",
    provider: "llama",
  },
  {
    value: "llama3.2-3b-instruct",
    label: "Llama 3.2 3B Instruct",
    provider: "llama",
  },
  {
    value: "llama3.2-1b-instruct",
    label: "Llama 3.2 1B Instruct",
    provider: "llama",
  },
];

export async function GET() {
  try {
    const ollamaEndpoint = process.env.OLLAMA_API_URL || "http://localhost:11434";
    const ollamaApiKey = process.env.OLLAMA_API_KEY;
    
    // Prepare headers for Ollama API
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header if API key is available (for Ollama Turbo)
    if (ollamaApiKey) {
      headers['Authorization'] = `Bearer ${ollamaApiKey}`;
    }
    
    // Fetch available models from Ollama
    const response = await fetch(`${ollamaEndpoint}/api/tags`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Ollama models to our format
    const ollamaModels = data.models?.map((model: any) => ({
      value: model.name,
      label: model.name.split(':')[0], // Remove tag for display
      size: model.size,
      modified: model.modified_at,
      details: model.details,
      provider: "ollama",
      // Enable thinking mode for DeepSeek V3 and R1 models
      isThinker: model.name.includes('deepseek-v3') || model.name.includes('deepseek-r1'),
    })) || [];
    
    // Add Llama API models if API key is configured
    const llamaApiKey = process.env.LLAMA_API_KEY;
    const allModels = [
      ...(llamaApiKey ? LLAMA_MODELS : []),
      ...ollamaModels
    ];
    
    return NextResponse.json({
      ok: true,
      models: allModels,
      hasLlamaApi: !!llamaApiKey,
    });
  } catch (error: any) {
    console.error("Error fetching Ollama models:", error);
    
    // Return default models if Ollama is not available
    const llamaApiKey = process.env.LLAMA_API_KEY;
    const defaultOllamaModels = [
      {
        value: "deepseek-v3:latest",
        label: "DeepSeek V3",
        provider: "ollama",
        isThinker: true,
      },
      {
        value: "llama3.2:latest",
        label: "Llama 3.2",
        provider: "ollama",
      },
      {
        value: "qwen2.5-coder:latest",
        label: "Qwen 2.5 Coder",
        provider: "ollama",
      },
    ];
    
    // Add Llama API models if API key is configured
    const fallbackModels = [
      ...(llamaApiKey ? LLAMA_MODELS : []),
      ...defaultOllamaModels
    ];
    
    return NextResponse.json({
      ok: true,
      models: fallbackModels,
      fallback: true,
      hasLlamaApi: !!llamaApiKey,
      error: error.message,
    });
  }
}