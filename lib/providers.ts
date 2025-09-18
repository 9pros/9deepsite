export const PROVIDERS = {
  ollama: {
    name: "Ollama Turbo (Cloud)",
    max_tokens: 131_000,
    id: "ollama",
    endpoint: process.env.OLLAMA_API_URL || "http://localhost:11434",
  },
  llama: {
    name: "Llama API",
    max_tokens: 128_000,
    id: "llama",
    endpoint: process.env.LLAMA_API_URL || "https://api.llama.com/v1",
    apiKey: process.env.LLAMA_API_KEY,
  },
};

// Default models - will be replaced by dynamic models from Ollama
export const DEFAULT_MODELS = [
  // Available Local Models
  {
    value: "llama3.2:3b",
    label: "Llama 3.2 3B (Local)",
    providers: ["ollama"],
    autoProvider: "ollama",
  },
  {
    value: "deepseek-r1:14b",
    label: "DeepSeek R1 14B (Local)",
    providers: ["ollama"],
    autoProvider: "ollama",
    isThinker: true,
  },
  // Llama API Models
  {
    value: "llama3.3-70b",
    label: "Llama 3.3 70B",
    providers: ["llama"],
    autoProvider: "llama",
  },
  {
    value: "llama3.2-90b",
    label: "Llama 3.2 90B",
    providers: ["llama"],
    autoProvider: "llama",
  },
  {
    value: "llama3.2-11b-vision",
    label: "Llama 3.2 11B Vision",
    providers: ["llama"],
    autoProvider: "llama",
  },
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
export const updateModels = (newModels: Array<{
  provider?: string;
  value?: string;
  isThinker?: boolean;
  [key: string]: unknown;
}>) => {
  MODELS = newModels.map(model => {
    // Check if this is a Llama API model
    const isLlamaModel = model.provider === 'llama' ||
                       model.value?.includes('llama3.3') ||
                       model.value?.includes('llama3.2');

    return {
      ...model,
      providers: [model.provider || (isLlamaModel ? "llama" : "ollama")],
      autoProvider: model.provider || (isLlamaModel ? "llama" : "ollama"),
      // Preserve isThinker flag if present, or check for DeepSeek V3 models
      isThinker: model.isThinker || model.value?.includes('deepseek-v3') || model.value?.includes('deepseek-r1'),
    };
  });
};
