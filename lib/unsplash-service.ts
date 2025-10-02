/**
 * Unsplash API Integration Service
 * Provides high-quality, contextual images for website generation
 */

import { createApi } from 'unsplash-js';

interface UnsplashPhoto {
  id: string;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
    raw: string;
  };
  alt_description?: string;
  description?: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    download_location: string;
  };
  blur_hash?: string;
  width: number;
  height: number;
}

interface SearchResult {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

interface BusinessContext {
  industry?: string;
  services?: string[];
  location?: string;
  style?: string;
  companyName?: string;
}

interface ImageCollection {
  hero: UnsplashPhoto[];
  gallery: UnsplashPhoto[];
  backgrounds: UnsplashPhoto[];
  total: number;
}

class UnsplashService {
  private accessKey: string;
  private baseUrl = 'https://api.unsplash.com';
  private cache = new Map<string, SearchResult>();
  private rateLimitRemaining: number | null = null;

  constructor(accessKey?: string) {
    this.accessKey = accessKey ||
                     process.env.UNSPLASH_ACCESS_KEY ||
                     process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY ||
                     '';
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Client-ID ${this.accessKey}`,
      'Accept-Version': 'v1'
    };
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!this.accessKey) {
      throw new Error('Unsplash access key is required');
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      // Track rate limiting
      this.rateLimitRemaining = parseInt(response.headers.get('X-Ratelimit-Remaining') || '0');

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Unsplash rate limit exceeded. Please try again later.');
        }
        throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Unsplash API request failed:', error);
      throw error;
    }
  }

  async searchPhotos(
    query: string,
    options: {
      page?: number;
      perPage?: number;
      orderBy?: 'relevant' | 'latest';
      contentFilter?: 'low' | 'high';
      color?: string;
      orientation?: 'landscape' | 'portrait' | 'squarish';
    } = {}
  ): Promise<SearchResult | null> {
    const cacheKey = `${query}-${JSON.stringify(options)}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = new URLSearchParams({
      query,
      page: (options.page || 1).toString(),
      per_page: (options.perPage || 10).toString(),
      order_by: options.orderBy || 'relevant',
      content_filter: options.contentFilter || 'high'
    });

    if (options.color) params.append('color', options.color);
    if (options.orientation) params.append('orientation', options.orientation);

    try {
      const result = await this.makeRequest<SearchResult>(`/search/photos?${params}`);

      // Cache for 1 hour
      this.cache.set(cacheKey, result);
      setTimeout(() => this.cache.delete(cacheKey), 3600000);

      return result;
    } catch (error) {
      console.warn(`Search failed for "${query}":`, error);
      return null;
    }
  }

  async trackDownload(photo: UnsplashPhoto): Promise<void> {
    if (!photo.links?.download_location) return;

    try {
      await this.makeRequest(photo.links.download_location.replace(this.baseUrl, ''));
    } catch (error) {
      console.warn('Failed to track download:', error);
    }
  }

  generateSearchQueries(businessContext: BusinessContext): string[] {
    const { industry, services, style } = businessContext;
    const queries: string[] = [];

    if (industry) {
      queries.push(
        `${industry} business`,
        `${industry} professional`,
        `${industry} workplace`,
        `modern ${industry}`
      );
    }

    if (services?.length) {
      services.forEach(service => {
        queries.push(`${service} professional`);
        if (industry) {
          queries.push(`${service} ${industry}`);
        }
      });
    }

    if (style) {
      queries.push(
        `${style} office`,
        `${style} workspace`,
        `${style} interior`
      );
    }

    // Fallback queries
    if (queries.length === 0) {
      queries.push('business professional', 'modern office', 'workplace');
    }

    return [...new Set(queries)]; // Remove duplicates
  }

  async getImagesForBusiness(businessContext: BusinessContext): Promise<ImageCollection> {
    const queries = this.generateSearchQueries(businessContext);
    const allImages: UnsplashPhoto[] = [];

    // Search with multiple queries
    for (const query of queries.slice(0, 5)) { // Limit to 5 queries to avoid rate limits
      const result = await this.searchPhotos(query, {
        perPage: 8,
        contentFilter: 'high',
        orientation: 'landscape'
      });

      if (result?.results) {
        allImages.push(...result.results);
      }

      // Small delay to be respectful of rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Remove duplicates and categorize
    const uniqueImages = this.removeDuplicates(allImages);

    return {
      hero: uniqueImages.slice(0, 3),
      gallery: uniqueImages.slice(3, 12),
      backgrounds: uniqueImages.slice(12, 18),
      total: uniqueImages.length
    };
  }

  private removeDuplicates(images: UnsplashPhoto[]): UnsplashPhoto[] {
    const seen = new Set<string>();
    return images.filter(image => {
      if (seen.has(image.id)) {
        return false;
      }
      seen.add(image.id);
      return true;
    });
  }

  getImageUrl(photo: UnsplashPhoto, size: 'thumb' | 'small' | 'regular' | 'full' = 'regular'): string {
    return photo.urls[size] || photo.urls.regular;
  }

  getCustomSizedImageUrl(photo: UnsplashPhoto, width: number, height: number): string {
    const baseUrl = photo.urls.raw;
    return `${baseUrl}&w=${width}&h=${height}&fit=crop&crop=entropy&auto=format&q=80`;
  }

  generateAttribution(photo: UnsplashPhoto, appName: string = 'Website Builder'): {
    photographerName: string;
    photographerUrl: string;
    unsplashUrl: string;
    attributionText: string;
  } {
    const utmParams = `?utm_source=${encodeURIComponent(appName)}&utm_medium=referral`;

    return {
      photographerName: photo.user.name,
      photographerUrl: `${photo.user.links.html}${utmParams}`,
      unsplashUrl: `https://unsplash.com${utmParams}`,
      attributionText: `Photo by ${photo.user.name} on Unsplash`
    };
  }

  getRemainingRequests(): number | null {
    return this.rateLimitRemaining;
  }

  isConfigured(): boolean {
    return !!this.accessKey;
  }
}

// Export singleton instance
export const unsplashService = new UnsplashService();

// Export types
export type { UnsplashPhoto, BusinessContext, ImageCollection };

// Helper functions for React components
export function getImageWithPlaceholder(photo: UnsplashPhoto, size: 'thumb' | 'small' | 'regular' | 'full' = 'regular') {
  return {
    src: unsplashService.getImageUrl(photo, size),
    blurDataURL: photo.blur_hash ? `data:image/jpeg;base64,${photo.blur_hash}` : undefined,
    alt: photo.alt_description || photo.description || 'Professional image',
    width: photo.width,
    height: photo.height
  };
}

export function generateImageAttribution(photo: UnsplashPhoto, appName?: string) {
  return unsplashService.generateAttribution(photo, appName);
}