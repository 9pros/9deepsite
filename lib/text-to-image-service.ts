/**
 * Text-to-Image Service
 * Handles AI-generated images using Cloudflare Workers AI
 */

export interface ImageGenerationRequest {
  prompt: string;
  industry?: string;
  imageType?: 'hero' | 'service' | 'team' | 'facility' | 'gallery';
  width?: number;
  height?: number;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  prompt?: string;
  industry?: string;
  imageType?: string;
  error?: string;
  details?: string;
}

export class TextToImageService {
  private static instance: TextToImageService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = '/api/generate-image';
  }

  public static getInstance(): TextToImageService {
    if (!TextToImageService.instance) {
      TextToImageService.instance = new TextToImageService();
    }
    return TextToImageService.instance;
  }

  /**
   * Generate an image based on a text prompt
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate multiple hero images for carousel/slider
   */
  async generateHeroImages(
    headlines: string[],
    industry?: string
  ): Promise<ImageGenerationResponse[]> {
    const promises = headlines.map((headline, index) => {
      const prompt = `${headline} - hero image ${index + 1}`;
      return this.generateImage({
        prompt,
        industry,
        imageType: 'hero',
        width: 1200,
        height: 800,
      });
    });

    return Promise.all(promises);
  }

  /**
   * Generate service-specific images
   */
  async generateServiceImages(
    services: string[],
    industry?: string
  ): Promise<ImageGenerationResponse[]> {
    const promises = services.map((service) => {
      const prompt = `${service} service in action`;
      return this.generateImage({
        prompt,
        industry,
        imageType: 'service',
        width: 600,
        height: 400,
      });
    });

    return Promise.all(promises);
  }

  /**
   * Generate contextual prompts based on industry
   */
  generateContextualPrompt(basePrompt: string, industry?: string, context?: string): string {
    let enhancedPrompt = basePrompt;

    if (industry) {
      const industryContext = this.getIndustryContext(industry);
      enhancedPrompt = `${industryContext} ${basePrompt}`;
    }

    if (context) {
      enhancedPrompt += ` ${context}`;
    }

    return enhancedPrompt;
  }

  private getIndustryContext(industry: string): string {
    const contexts: Record<string, string> = {
      hvac: 'Professional HVAC and air conditioning service company',
      plumbing: 'Expert plumbing and water system professionals',
      electrical: 'Licensed electrical contractors and technicians',
      roofing: 'Professional roofing and exterior services',
      landscaping: 'Professional landscaping and outdoor design services',
      'pest-control': 'Professional pest control and extermination services',
      cleaning: 'Professional cleaning and janitorial services',
      construction: 'Professional construction and building services',
      automotive: 'Professional automotive repair and maintenance services',
      'real-estate': 'Professional real estate and property services',
      healthcare: 'Professional healthcare and medical services',
      dental: 'Professional dental and oral health services',
      legal: 'Professional legal and law firm services',
      accounting: 'Professional accounting and financial services',
      technology: 'Professional technology and IT services',
      restaurant: 'Professional restaurant and food service',
      retail: 'Professional retail and customer service',
      education: 'Professional education and training services',
      fitness: 'Professional fitness and wellness services',
      beauty: 'Professional beauty and cosmetic services',
    };

    return contexts[industry] || `Professional ${industry} business`;
  }
}

// Export a singleton instance for easy use
export const textToImageService = TextToImageService.getInstance();