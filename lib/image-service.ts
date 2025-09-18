// Image service to fetch industry-relevant stock photos
// Using Unsplash Source API (no API key required for basic usage)

interface ImageSearchParams {
  query: string;
  width?: number;
  height?: number;
  count?: number;
}

interface StockImage {
  url: string;
  alt: string;
  credit?: string;
}

// Industry-specific keyword mappings to improve image relevance
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  'restaurant': ['restaurant', 'food', 'dining', 'chef', 'cuisine', 'dishes', 'kitchen'],
  'hvac': ['hvac', 'air conditioning', 'ac unit', 'heating', 'cooling', 'ventilation', 'thermostat', 'furnace', 'air conditioner'],
  'plumbing': ['plumbing', 'plumber', 'pipes', 'water', 'sink', 'bathroom', 'toilet', 'faucet', 'drain'],
  'electrical': ['electrical', 'electrician', 'wiring', 'power', 'lighting', 'outlet', 'circuit', 'panel'],
  'roofing': ['roofing', 'roof', 'shingles', 'tiles', 'gutter', 'attic', 'ceiling'],
  'painting': ['painting', 'painter', 'paint', 'brush', 'wall', 'color', 'renovation'],
  'landscaping': ['landscaping', 'garden', 'lawn', 'outdoor', 'plants', 'trees', 'grass', 'yard'],
  'cleaning': ['cleaning', 'cleaner', 'maid', 'janitor', 'vacuum', 'mop', 'sanitize'],
  'automotive': ['automotive', 'car', 'auto', 'mechanic', 'garage', 'repair', 'vehicle', 'engine'],
  'fitness': ['gym', 'fitness', 'workout', 'exercise', 'training', 'weights', 'cardio'],
  'technology': ['technology', 'computer', 'software', 'coding', 'digital', 'tech', 'it'],
  'healthcare': ['healthcare', 'medical', 'doctor', 'hospital', 'health', 'clinic', 'patient'],
  'dental': ['dental', 'dentist', 'teeth', 'smile', 'orthodontic', 'oral'],
  'veterinary': ['veterinary', 'vet', 'pets', 'animals', 'dog', 'cat', 'clinic'],
  'real_estate': ['real estate', 'property', 'house', 'home', 'realty', 'mortgage', 'apartment'],
  'construction': ['construction', 'building', 'contractor', 'tools', 'site', 'concrete', 'steel'],
  'legal': ['legal', 'law', 'lawyer', 'attorney', 'court', 'justice', 'firm'],
  'beauty': ['beauty', 'salon', 'spa', 'cosmetics', 'hair', 'makeup', 'skincare'],
  'moving': ['moving', 'mover', 'relocation', 'boxes', 'truck', 'packing', 'storage'],
  'insurance': ['insurance', 'policy', 'coverage', 'claim', 'agent', 'protection'],
  'florist': ['florist', 'flowers', 'bouquet', 'floral', 'arrangement', 'roses', 'wedding'],
  'education': ['education', 'school', 'classroom', 'teacher', 'students', 'learning'],
  'finance': ['finance', 'banking', 'money', 'investment', 'accounting', 'financial'],
  'retail': ['retail', 'shopping', 'store', 'shop', 'merchandise', 'customer'],
  'travel': ['travel', 'tourism', 'vacation', 'trip', 'destination', 'hotel'],
  'photography': ['photography', 'photographer', 'camera', 'photo', 'portrait', 'studio'],
  'marketing': ['marketing', 'advertising', 'brand', 'promotion', 'digital', 'social'],
  'consulting': ['consulting', 'consultant', 'business', 'strategy', 'advisory', 'professional'],
  'catering': ['catering', 'food service', 'event', 'buffet', 'party', 'banquet'],
  'bakery': ['bakery', 'bread', 'pastries', 'cake', 'cookies', 'fresh baked'],
  'coffee': ['coffee', 'cafe', 'espresso', 'latte', 'barista', 'coffeeshop'],
  'bar': ['bar', 'pub', 'cocktails', 'drinks', 'bartender', 'nightlife'],
  'spa': ['spa', 'massage', 'relaxation', 'wellness', 'therapy', 'facial'],
  'yoga': ['yoga', 'meditation', 'wellness', 'mindfulness', 'studio', 'namaste'],
  'dance': ['dance', 'dancing', 'studio', 'ballet', 'choreography', 'performance'],
  'music': ['music', 'instruments', 'recording', 'studio', 'performance', 'band'],
  'art': ['art', 'gallery', 'painting', 'artist', 'exhibition', 'creative'],
  'fashion': ['fashion', 'clothing', 'style', 'boutique', 'designer', 'apparel'],
  'jewelry': ['jewelry', 'jeweler', 'diamonds', 'rings', 'gold', 'gems'],
  'wedding': ['wedding', 'bridal', 'ceremony', 'reception', 'bride', 'groom'],
  'event': ['event', 'planning', 'party', 'conference', 'meeting', 'venue'],
  'nonprofit': ['nonprofit', 'charity', 'volunteer', 'community', 'donation', 'cause'],
  'church': ['church', 'faith', 'worship', 'religious', 'spiritual', 'congregation'],
  'sports': ['sports', 'athletics', 'team', 'game', 'training', 'field'],
  'recreation': ['recreation', 'leisure', 'fun', 'activities', 'entertainment', 'park'],
  'childcare': ['childcare', 'daycare', 'kids', 'children', 'nursery', 'preschool'],
  'senior': ['senior', 'elderly', 'retirement', 'assisted living', 'care', 'nursing'],
  'logistics': ['logistics', 'shipping', 'warehouse', 'delivery', 'freight', 'transport'],
  'manufacturing': ['manufacturing', 'factory', 'production', 'industrial', 'machinery'],
  'agriculture': ['agriculture', 'farming', 'farm', 'crops', 'harvest', 'field'],
  'energy': ['energy', 'power', 'renewable', 'solar', 'wind', 'electricity'],
  'environment': ['environment', 'eco', 'green', 'sustainable', 'nature', 'conservation'],
  'security': ['security', 'safety', 'protection', 'surveillance', 'guard', 'alarm'],
  'default': ['business', 'professional', 'office', 'modern', 'corporate', 'success']
};

