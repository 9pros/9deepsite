/**
 * Modern Features Templates for AI-generated websites
 * Includes multi-step forms, typing animations, and other interactive elements
 */

export const MULTI_STEP_FORM_TEMPLATE = `
<!-- Multi-Step Conversion Form -->
<section class="py-16 bg-gradient-to-br from-blue-50 to-white">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-8">Get Your Free Quote</h2>
    
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <!-- Progress Bar -->
      <div class="progress-container mb-8">
        <div class="flex justify-between items-center relative">
          <div class="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div class="progress-line absolute top-5 left-0 h-1 bg-blue-600 transition-all duration-500" style="width: 0%"></div>
          
          <div class="step-circle active" data-step="1">
            <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold relative z-10">1</div>
            <span class="text-xs mt-2 block">Service</span>
          </div>
          <div class="step-circle" data-step="2">
            <div class="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold relative z-10">2</div>
            <span class="text-xs mt-2 block">Contact</span>
          </div>
          <div class="step-circle" data-step="3">
            <div class="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold relative z-10">3</div>
            <span class="text-xs mt-2 block">Schedule</span>
          </div>
          <div class="step-circle" data-step="4">
            <div class="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold relative z-10">4</div>
            <span class="text-xs mt-2 block">Confirm</span>
          </div>
        </div>
      </div>

      <!-- Form Steps -->
      <form id="multiStepForm" class="relative">
        <!-- Step 1: Service Selection -->
        <div class="form-step active" data-step="1">
          <h3 class="text-2xl font-semibold mb-6">What service do you need?</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="service-card cursor-pointer">
              <input type="radio" name="service" value="repair" class="hidden">
              <div class="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition">
                <div class="flex items-center">
                  <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Repair Service</h4>
                    <p class="text-sm text-gray-600">Fix existing equipment</p>
                  </div>
                </div>
              </div>
            </label>
            
            <label class="service-card cursor-pointer">
              <input type="radio" name="service" value="installation" class="hidden">
              <div class="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition">
                <div class="flex items-center">
                  <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <div>
                    <h4 class="font-semibold">New Installation</h4>
                    <p class="text-sm text-gray-600">Install new system</p>
                  </div>
                </div>
              </div>
            </label>
            
            <label class="service-card cursor-pointer">
              <input type="radio" name="service" value="maintenance" class="hidden">
              <div class="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition">
                <div class="flex items-center">
                  <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Maintenance</h4>
                    <p class="text-sm text-gray-600">Regular checkup</p>
                  </div>
                </div>
              </div>
            </label>
            
            <label class="service-card cursor-pointer">
              <input type="radio" name="service" value="emergency" class="hidden">
              <div class="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition">
                <div class="flex items-center">
                  <svg class="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <div>
                    <h4 class="font-semibold">Emergency</h4>
                    <p class="text-sm text-gray-600">Urgent repair needed</p>
                  </div>
                </div>
              </div>
            </label>
          </div>
          
          <div class="mt-6">
            <label class="block text-sm font-medium mb-2">Additional Details (Optional)</label>
            <textarea name="details" rows="3" class="w-full border rounded-lg p-3" placeholder="Describe your issue..."></textarea>
          </div>
        </div>

        <!-- Step 2: Contact Information -->
        <div class="form-step" data-step="2" style="display: none;">
          <h3 class="text-2xl font-semibold mb-6">Your Contact Information</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">First Name *</label>
                <input type="text" name="firstName" required class="w-full border rounded-lg p-3" placeholder="John">
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Last Name *</label>
                <input type="text" name="lastName" required class="w-full border rounded-lg p-3" placeholder="Doe">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Email Address *</label>
              <input type="email" name="email" required class="w-full border rounded-lg p-3" placeholder="john.doe@example.com">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Phone Number *</label>
              <input type="tel" name="phone" required class="w-full border rounded-lg p-3" placeholder="(555) 123-4567">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Property Address *</label>
              <input type="text" name="address" required class="w-full border rounded-lg p-3" placeholder="123 Main St, City, State ZIP">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Property Type</label>
              <select name="propertyType" class="w-full border rounded-lg p-3">
                <option value="">Select...</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step 3: Schedule -->
        <div class="form-step" data-step="3" style="display: none;">
          <h3 class="text-2xl font-semibold mb-6">When would you like service?</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Preferred Date *</label>
              <input type="date" name="date" required class="w-full border rounded-lg p-3">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-4">Preferred Time *</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label class="time-slot cursor-pointer">
                  <input type="radio" name="time" value="morning" class="hidden">
                  <div class="border-2 rounded-lg p-3 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                    <div class="font-semibold">Morning</div>
                    <div class="text-sm text-gray-600">8AM - 12PM</div>
                  </div>
                </label>
                
                <label class="time-slot cursor-pointer">
                  <input type="radio" name="time" value="afternoon" class="hidden">
                  <div class="border-2 rounded-lg p-3 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                    <div class="font-semibold">Afternoon</div>
                    <div class="text-sm text-gray-600">12PM - 4PM</div>
                  </div>
                </label>
                
                <label class="time-slot cursor-pointer">
                  <input type="radio" name="time" value="evening" class="hidden">
                  <div class="border-2 rounded-lg p-3 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                    <div class="font-semibold">Evening</div>
                    <div class="text-sm text-gray-600">4PM - 8PM</div>
                  </div>
                </label>
                
                <label class="time-slot cursor-pointer">
                  <input type="radio" name="time" value="flexible" class="hidden">
                  <div class="border-2 rounded-lg p-3 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                    <div class="font-semibold">Flexible</div>
                    <div class="text-sm text-gray-600">Any time</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">How urgent is this?</label>
              <select name="urgency" class="w-full border rounded-lg p-3">
                <option value="normal">Normal - Within a week</option>
                <option value="urgent">Urgent - Within 48 hours</option>
                <option value="emergency">Emergency - ASAP</option>
                <option value="planning">Just planning ahead</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Special Instructions</label>
              <textarea name="instructions" rows="3" class="w-full border rounded-lg p-3" placeholder="Gate code, parking instructions, etc."></textarea>
            </div>
          </div>
        </div>

        <!-- Step 4: Confirmation -->
        <div class="form-step" data-step="4" style="display: none;">
          <h3 class="text-2xl font-semibold mb-6">Review & Confirm</h3>
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <div class="summary-item">
              <h4 class="font-semibold text-gray-700 mb-2">Service Details</h4>
              <div id="summaryService" class="text-gray-600"></div>
            </div>
            
            <div class="summary-item">
              <h4 class="font-semibold text-gray-700 mb-2">Contact Information</h4>
              <div id="summaryContact" class="text-gray-600"></div>
            </div>
            
            <div class="summary-item">
              <h4 class="font-semibold text-gray-700 mb-2">Scheduled Time</h4>
              <div id="summarySchedule" class="text-gray-600"></div>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-green-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h4 class="font-semibold text-green-800">What happens next?</h4>
                <ul class="text-sm text-green-700 mt-2 space-y-1">
                  <li>✓ We'll call you within 1 hour to confirm</li>
                  <li>✓ Get a detailed quote before any work begins</li>
                  <li>✓ 100% satisfaction guaranteed</li>
                </ul>
              </div>
            </div>
          </div>
          
          <label class="flex items-center mt-6">
            <input type="checkbox" name="consent" required class="mr-2">
            <span class="text-sm text-gray-600">I agree to be contacted about this service request</span>
          </label>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8">
          <button type="button" id="prevBtn" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition" style="display: none;">
            ← Back
          </button>
          <button type="button" id="nextBtn" class="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Next →
          </button>
          <button type="submit" id="submitBtn" class="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" style="display: none;">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  </div>
</section>

<style>
  .form-step {
    animation: slideIn 0.3s ease-out;
  }
  
  .form-step.active {
    display: block !important;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .service-card input:checked + div,
  .time-slot input:checked + div {
    border-color: #2563eb;
    background-color: #eff6ff;
  }
  
  .step-circle.active .rounded-full {
    background-color: #2563eb;
    color: white;
  }
  
  .step-circle.completed .rounded-full {
    background-color: #10b981;
    color: white;
  }
</style>

<script>
  // Multi-step form logic
  let currentStep = 1;
  const totalSteps = 4;
  
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const form = document.getElementById('multiStepForm');
  const progressLine = document.querySelector('.progress-line');
  
  function updateStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => {
      s.style.display = 'none';
      s.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(\`.form-step[data-step="\${step}"]\`);
    currentStepEl.style.display = 'block';
    currentStepEl.classList.add('active');
    
    // Update progress bar
    const progress = ((step - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = progress + '%';
    
    // Update step circles
    document.querySelectorAll('.step-circle').forEach((circle, index) => {
      const circleStep = index + 1;
      const circleDiv = circle.querySelector('div');
      
      if (circleStep < step) {
        circle.classList.add('completed');
        circleDiv.classList.add('bg-green-600', 'text-white');
        circleDiv.classList.remove('bg-gray-300', 'text-gray-600', 'bg-blue-600');
        circleDiv.innerHTML = '✓';
      } else if (circleStep === step) {
        circle.classList.add('active');
        circle.classList.remove('completed');
        circleDiv.classList.add('bg-blue-600', 'text-white');
        circleDiv.classList.remove('bg-gray-300', 'text-gray-600', 'bg-green-600');
        circleDiv.innerHTML = circleStep;
      } else {
        circle.classList.remove('active', 'completed');
        circleDiv.classList.add('bg-gray-300', 'text-gray-600');
        circleDiv.classList.remove('bg-blue-600', 'bg-green-600', 'text-white');
        circleDiv.innerHTML = circleStep;
      }
    });
    
    // Update buttons
    prevBtn.style.display = step === 1 ? 'none' : 'block';
    nextBtn.style.display = step === totalSteps ? 'none' : 'block';
    submitBtn.style.display = step === totalSteps ? 'block' : 'none';
    
    // Update summary on last step
    if (step === 4) {
      updateSummary();
    }
  }
  
  function validateStep(step) {
    const stepEl = document.querySelector(\`.form-step[data-step="\${step}"]\`);
    const requiredFields = stepEl.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
      if (!field.value && !field.checked) {
        field.classList.add('border-red-500');
        return false;
      }
      field.classList.remove('border-red-500');
    }
    
    // Check radio buttons for step 1
    if (step === 1) {
      const serviceSelected = document.querySelector('input[name="service"]:checked');
      if (!serviceSelected) {
        alert('Please select a service');
        return false;
      }
    }
    
    return true;
  }
  
  function updateSummary() {
    const formData = new FormData(form);
    
    // Service summary
    const service = formData.get('service');
    const details = formData.get('details');
    document.getElementById('summaryService').innerHTML = \`
      <p>Service Type: <strong>\${service || 'Not selected'}</strong></p>
      \${details ? \`<p>Details: \${details}</p>\` : ''}
    \`;
    
    // Contact summary
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const address = formData.get('address');
    document.getElementById('summaryContact').innerHTML = \`
      <p>Name: <strong>\${firstName} \${lastName}</strong></p>
      <p>Email: <strong>\${email}</strong></p>
      <p>Phone: <strong>\${phone}</strong></p>
      <p>Address: <strong>\${address}</strong></p>
    \`;
    
    // Schedule summary
    const date = formData.get('date');
    const time = formData.get('time');
    const urgency = formData.get('urgency');
    document.getElementById('summarySchedule').innerHTML = \`
      <p>Date: <strong>\${date || 'Not selected'}</strong></p>
      <p>Time: <strong>\${time || 'Not selected'}</strong></p>
      <p>Urgency: <strong>\${urgency || 'Normal'}</strong></p>
    \`;
  }
  
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      updateStep(currentStep);
    }
  });
  
  prevBtn.addEventListener('click', () => {
    currentStep--;
    updateStep(currentStep);
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      // Success animation
      submitBtn.innerHTML = 'Submitting...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert('Thank you! Your request has been submitted. We will contact you within 1 hour.');
        form.reset();
        currentStep = 1;
        updateStep(currentStep);
        submitBtn.innerHTML = 'Submit Request';
        submitBtn.disabled = false;
      }, 1500);
    }
  });
  
  // Initialize
  updateStep(currentStep);
</script>
`;

