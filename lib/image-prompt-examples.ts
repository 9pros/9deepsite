/**
 * Example prompts to guide AI in using industry-specific images
 * These examples show how to properly use Unsplash Source API for different industries
 */

export const IMAGE_PROMPT_EXAMPLES = {
  restaurant: `
    <!-- Hero Section with Restaurant Background -->
    <section class="relative h-screen">
      <img src="https://source.unsplash.com/1920x1080/?restaurant,dining&sig=1" 
           alt="Restaurant interior" 
           class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-10 bg-black/50 h-full flex items-center justify-center">
        <h1 class="text-white text-6xl font-bold">Welcome to Our Restaurant</h1>
      </div>
    </section>

    <!-- Menu Items with Food Images -->
    <div class="grid grid-cols-3 gap-6">
      <div class="card">
        <img src="https://source.unsplash.com/400x300/?pasta,food&sig=2" 
             alt="Pasta dish" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Italian Pasta</h3>
      </div>
      <div class="card">
        <img src="https://source.unsplash.com/400x300/?steak,food&sig=3" 
             alt="Steak dish" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Prime Steaks</h3>
      </div>
      <div class="card">
        <img src="https://source.unsplash.com/400x300/?seafood,food&sig=4" 
             alt="Seafood dish" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Fresh Seafood</h3>
      </div>
    </div>
  `,

  plumbing: `
    <!-- Hero Section with Plumbing Service Background -->
    <section class="relative h-screen">
      <img src="https://source.unsplash.com/1920x1080/?plumbing,pipes&sig=1" 
           alt="Professional plumbing service" 
           class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-10 bg-blue-900/70 h-full flex items-center justify-center">
        <h1 class="text-white text-6xl font-bold">Expert Plumbing Services</h1>
      </div>
    </section>

    <!-- Service Cards with Relevant Images -->
    <div class="grid grid-cols-3 gap-6">
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?bathroom,renovation&sig=2" 
             alt="Bathroom plumbing" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Bathroom Renovation</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?kitchen,sink&sig=3" 
             alt="Kitchen plumbing" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Kitchen Plumbing</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?water,heater&sig=4" 
             alt="Water heater service" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Water Heater Repair</h3>
      </div>
    </div>
  `,

  fitness: `
    <!-- Hero Section with Gym Background -->
    <section class="relative h-screen">
      <img src="https://source.unsplash.com/1920x1080/?gym,fitness&sig=1" 
           alt="Modern gym facility" 
           class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-10 bg-gradient-to-r from-orange-600/80 to-red-600/80 h-full flex items-center justify-center">
        <h1 class="text-white text-6xl font-bold">Transform Your Body</h1>
      </div>
    </section>

    <!-- Training Programs with Action Images -->
    <div class="grid grid-cols-3 gap-6">
      <div class="program-card">
        <img src="https://source.unsplash.com/400x300/?weightlifting,training&sig=2" 
             alt="Weight training" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Strength Training</h3>
      </div>
      <div class="program-card">
        <img src="https://source.unsplash.com/400x300/?yoga,fitness&sig=3" 
             alt="Yoga class" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Yoga Classes</h3>
      </div>
      <div class="program-card">
        <img src="https://source.unsplash.com/400x300/?cardio,running&sig=4" 
             alt="Cardio training" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Cardio Workouts</h3>
      </div>
    </div>
  `,

  landscaping: `
    <!-- Hero Section with Beautiful Garden -->
    <section class="relative h-screen">
      <img src="https://source.unsplash.com/1920x1080/?garden,landscaping&sig=1" 
           alt="Beautiful landscaped garden" 
           class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-10 bg-green-900/60 h-full flex items-center justify-center">
        <h1 class="text-white text-6xl font-bold">Professional Landscaping</h1>
      </div>
    </section>

    <!-- Services with Nature Images -->
    <div class="grid grid-cols-3 gap-6">
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?lawn,grass&sig=2" 
             alt="Lawn maintenance" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Lawn Care</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?flowers,garden&sig=3" 
             alt="Garden design" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Garden Design</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?trees,pruning&sig=4" 
             alt="Tree service" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Tree Services</h3>
      </div>
    </div>
  `,

  technology: `
    <!-- Hero Section with Tech Background -->
    <section class="relative h-screen">
      <img src="https://source.unsplash.com/1920x1080/?technology,computer&sig=1" 
           alt="Technology and innovation" 
           class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-10 bg-gradient-to-r from-blue-900/80 to-purple-900/80 h-full flex items-center justify-center">
        <h1 class="text-white text-6xl font-bold">Innovative Tech Solutions</h1>
      </div>
    </section>

    <!-- Services with Tech Images -->
    <div class="grid grid-cols-3 gap-6">
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?coding,programming&sig=2" 
             alt="Software development" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Software Development</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?cloud,computing&sig=3" 
             alt="Cloud services" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Cloud Solutions</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?cybersecurity,network&sig=4" 
             alt="Cybersecurity" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Cybersecurity</h3>
      </div>
    </div>
  `,

  healthcare: `
    <!-- Hero Section with Medical Background -->
    <section class="relative h-screen">
      <img src="https://source.unsplash.com/1920x1080/?healthcare,medical&sig=1" 
           alt="Healthcare facility" 
           class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-10 bg-teal-800/70 h-full flex items-center justify-center">
        <h1 class="text-white text-6xl font-bold">Compassionate Healthcare</h1>
      </div>
    </section>

    <!-- Medical Services with Appropriate Images -->
    <div class="grid grid-cols-3 gap-6">
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?doctor,consultation&sig=2" 
             alt="Medical consultation" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>General Practice</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?hospital,care&sig=3" 
             alt="Patient care" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Specialized Care</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?laboratory,medical&sig=4" 
             alt="Medical laboratory" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Lab Services</h3>
      </div>
    </div>
  `,

  construction: `
    <!-- Hero Section with Construction Site -->
    <section class="relative h-screen">
      <img src="https://source.unsplash.com/1920x1080/?construction,building&sig=1" 
           alt="Construction site" 
           class="absolute inset-0 w-full h-full object-cover">
      <div class="relative z-10 bg-orange-900/70 h-full flex items-center justify-center">
        <h1 class="text-white text-6xl font-bold">Building Your Dreams</h1>
      </div>
    </section>

    <!-- Construction Services -->
    <div class="grid grid-cols-3 gap-6">
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?residential,construction&sig=2" 
             alt="Residential construction" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Residential</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?commercial,building&sig=3" 
             alt="Commercial construction" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Commercial</h3>
      </div>
      <div class="service-card">
        <img src="https://source.unsplash.com/400x300/?renovation,remodeling&sig=4" 
             alt="Renovation work" 
             class="w-full h-48 object-cover rounded-t-lg">
        <h3>Renovations</h3>
      </div>
    </div>
  `
};

