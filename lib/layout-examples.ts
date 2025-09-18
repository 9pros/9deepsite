/**
 * Specific HTML layout examples to ensure variety
 * The AI should randomly select from these layouts
 */

export const LAYOUT_EXAMPLES = {
  // HERO LAYOUT 1: Split Screen with Animated Background
  heroSplit: `
<section class="h-screen flex">
  <div class="w-1/2 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-12 relative overflow-hidden">
    <!-- Animated background shapes -->
    <div class="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div class="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    
    <div class="relative z-10">
      <h1 class="text-6xl font-bold text-white mb-6">Your Heading</h1>
      <p class="text-xl text-gray-200 mb-8">Subheading text here</p>
      <button class="px-8 py-4 bg-yellow-500 text-black rounded-full font-bold">Get Started</button>
    </div>
  </div>
  <div class="w-1/2">
    <img src="IMAGE_URL_1" class="w-full h-full object-cover">
  </div>
</section>`,

  // HERO LAYOUT 2: Diagonal Split
  heroDiagonal: `
<section class="h-screen relative overflow-hidden">
  <div class="absolute inset-0">
    <img src="IMAGE_URL_1" class="w-full h-full object-cover">
  </div>
  <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" style="clip-path: polygon(0 0, 60% 0, 40% 100%, 0% 100%);"></div>
  <div class="relative h-full flex items-center">
    <div class="max-w-2xl px-12">
      <h1 class="text-7xl font-bold text-white mb-6">Heading Here</h1>
      <p class="text-2xl text-gray-300 mb-8">Description text</p>
      <div class="flex gap-4">
        <button class="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg">Primary CTA</button>
        <button class="px-8 py-4 border-2 border-white text-white rounded-lg">Secondary</button>
      </div>
    </div>
  </div>
</section>`,

  // HERO LAYOUT 3: Centered with Floating Cards
  heroFloating: `
<section class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 relative">
  <div class="container mx-auto px-4 py-20">
    <div class="text-center mb-12">
      <h1 class="text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
        Main Headline
      </h1>
      <p class="text-2xl text-gray-300 max-w-3xl mx-auto">Compelling description</p>
    </div>
    
    <!-- Floating service cards -->
    <div class="relative h-96">
      <div class="absolute top-0 left-1/4 bg-white rounded-xl shadow-2xl p-6 w-64 transform -rotate-6 hover:rotate-0 transition-transform">
        <img src="IMAGE_URL_2" class="w-full h-32 object-cover rounded-lg mb-4">
        <h3 class="font-bold">Service 1</h3>
      </div>
      <div class="absolute top-20 right-1/4 bg-white rounded-xl shadow-2xl p-6 w-64 transform rotate-6 hover:rotate-0 transition-transform">
        <img src="IMAGE_URL_3" class="w-full h-32 object-cover rounded-lg mb-4">
        <h3 class="font-bold">Service 2</h3>
      </div>
      <div class="absolute bottom-0 left-1/3 bg-white rounded-xl shadow-2xl p-6 w-64 transform -rotate-3 hover:rotate-0 transition-transform">
        <img src="IMAGE_URL_4" class="w-full h-32 object-cover rounded-lg mb-4">
        <h3 class="font-bold">Service 3</h3>
      </div>
    </div>
  </div>
</section>`,

  // SERVICE LAYOUT 1: Bento Grid
  servicesBento: `
<section class="py-20 bg-gray-100">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-4 grid-rows-3 gap-6 h-[800px]">
      <!-- Large featured service -->
      <div class="col-span-2 row-span-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <img src="IMAGE_URL_5" class="absolute right-0 bottom-0 w-1/2 h-full object-cover opacity-30">
        <div class="relative z-10">
          <h3 class="text-3xl font-bold mb-4">Premium Service</h3>
          <p class="text-lg mb-6">Detailed description here</p>
          <button class="px-6 py-3 bg-white text-blue-600 rounded-lg">Learn More</button>
        </div>
      </div>
      
      <!-- Medium cards -->
      <div class="col-span-1 row-span-2 bg-white rounded-3xl shadow-lg overflow-hidden">
        <img src="IMAGE_URL_6" class="w-full h-1/3 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">Service 2</h3>
          <p class="text-gray-600">Quick description</p>
        </div>
      </div>
      
      <!-- Small cards -->
      <div class="col-span-1 row-span-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl p-6 text-white">
        <h3 class="text-lg font-bold">Quick Service</h3>
        <p class="text-sm">Fast delivery</p>
      </div>
      
      <div class="col-span-1 row-span-1 bg-white rounded-3xl shadow-lg p-6">
        <img src="IMAGE_URL_7" class="w-full h-20 object-cover rounded-lg mb-3">
        <h3 class="font-bold">Service 4</h3>
      </div>
      
      <!-- Wide bottom card -->
      <div class="col-span-3 row-span-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-6 text-white flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-bold">Need Custom Solutions?</h3>
          <p class="text-gray-300">We create tailored services for your needs</p>
        </div>
        <button class="px-8 py-4 bg-yellow-500 text-black rounded-lg font-bold">Contact Us</button>
      </div>
    </div>
  </div>
</section>`,

  // SERVICE LAYOUT 2: Alternating with Diagonal Images
  servicesAlternating: `
<section class="py-20">
  <div class="container mx-auto px-4 space-y-20">
    <!-- Service 1 - Image Right -->
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <span class="text-orange-500 font-bold">01</span>
        <h3 class="text-4xl font-bold mt-2 mb-4">First Service</h3>
        <p class="text-xl text-gray-600 mb-6">Detailed service description goes here with all the benefits.</p>
        <ul class="space-y-3 mb-6">
          <li class="flex items-center gap-3">
            <div class="w-6 h-6 bg-green-500 rounded-full"></div>
            <span>Benefit one</span>
          </li>
          <li class="flex items-center gap-3">
            <div class="w-6 h-6 bg-green-500 rounded-full"></div>
            <span>Benefit two</span>
          </li>
        </ul>
        <button class="px-8 py-4 bg-black text-white rounded-full">Get Started</button>
      </div>
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transform rotate-6 rounded-3xl"></div>
        <img src="IMAGE_URL_8" class="relative rounded-3xl shadow-2xl">
      </div>
    </div>
    
    <!-- Service 2 - Image Left -->
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="relative order-2 md:order-1">
        <div class="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 transform -rotate-6 rounded-3xl"></div>
        <img src="IMAGE_URL_9" class="relative rounded-3xl shadow-2xl">
      </div>
      <div class="order-1 md:order-2">
        <span class="text-purple-500 font-bold">02</span>
        <h3 class="text-4xl font-bold mt-2 mb-4">Second Service</h3>
        <p class="text-xl text-gray-600 mb-6">Another detailed description with unique value props.</p>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="text-3xl font-bold text-purple-600">99%</p>
            <p class="text-sm text-gray-600">Success Rate</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="text-3xl font-bold text-purple-600">24/7</p>
            <p class="text-sm text-gray-600">Support</p>
          </div>
        </div>
        <button class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">Learn More</button>
      </div>
    </div>
  </div>
</section>`,

  // SERVICE LAYOUT 3: Cards with Hover Flip
  servicesFlip: `
<section class="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Flip Card 1 -->
      <div class="flip-card h-96">
        <div class="flip-card-inner">
          <!-- Front -->
          <div class="flip-card-front bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
            <img src="IMAGE_URL_10" class="w-32 h-32 rounded-full object-cover mb-4">
            <h3 class="text-2xl font-bold mb-2">Service Name</h3>
            <p class="text-gray-600 text-center">Quick description</p>
          </div>
          <!-- Back -->
          <div class="flip-card-back bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white flex flex-col justify-center">
            <h3 class="text-2xl font-bold mb-4">Service Details</h3>
            <ul class="space-y-2 mb-6">
              <li>• Feature 1</li>
              <li>• Feature 2</li>
              <li>• Feature 3</li>
            </ul>
            <button class="px-6 py-3 bg-white text-blue-600 rounded-lg">Book Now</button>
          </div>
        </div>
      </div>
      
      <!-- Repeat for other cards with IMAGE_URL_11, IMAGE_URL_12 -->
    </div>
  </div>
</section>

<style>
.flip-card {
  perspective: 1000px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.flip-card-back {
  transform: rotateY(180deg);
}
</style>`,

  // TESTIMONIAL LAYOUT 1: Masonry Grid
  testimonialsMasonry: `
<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      <!-- Testimonial 1 - Short -->
      <div class="break-inside-avoid bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
        <div class="flex gap-1 mb-3">
          ⭐⭐⭐⭐⭐
        </div>
        <p class="text-gray-700 mb-4">"Amazing service! Highly recommend."</p>
        <div class="flex items-center gap-3">
          <img src="https://picsum.photos/50/50?random=201" class="w-10 h-10 rounded-full">
          <div>
            <p class="font-bold text-sm">John Doe</p>
            <p class="text-xs text-gray-600">CEO, Company</p>
          </div>
        </div>
      </div>
      
      <!-- Testimonial 2 - Long -->
      <div class="break-inside-avoid bg-white border-2 border-gray-200 rounded-2xl p-6">
        <div class="flex gap-1 mb-3">
          ⭐⭐⭐⭐⭐
        </div>
        <p class="text-gray-700 mb-4">"This is a longer testimonial that goes into much more detail about the amazing experience we had with this company. They exceeded all our expectations and delivered incredible results that transformed our business."</p>
        <div class="flex items-center gap-3">
          <img src="https://picsum.photos/50/50?random=202" class="w-10 h-10 rounded-full">
          <div>
            <p class="font-bold text-sm">Jane Smith</p>
            <p class="text-xs text-gray-600">Director, Corp</p>
          </div>
        </div>
      </div>
      
      <!-- Testimonial 3 - Featured -->
      <div class="break-inside-avoid bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl p-8">
        <p class="text-2xl font-bold mb-4">"Game changer!"</p>
        <p class="mb-4">Best decision we ever made for our business.</p>
        <div class="flex items-center gap-3">
          <img src="https://picsum.photos/50/50?random=203" class="w-12 h-12 rounded-full border-2 border-white">
          <div>
            <p class="font-bold">Mike Johnson</p>
            <p class="text-sm opacity-90">Founder</p>
          </div>
        </div>
      </div>
      
      <!-- Add more testimonials with IMAGE URLs 204-210 -->
    </div>
  </div>
</section>`,

  // CTA LAYOUT 1: Floating Islands
  ctaIslands: `
<section class="py-20 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 relative overflow-hidden">
  <!-- Floating decorative elements -->
  <div class="absolute top-10 left-10 w-64 h-64 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
  <div class="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
  
  <div class="container mx-auto px-4 relative z-10">
    <div class="grid md:grid-cols-3 gap-8">
      <!-- CTA Card 1 -->
      <div class="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:-translate-y-2 transition-transform">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
          <span class="text-white text-2xl font-bold">1</span>
        </div>
        <h3 class="text-2xl font-bold mb-3">Get Quote</h3>
        <p class="text-gray-600 mb-6">Free instant pricing</p>
        <button class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl">Start Now</button>
      </div>
      
      <!-- CTA Card 2 - Featured -->
      <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 shadow-2xl transform scale-105 text-white">
        <div class="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4">Most Popular</div>
        <h3 class="text-3xl font-bold mb-3">Book Service</h3>
        <p class="mb-6 opacity-90">Schedule your appointment</p>
        <button class="w-full px-6 py-4 bg-white text-orange-500 rounded-xl font-bold">Book Now</button>
      </div>
      
      <!-- CTA Card 3 -->
      <div class="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-2xl transform hover:-translate-y-2 transition-transform">
        <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
          <span class="text-white text-2xl">💬</span>
        </div>
        <h3 class="text-2xl font-bold mb-3">Live Chat</h3>
        <p class="text-gray-600 mb-6">Talk to an expert</p>
        <button class="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl">Chat Now</button>
      </div>
    </div>
  </div>
</section>`
};

// CRITICAL: Tell AI to use these exact structures
export const LAYOUT_INSTRUCTIONS = `
IMPORTANT: You MUST use varied layouts from the examples above!

For Hero: Randomly pick between:
- Split screen (content left, image right)
- Diagonal split with clip-path
- Floating cards over gradient
- Fullscreen image with overlay
- Asymmetric with image grid

For Services: Randomly pick between:
- Bento grid (mixed card sizes)
- Alternating left/right with angles
- Flip cards on hover
- Masonry layout
- Carousel/slider

For Testimonials: Use either:
- Masonry columns layout
- Full-width carousel
- Grid with varied sizes

NEVER use the same layout pattern twice on one page!
Mix gradients, angles, and card styles for variety.
`;