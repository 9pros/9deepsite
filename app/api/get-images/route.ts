import { NextRequest, NextResponse } from 'next/server';
import { unsplashService } from '@/lib/unsplash-service';

export async function POST(request: NextRequest) {
  try {
    const { industry, services, style, location, companyName } = await request.json();

    if (!industry) {
      return NextResponse.json(
        { error: 'Industry is required' },
        { status: 400 }
      );
    }

    // Check if Unsplash is configured
    if (!unsplashService.isConfigured()) {
      console.warn('Unsplash not configured, returning fallback images');
      return NextResponse.json({
        success: false,
        message: 'Unsplash service not configured, using fallback images',
        images: []
      });
    }

    // Get contextual images based on business information
    const businessContext = {
      industry,
      services: services || [],
      style: style || 'modern',
      location,
      companyName
    };

    console.log('Fetching images for business context:', businessContext);

    const imageCollection = await unsplashService.getImagesForBusiness(businessContext);

    // Format images for website generation with proper attribution
    const formattedImages = {
      hero: imageCollection.hero.map(photo => ({
        url: unsplashService.getCustomSizedImageUrl(photo, 1920, 1080),
        alt: photo.alt_description || `Professional ${industry} image`,
        attribution: unsplashService.generateAttribution(photo, 'DeepSite')
      })),
      services: imageCollection.gallery.slice(0, 6).map(photo => ({
        url: unsplashService.getCustomSizedImageUrl(photo, 800, 600),
        alt: photo.alt_description || `${industry} service image`,
        attribution: unsplashService.generateAttribution(photo, 'DeepSite')
      })),
      about: imageCollection.gallery.slice(6, 8).map(photo => ({
        url: unsplashService.getCustomSizedImageUrl(photo, 1200, 800),
        alt: photo.alt_description || `About ${industry} business`,
        attribution: unsplashService.generateAttribution(photo, 'DeepSite')
      })),
      backgrounds: imageCollection.backgrounds.map(photo => ({
        url: unsplashService.getCustomSizedImageUrl(photo, 1920, 1080),
        alt: photo.alt_description || `${industry} background`,
        attribution: unsplashService.generateAttribution(photo, 'DeepSite')
      }))
    };

    // Track downloads for attribution compliance
    for (const photo of [...imageCollection.hero, ...imageCollection.gallery, ...imageCollection.backgrounds]) {
      try {
        await unsplashService.trackDownload(photo);
      } catch (error) {
        console.warn('Failed to track download for photo:', photo.id, error);
      }
    }

    return NextResponse.json({
      success: true,
      images: formattedImages,
      total: imageCollection.total,
      remainingRequests: unsplashService.getRemainingRequests()
    });

  } catch (error) {
    console.error('Error fetching images:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch images',
      images: []
    }, { status: 500 });
  }
}