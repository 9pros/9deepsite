/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { MODELS, PROVIDERS } from "@/lib/providers";
import {
  DIVIDER,
  FOLLOW_UP_SYSTEM_PROMPT,
  INITIAL_SYSTEM_PROMPT,
  NEW_PAGE_END,
  NEW_PAGE_START,
  REPLACE_END,
  SEARCH_START,
  UPDATE_PAGE_START,
  UPDATE_PAGE_END,
} from "@/lib/prompts";
// import MY_TOKEN_KEY from "@/lib/get-cookie-name";
import { Page } from "@/types";
import { extractBusinessContext, detectIndustry } from "@/lib/image-service";
import { trackGeneration, getRecommendations } from "@/lib/analytics-service";

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
  // const authHeaders = await headers();
  // const userToken = request.cookies.get(MY_TOKEN_KEY())?.value;

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
    } catch {
      console.warn('Failed to fetch Ollama models');
    }

    // Combine all models
    allModels = [
      ...(llamaApiKey ? LLAMA_MODELS : []),
      ...ollamaModels
    ];
  } catch {
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

  // Smart industry detection and business context extraction
  let detectedIndustry = 'technology';

  if (redesignMarkdown) {
    // For redesigns, detect from the URL and markdown content
    detectedIndustry = detectIndustry(redesignMarkdown);
  } else if (prompt) {
    // For new sites, extract from prompt
    const extracted = extractBusinessContext(prompt);
    detectedIndustry = extracted.industry;
  }

  // NEW APPROACH: Use placeholder markers instead of generating images
  // This avoids the "request body too large" error
  const imagePromptSection = `\n\nIMPORTANT IMAGE PLACEHOLDERS:
You MUST include these AI image placeholder markers in your HTML:

- Hero section: <!-- AI_IMAGE_HERO -->
- Service card 1: <!-- AI_IMAGE_SERVICE_1 -->
- Service card 2: <!-- AI_IMAGE_SERVICE_2 -->
- Service card 3: <!-- AI_IMAGE_SERVICE_3 -->
- Service card 4: <!-- AI_IMAGE_SERVICE_4 -->
- Service card 5: <!-- AI_IMAGE_SERVICE_5 -->
- Service card 6: <!-- AI_IMAGE_SERVICE_6 -->
- About section: <!-- AI_IMAGE_ABOUT -->
- Gallery image 1: <!-- AI_IMAGE_GALLERY_1 -->

USAGE EXAMPLE:
<div class="hero-image">
  <!-- AI_IMAGE_HERO -->
</div>

<div class="service-card">
  <!-- AI_IMAGE_SERVICE_1 -->
</div>

These placeholders will be replaced with AI-generated images in a subsequent request.
For now, they serve as markers for where images should be placed.

FALLBACK: You can also use stock images from Pexels/Unsplash as immediate placeholders if needed.
`;

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

  // Add random design variation selection
  const designVariations = {
    colorSchemes: [
      'Deep navy (#1e293b) with bright blue (#3b82f6) accents',
      'Rich brown (#92400e) with orange (#ea580c) highlights',
      'Dark gray (#374151) with lime green (#65a30d) accents',
      'Deep purple (#581c87) with violet (#8b5cf6) highlights',
      'Charcoal (#1f2937) with teal (#0d9488) accents',
      'Dark red (#991b1b) with bright orange (#f97316) highlights',
      'Steel blue (#1e40af) with cyan (#06b6d4) accents',
      'Forest green (#166534) with emerald (#10b981) highlights'
    ],
    layoutStyles: [
      'Modern minimalist with generous white space',
      'Bold and dramatic with strong contrasts',
      'Geometric shapes and angular design elements',
      'Organic curves and flowing lines',
      'Industrial/tech aesthetic with sharp edges',
      'Elegant and sophisticated with subtle details',
      'Playful with bright accents and gradients',
      'Professional corporate style'
    ],
    animations: [
      'Subtle fade-in on scroll effects',
      'Micro-interactions on hover and click',
      'Parallax background elements',
      'Staggered animation reveals',
      'Smooth slide transitions',
      'Elastic bounce effects',
      'Morphing shape animations',
      'Particle or dot animations'
    ]
  };

  // Get intelligent recommendations based on historical data
  const recommendations = getRecommendations(detectedIndustry);

  // Use recommendations if confidence is high, otherwise use random selection
  let selectedColor, selectedLayout, selectedAnimation;

  if (recommendations.confidence > 0.7) {
    // High confidence - use recommendations
    selectedColor = recommendations.recommendedColor;
    selectedLayout = recommendations.recommendedLayout;
    selectedAnimation = recommendations.recommendedAnimation;
  } else {
    // Low confidence - use random selection but bias towards recommendations
    const useRecommendation = Math.random() < 0.5; // 50% chance to use recommendation

    selectedColor = useRecommendation
      ? recommendations.recommendedColor
      : designVariations.colorSchemes[Math.floor(Math.random() * designVariations.colorSchemes.length)];

    selectedLayout = useRecommendation
      ? recommendations.recommendedLayout
      : designVariations.layoutStyles[Math.floor(Math.random() * designVariations.layoutStyles.length)];

    selectedAnimation = useRecommendation
      ? recommendations.recommendedAnimation
      : designVariations.animations[Math.floor(Math.random() * designVariations.animations.length)];
  }

  // Enhance the prompt with industry and image guidance
  const enhancedPrompt = `${prompt || ''}\n\nCRITICAL: This is a ${detectedIndustry} business.${logoInstruction}${imagePromptSection}\n\nDESIGN REQUIREMENTS FOR THIS GENERATION:\n- Color scheme: ${selectedColor}\n- Layout style: ${selectedLayout}\n- Animation style: ${selectedAnimation}\n\nMAKE SURE TO:\n1. Use typing animation for H1 headlines with TypeIt.js\n2. Include a multi-step form with progress indicators\n3. Use modern varied layouts (bento grid, split screen, etc.)\n4. Add FAQ section with accordion\n5. Include service areas with expandable sub-areas\n6. Use AI image placeholder markers (<!-- AI_IMAGE_* -->)\n7. All images should be relevant to the ${detectedIndustry} industry\n8. Apply the selected design variations consistently throughout\n9. Ensure each generation looks distinctly different from previous ones`;

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
      // Track the generation for analytics
      const sessionId = trackGeneration({
        industry: detectedIndustry,
        prompt: enhancedPrompt,
        model: selectedModel.value,
        layoutVariation: selectedLayout,
        colorScheme: selectedColor,
        animationStyle: selectedAnimation
      });

      console.log(`Generation tracked with session ID: ${sessionId}`);

      // let completeResponse = "";
      try {
        // Determine which API to call based on provider
        const isLlamaProvider = selectedProvider.id === 'llama';

        // API configuration
        const apiEndpoint = isLlamaProvider
          ? (selectedProvider.endpoint || process.env.LLAMA_API_URL || "https://api.llama.com/v1")
          : (selectedProvider.endpoint || process.env.OLLAMA_API_URL || "http://localhost:11434");

        const apiKey = isLlamaProvider
          ? ((selectedProvider as any).apiKey || process.env.LLAMA_API_KEY)
          : (process.env.OLLAMA_API_KEY);

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
                ? `Here is my current design as a markdown:\n\n${redesignMarkdown}\n\nNow, please create a new design based on this markdown. IMPORTANT: This is a ${detectedIndustry} business. Use AI image placeholder markers for all images.`
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
                ? `Here is my current design as a markdown:\n\n${redesignMarkdown}\n\nNow, please create a new design based on this markdown. IMPORTANT: This is a ${detectedIndustry} business. Use AI image placeholder markers for all images.`
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
              } catch {
                console.log('Failed to parse line:', line);
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
        } catch {
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
  // const authHeaders = await headers();
  // const userToken = request.cookies.get(MY_TOKEN_KEY())?.value;

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
    // Check if it's a thinker model by name
    isThinker: model?.includes('deepseek-v3') ||
               model?.includes('deepseek-r1') ||
               model?.includes('Llama-4-Maverick'),
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
    // Determine which API to call based on provider
    const isLlamaProvider = selectedProvider.id === 'llama';

    // API configuration
    const apiEndpoint = isLlamaProvider
      ? (selectedProvider.endpoint || process.env.LLAMA_API_URL || "https://api.llama.com/v1")
      : (selectedProvider.endpoint || process.env.OLLAMA_API_URL || "http://localhost:11434");

    const apiKey = isLlamaProvider
      ? ((selectedProvider as any).apiKey || process.env.LLAMA_API_KEY)
      : (process.env.OLLAMA_API_KEY);

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

    // Prepare request body - disable thinking for thinker models in follow-up requests
    const requestBody: any = isLlamaProvider ? {
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
      max_tokens: selectedProvider.max_tokens,
    } : {
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
    };

    // Disable thinking for thinker models in follow-up requests (Ollama-specific)
    if (selectedModel.isThinker && !isLlamaProvider) {
      requestBody.options.enable_thinking = false;
    }

    // Disable thinking for thinker models in follow-up requests (Llama API-specific)
    if (selectedModel.isThinker && isLlamaProvider) {
      requestBody.thinking = {
        type: "disabled"
      };
    }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error - Provider: ${isLlamaProvider ? 'Llama' : 'Ollama'}, Model: ${selectedModel.value}, URL: ${requestUrl}, Status: ${response.status}, Error: ${errorText}`);
      throw new Error(`${isLlamaProvider ? 'Llama' : 'Ollama'} API error: ${response.statusText} (${response.status})`);
    }

    const apiResult = await response.json();
    const chunk = isLlamaProvider
      ? apiResult.choices?.[0]?.message?.content
      : apiResult.message?.content;
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
