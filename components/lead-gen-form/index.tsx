'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Globe, Zap } from 'lucide-react';
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
    }
  });

  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [customServiceInput, setCustomServiceInput] = useState('');

  useEffect(() => {
    if (formData.industry) {
      setAvailableServices(servicesByIndustry[formData.industry] || []);
    }
  }, [formData.industry]);

  const totalSteps = formData.projectType === 'redesign' ? 4 : 6;

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (formData.projectType === 'redesign') {
        // Redesign flow: 1 -> 2 -> 3 (service areas) -> 4 (contact)
        if (currentStep === 2) {
          setCurrentStep(3); // Go to service areas
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else {
        // New website flow: normal progression
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
        // For redesign: contact info, For new: services
        if (formData.projectType === 'redesign') {
          const { firstName, lastName, email, phone } = formData.contactInfo;
          return firstName && lastName && email && phone && 
                 /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        } else {
          return formData.services.length > 0 || formData.customServices.length > 0;
        }
      case 5:
        // Only for new: service areas
        return formData.serviceAreas.some(area => area.city && area.state);
      case 6:
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
    const { projectType, websiteUrl, companyName, industry, services, customServices, serviceAreas, contactInfo } = formData;
    
    let prompt = '';
    
    if (projectType === 'redesign' && websiteUrl) {
      prompt = `Redesign the website at ${normalizeUrl(websiteUrl)} with a modern, professional design that converts visitors into customers. `;
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
      
      prompt += `Create an award-winning design with compelling copy, strong call-to-actions, testimonials section, services showcase, about us section, and a contact form. Make it mobile-responsive and SEO-optimized.`;
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
                        <h3 className="text-2xl font-bold text-gray-900">What's your website URL?</h3>
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
                        <h3 className="text-2xl font-bold text-gray-900">What's your company name?</h3>
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

                {/* Step 4 (redesign) or Step 6 (new): Contact Info */}
                {((currentStep === 4 && formData.projectType === 'redesign') || (currentStep === 6 && formData.projectType === 'new')) && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Almost done! Your contact info</h3>
                      <p className="text-gray-600 text-sm mt-1">We'll use this to personalize your website</p>
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