export const TYPING_ANIMATION_HERO = `
<!-- Hero Section with Typing Animation -->
<section class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
  <!-- Background Pattern -->
  <div class="absolute inset-0 opacity-10">
    <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
  </div>
  
  <div class="container mx-auto px-4 relative z-10">
    <div class="text-center">
      <!-- Animated Badge -->
      <div class="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-pulse">
        <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
        <span class="text-white text-sm">Available 24/7 for Emergency Service</span>
      </div>
      
      <!-- Typing Animation Headline -->
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
        <span id="typed-text" class="text-yellow-400"></span>
        <span class="typed-cursor text-yellow-400">|</span>
      </h1>
      
      <!-- Static Subheadline -->
      <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
        Professional service you can trust. Over 20 years of experience serving our community with excellence.
      </p>
      
      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button class="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-xl">
          Get Free Quote Now
        </button>
        <button class="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/30">
          <span class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
            </svg>
            Call (555) 123-4567
          </span>
        </button>
      </div>
      
      <!-- Trust Indicators -->
      <div class="flex flex-wrap justify-center gap-8 items-center">
        <div class="flex items-center text-white/80">
          <svg class="w-6 h-6 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span>4.9/5 Rating (500+ Reviews)</span>
        </div>
        <div class="flex items-center text-white/80">
          <svg class="w-6 h-6 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>Licensed & Insured</span>
        </div>
        <div class="flex items-center text-white/80">
          <svg class="w-6 h-6 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
          </svg>
          <span>Same Day Service</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Scroll Indicator -->
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  </div>
</section>

<!-- TypeIt.js Library -->
<script src="https://unpkg.com/typeit@8.7.1/dist/index.umd.js"></script>

<style>
  .typed-cursor {
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
</style>

<script>
  // Initialize TypeIt with multiple strings
  document.addEventListener('DOMContentLoaded', function() {
    new TypeIt("#typed-text", {
      strings: [
        "Expert HVAC Services",
        "24/7 Emergency Repairs",
        "Certified Technicians",
        "Affordable Pricing",
        "Satisfaction Guaranteed"
      ],
      speed: 50,
      breakLines: false,
      loop: true,
      deleteSpeed: 30,
      nextStringDelay: 2000,
      cursor: false
    }).go();
  });
</script>
`;

