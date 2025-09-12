export const PROVIDERS = {
  ollama: {
    name: "Ollama Turbo (Cloud)",
    max_tokens: 131_000,
    id: "ollama",
    endpoint: process.env.OLLAMA_API_URL || "http://localhost:11434",
  },
};

// Default models - will be replaced by dynamic models from Ollama
export const DEFAULT_MODELS = [
  // Ollama Turbo Models (cloud-based)
  {
    value: "gpt-oss:20b",
    label: "GPT-OSS 20B (Turbo)",
    providers: ["ollama"],
    autoProvider: "ollama",
  },
  {
    value: "gpt-oss:120b", 
    label: "GPT-OSS 120B (Turbo)",
    providers: ["ollama"],
    autoProvider: "ollama",
  },
  {
    value: "deepseek-v3.1:671b",
    label: "DeepSeek V3.1 671B (Turbo)",
    providers: ["ollama"],
    autoProvider: "ollama",
    isThinker: true,
  },
  // Local Ollama Models (fallback)
  {
    value: "deepseek-v3:latest",
    label: "DeepSeek V3",
    providers: ["ollama"],
    autoProvider: "ollama",
    isThinker: true,
  },
  {
    value: "llama3.2:latest",
    label: "Llama 3.2",
    providers: ["ollama"],
    autoProvider: "ollama",
  },
  {
    value: "qwen2.5-coder:latest",
    label: "Qwen 2.5 Coder",
    providers: ["ollama"],
    autoProvider: "ollama",
  },
  {
    value: "mistral:latest",
    label: "Mistral",
    providers: ["ollama"],
    autoProvider: "ollama",
  },
  {
    value: "codellama:latest",
    label: "Code Llama",
    providers: ["ollama"],
    autoProvider: "ollama",
  },
];

// This will be populated dynamically from the API
export let MODELS = DEFAULT_MODELS;

// Function to update models dynamically
export const updateModels = (newModels: any[]) => {
  MODELS = newModels.map(model => ({
    ...model,
    providers: ["ollama"],
    autoProvider: "ollama",
    // Preserve isThinker flag if present, or check for DeepSeek V3 models
    isThinker: model.isThinker || model.value?.includes('deepseek-v3') || model.value?.includes('deepseek-r1'),
  }));
};
