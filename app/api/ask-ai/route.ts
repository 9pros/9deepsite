/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { MODELS, PROVIDERS } from "@/lib/providers";
import {
  DIVIDER,
  FOLLOW_UP_SYSTEM_PROMPT,
  INITIAL_SYSTEM_PROMPT,
  MAX_REQUESTS_PER_IP,
  NEW_PAGE_END,
  NEW_PAGE_START,
  REPLACE_END,
  SEARCH_START,
  UPDATE_PAGE_START,
  UPDATE_PAGE_END,
} from "@/lib/prompts";
import MY_TOKEN_KEY from "@/lib/get-cookie-name";
import { Page } from "@/types";
import { extractBusinessContext, generateImageUrls, detectIndustry } from "@/lib/image-service";
// import { detectIndustryFromContext, generateIndustryImageSet } from "@/lib/smart-image-service";

// Rate limiting with automatic cleanup
const ipAddresses = new Map();
const ipTimestamps = new Map();

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamp] of ipTimestamps.entries()) {
    if (now - timestamp > 3600000) { // 1 hour
      ipAddresses.delete(ip);
      ipTimestamps.delete(ip);
    }
  }
}, 3600000);

export async function POST(request: NextRequest) {
  const authHeaders = await headers();
  const userToken = request.cookies.get(MY_TOKEN_KEY())?.value;

  const body = await request.json();
  const { prompt, provider, model, redesignMarkdown, previousPrompts, pages } = body;

  if (!model || (!prompt && !redesignMarkdown)) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Load models directly (same logic as /api/models but without HTTP request)
  let allModels = MODELS;

  try {
    const ollamaEndpoint = process.env.OLLAMA_API_URL || "http://localhost:11434";
    const ollamaApiKey = process.env.OLLAMA_API_KEY;
    const llamaApiKey = process.env.LLAMA_API_KEY;

    // Add Llama API models if API key is configured
    const LLAMA_MODELS = [
      {
        value: "Llama-4-Maverick-17B-128E-Instruct-FP8",
        label: "Llama 4 Maverick 17B (Latest)",
        provider: "llama",
        providers: ["llama"],
        autoProvider: "llama",
        isThinker: true,
      },
      {
        value: "Llama-4-Scout-8B-64E-Instruct-FP8",
        label: "Llama 4 Scout 8B (Latest)",
        provider: "llama",
        providers: ["llama"],
        autoProvider: "llama",
      },
      {
        value: "llama3.1-405b-instruct",
        label: "Llama 3.1 405B Instruct",
        provider: "llama",
        providers: ["llama"],
        autoProvider: "llama",
      },
      {
        value: "llama3.1-70b-instruct",
        label: "Llama 3.1 70B Instruct",
        provider: "llama",
        providers: ["llama"],
        autoProvider: "llama",
      },
      {
        value: "llama3.1-8b-instruct",
        label: "Llama 3.1 8B Instruct",
        provider: "llama",
        providers: ["llama"],
        autoProvider: "llama",
      },
      {
        value: "llama3.2-90b-instruct",
        label: "Llama 3.2 90B Instruct",
        provider: "llama",
        providers: ["llama"],
        autoProvider: "llama",
      },
      {
        value: "llama3.2-11b-instruct",
        label: "Llama 3.2 11B Instruct",
        provider: "llama",
        providers: ["llama"],
        autoProvider: "llama",
      },
      {
        value: "llama3.2-3b-instruct",
        label: "Llama 3.2 3B Instruct",
        provider: "llama",
        providers: ["llama"],
        autoProvider: "llama",
      },
      {
        value: "llama3.2-1b-instruct",
        label: "Llama 3.2 1B Instruct",
        provider: "llama",
        providers: ["llama"],
        autoProvider: "llama",
      },
    ];

    // Try to get Ollama models
    let ollamaModels: any[] = [];
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (ollamaApiKey) {
        headers['Authorization'] = `Bearer ${ollamaApiKey}`;
      }

      const response = await fetch(`${ollamaEndpoint}/api/tags`, { headers });
      if (response.ok) {
        const data = await response.json();
        ollamaModels = data.models?.map((m: any) => ({
          value: m.name,
          label: m.name.split(':')[0],
          provider: "ollama",
          providers: ["ollama"],
          autoProvider: "ollama",
          isThinker: m.name.includes('deepseek-v3') || m.name.includes('deepseek-r1'),
        })) || [];
      }
    } catch (error) {
      console.warn('Failed to fetch Ollama models');
    }

    // Combine all models
    allModels = [
      ...(llamaApiKey ? LLAMA_MODELS : []),
      ...ollamaModels
    ];
  } catch (error) {
    console.warn('Failed to load dynamic models, using static fallback');
  }

  // Find the selected model
  const selectedModel = allModels.find(
    (m) => m.value === model || m.label === model
  ) || {
    value: model,
    label: model,
    providers: ["ollama"],
    autoProvider: "ollama",
  };

  // For auto provider, use the model's preferred provider
  const actualProvider = provider === "auto" ? selectedModel.autoProvider : provider;

  console.log(`DEBUG: model=${model}, provider=${provider}, selectedModel.autoProvider=${selectedModel.autoProvider}, actualProvider=${actualProvider}, selectedModel.providers=${JSON.stringify(selectedModel.providers)}`);

  if (!selectedModel.providers.includes(actualProvider)) {
    return NextResponse.json(
      {
        ok: false,
        error: `The selected model "${model}" does not support the "${actualProvider}" provider. Available providers: ${selectedModel.providers.join(", ")}`,
        openSelectProvider: true,
      },
      { status: 400 }
    );
  }

  // Disabled rate limiting for local Ollama usage
  // Uncomment below to enable rate limiting if needed
  /*
  const ip = authHeaders.get("x-forwarded-for")?.includes(",")
    ? authHeaders.get("x-forwarded-for")?.split(",")[1].trim()
    : authHeaders.get("x-forwarded-for");

  const now = Date.now();
  const lastRequest = ipTimestamps.get(ip) || 0;
  
  // Reset counter if more than 1 minute has passed
  if (now - lastRequest > 60000) {
    ipAddresses.set(ip, 1);
    ipTimestamps.set(ip, now);
  } else {
    ipAddresses.set(ip, (ipAddresses.get(ip) || 0) + 1);
    ipTimestamps.set(ip, now);
    
    if (ipAddresses.get(ip) > (MAX_REQUESTS_PER_IP || 1000)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Rate limit exceeded. Please wait a minute before making more requests.",
        },
        { status: 429 }
      );
    }
  }
  */

  const DEFAULT_PROVIDER = PROVIDERS.ollama;
  const selectedProvider = PROVIDERS[actualProvider as keyof typeof PROVIDERS] ?? DEFAULT_PROVIDER;

  // Smart industry detection for better image matching
  let detectedIndustry = 'technology';
  
  if (redesignMarkdown) {
    // For redesigns, detect from the URL and markdown content
    const urlMatch = redesignMarkdown.match(/https?:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : '';
    detectedIndustry = detectIndustry(url, redesignMarkdown);
  } else if (prompt) {
    // For new sites, extract from prompt
    const businessContext = extractBusinessContext(prompt);
    detectedIndustry = businessContext.industry;
  }
  
  // Get the industry-specific images from PEXELS_IMAGES
  const PEXELS_IMAGES = {
    hvac: {
      hero: 'https://images.pexels.com/photos/3964341/pexels-photo-3964341.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
      service1: 'https://images.pexels.com/photos/3964704/pexels-photo-3964704.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service2: 'https://images.pexels.com/photos/5463576/pexels-photo-5463576.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service3: 'https://images.pexels.com/photos/7641474/pexels-photo-7641474.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service4: 'https://images.pexels.com/photos/8853505/pexels-photo-8853505.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service5: 'https://images.pexels.com/photos/5691604/pexels-photo-5691604.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service6: 'https://images.pexels.com/photos/1854037/pexels-photo-1854037.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      about: 'https://images.pexels.com/photos/5691625/pexels-photo-5691625.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      gallery1: 'https://images.pexels.com/photos/3201763/pexels-photo-3201763.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery2: 'https://images.pexels.com/photos/7031712/pexels-photo-7031712.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery3: 'https://images.pexels.com/photos/4792485/pexels-photo-4792485.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    },
    construction: {
      hero: 'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
      service1: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service2: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service3: 'https://images.pexels.com/photos/3760613/pexels-photo-3760613.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service4: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service5: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      about: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      gallery1: 'https://images.pexels.com/photos/544965/pexels-photo-544965.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery2: 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery3: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    },
    default: {
      hero: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
      service1: 'https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service2: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service3: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service4: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      service5: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      about: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
      gallery1: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery2: 'https://images.pexels.com/photos/3182835/pexels-photo-3182835.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery3: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    }
  };
  
  // Get industry images or default
  const imageSet = PEXELS_IMAGES[detectedIndustry] || PEXELS_IMAGES.default;
  
  // Create image list for the prompt
  const imageList = Object.entries(imageSet)
    .map(([key, url]) => `${key}: ${url}`)
    .join('\n');
  
  // Check if redesign and extract logo URL
  let logoInstruction = '';
  if (redesignMarkdown) {
    // Try to find logo in the markdown
    const logoMatch = redesignMarkdown.match(/!\[.*?logo.*?\]\((.*?)\)/i) || 
                      redesignMarkdown.match(/img.*?src=["'](.*?logo.*?)["']/i) ||
                      redesignMarkdown.match(/logo.*?:.*?(https?:\/\/[^\s"']+)/i);
    if (logoMatch && logoMatch[1]) {
      logoInstruction = `\n\nIMPORTANT: Use the original website's logo: ${logoMatch[1]}`;
    }
  }
  
  // Enhance the prompt with industry and image guidance
  const enhancedPrompt = `${prompt || ''}\n\nCRITICAL: This is a ${detectedIndustry} business.${logoInstruction}\n\nUSE THESE EXACT IMAGES FOR EACH SECTION (DO NOT REUSE THE SAME IMAGE):\n${imageList}\n\nIMPORTANT IMAGE RULES:\n- Use DIFFERENT images for each section\n- Hero section MUST use the 'hero' image\n- Each service card MUST use a different service image (service1, service2, etc.)\n- About section MUST use the 'about' image\n- Gallery MUST use gallery1, gallery2, gallery3 images\n- NEVER use the same image URL twice\n\nMAKE SURE TO:\n1. Use typing animation for H1 headlines with TypeIt.js\n2. Include a multi-step form with progress indicators\n3. Use modern varied layouts (bento grid, split screen, etc.)\n4. Add FAQ section with accordion\n5. Include service areas with expandable sub-areas\n6. Use ALL provided images (not just one)`;
  
  const rewrittenPrompt = enhancedPrompt;

  try {
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const response = new NextResponse(stream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

    (async () => {
      // let completeResponse = "";
      try {
        // Determine which API to call based on provider
        const isLlamaProvider = selectedProvider.id === 'llama';
        
        // API configuration
        const apiEndpoint = isLlamaProvider
          ? (selectedProvider.endpoint || process.env.LLAMA_API_URL || "https://api.llama.com/v1")
          : (selectedProvider.endpoint || process.env.OLLAMA_API_URL || "http://localhost:11434");
        
        const apiKey = isLlamaProvider
          ? (selectedProvider.apiKey || process.env.LLAMA_API_KEY)
          : (selectedProvider.apiKey || process.env.OLLAMA_API_KEY);
        
        // Prepare headers
        const apiHeaders: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        // Add Authorization header if API key is available
        if (apiKey) {
          apiHeaders['Authorization'] = `Bearer ${apiKey}`;
        }
        
        // Prepare request URL based on provider
        const requestUrl = isLlamaProvider 
          ? `${apiEndpoint}/chat/completions`
          : `${apiEndpoint}/api/chat`;
        
        // Prepare request body based on provider
        const requestBody = isLlamaProvider ? {
          model: selectedModel.value,
          messages: [
            {
              role: "system",
              content: INITIAL_SYSTEM_PROMPT,
            },
            ...(pages?.length > 1 ? [{
              role: "assistant",
              content: `Here are the current pages:\n\n${pages.map((p: Page) => `- ${p.path} \n${p.html}`).join("\n")}\n\nNow, please create a new page based on this code. Also here are the previous prompts:\n\n${previousPrompts.map((p: string) => `- ${p}`).join("\n")}`
            }] : []),
            {
              role: "user",
              content: redesignMarkdown
                ? `Here is my current design as a markdown:\n\n${redesignMarkdown}\n\nNow, please create a new design based on this markdown. IMPORTANT: This is a ${detectedIndustry} business. Use relevant ${detectedIndustry} images from the provided image list.`
                : rewrittenPrompt,
            },
          ],
          stream: true,
          max_tokens: selectedProvider.max_tokens,
        } : {
          model: selectedModel.value,
          messages: [
            {
              role: "system",
              content: INITIAL_SYSTEM_PROMPT,
            },
            ...(pages?.length > 1 ? [{
              role: "assistant",
              content: `Here are the current pages:\n\n${pages.map((p: Page) => `- ${p.path} \n${p.html}`).join("\n")}\n\nNow, please create a new page based on this code. Also here are the previous prompts:\n\n${previousPrompts.map((p: string) => `- ${p}`).join("\n")}`
            }] : []),
            {
              role: "user",
              content: redesignMarkdown
                ? `Here is my current design as a markdown:\n\n${redesignMarkdown}\n\nNow, please create a new design based on this markdown. IMPORTANT: This is a ${detectedIndustry} business. Use relevant ${detectedIndustry} images from the provided image list.`
                : rewrittenPrompt,
            },
          ],
          stream: true,
          options: {
            num_predict: selectedProvider.max_tokens,
          }
        };

        const apiResponse = await fetch(requestUrl, {
          method: 'POST',
          headers: apiHeaders,
          body: JSON.stringify(requestBody),
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error(`API Error - Provider: ${isLlamaProvider ? 'Llama' : 'Ollama'}, Model: ${selectedModel.value}, URL: ${requestUrl}, Status: ${apiResponse.status}, Error: ${errorText}`);
          throw new Error(`${isLlamaProvider ? 'Llama' : 'Ollama'} API error: ${apiResponse.statusText} (${apiResponse.status})`);
        }

        const reader = apiResponse.body?.getReader();
        if (!reader) {
          throw new Error(`No response body from ${isLlamaProvider ? 'Llama' : 'Ollama'}`);
        }

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.trim()) {
              try {
                // Handle OpenAI/Llama API format (data: prefix)
                const cleanLine = line.replace(/^data:\s*/, '');
                if (cleanLine === '[DONE]') break;

                console.log(`Stream line (${isLlamaProvider ? 'Llama' : 'Ollama'}):`, cleanLine);

                const json = JSON.parse(cleanLine);

                // Llama API format (Meta's custom format)
                if (isLlamaProvider && json.event?.event_type === 'progress' && json.event?.delta?.text) {
                  console.log('Writing Llama content:', json.event.delta.text);
                  await writer.write(encoder.encode(json.event.delta.text));
                }
                // Ollama API format
                else if (!isLlamaProvider && json.message?.content) {
                  console.log('Writing Ollama content:', json.message.content);
                  await writer.write(encoder.encode(json.message.content));
                }
                // Skip non-progress events (complete, metrics, etc.)
                else if (isLlamaProvider && json.event?.event_type !== 'progress') {
                  console.log('Skipping non-progress event:', json.event?.event_type);
                }
                else {
                  console.log('No content found in JSON:', json);
                }
              } catch (e) {
                console.log('Failed to parse line:', line, 'Error:', e);
              }
            }
          }
        }
      } catch (error: any) {
        await writer.write(
          encoder.encode(
            JSON.stringify({
              ok: false,
              message:
                error.message ||
                "An error occurred while processing your request.",
            })
          )
        );
      } finally {
        try {
          await writer?.close();
        } catch (e) {
          // Stream might already be closed
        }
      }
    })();

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        openSelectProvider: true,
        message:
          error?.message || "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authHeaders = await headers();
  const userToken = request.cookies.get(MY_TOKEN_KEY())?.value;

  const body = await request.json();
  const { prompt, previousPrompts, provider, selectedElementHtml, model, pages, files, } =
    body;

  if (!prompt || pages.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Allow any model name for Ollama since models are dynamic
  const selectedModel = MODELS.find(
    (m) => m.value === model || m.label === model
  ) || {
    value: model,
    label: model,
    providers: ["ollama"],
    autoProvider: "ollama",
  };

  // Disabled rate limiting for local Ollama usage
  // Uncomment below to enable rate limiting if needed
  /*
  const ip = authHeaders.get("x-forwarded-for")?.includes(",")
    ? authHeaders.get("x-forwarded-for")?.split(",")[1].trim()
    : authHeaders.get("x-forwarded-for");

  const now = Date.now();
  const lastRequest = ipTimestamps.get(ip) || 0;
  
  // Reset counter if more than 1 minute has passed
  if (now - lastRequest > 60000) {
    ipAddresses.set(ip, 1);
    ipTimestamps.set(ip, now);
  } else {
    ipAddresses.set(ip, (ipAddresses.get(ip) || 0) + 1);
    ipTimestamps.set(ip, now);
    
    if (ipAddresses.get(ip) > (MAX_REQUESTS_PER_IP || 1000)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Rate limit exceeded. Please wait a minute before making more requests.",
        },
        { status: 429 }
      );
    }
  }
  */

  // Extract business context for follow-up requests too
  const businessContext = extractBusinessContext(prompt || previousPrompts?.join(" ") || "");
  
  const DEFAULT_PROVIDER = PROVIDERS.ollama;
  const selectedProvider =
    provider === "auto"
      ? PROVIDERS[selectedModel.autoProvider as keyof typeof PROVIDERS]
      : PROVIDERS[provider as keyof typeof PROVIDERS] ?? DEFAULT_PROVIDER;

  try {
    // Call Ollama API for non-streaming completion
    const ollamaEndpoint = selectedProvider.endpoint || process.env.OLLAMA_API_URL || "http://localhost:11434";
    const ollamaApiKey = process.env.OLLAMA_API_KEY;
    
    // Prepare headers for Ollama API
    const ollamaHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header if API key is available (for Ollama Turbo)
    if (ollamaApiKey) {
      ollamaHeaders['Authorization'] = `Bearer ${ollamaApiKey}`;
    }
    
    const response = await fetch(`${ollamaEndpoint}/api/chat`, {
      method: 'POST',
      headers: ollamaHeaders,
      body: JSON.stringify({
        model: selectedModel.value,
        messages: [
          {
            role: "system",
            content: FOLLOW_UP_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: previousPrompts
              ? `Also here are the previous prompts:\n\n${previousPrompts.map((p: string) => `- ${p}`).join("\n")}`
              : "You are modifying the HTML file based on the user's request.",
          },
          {
            role: "assistant",

            content: `${
              selectedElementHtml
                ? `\n\nYou have to update ONLY the following element, NOTHING ELSE: \n\n\`\`\`html\n${selectedElementHtml}\n\`\`\``
                : ""
            }. Current pages: ${pages?.map((p: Page) => `- ${p.path} \n${p.html}`).join("\n")}. ${files?.length > 0 ? `Current images: ${files?.map((f: string) => `- ${f}`).join("\n")}.` : ""}`,
          },
          {
            role: "user",
            content: `${prompt}\n\nIMPORTANT: This is a ${businessContext.industry} business. Continue using relevant ${businessContext.industry} images from Unsplash for any new visual elements.`,
          },
        ],
        stream: false,
        options: {
          num_predict: selectedProvider.max_tokens,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const ollamaResult = await response.json();
    const chunk = ollamaResult.message?.content;
    if (!chunk) {
      return NextResponse.json(
        { ok: false, message: "No content returned from the model" },
        { status: 400 }
      );
    }

    if (chunk) {
      const updatedLines: number[][] = [];
      let newHtml = "";
      const updatedPages = [...(pages || [])];

      const updatePageRegex = new RegExp(`${UPDATE_PAGE_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\s]+)\\s*${UPDATE_PAGE_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=${UPDATE_PAGE_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${NEW_PAGE_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|$)`, 'g');
      let updatePageMatch;
      
      while ((updatePageMatch = updatePageRegex.exec(chunk)) !== null) {
        const [, pagePath, pageContent] = updatePageMatch;
        
        const pageIndex = updatedPages.findIndex(p => p.path === pagePath);
        if (pageIndex !== -1) {
          let pageHtml = updatedPages[pageIndex].html;
          
          let processedContent = pageContent;
          const htmlMatch = pageContent.match(/```html\s*([\s\S]*?)\s*```/);
          if (htmlMatch) {
            processedContent = htmlMatch[1];
          }
          let position = 0;
          let moreBlocks = true;

          while (moreBlocks) {
            const searchStartIndex = processedContent.indexOf(SEARCH_START, position);
            if (searchStartIndex === -1) {
              moreBlocks = false;
              continue;
            }

            const dividerIndex = processedContent.indexOf(DIVIDER, searchStartIndex);
            if (dividerIndex === -1) {
              moreBlocks = false;
              continue;
            }

            const replaceEndIndex = processedContent.indexOf(REPLACE_END, dividerIndex);
            if (replaceEndIndex === -1) {
              moreBlocks = false;
              continue;
            }

            const searchBlock = processedContent.substring(
              searchStartIndex + SEARCH_START.length,
              dividerIndex
            );
            const replaceBlock = processedContent.substring(
              dividerIndex + DIVIDER.length,
              replaceEndIndex
            );

            if (searchBlock.trim() === "") {
              pageHtml = `${replaceBlock}\n${pageHtml}`;
              updatedLines.push([1, replaceBlock.split("\n").length]);
            } else {
              const blockPosition = pageHtml.indexOf(searchBlock);
              if (blockPosition !== -1) {
                const beforeText = pageHtml.substring(0, blockPosition);
                const startLineNumber = beforeText.split("\n").length;
                const replaceLines = replaceBlock.split("\n").length;
                const endLineNumber = startLineNumber + replaceLines - 1;

                updatedLines.push([startLineNumber, endLineNumber]);
                pageHtml = pageHtml.replace(searchBlock, replaceBlock);
              }
            }

            position = replaceEndIndex + REPLACE_END.length;
          }

          updatedPages[pageIndex].html = pageHtml;
          
          if (pagePath === '/' || pagePath === '/index' || pagePath === 'index') {
            newHtml = pageHtml;
          }
        }
      }

      const newPageRegex = new RegExp(`${NEW_PAGE_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\s]+)\\s*${NEW_PAGE_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=${UPDATE_PAGE_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${NEW_PAGE_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|$)`, 'g');
      let newPageMatch;
      
      while ((newPageMatch = newPageRegex.exec(chunk)) !== null) {
        const [, pagePath, pageContent] = newPageMatch;
        
        let pageHtml = pageContent;
        const htmlMatch = pageContent.match(/```html\s*([\s\S]*?)\s*```/);
        if (htmlMatch) {
          pageHtml = htmlMatch[1];
        }
        
        const existingPageIndex = updatedPages.findIndex(p => p.path === pagePath);
        
        if (existingPageIndex !== -1) {
          updatedPages[existingPageIndex] = {
            path: pagePath,
            html: pageHtml.trim()
          };
        } else {
          updatedPages.push({
            path: pagePath,
            html: pageHtml.trim()
          });
        }
      }

      if (updatedPages.length === pages?.length && !chunk.includes(UPDATE_PAGE_START)) {
        let position = 0;
        let moreBlocks = true;

        while (moreBlocks) {
          const searchStartIndex = chunk.indexOf(SEARCH_START, position);
          if (searchStartIndex === -1) {
            moreBlocks = false;
            continue;
          }

          const dividerIndex = chunk.indexOf(DIVIDER, searchStartIndex);
          if (dividerIndex === -1) {
            moreBlocks = false;
            continue;
          }

          const replaceEndIndex = chunk.indexOf(REPLACE_END, dividerIndex);
          if (replaceEndIndex === -1) {
            moreBlocks = false;
            continue;
          }

          const searchBlock = chunk.substring(
            searchStartIndex + SEARCH_START.length,
            dividerIndex
          );
          const replaceBlock = chunk.substring(
            dividerIndex + DIVIDER.length,
            replaceEndIndex
          );

          if (searchBlock.trim() === "") {
            newHtml = `${replaceBlock}\n${newHtml}`;
            updatedLines.push([1, replaceBlock.split("\n").length]);
          } else {
            const blockPosition = newHtml.indexOf(searchBlock);
            if (blockPosition !== -1) {
              const beforeText = newHtml.substring(0, blockPosition);
              const startLineNumber = beforeText.split("\n").length;
              const replaceLines = replaceBlock.split("\n").length;
              const endLineNumber = startLineNumber + replaceLines - 1;

              updatedLines.push([startLineNumber, endLineNumber]);
              newHtml = newHtml.replace(searchBlock, replaceBlock);
            }
          }

          position = replaceEndIndex + REPLACE_END.length;
        }

        // Update the main HTML if it's the index page
        const mainPageIndex = updatedPages.findIndex(p => p.path === '/' || p.path === '/index' || p.path === 'index');
        if (mainPageIndex !== -1) {
          updatedPages[mainPageIndex].html = newHtml;
        }
      }

      return NextResponse.json({
        ok: true,
        updatedLines,
        pages: updatedPages,
      });
    } else {
      return NextResponse.json(
        { ok: false, message: "No content returned from the model" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    if (error.message?.includes("exceeded your monthly included credits")) {
      return NextResponse.json(
        {
          ok: false,
          openProModal: true,
          message: error.message,
        },
        { status: 402 }
      );
    }
    return NextResponse.json(
      {
        ok: false,
        openSelectProvider: true,
        message:
          error.message || "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
