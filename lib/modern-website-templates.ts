/**
 * Modern website component templates for AI generation
 * These templates provide code examples for conversion-focused features
 */

export const MODERN_TEMPLATES = {
  heroWithTypingAnimation: `
    <!-- Hero Section with Typing Animation -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img src="[INDUSTRY_HERO_IMAGE]" alt="Hero background" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <h1 class="text-5xl md:text-7xl font-bold mb-6">
          <span id="typed-text"></span>
          <span class="typed-cursor">|</span>
        </h1>
        <p class="text-xl md:text-2xl mb-8 opacity-90">Professional Service You Can Trust</p>
        <div class="flex gap-4 justify-center">
          <button class="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
            Get Free Quote
          </button>
          <button class="px-8 py-4 border-2 border-white hover:bg-white hover:text-black rounded-full text-lg font-semibold transition-all">
            Call Now: (555) 123-4567
          </button>
        </div>
      </div>
    </section>
    
    <script>
      // Typing Animation
      const phrases = [
        "Expert HVAC Services",
        "24/7 Emergency Repairs",
        "Certified Technicians",
        "Same Day Service",
        "100% Satisfaction Guaranteed"
      ];
      
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      const typedElement = document.getElementById('typed-text');
      
      function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
          typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
          charIndex--;
          
          if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
        } else {
          typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
          charIndex++;
          
          if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(type, 2000); // Pause at end
            return;
          }
        }
        
        setTimeout(type, isDeleting ? 50 : 100);
      }
      
      // Start typing animation
      type();
    </script>
  `,

  multiStepForm: `
    <!-- Multi-Step Conversion Form -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-8">Get Your Free Quote</h2>
        
        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium step-label active">Service</span>
            <span class="text-sm font-medium step-label">Contact</span>
            <span class="text-sm font-medium step-label">Schedule</span>
            <span class="text-sm font-medium step-label">Confirm</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div id="progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: 25%"></div>
          </div>
        </div>
        
        <!-- Form Steps -->
        <form id="multi-step-form" class="bg-white rounded-lg shadow-lg p-8">
          <!-- Step 1: Service Selection -->
          <div class="form-step active" data-step="1">
            <h3 class="text-2xl font-semibold mb-6">What service do you need?</h3>
            <div class="grid grid-cols-2 gap-4">
              <label class="service-card">
                <input type="radio" name="service" value="installation" class="hidden">
                <div class="p-6 border-2 rounded-lg cursor-pointer hover:border-blue-600 transition-all">
                  <i data-feather="tool" class="w-8 h-8 mb-2"></i>
                  <h4 class="font-semibold">Installation</h4>
                  <p class="text-sm text-gray-600">New system installation</p>
                </div>
              </label>
              <label class="service-card">
                <input type="radio" name="service" value="repair" class="hidden">
                <div class="p-6 border-2 rounded-lg cursor-pointer hover:border-blue-600 transition-all">
                  <i data-feather="wrench" class="w-8 h-8 mb-2"></i>
                  <h4 class="font-semibold">Repair</h4>
                  <p class="text-sm text-gray-600">Fix existing system</p>
                </div>
              </label>
              <label class="service-card">
                <input type="radio" name="service" value="maintenance" class="hidden">
                <div class="p-6 border-2 rounded-lg cursor-pointer hover:border-blue-600 transition-all">
                  <i data-feather="settings" class="w-8 h-8 mb-2"></i>
                  <h4 class="font-semibold">Maintenance</h4>
                  <p class="text-sm text-gray-600">Regular service</p>
                </div>
              </label>
              <label class="service-card">
                <input type="radio" name="service" value="emergency" class="hidden">
                <div class="p-6 border-2 rounded-lg cursor-pointer hover:border-blue-600 transition-all">
                  <i data-feather="alert-circle" class="w-8 h-8 mb-2"></i>
                  <h4 class="font-semibold">Emergency</h4>
                  <p class="text-sm text-gray-600">Urgent repair needed</p>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Step 2: Contact Information -->
          <div class="form-step" data-step="2">
            <h3 class="text-2xl font-semibold mb-6">Your Contact Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" class="px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none">
              <input type="text" placeholder="Last Name" class="px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none">
              <input type="email" placeholder="Email" class="px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none col-span-2">
              <input type="tel" placeholder="Phone" class="px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none">
              <input type="text" placeholder="ZIP Code" class="px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none">
            </div>
          </div>
          
          <!-- Step 3: Schedule -->
          <div class="form-step" data-step="3">
            <h3 class="text-2xl font-semibold mb-6">When do you need service?</h3>
            <div class="space-y-4">
              <label class="block">
                <span class="text-gray-700">Preferred Date</span>
                <input type="date" class="mt-1 block w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none">
              </label>
              <label class="block">
                <span class="text-gray-700">Preferred Time</span>
                <select class="mt-1 block w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none">
                  <option>Morning (8AM - 12PM)</option>
                  <option>Afternoon (12PM - 5PM)</option>
                  <option>Evening (5PM - 8PM)</option>
                </select>
              </label>
              <label class="block">
                <span class="text-gray-700">Additional Notes</span>
                <textarea rows="4" class="mt-1 block w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"></textarea>
              </label>
            </div>
          </div>
          
          <!-- Step 4: Confirmation -->
          <div class="form-step" data-step="4">
            <h3 class="text-2xl font-semibold mb-6">Confirm Your Request</h3>
            <div class="bg-gray-50 p-6 rounded-lg">
              <h4 class="font-semibold mb-4">Service Summary:</h4>
              <div id="summary-content" class="space-y-2 text-gray-700">
                <!-- Summary will be populated by JavaScript -->
              </div>
            </div>
            <label class="flex items-center mt-6">
              <input type="checkbox" class="mr-2">
              <span class="text-sm">I agree to the terms and conditions</span>
            </label>
          </div>
          
          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-8">
            <button type="button" id="prev-btn" class="px-6 py-3 bg-gray-300 rounded-lg hidden">Previous</button>
            <button type="button" id="next-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg ml-auto">Next</button>
            <button type="submit" id="submit-btn" class="px-6 py-3 bg-green-600 text-white rounded-lg ml-auto hidden">Submit Request</button>
          </div>
        </form>
      </div>
    </section>
    
    <script>
      // Multi-step form logic
      let currentStep = 1;
      const totalSteps = 4;
      
      document.getElementById('next-btn').addEventListener('click', () => {
        if (currentStep < totalSteps) {
          currentStep++;
          updateFormStep();
        }
      });
      
      document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateFormStep();
        }
      });
      
      function updateFormStep() {
        // Update progress bar
        document.getElementById('progress-bar').style.width = (currentStep / totalSteps * 100) + '%';
        
        // Update step visibility
        document.querySelectorAll('.form-step').forEach(step => {
          step.classList.remove('active');
        });
        document.querySelector(\`.form-step[data-step="\${currentStep}"]\`).classList.add('active');
        
        // Update buttons
        document.getElementById('prev-btn').classList.toggle('hidden', currentStep === 1);
        document.getElementById('next-btn').classList.toggle('hidden', currentStep === totalSteps);
        document.getElementById('submit-btn').classList.toggle('hidden', currentStep !== totalSteps);
        
        // Update step labels
        document.querySelectorAll('.step-label').forEach((label, index) => {
          label.classList.toggle('active', index < currentStep);
        });
      }
    </script>
  `,

  serviceAreasWithSubAreas: `
    <!-- Service Areas with Sub-Areas -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-4">Service Areas</h2>
        <p class="text-xl text-gray-600 text-center mb-12">We proudly serve the following locations</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Miami-Dade County -->
          <div class="service-area-card">
            <div class="bg-blue-600 text-white p-4 rounded-t-lg cursor-pointer flex justify-between items-center" onclick="toggleArea('miami')">
              <h3 class="font-semibold text-lg">Miami-Dade County</h3>
              <i data-feather="chevron-down" class="w-5 h-5 transition-transform" id="miami-icon"></i>
            </div>
            <div id="miami-areas" class="bg-gray-50 rounded-b-lg overflow-hidden max-h-0 transition-all duration-300">
              <div class="p-4 space-y-2">
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Miami Beach</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Coral Gables</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Aventura</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Kendall</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Homestead</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Broward County -->
          <div class="service-area-card">
            <div class="bg-blue-600 text-white p-4 rounded-t-lg cursor-pointer flex justify-between items-center" onclick="toggleArea('broward')">
              <h3 class="font-semibold text-lg">Broward County</h3>
              <i data-feather="chevron-down" class="w-5 h-5 transition-transform" id="broward-icon"></i>
            </div>
            <div id="broward-areas" class="bg-gray-50 rounded-b-lg overflow-hidden max-h-0 transition-all duration-300">
              <div class="p-4 space-y-2">
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Fort Lauderdale</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Hollywood</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Pembroke Pines</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Coral Springs</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Palm Beach County -->
          <div class="service-area-card">
            <div class="bg-blue-600 text-white p-4 rounded-t-lg cursor-pointer flex justify-between items-center" onclick="toggleArea('palm')">
              <h3 class="font-semibold text-lg">Palm Beach County</h3>
              <i data-feather="chevron-down" class="w-5 h-5 transition-transform" id="palm-icon"></i>
            </div>
            <div id="palm-areas" class="bg-gray-50 rounded-b-lg overflow-hidden max-h-0 transition-all duration-300">
              <div class="p-4 space-y-2">
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>West Palm Beach</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Boca Raton</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Delray Beach</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-feather="map-pin" class="w-4 h-4 text-blue-600"></i>
                  <span>Jupiter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Interactive Map Placeholder -->
        <div class="mt-12 bg-gray-100 rounded-lg p-8 text-center">
          <i data-feather="map" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
          <p class="text-gray-600">Interactive service area map</p>
        </div>
      </div>
    </section>
    
    <script>
      function toggleArea(area) {
        const areaElement = document.getElementById(area + '-areas');
        const iconElement = document.getElementById(area + '-icon');
        
        if (areaElement.style.maxHeight && areaElement.style.maxHeight !== '0px') {
          areaElement.style.maxHeight = '0';
          iconElement.style.transform = 'rotate(0deg)';
        } else {
          areaElement.style.maxHeight = areaElement.scrollHeight + 'px';
          iconElement.style.transform = 'rotate(180deg)';
        }
      }
    </script>
  `,

  faqSection: `
    <!-- FAQ Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
        <p class="text-xl text-gray-600 text-center mb-12">Get answers to common questions</p>
        
        <!-- FAQ Search -->
        <div class="mb-8">
          <input type="text" id="faq-search" placeholder="Search FAQs..." 
                 class="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none">
        </div>
        
        <!-- FAQ Items -->
        <div class="space-y-4" id="faq-container">
          <div class="faq-item bg-white rounded-lg shadow-md">
            <button class="w-full px-6 py-4 text-left flex justify-between items-center" onclick="toggleFAQ(this)">
              <span class="font-semibold">How quickly can you respond to emergency calls?</span>
              <i data-feather="plus" class="w-5 h-5 transition-transform"></i>
            </button>
            <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
              <div class="px-6 pb-4 text-gray-600">
                We offer 24/7 emergency service and typically respond within 1-2 hours for urgent situations. Our emergency hotline is always staffed with trained professionals ready to help.
              </div>
            </div>
          </div>
          
          <div class="faq-item bg-white rounded-lg shadow-md">
            <button class="w-full px-6 py-4 text-left flex justify-between items-center" onclick="toggleFAQ(this)">
              <span class="font-semibold">What brands do you service?</span>
              <i data-feather="plus" class="w-5 h-5 transition-transform"></i>
            </button>
            <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
              <div class="px-6 pb-4 text-gray-600">
                We service all major brands including Carrier, Trane, Lennox, Rheem, Goodman, and more. Our technicians are certified and trained on the latest models and technologies.
              </div>
            </div>
          </div>
          
          <div class="faq-item bg-white rounded-lg shadow-md">
            <button class="w-full px-6 py-4 text-left flex justify-between items-center" onclick="toggleFAQ(this)">
              <span class="font-semibold">Do you offer financing options?</span>
              <i data-feather="plus" class="w-5 h-5 transition-transform"></i>
            </button>
            <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
              <div class="px-6 pb-4 text-gray-600">
                Yes! We offer flexible financing options with approved credit. We have 0% interest options available for qualified customers, as well as low monthly payment plans.
              </div>
            </div>
          </div>
          
          <div class="faq-item bg-white rounded-lg shadow-md">
            <button class="w-full px-6 py-4 text-left flex justify-between items-center" onclick="toggleFAQ(this)">
              <span class="font-semibold">How often should I service my HVAC system?</span>
              <i data-feather="plus" class="w-5 h-5 transition-transform"></i>
            </button>
            <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
              <div class="px-6 pb-4 text-gray-600">
                We recommend servicing your HVAC system twice a year - once in spring for cooling and once in fall for heating. Regular maintenance extends system life and improves efficiency.
              </div>
            </div>
          </div>
          
          <div class="faq-item bg-white rounded-lg shadow-md">
            <button class="w-full px-6 py-4 text-left flex justify-between items-center" onclick="toggleFAQ(this)">
              <span class="font-semibold">What's included in your maintenance plans?</span>
              <i data-feather="plus" class="w-5 h-5 transition-transform"></i>
            </button>
            <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
              <div class="px-6 pb-4 text-gray-600">
                Our maintenance plans include bi-annual inspections, filter changes, cleaning, priority service, discounts on repairs, and no overtime charges for emergency calls.
              </div>
            </div>
          </div>
          
          <div class="faq-item bg-white rounded-lg shadow-md">
            <button class="w-full px-6 py-4 text-left flex justify-between items-center" onclick="toggleFAQ(this)">
              <span class="font-semibold">Are your technicians licensed and insured?</span>
              <i data-feather="plus" class="w-5 h-5 transition-transform"></i>
            </button>
            <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
              <div class="px-6 pb-4 text-gray-600">
                Yes, all our technicians are fully licensed, bonded, and insured. They undergo continuous training and background checks for your safety and peace of mind.
              </div>
            </div>
          </div>
          
          <div class="faq-item bg-white rounded-lg shadow-md">
            <button class="w-full px-6 py-4 text-left flex justify-between items-center" onclick="toggleFAQ(this)">
              <span class="font-semibold">Do you offer free estimates?</span>
              <i data-feather="plus" class="w-5 h-5 transition-transform"></i>
            </button>
            <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
              <div class="px-6 pb-4 text-gray-600">
                Yes! We provide free, no-obligation estimates for new installations and replacements. For repairs, we charge a diagnostic fee that's waived if you proceed with the repair.
              </div>
            </div>
          </div>
          
          <div class="faq-item bg-white rounded-lg shadow-md">
            <button class="w-full px-6 py-4 text-left flex justify-between items-center" onclick="toggleFAQ(this)">
              <span class="font-semibold">What warranties do you offer?</span>
              <i data-feather="plus" class="w-5 h-5 transition-transform"></i>
            </button>
            <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
              <div class="px-6 pb-4 text-gray-600">
                We offer comprehensive warranties including manufacturer warranties on parts (up to 10 years), labor warranties on our work (1-2 years), and extended warranty options for complete coverage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <script>
      function toggleFAQ(button) {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('svg');
        
        if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
          answer.style.maxHeight = '0';
          icon.style.transform = 'rotate(0deg)';
        } else {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          icon.style.transform = 'rotate(45deg)';
        }
      }
      
      // FAQ Search functionality
      document.getElementById('faq-search').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
          const question = item.querySelector('span.font-semibold').textContent.toLowerCase();
          const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
          
          if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    </script>
  `,

  trustBadges: `
    <!-- Trust Badges Section -->
    <section class="py-8 bg-white border-y">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-wrap justify-center items-center gap-8">
          <div class="flex items-center gap-2">
            <i data-feather="shield" class="w-8 h-8 text-green-600"></i>
            <div>
              <p class="font-semibold">Licensed & Insured</p>
              <p class="text-sm text-gray-600">Lic #ABC123456</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <i data-feather="award" class="w-8 h-8 text-blue-600"></i>
            <div>
              <p class="font-semibold">BBB A+ Rated</p>
              <p class="text-sm text-gray-600">Since 2010</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <i data-feather="star" class="w-8 h-8 text-yellow-500"></i>
            <div>
              <p class="font-semibold">4.9/5 Stars</p>
              <p class="text-sm text-gray-600">500+ Reviews</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <i data-feather="clock" class="w-8 h-8 text-red-600"></i>
            <div>
              <p class="font-semibold">24/7 Emergency</p>
              <p class="text-sm text-gray-600">Always Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
};

export const MODERN_STYLES = `
  <style>
    /* Typing cursor animation */
    .typed-cursor {
      animation: blink 1s infinite;
    }
    
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    
    /* Form step transitions */
    .form-step {
      display: none;
    }
    
    .form-step.active {
      display: block;
      animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    /* Service card selected state */
    .service-card input:checked + div {
      border-color: #2563eb;
      background-color: #eff6ff;
    }
    
    /* Smooth FAQ transitions */
    .faq-answer {
      transition: max-height 0.3s ease-out;
    }
    
    /* Sticky header */
    .sticky-header {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* Floating WhatsApp button */
    .whatsapp-float {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #25d366;
      color: white;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      z-index: 999;
      transition: transform 0.3s ease;
    }
    
    .whatsapp-float:hover {
      transform: scale(1.1);
    }
    
    /* Parallax effect */
    .parallax {
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  </style>
`;