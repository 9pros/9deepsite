import { useEffect, useState } from 'react';
import { DEFAULT_MODELS, updateModels } from '@/lib/providers';

export function useOllamaModels() {
  const [models, setModels] = useState(DEFAULT_MODELS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models');
        const data = await response.json();
        
        if (data.ok && data.models && data.models.length > 0) {
          const formattedModels = data.models.map((model: any) => ({
            value: model.value,
            label: model.label || model.value,
            providers: ["ollama"],
            autoProvider: "ollama",
            // Enable thinking mode for DeepSeek V3 models
            isThinker: model.value.includes('deepseek-v3') || model.value.includes('deepseek-r1'),
          }));
          
          setModels(formattedModels);
          updateModels(formattedModels);
        } else if (data.fallback) {
          // Use fallback models if Ollama is not available
          setModels(data.models);
          updateModels(data.models);
        }
      } catch (err) {
        console.error('Failed to fetch Ollama models:', err);
        setError('Failed to fetch models');
        // Keep using default models on error
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
    
    // Refresh models every 30 seconds
    const interval = setInterval(fetchModels, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { models, loading, error };
}