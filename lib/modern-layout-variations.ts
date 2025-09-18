/**
 * Modern layout variations and creative design patterns
 * These provide diverse, conversion-focused layouts for different sections
 */

export const LAYOUT_VARIATIONS = {
  // HERO VARIATIONS
  heroSplitScreen: `
    <!-- Split Screen Hero with Video Background -->
    <section class="relative h-screen flex">
      <!-- Left Side - Content -->
      <div class="w-full lg:w-1/2 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-12">
        <div class="max-w-xl">
          <h1 class="text-5xl lg:text-6xl font-bold text-white mb-6">
            <span id="typed-hero"></span>
          </h1>
          <p class="text-xl text-blue-100 mb-8">24/7 Emergency Service • Licensed & Insured • Same Day Service</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="px-8 py-4 bg-white text-blue-900 rounded-lg font-bold hover:bg-gray-100 transition-all">
              Get Instant Quote
            </button>
            <button class="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-900 transition-all">
              <i data-feather="phone" class="inline w-5 h-5 mr-2"></i>
              (555) 123-4567
            </button>
          </div>
        </div>
      </div>
      <!-- Right Side - Image/Video -->
      <div class="hidden lg:block w-1/2 relative">
        <img src="[HERO_IMAGE]" alt="Professional service" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-black/20"></div>
        <!-- Floating Stats -->
        <div class="absolute bottom-10 right-10 bg-white/95 backdrop-blur p-6 rounded-xl">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <p class="text-3xl font-bold text-blue-900">15K+</p>
              <p class="text-sm text-gray-600">Happy Customers</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-bold text-blue-900">24/7</p>
              <p class="text-sm text-gray-600">Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  heroFullscreenVideo: `
    <!-- Fullscreen Video Hero with Overlay -->
    <section class="relative h-screen overflow-hidden">
      <!-- Video Background (use image as fallback) -->
      <div class="absolute inset-0">
        <img src="[HERO_IMAGE]" alt="Background" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      </div>
      
      <!-- Animated Particles Effect -->
      <div class="absolute inset-0">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
      </div>
      
      <!-- Content -->
      <div class="relative h-full flex items-center justify-center text-center">
        <div class="max-w-4xl px-4">
          <div class="mb-6">
            <span class="px-4 py-2 bg-blue-600/20 border border-blue-400 text-blue-300 rounded-full text-sm font-semibold">
              ⚡ Same Day Service Available
            </span>
          </div>
          <h1 class="text-6xl lg:text-8xl font-bold text-white mb-6 animate-fade-in">
            <span id="hero-text"></span>
          </h1>
          <p class="text-2xl text-gray-200 mb-10 animate-slide-up">
            Professional • Reliable • Affordable
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay">
            <button class="group px-10 py-5 bg-blue-600 text-white rounded-full text-lg font-bold hover:bg-blue-700 transition-all transform hover:scale-105">
              Start Your Project
              <i data-feather="arrow-right" class="inline w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i data-feather="chevron-down" class="w-8 h-8 text-white"></i>
      </div>
    </section>
    
    <style>
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255,255,255,0.5);
        animation: float 6s ease-in-out infinite;
      }
      .particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
      .particle-2 { top: 60%; left: 80%; animation-delay: 1s; }
      .particle-3 { top: 40%; left: 30%; animation-delay: 2s; }
      .particle-4 { top: 80%; left: 60%; animation-delay: 3s; }
    </style>
  `,

  heroMinimalist: `
    <!-- Minimalist Hero with Side Navigation -->
    <section class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div class="container mx-auto px-4 py-20">
        <div class="grid lg:grid-cols-12 gap-12 items-center">
          <!-- Side Nav -->
          <div class="lg:col-span-2">
            <nav class="space-y-4">
              <a href="#services" class="block text-gray-500 hover:text-blue-600 transition-colors">Services</a>
              <a href="#process" class="block text-gray-500 hover:text-blue-600 transition-colors">Process</a>
              <a href="#pricing" class="block text-gray-500 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#contact" class="block text-gray-500 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
          </div>
          
          <!-- Main Content -->
          <div class="lg:col-span-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-6">
              <span class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Available Now
            </div>
            <h1 class="text-5xl lg:text-7xl font-light text-gray-900 mb-6">
              We Make
              <span class="font-bold text-blue-600 block">Excellence</span>
              Look Easy
            </h1>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your space with our professional services. 
              Quality guaranteed, satisfaction assured.
            </p>
            <div class="flex gap-4">
              <button class="px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                View Our Work
              </button>
              <button class="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-all">
                Get Quote
              </button>
            </div>
          </div>
          
          <!-- Image Grid -->
          <div class="lg:col-span-4">
            <div class="grid grid-cols-2 gap-4">
              <img src="[SERVICE_IMAGE_1]" alt="Service 1" class="rounded-lg h-40 w-full object-cover">
              <img src="[SERVICE_IMAGE_2]" alt="Service 2" class="rounded-lg h-40 w-full object-cover transform translate-y-8">
              <img src="[SERVICE_IMAGE_3]" alt="Service 3" class="rounded-lg h-40 w-full object-cover">
              <img src="[SERVICE_IMAGE_4]" alt="Service 4" class="rounded-lg h-40 w-full object-cover transform translate-y-8">
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  // SERVICE SECTION VARIATIONS
  servicesBentoGrid: `
    <!-- Bento Grid Services Layout -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-4">Our Services</h2>
        <p class="text-xl text-gray-600 text-center mb-12">Comprehensive solutions for all your needs</p>
        
        <div class="grid grid-cols-12 gap-6">
          <!-- Large Feature Card -->
          <div class="col-span-12 lg:col-span-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden">
            <div class="relative z-10">
              <span class="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4">Most Popular</span>
              <h3 class="text-3xl font-bold mb-4">Complete Installation</h3>
              <p class="text-lg mb-6 text-blue-100">Full system installation with warranty and maintenance plan included</p>
              <button class="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Learn More →
              </button>
            </div>
            <img src="[SERVICE_IMAGE_1]" alt="Installation" class="absolute right-0 bottom-0 w-1/2 h-full object-cover opacity-20">
          </div>
          
          <!-- Medium Cards -->
          <div class="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <img src="[SERVICE_IMAGE_2]" alt="Repair" class="w-full h-32 object-cover rounded-lg mb-4">
            <h3 class="text-xl font-bold mb-2">Emergency Repair</h3>
            <p class="text-gray-600 mb-4">24/7 emergency service available</p>
            <a href="#" class="text-blue-600 font-semibold hover:text-blue-700">View Details →</a>
          </div>
          
          <!-- Small Cards Grid -->
          <div class="col-span-12 sm:col-span-6 lg:col-span-4 space-y-6">
            <div class="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i data-feather="tool" class="w-8 h-8 text-blue-600"></i>
                </div>
                <div>
                  <h4 class="font-bold">Maintenance</h4>
                  <p class="text-sm text-gray-600">Regular check-ups</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <i data-feather="check-circle" class="w-8 h-8 text-green-600"></i>
                </div>
                <div>
                  <h4 class="font-bold">Inspection</h4>
                  <p class="text-sm text-gray-600">Safety certified</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Wide Card -->
          <div class="col-span-12 lg:col-span-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-bold mb-2">Custom Solutions</h3>
                <p class="text-gray-300">Tailored services for unique requirements</p>
              </div>
              <button class="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  servicesInteractive: `
    <!-- Interactive Services with Hover Effects -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-5xl font-bold text-center mb-16">What We Do Best</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Service Card 1 -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative bg-white border-2 border-gray-200 rounded-2xl p-8 group-hover:border-transparent group-hover:transform group-hover:-translate-y-2 transition-all duration-300">
              <img src="[SERVICE_IMAGE_1]" alt="Service" class="w-full h-48 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform">
              <h3 class="text-2xl font-bold mb-3 group-hover:text-white">Premium Service</h3>
              <p class="text-gray-600 mb-6 group-hover:text-white/90">Complete solutions with lifetime warranty</p>
              <div class="flex items-center justify-between">
                <span class="text-3xl font-bold text-blue-600 group-hover:text-white">$299</span>
                <button class="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-all">
                  Book Now
                </button>
              </div>
            </div>
          </div>
          
          <!-- Service Card 2 - Featured -->
          <div class="group relative transform scale-105">
            <div class="absolute -top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">Popular</div>
            <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"></div>
            <div class="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <img src="[SERVICE_IMAGE_2]" alt="Service" class="w-full h-48 object-cover rounded-lg mb-6">
              <h3 class="text-2xl font-bold mb-3">Professional Package</h3>
              <p class="text-white/90 mb-6">Most comprehensive service package</p>
              <div class="flex items-center justify-between">
                <span class="text-3xl font-bold">$499</span>
                <button class="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
          
          <!-- Service Card 3 -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative bg-white border-2 border-gray-200 rounded-2xl p-8 group-hover:border-transparent group-hover:transform group-hover:-translate-y-2 transition-all duration-300">
              <img src="[SERVICE_IMAGE_3]" alt="Service" class="w-full h-48 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform">
              <h3 class="text-2xl font-bold mb-3 group-hover:text-white">Basic Service</h3>
              <p class="text-gray-600 mb-6 group-hover:text-white/90">Essential maintenance and repairs</p>
              <div class="flex items-center justify-between">
                <span class="text-3xl font-bold text-green-600 group-hover:text-white">$199</span>
                <button class="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg group-hover:bg-white group-hover:text-green-600 transition-all">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  // TESTIMONIAL VARIATIONS
  testimonialsCarousel: `
    <!-- Modern Testimonials Carousel -->
    <section class="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-16">Client Success Stories</h2>
        
        <div class="relative max-w-4xl mx-auto">
          <!-- Main Testimonial -->
          <div class="bg-white rounded-3xl shadow-2xl p-12">
            <div class="flex flex-col md:flex-row gap-8 items-center">
              <img src="https://picsum.photos/200/200?random=101" alt="Client" class="w-32 h-32 rounded-full object-cover">
              <div class="flex-1">
                <div class="flex gap-1 mb-4">
                  <i data-feather="star" class="w-5 h-5 fill-yellow-400 text-yellow-400"></i>
                  <i data-feather="star" class="w-5 h-5 fill-yellow-400 text-yellow-400"></i>
                  <i data-feather="star" class="w-5 h-5 fill-yellow-400 text-yellow-400"></i>
                  <i data-feather="star" class="w-5 h-5 fill-yellow-400 text-yellow-400"></i>
                  <i data-feather="star" class="w-5 h-5 fill-yellow-400 text-yellow-400"></i>
                </div>
                <p class="text-xl text-gray-700 mb-6 italic">
                  "Absolutely incredible service! They went above and beyond our expectations. 
                  The team was professional, punctual, and delivered outstanding results. 
                  I couldn't be happier with the outcome."
                </p>
                <div>
                  <p class="font-bold text-lg">Jennifer Martinez</p>
                  <p class="text-gray-600">CEO, TechCorp Solutions</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Navigation -->
          <div class="flex justify-center gap-2 mt-8">
            <button class="w-3 h-3 bg-blue-600 rounded-full"></button>
            <button class="w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"></button>
            <button class="w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"></button>
            <button class="w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"></button>
          </div>
        </div>
        
        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
          <div class="text-center">
            <p class="text-4xl font-bold text-blue-600">98%</p>
            <p class="text-gray-600">Satisfaction Rate</p>
          </div>
          <div class="text-center">
            <p class="text-4xl font-bold text-blue-600">5000+</p>
            <p class="text-gray-600">Happy Clients</p>
          </div>
          <div class="text-center">
            <p class="text-4xl font-bold text-blue-600">4.9</p>
            <p class="text-gray-600">Average Rating</p>
          </div>
          <div class="text-center">
            <p class="text-4xl font-bold text-blue-600">15+</p>
            <p class="text-gray-600">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  `,

  // PRICING VARIATIONS
  pricingCalculator: `
    <!-- Interactive Pricing Calculator -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-4">Transparent Pricing</h2>
        <p class="text-xl text-gray-600 text-center mb-12">Calculate your estimate instantly</p>
        
        <div class="max-w-5xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="grid md:grid-cols-2 gap-8">
              <!-- Calculator -->
              <div>
                <h3 class="text-2xl font-bold mb-6">Service Calculator</h3>
                
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                    <select class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Installation - $500 base</option>
                      <option>Repair - $150 base</option>
                      <option>Maintenance - $100 base</option>
                      <option>Emergency - $250 base</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Property Size</label>
                    <div class="grid grid-cols-3 gap-3">
                      <button class="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-600 focus:border-blue-600 focus:bg-blue-50">Small</button>
                      <button class="px-4 py-2 border-2 border-blue-600 bg-blue-50 rounded-lg">Medium</button>
                      <button class="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-600 focus:border-blue-600 focus:bg-blue-50">Large</button>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Additional Services</label>
                    <div class="space-y-2">
                      <label class="flex items-center">
                        <input type="checkbox" class="mr-3">
                        <span>Extended Warranty (+$150)</span>
                      </label>
                      <label class="flex items-center">
                        <input type="checkbox" class="mr-3">
                        <span>Priority Service (+$75)</span>
                      </label>
                      <label class="flex items-center">
                        <input type="checkbox" class="mr-3">
                        <span>Annual Maintenance Plan (+$299)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Estimate Display -->
              <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
                <h3 class="text-2xl font-bold mb-6">Your Estimate</h3>
                
                <div class="space-y-4 mb-8">
                  <div class="flex justify-between">
                    <span>Base Service</span>
                    <span class="font-bold">$500</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Property Size (Medium)</span>
                    <span class="font-bold">$100</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Additional Services</span>
                    <span class="font-bold">$0</span>
                  </div>
                  <div class="border-t pt-4">
                    <div class="flex justify-between text-2xl font-bold">
                      <span>Total Estimate</span>
                      <span>$600</span>
                    </div>
                  </div>
                </div>
                
                <button class="w-full px-6 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                  Schedule Service
                </button>
                
                <p class="text-sm text-blue-100 text-center mt-4">
                  * Final price confirmed after inspection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  // PROCESS TIMELINE
  processTimeline: `
    <!-- Visual Process Timeline -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-16">Our Simple Process</h2>
        
        <div class="max-w-5xl mx-auto">
          <!-- Timeline -->
          <div class="relative">
            <!-- Line -->
            <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600"></div>
            
            <!-- Step 1 -->
            <div class="relative flex items-center mb-12">
              <div class="w-full md:w-5/12 text-right pr-8">
                <h3 class="text-2xl font-bold mb-2">Schedule Consultation</h3>
                <p class="text-gray-600">Book your free consultation online or by phone</p>
              </div>
              <div class="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                1
              </div>
              <div class="hidden md:block w-5/12 pl-8">
                <img src="[PROCESS_IMAGE_1]" alt="Consultation" class="rounded-lg shadow-lg">
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="relative flex items-center mb-12">
              <div class="hidden md:block w-5/12 pr-8">
                <img src="[PROCESS_IMAGE_2]" alt="Assessment" class="rounded-lg shadow-lg">
              </div>
              <div class="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                2
              </div>
              <div class="w-full md:w-5/12 pl-8 md:text-left">
                <h3 class="text-2xl font-bold mb-2">Professional Assessment</h3>
                <p class="text-gray-600">Our experts evaluate your needs and provide solutions</p>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="relative flex items-center mb-12">
              <div class="w-full md:w-5/12 text-right pr-8">
                <h3 class="text-2xl font-bold mb-2">Quality Service</h3>
                <p class="text-gray-600">Professional execution with attention to detail</p>
              </div>
              <div class="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                3
              </div>
              <div class="hidden md:block w-5/12 pl-8">
                <img src="[PROCESS_IMAGE_3]" alt="Service" class="rounded-lg shadow-lg">
              </div>
            </div>
            
            <!-- Step 4 -->
            <div class="relative flex items-center">
              <div class="hidden md:block w-5/12 pr-8">
                <img src="[PROCESS_IMAGE_4]" alt="Satisfaction" class="rounded-lg shadow-lg">
              </div>
              <div class="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                ✓
              </div>
              <div class="w-full md:w-5/12 pl-8 md:text-left">
                <h3 class="text-2xl font-bold mb-2">100% Satisfaction</h3>
                <p class="text-gray-600">Guaranteed quality with follow-up support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
};

