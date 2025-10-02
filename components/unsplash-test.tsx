'use client';

import { useState, useEffect } from 'react';
import { unsplashService, type UnsplashPhoto } from '@/lib/unsplash-service';

export function UnsplashTest() {
  const [images, setImages] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const testSearch = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await unsplashService.searchPhotos(query, {
        perPage: 6,
        orientation: 'landscape'
      });

      if (result?.results) {
        setImages(result.results);
      } else {
        setError('No images found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const testBusinessContext = async () => {
    setLoading(true);
    setError(null);

    try {
      const images = await unsplashService.getImagesForBusiness({
        industry: 'restaurant',
        services: ['fine dining', 'catering'],
        style: 'modern'
      });

      setImages([...images.hero, ...images.gallery.slice(0, 3)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Business search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Unsplash Integration Test</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => testSearch('restaurant')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          Test Search: Restaurant
        </button>

        <button
          onClick={() => testSearch('office')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={loading}
        >
          Test Search: Office
        </button>

        <button
          onClick={testBusinessContext}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={loading}
        >
          Test Business Context
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">Loading images...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          <p className="mb-4">
            Found {images.length} images. API requests remaining: {unsplashService.getRemainingRequests() || 'Unknown'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((photo) => {
              const attribution = unsplashService.generateAttribution(photo, 'DeepSite');

              return (
                <div key={photo.id} className="border rounded-lg overflow-hidden shadow-md">
                  <img
                    src={unsplashService.getImageUrl(photo, 'small')}
                    alt={photo.alt_description || 'Unsplash photo'}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <p className="text-xs text-gray-600">
                      Photo by{' '}
                      <a
                        href={attribution.photographerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {attribution.photographerName}
                      </a>
                      {' '}on{' '}
                      <a
                        href={attribution.unsplashUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Unsplash
                      </a>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Integration Status:</h3>
        <ul className="text-sm space-y-1">
          <li>✅ Unsplash service configured: {mounted ? (unsplashService.isConfigured() ? 'Yes' : 'No') : 'Loading...'}</li>
          <li>✅ Access key present: {mounted ? (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY ? 'Yes' : 'Server-side only') : 'Loading...'}</li>
          <li>✅ SDK installed: Yes (unsplash-js)</li>
        </ul>
      </div>
    </div>
  );
}