export const FAQ_SECTION_TEMPLATE = `
<!-- FAQ Section with Search -->
<section class="py-16 bg-gray-50">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our services</p>
      
      <!-- Search Box -->
      <div class="max-w-md mx-auto mt-8">
        <div class="relative">
          <input type="text" id="faqSearch" placeholder="Search FAQs..." class="w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:border-blue-500">
          <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="max-w-3xl mx-auto">
      <div class="space-y-4" id="faqContainer">
        <!-- FAQ Item 1 -->
        <div class="faq-item bg-white rounded-lg shadow-md" data-faq>
          <button class="faq-question w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">How quickly can you respond to emergency calls?</span>
            <svg class="faq-icon w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="faq-answer hidden px-6 pb-4">
            <p class="text-gray-600">We offer 24/7 emergency service and typically respond within 60 minutes for urgent situations. Our dispatchers will provide you with an accurate arrival time when you call.</p>
          </div>
        </div>
        
        <!-- FAQ Item 2 -->
        <div class="faq-item bg-white rounded-lg shadow-md" data-faq>
          <button class="faq-question w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">What brands do you service?</span>
            <svg class="faq-icon w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="faq-answer hidden px-6 pb-4">
            <p class="text-gray-600">We service all major brands including Carrier, Trane, Lennox, Rheem, Goodman, York, and many more. Our technicians are certified to work on all makes and models.</p>
          </div>
        </div>
        
        <!-- FAQ Item 3 -->
        <div class="faq-item bg-white rounded-lg shadow-md" data-faq>
          <button class="faq-question w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">Do you offer financing options?</span>
            <svg class="faq-icon w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="faq-answer hidden px-6 pb-4">
            <p class="text-gray-600">Yes! We offer flexible financing options with approved credit. We have 0% interest plans available for qualified customers, as well as low monthly payment options.</p>
          </div>
        </div>
        
        <!-- FAQ Item 4 -->
        <div class="faq-item bg-white rounded-lg shadow-md" data-faq>
          <button class="faq-question w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">How often should I have my system serviced?</span>
            <svg class="faq-icon w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="faq-answer hidden px-6 pb-4">
            <p class="text-gray-600">We recommend annual maintenance for most systems - ideally in spring for AC units and fall for heating systems. Regular maintenance can extend equipment life by 40% and improve efficiency by up to 30%.</p>
          </div>
        </div>
        
        <!-- FAQ Item 5 -->
        <div class="faq-item bg-white rounded-lg shadow-md" data-faq>
          <button class="faq-question w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">What's included in your maintenance plans?</span>
            <svg class="faq-icon w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="faq-answer hidden px-6 pb-4">
            <p class="text-gray-600">Our maintenance plans include: comprehensive system inspection, cleaning of all components, filter replacement, performance testing, priority service, discounts on repairs, and no overtime charges for emergency calls.</p>
          </div>
        </div>
        
        <!-- FAQ Item 6 -->
        <div class="faq-item bg-white rounded-lg shadow-md" data-faq>
          <button class="faq-question w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">Are your technicians licensed and insured?</span>
            <svg class="faq-icon w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="faq-answer hidden px-6 pb-4">
            <p class="text-gray-600">Absolutely! All our technicians are fully licensed, bonded, and insured. They undergo continuous training and are NATE-certified professionals with extensive experience.</p>
          </div>
        </div>
        
        <!-- FAQ Item 7 -->
        <div class="faq-item bg-white rounded-lg shadow-md" data-faq>
          <button class="faq-question w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">How long do HVAC systems typically last?</span>
            <svg class="faq-icon w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="faq-answer hidden px-6 pb-4">
            <p class="text-gray-600">With proper maintenance, air conditioners typically last 15-20 years, furnaces 20-30 years, and heat pumps 10-15 years. Regular maintenance can significantly extend these lifespans.</p>
          </div>
        </div>
        
        <!-- FAQ Item 8 -->
        <div class="faq-item bg-white rounded-lg shadow-md" data-faq>
          <button class="faq-question w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition">
            <span class="font-semibold text-gray-800">Do you provide free estimates?</span>
            <svg class="faq-icon w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="faq-answer hidden px-6 pb-4">
            <p class="text-gray-600">Yes! We provide free, no-obligation estimates for new installations and replacements. For repairs, we charge a diagnostic fee which is waived if you proceed with the repair.</p>
          </div>
        </div>
        
        <!-- No Results Message -->
        <div id="noResults" class="hidden text-center py-8">
          <p class="text-gray-500">No FAQs match your search. Please try different keywords or <a href="#contact" class="text-blue-600 hover:underline">contact us</a> directly.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const answer = item.querySelector('.faq-answer');
      const icon = button.querySelector('.faq-icon');
      const isOpen = !answer.classList.contains('hidden');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.querySelector('.faq-answer').classList.add('hidden');
          otherItem.querySelector('.faq-icon').classList.remove('rotate-180');
        }
      });
      
      // Toggle current FAQ
      if (isOpen) {
        answer.classList.add('hidden');
        icon.classList.remove('rotate-180');
      } else {
        answer.classList.remove('hidden');
        icon.classList.add('rotate-180');
      }
    });
  });
  
  // FAQ Search
  const searchInput = document.getElementById('faqSearch');
  const faqItems = document.querySelectorAll('.faq-item');
  const noResults = document.getElementById('noResults');
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let hasResults = false;
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question span').textContent.toLowerCase();
      const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
      
      if (question.includes(searchTerm) || answer.includes(searchTerm)) {
        item.style.display = 'block';
        hasResults = true;
      } else {
        item.style.display = 'none';
      }
    });
    
    noResults.classList.toggle('hidden', hasResults);
  });
</script>
`;