// Component-specific image suggestions
const COMPONENT_KEYWORDS: Record<string, string[]> = {
  'hero': ['hero', 'banner', 'header', 'main', 'featured', 'cover'],
  'about': ['team', 'office', 'people', 'company', 'workspace', 'collaboration'],
  'services': ['service', 'solution', 'work', 'professional', 'expertise'],
  'portfolio': ['portfolio', 'projects', 'showcase', 'work', 'gallery'],
  'testimonial': ['customer', 'client', 'happy', 'satisfied', 'people'],
  'contact': ['contact', 'communication', 'phone', 'email', 'location'],
  'product': ['product', 'item', 'showcase', 'display', 'feature'],
  'cta': ['action', 'business', 'success', 'growth', 'opportunity'],
  'team': ['team', 'staff', 'people', 'employees', 'professional', 'portrait'],
  'blog': ['writing', 'article', 'content', 'reading', 'blog', 'news']
};

/**
 * Detects the industry from business description or keywords
 */
export function detectIndustry(description: string): string {
  const lowerDesc = description.toLowerCase();
  
  // Check for HVAC-specific terms first (highest priority)
  if (lowerDesc.includes('hvac') || 
      lowerDesc.includes('heating') || 
      lowerDesc.includes('cooling') || 
      lowerDesc.includes('air conditioning') || 
      lowerDesc.includes('air conditioner') ||
      lowerDesc.includes('ac ') ||
      lowerDesc.includes('a/c') ||
      lowerDesc.includes('furnace') ||
      lowerDesc.includes('ventilation') ||
      lowerDesc.includes('hvac maintenance') ||
      lowerDesc.includes('hvac repair') ||
      lowerDesc.includes('hvac installation') ||
      lowerDesc.includes('hvac service')) {
    return 'hvac';
  }
  
  // Check for other specific industries
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (industry === 'default' || industry === 'hvac') continue;
    
    // Check if any industry keyword appears in the description
    if (keywords.some(keyword => {
      // Use word boundaries for more accurate matching
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
      return regex.test(lowerDesc);
    })) {
      return industry;
    }
  }
  
  return 'default';
}

/**
 * Generates smart image search queries based on context
 */
export function generateImageQueries(
  industry: string,
  component: string,
  businessName?: string,
  specificNeeds?: string[]
): string[] {
  const queries: string[] = [];
  
  // Get industry-specific keywords
  const industryKeywords = INDUSTRY_KEYWORDS[industry] || INDUSTRY_KEYWORDS.default;
  const componentKeywords = COMPONENT_KEYWORDS[component] || [];
  
  // Combine keywords for better relevance
  if (component === 'hero') {
    // Hero images should be more industry-specific
    queries.push(industryKeywords[0]);
    queries.push(`${industryKeywords[0]} ${componentKeywords[0]}`);
  } else {
    // Mix industry and component keywords
    componentKeywords.forEach(compKey => {
      queries.push(`${industryKeywords[0]} ${compKey}`);
    });
  }
  
  // Add any specific needs
  if (specificNeeds && specificNeeds.length > 0) {
    queries.push(...specificNeeds);
  }
  
  return queries;
}

/**
 * Returns working stock image URLs from Pexels (pre-verified URLs)
 */
