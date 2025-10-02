'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Globe, Zap, Upload, Palette, Target, Users, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { industries, servicesByIndustry, states } from '@/lib/lead-gen-data';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface FormData {
  projectType: 'redesign' | 'new' | null;
  websiteUrl?: string;
  companyName?: string;
  industry?: string;
  services: string[];
  customServices: string[];
  serviceAreas: Array<{ city: string; state: string }>;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  branding: {
    logoFile?: File;
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    hasExistingBranding: boolean;
  };
  websiteGoals: {
    primaryGoal: string;
    targetAudience: string;
    callToAction: string;
    specialFeatures: string[];
  };
  businessDetails: {
    yearsInBusiness: string;
    teamSize: string;
    businessHours: string;
    socialMediaLinks: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}

interface LeadGenFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadGenForm({ isOpen, onClose }: LeadGenFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    projectType: null,
    services: [],
    customServices: [],
    serviceAreas: [{ city: '', state: '' }],
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      hasExistingBranding: false
    },
    websiteGoals: {
      primaryGoal: '',
      targetAudience: '',
      callToAction: '',
      specialFeatures: []
    },
    businessDetails: {
      yearsInBusiness: '',
      teamSize: '',
      businessHours: '',
      socialMediaLinks: {}
    }
  });

  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [customServiceInput, setCustomServiceInput] = useState('');

  useEffect(() => {
    if (formData.industry) {
      setAvailableServices(servicesByIndustry[formData.industry] || []);
    }
  }, [formData.industry]);

  const totalSteps = formData.projectType === 'redesign' ? 7 : 9;

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (formData.projectType === 'redesign') {
        // Redesign flow: 1 -> 2 (URL) -> 3 (service areas) -> 4 (branding) -> 5 (goals) -> 6 (business details) -> 7 (contact)
        if (currentStep === 2) {
          setCurrentStep(3); // Go to service areas
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else {
        // New website flow: 1 -> 2 (company) -> 3 (industry) -> 4 (services) -> 5 (service areas) -> 6 (branding) -> 7 (goals) -> 8 (business details) -> 9 (contact)
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (formData.projectType === 'redesign') {
      // Redesign flow navigation
      if (currentStep === 3) {
        setCurrentStep(2); // Back to URL
      } else if (currentStep === 4) {
        setCurrentStep(3); // Back to service areas
      } else {
        setCurrentStep(currentStep - 1);
      }
    } else {
      // New website flow: normal back navigation
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.projectType !== null;
      case 2:
        return formData.projectType === 'redesign'
          ? formData.websiteUrl && formData.websiteUrl.trim() !== ''
          : formData.companyName && formData.companyName.trim() !== '';
      case 3:
        // For redesign: service areas, For new: industry
        return formData.projectType === 'redesign'
          ? formData.serviceAreas.some(area => area.city && area.state)
          : formData.industry && formData.industry !== '';
      case 4:
        // For redesign: branding, For new: services
        if (formData.projectType === 'redesign') {
          return true; // Branding is optional but step exists
        } else {
          return formData.services.length > 0 || formData.customServices.length > 0;
        }
      case 5:
        // For redesign: goals, For new: service areas
        if (formData.projectType === 'redesign') {
          return formData.websiteGoals.primaryGoal && formData.websiteGoals.targetAudience;
        } else {
          return formData.serviceAreas.some(area => area.city && area.state);
        }
      case 6:
        // For redesign: business details, For new: branding
        return true; // Both are optional but steps exist
      case 7:
        // For redesign: contact info, For new: goals
        if (formData.projectType === 'redesign') {
          const { firstName, lastName, email, phone } = formData.contactInfo;
          return firstName && lastName && email && phone &&
                 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        } else {
          return formData.websiteGoals.primaryGoal && formData.websiteGoals.targetAudience;
        }
      case 8:
        // Only for new: business details
        return true; // Optional
      case 9:
        // Only for new: contact info
        const { firstName, lastName, email, phone } = formData.contactInfo;
        return firstName && lastName && email && phone &&
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      default:
        return false;
    }
  };

  const normalizeUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const generatePrompt = () => {
    const { projectType, websiteUrl, companyName, industry, services, customServices, serviceAreas, branding, websiteGoals, businessDetails } = formData;
    
    let prompt = '';
    
    if (projectType === 'redesign' && websiteUrl) {
      prompt = `Redesign the website at ${normalizeUrl(websiteUrl)} with a modern, professional design that converts visitors into customers. `;
      
      // Add industry context for redesigns too
      const industryLabel = industries.find(i => i.value === industry)?.label;
      if (industryLabel) {
        prompt += `This is a ${industryLabel.toLowerCase()} business. `;
      }
    } else {
      prompt = `Create a stunning, modern website for ${companyName}, `;
      
      const industryLabel = industries.find(i => i.value === industry)?.label;
      if (industryLabel) {
        prompt += `a ${industryLabel.toLowerCase()} business. `;
      }
      
      const allServices = [...services, ...customServices];
      if (allServices.length > 0) {
        prompt += `The company provides the following services: ${allServices.join(', ')}. `;
      }
      
      if (serviceAreas.length > 0) {
        const areas = serviceAreas.map(area => `${area.city}, ${area.state}`).join('; ');
        prompt += `They serve the following areas: ${areas}. `;
      }
      
      // Add website goals and target audience
      if (websiteGoals.primaryGoal) {
        prompt += `PRIMARY GOAL: ${websiteGoals.primaryGoal}. `;
      }
      if (websiteGoals.targetAudience) {
        prompt += `TARGET AUDIENCE: ${websiteGoals.targetAudience}. `;
      }
      if (websiteGoals.callToAction) {
        prompt += `MAIN CALL TO ACTION: ${websiteGoals.callToAction}. `;
      }

      prompt += `Create an AWARD-WINNING, CONVERSION-FOCUSED website with:
      1) Hero section with TYPING ANIMATION rotating multiple H1 headlines
      2) Multi-step conversion form for lead capture
      3) Service areas section with expandable sub-areas (cities/neighborhoods)
      4) FAQ accordion section with at least 10 questions
      5) Trust badges and certifications
      6) Before/After gallery
      7) Video testimonials placeholder
      8) Pricing calculator
      9) Team showcase
      10) Google Reviews section
      11) Emergency service banner
      12) Process timeline
      13) Multiple CTAs throughout
      14) Sticky header with phone number
      15) Floating WhatsApp button`;

      // Add special features if specified
      if (websiteGoals.specialFeatures.length > 0) {
        prompt += `
      16) Special features: ${websiteGoals.specialFeatures.join(', ')}`;
      }

      prompt += `
      Make it mobile-responsive, SEO-optimized, with smooth animations and parallax effects.`;
    }
    
    // Add branding information
    prompt += ` BRANDING REQUIREMENTS: `;
    if (branding.hasExistingBranding && branding.logoUrl) {
      prompt += `Use the provided logo image. `;
    }
    prompt += `Use ${branding.primaryColor} as the primary brand color and ${branding.secondaryColor} as the secondary color throughout the design. `;
    prompt += `Create a cohesive color scheme that reflects professionalism and trustworthiness. `;

    // Add business details
    if (businessDetails.yearsInBusiness) {
      prompt += `The company has been in business for ${businessDetails.yearsInBusiness}. `;
    }
    if (businessDetails.teamSize) {
      prompt += `Team size: ${businessDetails.teamSize}. `;
    }
    if (businessDetails.businessHours) {
      prompt += `Business hours: ${businessDetails.businessHours}. `;
    }

    // Add social media links
    const socialLinks = businessDetails.socialMediaLinks;
    if (socialLinks.facebook || socialLinks.instagram || socialLinks.linkedin || socialLinks.twitter) {
      prompt += `Include social media links: `;
      const links = [];
      if (socialLinks.facebook) links.push('Facebook');
      if (socialLinks.instagram) links.push('Instagram');
      if (socialLinks.linkedin) links.push('LinkedIn');
      if (socialLinks.twitter) links.push('Twitter');
      prompt += `${links.join(', ')}. `;
    }

    // Add AI-generated image guidance
    const industryLabel = industries.find(i => i.value === industry)?.label?.toLowerCase();
    if (industryLabel) {
      prompt += ` AI IMAGE GENERATION REQUIREMENTS: `;
      prompt += `Generate custom images using the text-to-image API for maximum relevance. `;

      // Hero images
      prompt += `HERO IMAGES: Use the generateHeroImages() function to create 3-5 unique hero images that match each headline. `;

      // Service images
      if (services.length > 0 || customServices.length > 0) {
        const allServices = [...services, ...customServices];
        prompt += `SERVICE IMAGES: Generate contextual images for these services: ${allServices.join(', ')}. `;
      }

      // Industry-specific guidance
      if (industry === 'hvac' || industryLabel.includes('hvac') || industryLabel.includes('heating') || industryLabel.includes('cooling')) {
        prompt += `HVAC INDUSTRY: Generate images of AC units, furnaces, thermostats, ventilation systems, HVAC technicians at work. `;
        prompt += `Avoid generic stock photos - create industry-specific visuals. `;
      } else {
        prompt += `${industryLabel.toUpperCase()} INDUSTRY: Generate professional ${industryLabel} imagery showing services in action. `;
      }

      prompt += `FALLBACK: If AI generation fails, use Unsplash with contextually appropriate ${industryLabel} search terms. `;
      prompt += `Include service area maps showing coverage zones with pins for each city/neighborhood served. `;

      // Add the industry context for better AI generation
      prompt += `INDUSTRY CONTEXT: "${industryLabel}" - Use this for all AI image generation calls.`;
    }
    
    return prompt;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    // Generate the prompt
    const prompt = generatePrompt();
    
    // Store form data and prompt in localStorage
    localStorage.setItem('leadGenData', JSON.stringify({
      ...formData,
      generatedPrompt: prompt
    }));
    
    // Navigate to the editor with the prompt and force deepseek-v3.1:671b model
    if (formData.projectType === 'redesign' && formData.websiteUrl) {
      router.push(`/projects/new?prompt=${encodeURIComponent(prompt)}&url=${encodeURIComponent(normalizeUrl(formData.websiteUrl))}&autostart=true&model=deepseek-v3.1:671b`);
    } else {
      router.push(`/projects/new?prompt=${encodeURIComponent(prompt)}&autostart=true&model=deepseek-v3.1:671b`);
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleAddCustomService = () => {
    if (customServiceInput.trim() && !formData.customServices.includes(customServiceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        customServices: [...prev.customServices, customServiceInput.trim()]
      }));
      setCustomServiceInput('');
    }
  };

  const handleAddServiceArea = () => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, { city: '', state: '' }]
    }));
  };

  const handleServiceAreaChange = (index: number, field: 'city' | 'state', value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((area, i) => 
        i === index ? { ...area, [field]: value } : area
      )
    }));
  };

  const handleRemoveServiceArea = (index: number) => {
    if (formData.serviceAreas.length > 1) {
      setFormData(prev => ({
        ...prev,
        serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
      }));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        branding: {
          ...prev.branding,
          logoFile: file,
          logoUrl: logoUrl,
          hasExistingBranding: true
        }
      }));
    }
  };

  const handleSpecialFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      websiteGoals: {
        ...prev.websiteGoals,
        specialFeatures: prev.websiteGoals.specialFeatures.includes(feature)
          ? prev.websiteGoals.specialFeatures.filter(f => f !== feature)
          : [...prev.websiteGoals.specialFeatures, feature]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Get Your AI-Powered Website</h2>
                  <p className="text-white/80 text-sm">Just a few questions to create perfection</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              <AnimatePresence mode="wait">
                {/* Step 1: Project Type */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-gray-900">What would you like to do?</h3>
                    <div className="grid gap-4">
                      <button
                        onClick={() => setFormData({ ...formData, projectType: 'redesign' })}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-left transition-all",
                          formData.projectType === 'redesign'
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-xl",
                            formData.projectType === 'redesign' ? "bg-indigo-600" : "bg-gray-100"
                          )}>
                            <Globe className={cn(
                              "w-6 h-6",
                              formData.projectType === 'redesign' ? "text-white" : "text-gray-600"
                            )} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">Redesign My Website</h4>
                            <p className="text-gray-600 text-sm">Transform your existing website with AI-powered design</p>
                          </div>
                          {formData.projectType === 'redesign' && (
                            <Check className="w-6 h-6 text-indigo-600" />
                          )}
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setFormData({ ...formData, projectType: 'new' })}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-left transition-all",
                          formData.projectType === 'new'
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-3 rounded-xl",
                            formData.projectType === 'new' ? "bg-indigo-600" : "bg-gray-100"
                          )}>
                            <Zap className={cn(
                              "w-6 h-6",
                              formData.projectType === 'new' ? "text-white" : "text-gray-600"
                            )} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">Create a New Website</h4>
                            <p className="text-gray-600 text-sm">Build a brand new website from scratch with AI</p>
                          </div>
                          {formData.projectType === 'new' && (
                            <Check className="w-6 h-6 text-indigo-600" />
                          )}
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: URL or Company Name */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {formData.projectType === 'redesign' ? (
                      <>
                        <h3 className="text-2xl font-bold text-gray-900">What&apos;s your website URL?</h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website URL
                          </label>
                          <input
                            type="text"
                            placeholder="example.com or https://example.com"
                            value={formData.websiteUrl || ''}
                            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Enter with or without https://
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-900">What&apos;s your company name?</h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter your company name"
                            value={formData.companyName || ''}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Industry */}
                {currentStep === 3 && formData.projectType === 'new' && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-gray-900">What industry are you in?</h3>
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {industries.map((industry) => (
                        <button
                          key={industry.value}
                          onClick={() => setFormData({ ...formData, industry: industry.value })}
                          className={cn(
                            "p-3 rounded-xl border text-left transition-all text-sm",
                            formData.industry === industry.value
                              ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          )}
                        >
                          <span className="font-medium">{industry.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Services */}
                {currentStep === 4 && formData.projectType === 'new' && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">What services do you provide?</h3>
                      <p className="text-gray-600 text-sm mt-1">Select 4-6 services</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {availableServices.map((service) => (
                          <button
                            key={service}
                            onClick={() => handleServiceToggle(service)}
                            disabled={!formData.services.includes(service) && formData.services.length >= 6}
                            className={cn(
                              "p-3 rounded-xl border text-left transition-all text-sm",
                              formData.services.includes(service)
                                ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                                : "border-gray-200 hover:border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                          >
                            <span className="font-medium">{service}</span>
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom Services */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add custom service
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter a custom service"
                            value={customServiceInput}
                            onChange={(e) => setCustomServiceInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomService()}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all text-sm"
                          />
                          <button
                            onClick={handleAddCustomService}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm"
                          >
                            Add
                          </button>
                        </div>
                        
                        {formData.customServices.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {formData.customServices.map((service, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                              >
                                {service}
                                <button
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    customServices: prev.customServices.filter((_, i) => i !== index)
                                  }))}
                                  className="hover:text-purple-900"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 (redesign) or Step 5 (new): Service Areas */}
                {((currentStep === 3 && formData.projectType === 'redesign') || (currentStep === 5 && formData.projectType === 'new')) && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Where do you serve?</h3>
                      <p className="text-gray-600 text-sm mt-1">Add your service areas</p>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.serviceAreas.map((area, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={area.city}
                            onChange={(e) => handleServiceAreaChange(index, 'city', e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all text-sm"
                          />
                          <select
                            value={area.state}
                            onChange={(e) => handleServiceAreaChange(index, 'state', e.target.value)}
                            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all text-sm"
                          >
                            <option value="">State</option>
                            {states.map((state) => (
                              <option key={state.value} value={state.value}>
                                {state.label}
                              </option>
                            ))}
                          </select>
                          {formData.serviceAreas.length > 1 && (
                            <button
                              onClick={() => handleRemoveServiceArea(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      <button
                        onClick={handleAddServiceArea}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-colors text-sm"
                      >
                        + Add Another Area
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Branding Step - Step 4 (redesign) or Step 6 (new) */}
                {((currentStep === 4 && formData.projectType === 'redesign') || (currentStep === 6 && formData.projectType === 'new')) && (
                  <motion.div
                    key="branding"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Let&apos;s customize your branding</h3>
                      <p className="text-gray-600 text-sm mt-1">Upload your logo and choose colors</p>
                    </div>

                    <div className="space-y-6">
                      {/* Logo Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Company Logo (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-600 transition-colors">
                          {formData.branding.logoUrl ? (
                            <div className="space-y-3">
                              <img
                                src={formData.branding.logoUrl}
                                alt="Logo preview"
                                className="max-h-20 mx-auto"
                              />
                              <button
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  branding: { ...prev.branding, logoUrl: undefined, logoFile: undefined, hasExistingBranding: false }
                                }))}
                                className="text-red-600 text-sm hover:text-red-700"
                              >
                                Remove Logo
                              </button>
                            </div>
                          ) : (
                            <div>
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600 text-sm mb-3">Upload your logo</p>
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleLogoUpload}
                                  className="hidden"
                                />
                                <span className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-700 transition-colors">
                                  Choose File
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Color Pickers */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Color
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.branding.primaryColor}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                branding: { ...prev.branding, primaryColor: e.target.value }
                              }))}
                              className="w-12 h-12 rounded-xl border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.branding.primaryColor}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                branding: { ...prev.branding, primaryColor: e.target.value }
                              }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm"
                              placeholder="#3B82F6"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secondary Color
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.branding.secondaryColor}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                branding: { ...prev.branding, secondaryColor: e.target.value }
                              }))}
                              className="w-12 h-12 rounded-xl border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.branding.secondaryColor}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                branding: { ...prev.branding, secondaryColor: e.target.value }
                              }))}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm"
                              placeholder="#8B5CF6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Website Goals Step - Step 5 (redesign) or Step 7 (new) */}
                {((currentStep === 5 && formData.projectType === 'redesign') || (currentStep === 7 && formData.projectType === 'new')) && (
                  <motion.div
                    key="goals"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">What&apos;s your website&apos;s purpose?</h3>
                      <p className="text-gray-600 text-sm mt-1">Help us create the perfect experience</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Goal *
                        </label>
                        <select
                          value={formData.websiteGoals.primaryGoal}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            websiteGoals: { ...prev.websiteGoals, primaryGoal: e.target.value }
                          }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                        >
                          <option value="">Select primary goal</option>
                          <option value="Generate leads and inquiries">Generate leads and inquiries</option>
                          <option value="Increase online sales">Increase online sales</option>
                          <option value="Build brand awareness">Build brand awareness</option>
                          <option value="Provide information and resources">Provide information and resources</option>
                          <option value="Schedule appointments or bookings">Schedule appointments or bookings</option>
                          <option value="Showcase portfolio or work">Showcase portfolio or work</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Audience *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Homeowners aged 30-65 in suburban areas"
                          value={formData.websiteGoals.targetAudience}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            websiteGoals: { ...prev.websiteGoals, targetAudience: e.target.value }
                          }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Main Call to Action
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Get Free Quote, Schedule Consultation, Call Now"
                          value={formData.websiteGoals.callToAction}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            websiteGoals: { ...prev.websiteGoals, callToAction: e.target.value }
                          }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Special Features (Optional)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            'Online Booking System',
                            'Live Chat Support',
                            'Customer Reviews',
                            'Photo Gallery',
                            'Blog/News Section',
                            'Customer Portal',
                            'Online Payments',
                            'Appointment Scheduling'
                          ].map((feature) => (
                            <button
                              key={feature}
                              onClick={() => handleSpecialFeatureToggle(feature)}
                              className={cn(
                                "p-3 rounded-xl border text-left transition-all text-sm",
                                formData.websiteGoals.specialFeatures.includes(feature)
                                  ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                                  : "border-gray-200 hover:border-gray-300 text-gray-700"
                              )}
                            >
                              {feature}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Business Details Step - Step 6 (redesign) or Step 8 (new) */}
                {((currentStep === 6 && formData.projectType === 'redesign') || (currentStep === 8 && formData.projectType === 'new')) && (
                  <motion.div
                    key="business-details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Tell us about your business</h3>
                      <p className="text-gray-600 text-sm mt-1">This helps us create more relevant content</p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years in Business
                          </label>
                          <select
                            value={formData.businessDetails.yearsInBusiness}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              businessDetails: { ...prev.businessDetails, yearsInBusiness: e.target.value }
                            }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                          >
                            <option value="">Select</option>
                            <option value="Under 1 year">Under 1 year</option>
                            <option value="1-2 years">1-2 years</option>
                            <option value="3-5 years">3-5 years</option>
                            <option value="6-10 years">6-10 years</option>
                            <option value="11-20 years">11-20 years</option>
                            <option value="Over 20 years">Over 20 years</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Team Size
                          </label>
                          <select
                            value={formData.businessDetails.teamSize}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              businessDetails: { ...prev.businessDetails, teamSize: e.target.value }
                            }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                          >
                            <option value="">Select</option>
                            <option value="Just me">Just me</option>
                            <option value="2-5 employees">2-5 employees</option>
                            <option value="6-10 employees">6-10 employees</option>
                            <option value="11-25 employees">11-25 employees</option>
                            <option value="26-50 employees">26-50 employees</option>
                            <option value="50+ employees">50+ employees</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Hours
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Mon-Fri 8AM-6PM, 24/7 Emergency Service"
                          value={formData.businessDetails.businessHours}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            businessDetails: { ...prev.businessDetails, businessHours: e.target.value }
                          }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Social Media Links (Optional)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <Facebook className="w-5 h-5 text-blue-600" />
                            <input
                              type="url"
                              placeholder="Facebook URL"
                              value={formData.businessDetails.socialMediaLinks.facebook || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                businessDetails: {
                                  ...prev.businessDetails,
                                  socialMediaLinks: { ...prev.businessDetails.socialMediaLinks, facebook: e.target.value }
                                }
                              }))}
                              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Instagram className="w-5 h-5 text-pink-600" />
                            <input
                              type="url"
                              placeholder="Instagram URL"
                              value={formData.businessDetails.socialMediaLinks.instagram || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                businessDetails: {
                                  ...prev.businessDetails,
                                  socialMediaLinks: { ...prev.businessDetails.socialMediaLinks, instagram: e.target.value }
                                }
                              }))}
                              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Linkedin className="w-5 h-5 text-blue-700" />
                            <input
                              type="url"
                              placeholder="LinkedIn URL"
                              value={formData.businessDetails.socialMediaLinks.linkedin || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                businessDetails: {
                                  ...prev.businessDetails,
                                  socialMediaLinks: { ...prev.businessDetails.socialMediaLinks, linkedin: e.target.value }
                                }
                              }))}
                              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Twitter className="w-5 h-5 text-blue-500" />
                            <input
                              type="url"
                              placeholder="Twitter/X URL"
                              value={formData.businessDetails.socialMediaLinks.twitter || ''}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                businessDetails: {
                                  ...prev.businessDetails,
                                  socialMediaLinks: { ...prev.businessDetails.socialMediaLinks, twitter: e.target.value }
                                }
                              }))}
                              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Contact Info Step - Step 7 (redesign) or Step 9 (new) */}
                {((currentStep === 7 && formData.projectType === 'redesign') || (currentStep === 9 && formData.projectType === 'new')) && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Almost done! Your contact info</h3>
                      <p className="text-gray-600 text-sm mt-1">We&apos;ll use this to personalize your website</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            placeholder="John"
                            value={formData.contactInfo.firstName}
                            onChange={(e) => setFormData({
                              ...formData,
                              contactInfo: { ...formData.contactInfo, firstName: e.target.value }
                            })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            placeholder="Doe"
                            value={formData.contactInfo.lastName}
                            onChange={(e) => setFormData({
                              ...formData,
                              contactInfo: { ...formData.contactInfo, lastName: e.target.value }
                            })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.contactInfo.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, email: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.contactInfo.phone}
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: { ...formData.contactInfo, phone: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                
                <div className="ml-auto">
                  {currentStep < totalSteps ? (
                    <button
                      onClick={handleNext}
                      disabled={!validateCurrentStep()}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                        validateCurrentStep()
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!validateCurrentStep() || isSubmitting}
                      className={cn(
                        "flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all",
                        validateCurrentStep() && !isSubmitting
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating Your Website...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Create My Website
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}