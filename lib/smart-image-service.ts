/**
 * Smart Image Service using Unsplash API for context-aware images
 * Falls back to Pexels direct URLs if API fails
 */

// Unsplash API (no key needed for demo/low volume)
// For production, get a free API key from https://unsplash.com/developers
const UNSPLASH_ACCESS_KEY = 'demo'; // Replace with actual key for production

/**
 * Industry-specific search terms for better image matching
 */
export const SMART_IMAGE_SEARCHES = {
  hvac: {
    hero: 'air conditioning unit commercial HVAC system',
    service1: 'HVAC technician working air conditioner repair',
    service2: 'furnace heating system maintenance',
    service3: 'thermostat smart home climate control',
    service4: 'air duct ventilation system',
    service5: 'HVAC installation new system',
    service6: 'emergency HVAC repair service',
    about: 'HVAC team technicians professional',
    gallery: ['HVAC equipment', 'air conditioning', 'heating system']
  },
  plumbing: {
    hero: 'professional plumber working pipes',
    service1: 'plumber fixing sink kitchen',
    service2: 'bathroom plumbing renovation',
    service3: 'water heater installation',
    service4: 'drain cleaning service',
    service5: 'pipe repair plumbing',
    service6: 'emergency plumber service',
    about: 'plumbing team professional',
    gallery: ['plumbing tools', 'pipe fitting', 'bathroom fixtures']
  },
  electrical: {
    hero: 'electrician working electrical panel',
    service1: 'electrician wiring installation',
    service2: 'electrical outlet repair',
    service3: 'lighting installation LED',
    service4: 'circuit breaker panel',
    service5: 'smart home electrical',
    service6: 'emergency electrician',
    about: 'electrical team professional',
    gallery: ['electrical work', 'wiring', 'electrical panel']
  },
  landscaping: {
    hero: 'beautiful landscaped garden yard',
    service1: 'lawn mowing maintenance',
    service2: 'garden design flowers',
    service3: 'tree trimming service',
    service4: 'hardscape patio installation',
    service5: 'irrigation sprinkler system',
    service6: 'landscape lighting outdoor',
    about: 'landscaping team working',
    gallery: ['garden design', 'lawn care', 'outdoor landscaping']
  },
  roofing: {
    hero: 'roof installation shingles house',
    service1: 'roofer installing shingles',
    service2: 'roof repair maintenance',
    service3: 'gutter installation cleaning',
    service4: 'roof inspection drone',
    service5: 'metal roof installation',
    service6: 'emergency roof repair',
    about: 'roofing team contractors',
    gallery: ['roof types', 'shingles', 'roofing work']
  },
  cleaning: {
    hero: 'professional cleaning service commercial',
    service1: 'house cleaning service',
    service2: 'office cleaning janitorial',
    service3: 'carpet cleaning professional',
    service4: 'window cleaning service',
    service5: 'deep cleaning sanitization',
    service6: 'move out cleaning',
    about: 'cleaning team professional',
    gallery: ['cleaning service', 'spotless space', 'clean office']
  },
  restaurant: {
    hero: 'restaurant interior dining atmosphere',
    service1: 'gourmet food plating chef',
    service2: 'restaurant kitchen cooking',
    service3: 'dining experience service',
    service4: 'cocktail bar drinks',
    service5: 'outdoor dining patio',
    service6: 'private dining event',
    about: 'restaurant team chef staff',
    gallery: ['food dishes', 'restaurant ambiance', 'dining experience']
  },
  fitness: {
    hero: 'gym fitness center equipment',
    service1: 'personal training session',
    service2: 'group fitness class',
    service3: 'yoga studio meditation',
    service4: 'weightlifting strength training',
    service5: 'cardio workout running',
    service6: 'nutrition coaching',
    about: 'fitness trainers team',
    gallery: ['gym equipment', 'workout', 'fitness training']
  },
  automotive: {
    hero: 'auto repair shop garage',
    service1: 'mechanic car repair',
    service2: 'oil change service',
    service3: 'tire rotation alignment',
    service4: 'brake repair service',
    service5: 'engine diagnostics',
    service6: 'auto detailing',
    about: 'automotive team mechanics',
    gallery: ['car repair', 'auto shop', 'mechanic working']
  },
  technology: {
    hero: 'modern technology office computers',
    service1: 'software development coding',
    service2: 'IT support help desk',
    service3: 'cloud computing servers',
    service4: 'cybersecurity protection',
    service5: 'web development design',
    service6: 'mobile app development',
    about: 'tech team developers',
    gallery: ['technology', 'coding', 'tech office']
  },
  healthcare: {
    hero: 'modern medical facility hospital',
    service1: 'doctor patient consultation',
    service2: 'medical examination',
    service3: 'healthcare technology',
    service4: 'nursing care patient',
    service5: 'medical laboratory',
    service6: 'emergency medical care',
    about: 'healthcare team doctors nurses',
    gallery: ['medical facility', 'healthcare', 'medical team']
  },
  real_estate: {
    hero: 'luxury home exterior modern',
    service1: 'house for sale sign',
    service2: 'home interior staging',
    service3: 'commercial property building',
    service4: 'real estate agent showing',
    service5: 'property investment',
    service6: 'home inspection',
    about: 'real estate team agents',
    gallery: ['properties', 'homes', 'real estate']
  },
  legal: {
    hero: 'law office library books',
    service1: 'lawyer consultation meeting',
    service2: 'courtroom legal',
    service3: 'contract signing document',
    service4: 'legal research',
    service5: 'law firm office',
    service6: 'legal advice consultation',
    about: 'legal team lawyers',
    gallery: ['law office', 'legal documents', 'law firm']
  },
  dental: {
    hero: 'modern dental office clinic',
    service1: 'dentist examining patient',
    service2: 'teeth whitening smile',
    service3: 'dental hygiene cleaning',
    service4: 'orthodontics braces',
    service5: 'dental surgery implant',
    service6: 'pediatric dentistry',
    about: 'dental team dentists',
    gallery: ['dental office', 'dental care', 'smile']
  },
  beauty: {
    hero: 'beauty salon spa interior',
    service1: 'hair styling salon',
    service2: 'facial treatment spa',
    service3: 'manicure nail art',
    service4: 'makeup artist beauty',
    service5: 'massage therapy spa',
    service6: 'skincare treatment',
    about: 'beauty team stylists',
    gallery: ['beauty salon', 'spa treatment', 'beauty services']
  }
};