export const CREATIVE_COMPONENTS = {
  floatingCTA: `
    <!-- Floating CTA Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 z-50 transform translate-y-full transition-transform" id="floating-cta">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="animate-pulse">
            <i data-feather="zap" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="font-bold">Limited Time Offer!</p>
            <p class="text-sm opacity-90">Get 20% off your first service</p>
          </div>
        </div>
        <div class="flex gap-4">
          <button class="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Claim Offer
          </button>
          <button onclick="document.getElementById('floating-cta').style.transform='translateY(100%)'" class="text-white/80 hover:text-white">
            <i data-feather="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
    </div>
    
    <script>
      // Show floating CTA after scrolling
      window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
          document.getElementById('floating-cta').style.transform = 'translateY(0)';
        }
      });
    </script>
  `,

  animatedStats: `
    <!-- Animated Statistics -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <p class="text-5xl font-bold" data-counter="15000">0</p>
            <p class="text-lg opacity-90">Happy Customers</p>
          </div>
          <div class="text-center">
            <p class="text-5xl font-bold" data-counter="98">0</p>
            <p class="text-lg opacity-90">Satisfaction Rate</p>
          </div>
          <div class="text-center">
            <p class="text-5xl font-bold" data-counter="24">0</p>
            <p class="text-lg opacity-90">Hour Service</p>
          </div>
          <div class="text-center">
            <p class="text-5xl font-bold" data-counter="10">0</p>
            <p class="text-lg opacity-90">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
    
    <script>
      // Animated counters
      const counters = document.querySelectorAll('[data-counter]');
      const speed = 200;
      
      counters.forEach(counter => {
        const updateCount = () => {
          const target = +counter.getAttribute('data-counter');
          const count = +counter.innerText;
          const inc = target / speed;
          
          if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 1);
          } else {
            counter.innerText = target;
            if (counter.innerText === '98') counter.innerText += '%';
            if (counter.innerText === '24') counter.innerText += '/7';
            if (counter.innerText === '10') counter.innerText += '+';
            if (counter.innerText === '15000') counter.innerText = '15K+';
          }
        };
        
        // Start animation when visible
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            updateCount();
            observer.disconnect();
          }
        });
        observer.observe(counter);
      });
    </script>
  `,

  videoTestimonial: `
    <!-- Video Testimonial Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-12">See What Our Clients Say</h2>
        
        <div class="max-w-4xl mx-auto">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl">
            <!-- Video Placeholder -->
            <img src="[VIDEO_THUMBNAIL]" alt="Video testimonial" class="w-full">
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button class="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors group">
                <i data-feather="play" class="w-8 h-8 text-blue-600 ml-1 group-hover:scale-110 transition-transform"></i>
              </button>
            </div>
            
            <!-- Client Info Overlay -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <p class="text-2xl font-bold">Michael Thompson</p>
              <p class="opacity-90">CEO, Growth Industries</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
};