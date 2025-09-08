export const PROVIDERS = {
  ollama: {
    name: "Ollama (Local)",
    max_tokens: 131_000,
    id: "ollama",
    endpoint: process.env.OLLAMA_API_URL || "http://localhost:11434",
  },
};

// Default models - will be replaced by dynamic models from Ollama
export const DEFAULT_MODELS = [
  {
    value: "deepseek-v3:latest",
    label: "DeepSeek V3",
    providers: ["ollama"],
    autoProvider: "ollama",
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
  }));
};
