import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ollamaEndpoint = process.env.OLLAMA_API_URL || "http://localhost:11434";
    
    // Fetch available models from Ollama
    const response = await fetch(`${ollamaEndpoint}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Ollama models to our format
    const models = data.models?.map((model: any) => ({
      value: model.name,
      label: model.name.split(':')[0], // Remove tag for display
      size: model.size,
      modified: model.modified_at,
      details: model.details,
    })) || [];
    
    return NextResponse.json({
      ok: true,
      models,
    });
  } catch (error: any) {
    console.error("Error fetching Ollama models:", error);
    
    // Return default models if Ollama is not available
    return NextResponse.json({
      ok: true,
      models: [
        {
          value: "deepseek-v3:latest",
          label: "DeepSeek V3",
        },
        {
          value: "llama3.2:latest",
          label: "Llama 3.2",
        },
        {
          value: "qwen2.5-coder:latest",
          label: "Qwen 2.5 Coder",
        },
      ],
      fallback: true,
      error: error.message,
    });
  }
}