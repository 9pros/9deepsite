'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Clock, Award, Star, ChevronRight, Menu, X, Globe, Palette, Code, TrendingUp } from 'lucide-react';
import LeadGenForm from '@/components/lead-gen-form';
import { Logo } from '@/components/ui/logo';

export default function LandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats = [
    { value: '1M+', label: 'Designer Expertise' },
    { value: '10s', label: 'Generation Time' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'AI Support' }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Generate perfect websites in seconds, not weeks'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Award-Winning Design',
      description: 'AI trained on millions of top-performing websites'
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Clean Code',
      description: 'SEO-optimized, mobile-responsive, and blazing fast'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Conversion Focused',
      description: 'Designed to turn visitors into customers'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart',
      content: '9Pros AI created a website that exceeded our expectations. What would have taken months was done in minutes!',
      rating: 5,
      image: '/api/placeholder/48/48'
    },
    {
      name: 'Michael Chen',
      role: 'Founder, GrowthLab',
      content: 'The AI understood our brand perfectly and delivered a stunning website that converts like crazy.',
      rating: 5,
      image: '/api/placeholder/48/48'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      content: 'Absolutely mind-blowing! The quality rivals top design agencies at a fraction of the cost and time.',
      rating: 5,
      image: '/api/placeholder/48/48'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#020205] text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-[#020205]/90 backdrop-blur-md z-40 border-b border-[#375CEC]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Logo variant="light" />
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors">How it Works</a>
                <a href="#testimonials" className="text-white/70 hover:text-white transition-colors">Testimonials</a>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-6 py-2 bg-[#375CEC] text-white rounded-full font-medium hover:bg-[#2a4bc7] hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-[#020205] border-t border-[#375CEC]/20"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block text-white/70 hover:text-white">Features</a>
                <a href="#how-it-works" className="block text-white/70 hover:text-white">How it Works</a>
                <a href="#testimonials" className="block text-white/70 hover:text-white">Testimonials</a>
                <button
                  onClick={() => {
                    setIsFormOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-[#375CEC] text-white rounded-full font-medium hover:bg-[#2a4bc7]"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#375CEC]/20 rounded-full mb-6 border border-[#375CEC]/30">
                <Award className="w-4 h-4 text-[#375CEC]" />
                <span className="text-sm text-[#375CEC] font-medium">AI-Powered Web Design Revolution</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Replace{' '}
                <span className="text-[#375CEC]">
                  1,000,000
                </span>{' '}
                Web Designers
              </h1>
              
              <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto">
                Create perfect websites in a flash with AI technology that understands design, 
                conversion, and your business needs better than any human ever could.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="group px-8 py-4 bg-[#375CEC] text-white rounded-full font-semibold text-lg hover:bg-[#2a4bc7] hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Get Your AI Website Now
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-[#375CEC]/30 text-white rounded-full font-semibold text-lg hover:border-[#375CEC]/50 hover:bg-[#375CEC]/10 transition-all">
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-[#375CEC]">{stat.value}</div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-16 relative"
            >
              <div className="relative mx-auto max-w-5xl">
                <div className="absolute inset-0 bg-[#375CEC] rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-[#375CEC] to-[#2a4bc7] rounded-3xl p-1">
                  <div className="bg-[#1a1a1f] rounded-3xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                          <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl animate-pulse"></div>
                          <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4"></div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="p-6 bg-[#020205] rounded-2xl shadow-2xl border border-[#375CEC]/30">
                        <Sparkles className="w-12 h-12 text-[#375CEC] mx-auto mb-2" />
                        <p className="text-sm font-semibold text-white">AI Generating...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why Choose 9Pros AI?
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Our AI has analyzed millions of successful websites to understand 
                what makes them convert, engage, and succeed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#1a1a1f] border border-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:border-[#375CEC]/30 transition-all"
                >
                  <div className="p-3 bg-[#375CEC] rounded-xl inline-block mb-4">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Get your perfect website in 3 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Tell Us About Your Business',
                  description: 'Answer a few simple questions about your business and goals'
                },
                {
                  step: '2',
                  title: 'AI Creates Your Website',
                  description: 'Our AI generates a perfect, custom website in seconds'
                },
                {
                  step: '3',
                  title: 'Launch & Grow',
                  description: 'Your website is ready to attract and convert customers'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#375CEC] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-[#375CEC]"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Loved by Businesses Everywhere
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Join thousands of businesses that have transformed their online presence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#1a1a1f] border border-gray-800 p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#375CEC] rounded-full"></div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#375CEC] to-[#2a4bc7] rounded-3xl p-12 text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Replace Your Web Designer?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join the AI revolution and get your perfect website in minutes, not months.
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-8 py-4 bg-white text-[#375CEC] rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Start Building Now - It's Free
              </button>
              <p className="text-sm text-white/70 mt-4">
                No credit card required • Setup in 60 seconds • Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#020205] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Logo variant="light" className="mb-4 md:mb-0" />
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div className="text-center text-sm text-gray-400 mt-8">
              © 2024 9Pros AI. All rights reserved. Powered by cutting-edge AI technology.
            </div>
          </div>
        </footer>
      </div>

      {/* Lead Generation Form Modal */}
      <LeadGenForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}