/**
 * Helper function to get image URL suggestions based on industry and component
 */
export function getImageSuggestions(industry: string, component: string): string[] {
  const suggestions: string[] = [];
  
  // Industry-specific image search terms
  const industryTerms: Record<string, string[]> = {
    restaurant: ['restaurant', 'food', 'dining', 'chef', 'cuisine'],
    plumbing: ['plumbing', 'pipes', 'bathroom', 'water', 'repair'],
    fitness: ['gym', 'fitness', 'workout', 'exercise', 'training'],
    landscaping: ['garden', 'landscaping', 'lawn', 'outdoor', 'plants'],
    technology: ['technology', 'computer', 'coding', 'software', 'digital'],
    healthcare: ['healthcare', 'medical', 'doctor', 'hospital', 'health'],
    construction: ['construction', 'building', 'contractor', 'tools', 'site'],
    legal: ['law', 'legal', 'office', 'justice', 'lawyer'],
    beauty: ['beauty', 'salon', 'spa', 'cosmetics', 'wellness'],
    automotive: ['car', 'automotive', 'vehicle', 'mechanic', 'garage'],
    cleaning: ['cleaning', 'service', 'professional', 'spotless', 'hygiene'],
    electrical: ['electrical', 'electrician', 'wiring', 'power', 'lighting'],
    default: ['business', 'professional', 'office', 'modern', 'success']
  };
  
  const terms = industryTerms[industry] || industryTerms.default;
  
  // Component-specific combinations
  if (component === 'hero') {
    suggestions.push(`https://source.unsplash.com/1920x1080/?${terms[0]},${terms[1]}`);
    suggestions.push(`https://source.unsplash.com/1920x1080/?${terms[0]}`);
  } else if (component === 'service') {
    terms.forEach((term, index) => {
      suggestions.push(`https://source.unsplash.com/600x400/?${term}&sig=${index + 1}`);
    });
  } else if (component === 'about') {
    suggestions.push(`https://source.unsplash.com/800x600/?${terms[0]},team`);
    suggestions.push(`https://source.unsplash.com/800x600/?${terms[0]},office`);
  } else if (component === 'gallery') {
    for (let i = 1; i <= 6; i++) {
      suggestions.push(`https://source.unsplash.com/600x400/?${terms[0]},${terms[1]}&sig=${i}`);
    }
  }
  
  return suggestions;
}