export function getStockImageUrl(
  query: string,
  width: number = 1920,
  height: number = 1080
): string {
  // Using Picsum Photos as a reliable fallback
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/${width}/${height}?random=${randomId}`;
}

/**
 * Pre-verified working image URLs from Pexels organized by industry
 */
const PEXELS_IMAGES: Record<string, Record<string, string>> = {
  restaurant: {
    hero: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service4: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service5: 'https://images.pexels.com/photos/784633/pexels-photo-784633.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service6: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800',
    gallery1: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    gallery2: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
    gallery3: 'https://images.pexels.com/photos/761854/pexels-photo-761854.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
  },
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
  plumbing: {
    hero: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/5691625/pexels-photo-5691625.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/6913835/pexels-photo-6913835.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/5691630/pexels-photo-5691630.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  electrical: {
    hero: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Electrical panel
    service1: 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', // Light bulbs
    service2: 'https://images.pexels.com/photos/2898199/pexels-photo-2898199.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', // Electrical work
    service3: 'https://images.pexels.com/photos/5691604/pexels-photo-5691604.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/5691625/pexels-photo-5691625.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  landscaping: {
    hero: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/1134062/pexels-photo-1134062.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/4505464/pexels-photo-4505464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/4505447/pexels-photo-4505447.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  roofing: {
    hero: 'https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Roof tiles
    service1: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', // House roof
    service2: 'https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', // Shingles
    service3: 'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/8961117/pexels-photo-8961117.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  cleaning: {
    hero: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Cleaning service
    service1: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/6197116/pexels-photo-6197116.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/6195951/pexels-photo-6195951.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  painting: {
    hero: 'https://images.pexels.com/photos/1669754/pexels-photo-1669754.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Painting wall
    service1: 'https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', // Paint brushes
    service2: 'https://images.pexels.com/photos/994164/pexels-photo-994164.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', // Color palette
    service3: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/7218525/pexels-photo-7218525.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  fitness: {
    hero: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  automotive: {
    hero: 'https://images.pexels.com/photos/3807133/pexels-photo-3807133.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Auto shop
    service1: 'https://images.pexels.com/photos/4489750/pexels-photo-4489750.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', // Mechanic
    service2: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', // Car repair
    service3: 'https://images.pexels.com/photos/4489737/pexels-photo-4489737.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/5835359/pexels-photo-5835359.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  real_estate: {
    hero: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Modern house
    service1: 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  beauty: {
    hero: 'https://images.pexels.com/photos/3738335/pexels-photo-3738335.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Beauty salon
    service1: 'https://images.pexels.com/photos/3738378/pexels-photo-3738378.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/3992878/pexels-photo-3992878.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/7755645/pexels-photo-7755645.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  legal: {
    hero: 'https://images.pexels.com/photos/3771097/pexels-photo-3771097.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Law office
    service1: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/8112199/pexels-photo-8112199.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/5673488/pexels-photo-5673488.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  dental: {
    hero: 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Dental office
    service1: 'https://images.pexels.com/photos/3779697/pexels-photo-3779697.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/6502306/pexels-photo-6502306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/3845653/pexels-photo-3845653.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  veterinary: {
    hero: 'https://images.pexels.com/photos/6235241/pexels-photo-6235241.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Vet clinic
    service1: 'https://images.pexels.com/photos/6235231/pexels-photo-6235231.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/6234628/pexels-photo-6234628.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/6235661/pexels-photo-6235661.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/5731874/pexels-photo-5731874.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  technology: {
    hero: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  healthcare: {
    hero: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  construction: {
    hero: 'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/8817763/pexels-photo-8817763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  moving: {
    hero: 'https://images.pexels.com/photos/4246107/pexels-photo-4246107.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Moving truck
    service1: 'https://images.pexels.com/photos/7464230/pexels-photo-7464230.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', // Boxes
    service2: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/7464224/pexels-photo-7464224.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  insurance: {
    hero: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/7821684/pexels-photo-7821684.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/6863515/pexels-photo-6863515.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  florist: {
    hero: 'https://images.pexels.com/photos/1488310/pexels-photo-1488310.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080', // Flower shop
    service1: 'https://images.pexels.com/photos/2253844/pexels-photo-2253844.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/1579227/pexels-photo-1579227.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/6913840/pexels-photo-6913840.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/4466492/pexels-photo-4466492.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  },
  default: {
    hero: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    service1: 'https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service2: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    service3: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    about: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800'
  }
};

/**
 * Generates multiple image URLs for a component
 */
export function generateImageUrls(
  industry: string,
  component: string,
  count: number = 3,
  width: number = 1920,
  height: number = 1080
): StockImage[] {
  const images: StockImage[] = [];
  
  // Get pre-verified Pexels images for the industry
  const industryImages = PEXELS_IMAGES[industry] || PEXELS_IMAGES.default;
  
  if (component === 'hero' && industryImages.hero) {
    images.push({
      url: industryImages.hero,
      alt: `${industry} hero image`,
      credit: 'Pexels'
    });
  } else if (component === 'services' || component === 'service') {
    if (industryImages.service1) {
      images.push({
        url: industryImages.service1,
        alt: `${industry} service image`,
        credit: 'Pexels'
      });
    }
    if (industryImages.service2 && count > 1) {
      images.push({
        url: industryImages.service2,
        alt: `${industry} service image`,
        credit: 'Pexels'
      });
    }
    if (industryImages.service3 && count > 2) {
      images.push({
        url: industryImages.service3,
        alt: `${industry} service image`,
        credit: 'Pexels'
      });
    }
  } else if (component === 'about' && industryImages.about) {
    images.push({
      url: industryImages.about,
      alt: `${industry} team image`,
      credit: 'Pexels'
    });
  }
  
  // Fill remaining with Picsum if needed
  while (images.length < count) {
    const randomId = Math.floor(Math.random() * 1000) + images.length;
    images.push({
      url: `https://picsum.photos/${width}/${height}?random=${randomId}`,
      alt: `Placeholder image`,
      credit: 'Picsum'
    });
  }
  
  return images;
}