/**
 * Generate Unsplash URLs with specific search terms
 * Uses Unsplash Source for direct image URLs (no API key needed)
 */
export function getSmartImageUrl(industry: string, imageType: string, index: number = 1): string {
  const searches = SMART_IMAGE_SEARCHES[industry] || SMART_IMAGE_SEARCHES['technology'];
  let searchTerm = searches[imageType] || searches.hero;
  
  // Handle gallery array - pick based on index
  if (Array.isArray(searchTerm)) {
    searchTerm = searchTerm[index % searchTerm.length];
  }
  
  // Clean and encode the search term
  const cleanSearch = String(searchTerm).replace(/[^\w\s]/g, ' ').trim();
  const encoded = encodeURIComponent(cleanSearch);
  
  // Dimensions based on image type
  let width = 1920;
  let height = 1080;
  
  if (imageType.includes('service')) {
    width = 800;
    height = 600;
  } else if (imageType === 'about') {
    width = 1200;
    height = 800;
  } else if (imageType.includes('gallery')) {
    width = 600;
    height = 400;
  }
  
  // Use Unsplash Source (free, no API key needed)
  // Add index as sig parameter to get different images for same search
  return `https://source.unsplash.com/${width}x${height}/?${encoded}&sig=${index}`;
}

/**
 * Generate a complete set of images for a business type
 */
export function generateIndustryImageSet(industry: string): Record<string, string> {
  const imageSet: Record<string, string> = {};
  
  // Hero image
  imageSet.hero = getSmartImageUrl(industry, 'hero', 1);
  
  // Service images (6 different ones)
  for (let i = 1; i <= 6; i++) {
    imageSet[`service${i}`] = getSmartImageUrl(industry, `service${i}`, i + 10);
  }
  
  // About section
  imageSet.about = getSmartImageUrl(industry, 'about', 20);
  
  // Gallery images
  for (let i = 1; i <= 3; i++) {
    imageSet[`gallery${i}`] = getSmartImageUrl(industry, 'gallery', i + 30);
  }
  
  // Team/testimonial images (using portraits)
  for (let i = 1; i <= 4; i++) {
    imageSet[`team${i}`] = `https://source.unsplash.com/200x200/?professional,portrait&sig=${i + 40}`;
  }
  
  // Process/timeline images
  for (let i = 1; i <= 4; i++) {
    imageSet[`process${i}`] = getSmartImageUrl(industry, `service${i}`, i + 50);
  }
  
  return imageSet;
}

/**
 * Fallback to verified Pexels URLs if needed
 */
export const FALLBACK_IMAGES = {
  hvac: {
    hero: 'https://images.pexels.com/photos/3964341/pexels-photo-3964341.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/3964704/pexels-photo-3964704.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/5463576/pexels-photo-5463576.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/7641474/pexels-photo-7641474.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/5691625/pexels-photo-5691625.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  // ... other industries
};

/**
 * Smart detection of industry from URL or description
 */
export function detectIndustryFromContext(url: string, description: string): string {
  const combined = `${url} ${description}`.toLowerCase();
  
  // Check for specific industry keywords
  const industryKeywords = {
    hvac: ['hvac', 'heating', 'cooling', 'air conditioning', 'furnace', 'thermostat', 'ventilation', 'climate control'],
    plumbing: ['plumb', 'pipe', 'drain', 'water heater', 'faucet', 'leak', 'bathroom', 'sink'],
    electrical: ['electric', 'wiring', 'outlet', 'circuit', 'lighting', 'power'],
    landscaping: ['landscape', 'lawn', 'garden', 'yard', 'grass', 'tree', 'outdoor'],
    roofing: ['roof', 'shingle', 'gutter', 'attic', 'ceiling'],
    restaurant: ['restaurant', 'food', 'dining', 'menu', 'chef', 'cuisine', 'eat'],
    fitness: ['gym', 'fitness', 'workout', 'exercise', 'training', 'health'],
    automotive: ['auto', 'car', 'vehicle', 'mechanic', 'repair', 'tire', 'engine'],
    technology: ['tech', 'software', 'IT', 'computer', 'digital', 'web', 'app'],
    healthcare: ['health', 'medical', 'doctor', 'hospital', 'clinic', 'patient'],
    real_estate: ['real estate', 'property', 'home', 'house', 'realtor', 'realty'],
    legal: ['law', 'legal', 'attorney', 'lawyer', 'court'],
    dental: ['dental', 'dentist', 'teeth', 'tooth', 'oral'],
    beauty: ['beauty', 'salon', 'spa', 'hair', 'nail', 'makeup', 'skincare']
  };
  
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (keywords.some(keyword => combined.includes(keyword))) {
      return industry;
    }
  }
  
  return 'technology'; // Default fallback
}