export const SERVICE_AREAS_TEMPLATE = `
<!-- Service Areas Section -->
<section class="py-16 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Areas We Serve</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">Proudly serving the greater metro area with fast, reliable service</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <!-- Area 1 -->
      <div class="service-area-card">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
          <h3 class="text-xl font-bold flex items-center justify-between cursor-pointer" onclick="toggleArea('area1')">
            <span>North County</span>
            <svg id="area1-icon" class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </h3>
        </div>
        <div id="area1" class="area-content hidden bg-gray-50 p-4 rounded-b-lg">
          <ul class="grid grid-cols-2 gap-2">
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Northville
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Pine Ridge
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Oak Hills
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Maple Grove
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Cedar Falls
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Riverside
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Area 2 -->
      <div class="service-area-card">
        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">
          <h3 class="text-xl font-bold flex items-center justify-between cursor-pointer" onclick="toggleArea('area2')">
            <span>Downtown & Central</span>
            <svg id="area2-icon" class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </h3>
        </div>
        <div id="area2" class="area-content hidden bg-gray-50 p-4 rounded-b-lg">
          <ul class="grid grid-cols-2 gap-2">
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              City Center
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Midtown
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Arts District
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Financial District
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Historic Quarter
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Warehouse District
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Area 3 -->
      <div class="service-area-card">
        <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-t-lg">
          <h3 class="text-xl font-bold flex items-center justify-between cursor-pointer" onclick="toggleArea('area3')">
            <span>South Metro</span>
            <svg id="area3-icon" class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </h3>
        </div>
        <div id="area3" class="area-content hidden bg-gray-50 p-4 rounded-b-lg">
          <ul class="grid grid-cols-2 gap-2">
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Southgate
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Lakeside
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Valley View
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Park Heights
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Sunny Hills
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Meadowbrook
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Area 4 -->
      <div class="service-area-card">
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg">
          <h3 class="text-xl font-bold flex items-center justify-between cursor-pointer" onclick="toggleArea('area4')">
            <span>East Side</span>
            <svg id="area4-icon" class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </h3>
        </div>
        <div id="area4" class="area-content hidden bg-gray-50 p-4 rounded-b-lg">
          <ul class="grid grid-cols-2 gap-2">
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Eastborough
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Sunrise Park
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Harbor View
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Fairfield
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Area 5 -->
      <div class="service-area-card">
        <div class="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-t-lg">
          <h3 class="text-xl font-bold flex items-center justify-between cursor-pointer" onclick="toggleArea('area5')">
            <span>West District</span>
            <svg id="area5-icon" class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </h3>
        </div>
        <div id="area5" class="area-content hidden bg-gray-50 p-4 rounded-b-lg">
          <ul class="grid grid-cols-2 gap-2">
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Westwood
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Canyon Ridge
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Desert View
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Mountain Heights
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Area 6 -->
      <div class="service-area-card">
        <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-t-lg">
          <h3 class="text-xl font-bold flex items-center justify-between cursor-pointer" onclick="toggleArea('area6')">
            <span>Suburban Areas</span>
            <svg id="area6-icon" class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </h3>
        </div>
        <div id="area6" class="area-content hidden bg-gray-50 p-4 rounded-b-lg">
          <ul class="grid grid-cols-2 gap-2">
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Brookdale
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Willowbrook
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Greenfield
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Spring Valley
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Forest Park
            </li>
            <li class="flex items-center text-gray-700">
              <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Country Club
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- CTA -->
    <div class="text-center mt-12">
      <p class="text-gray-600 mb-4">Don't see your area? Contact us - we may still serve your location!</p>
      <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Check Service Availability
      </button>
    </div>
  </div>
</section>

<script>
  function toggleArea(areaId) {
    const area = document.getElementById(areaId);
    const icon = document.getElementById(areaId + '-icon');
    
    if (area.classList.contains('hidden')) {
      // Close all other areas
      document.querySelectorAll('.area-content').forEach(content => {
        content.classList.add('hidden');
      });
      document.querySelectorAll('[id$="-icon"]').forEach(i => {
        i.classList.remove('rotate-180');
      });
      
      // Open this area
      area.classList.remove('hidden');
      icon.classList.add('rotate-180');
    } else {
      area.classList.add('hidden');
      icon.classList.remove('rotate-180');
    }
  }
</script>
`;