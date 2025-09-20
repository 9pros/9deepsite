import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, industry, imageType = 'hero' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Enhance the prompt based on industry and image type
    let enhancedPrompt = prompt;

    if (industry) {
      enhancedPrompt = `Professional ${industry} business: ${prompt}`;
    }

    // Add style modifiers based on image type
    switch (imageType) {
      case 'hero':
        enhancedPrompt += ' - high quality, professional photography, bright lighting, modern, clean aesthetic';
        break;
      case 'service':
        enhancedPrompt += ' - service in action, professional setting, high detail, commercial photography';
        break;
      case 'team':
        enhancedPrompt += ' - professional team photo, business attire, office environment, friendly and approachable';
        break;
      case 'facility':
        enhancedPrompt += ' - modern facility, clean environment, professional space, architectural photography';
        break;
      default:
        enhancedPrompt += ' - professional, high quality, commercial photography';
    }

    // Call your Cloudflare text-to-image API
    const imageApiUrl = process.env.TEXT_TO_IMAGE_API_URL;
    if (!imageApiUrl) {
      return NextResponse.json({ error: 'Text-to-image API not configured' }, { status: 500 });
    }

    const response = await fetch(imageApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        // Add any additional parameters your API expects
        width: 1024,
        height: 768,
        steps: 20,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Text-to-image API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate image', details: errorText },
        { status: response.status }
      );
    }

    const imageBlob = await response.blob();

    // Convert blob to base64 for easy handling
    const buffer = await imageBlob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      prompt: enhancedPrompt,
      industry,
      imageType,
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Text-to-image API endpoint. Use POST with { prompt, industry?, imageType? }',
    imageTypes: ['hero', 'service', 'team', 'facility'],
    example: {
      prompt: 'Modern HVAC technician working on air conditioning unit',
      industry: 'hvac',
      imageType: 'hero'
    }
  });
}