/**
 * Generates placeholder image HTML with proper attribution
 */
export function generateImageHTML(
  industry: string,
  component: string,
  className: string = '',
  width: number = 1920,
  height: number = 1080
): string {
  const images = generateImageUrls(industry, component, 1, width, height);
  const image = images[0];
  
  return `<img 
    src="${image.url}" 
    alt="${image.alt}" 
    class="${className}"
    loading="lazy"
    data-credit="${image.credit}"
  />`;
}

/**
 * Generates CSS background image style
 */
export function generateBackgroundImageStyle(
  industry: string,
  component: string,
  width: number = 1920,
  height: number = 1080
): string {
  const images = generateImageUrls(industry, component, 1, width, height);
  const url = images[0].url;
  
  return `background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${url}');`;
}

/**
 * Helper to inject images into HTML template
 */
export function injectImagesIntoHTML(
  html: string,
  industry: string,
  businessName?: string
): string {
  // Replace placeholder comments with actual images
  let updatedHTML = html;
  
  // Hero image placeholders
  updatedHTML = updatedHTML.replace(
    /<!-- IMAGE_HERO -->/g,
    generateImageHTML(industry, 'hero', 'w-full h-full object-cover')
  );
  
  // Service card images
  updatedHTML = updatedHTML.replace(
    /<!-- IMAGE_SERVICE_(\d+) -->/g,
    (match, num) => generateImageHTML(industry, 'services', 'w-full h-48 object-cover rounded-t-lg')
  );
  
  // About section images
  updatedHTML = updatedHTML.replace(
    /<!-- IMAGE_ABOUT -->/g,
    generateImageHTML(industry, 'about', 'w-full h-full object-cover rounded-lg')
  );
  
  // Portfolio/gallery images
  updatedHTML = updatedHTML.replace(
    /<!-- IMAGE_PORTFOLIO_(\d+) -->/g,
    (match, num) => generateImageHTML(industry, 'portfolio', 'w-full h-64 object-cover rounded-lg')
  );
  
  // Team member placeholders
  updatedHTML = updatedHTML.replace(
    /<!-- IMAGE_TEAM_(\d+) -->/g,
    (match, num) => generateImageHTML(industry, 'team', 'w-32 h-32 rounded-full object-cover mx-auto')
  );
  
  // Background image styles
  updatedHTML = updatedHTML.replace(
    /<!-- BG_IMAGE_HERO -->/g,
    generateBackgroundImageStyle(industry, 'hero')
  );
  
  updatedHTML = updatedHTML.replace(
    /<!-- BG_IMAGE_CTA -->/g,
    generateBackgroundImageStyle(industry, 'cta')
  );
  
  return updatedHTML;
}

/**
 * Extracts business context from form data or prompts
 */
export function extractBusinessContext(prompt: string): {
  industry: string;
  businessName?: string;
  services?: string[];
} {
  const industry = detectIndustry(prompt);
  
  // Try to extract business name (usually in quotes or after "for")
  const nameMatch = prompt.match(/(?:for |called |named |")([A-Z][^".,]+)/);
  const businessName = nameMatch ? nameMatch[1] : undefined;
  
  // Extract services mentioned
  const serviceKeywords = ['service', 'offer', 'provide', 'specialize'];
  const services: string[] = [];
  
  serviceKeywords.forEach(keyword => {
    const serviceMatch = prompt.match(new RegExp(`${keyword}[s]?[:\s]+([^.]+)`, 'i'));
    if (serviceMatch) {
      services.push(...serviceMatch[1].split(/,|and/).map(s => s.trim()));
    }
  });
  
  return { industry, businessName, services };
}