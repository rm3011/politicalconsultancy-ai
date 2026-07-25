'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Zap,
  Users
} from 'lucide-react';

export default function CTASection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const subject = encodeURIComponent(`Contact Form: ${fullName || formData.firstName}`);
      const body = encodeURIComponent(
        `Name: ${fullName || formData.firstName}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `---\nSent from NEVAS Political Consultancy Contact Form`
      );
      
      window.location.href = `mailto:theedgewithjohn@gmail.com?subject=${subject}&body=${body}`;
      
      setSubmitStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 6000);

    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to open email client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-8 md:py-12 relative overflow-hidden bg-[#020202]">
      {/* Gradient dividers */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
      </div>

      {/* Subtle textured background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-b from-red-500/2 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-red-500/2 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-red-500/20 bg-[#020202]/40 backdrop-blur-sm neuomorphic-flat mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            <span className="text-[10px] md:text-xs text-red-500 font-medium tracking-[0.2em] uppercase">
              Contact Us
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Get In{' '}
            <span className="text-red-500">Touch</span>
          </h2>
          
          <p className="text-zinc-400 max-w-2xl mx-auto mt-2 text-sm md:text-base font-light tracking-wide">
            Let&apos;s discuss how NEVAS can transform your political campaign.
          </p>
        </motion.div>

        {/* Main Content - Image Right, Form Left */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="neuomorphic-card p-0 overflow-hidden relative"
          >
            {/* Owner Image - Positioned on the RIGHT side (Desktop) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[105%] z-20 pointer-events-none hidden lg:block">
              <div className="relative w-full h-full">
                <Image
                  src="/cta/owner-real.png"
                  alt="NEVAS Political Consultancy Team"
                  fill
                  className="object-contain object-right"
                  style={{
                    objectPosition: 'right center',
                  }}
                  priority
                  quality={100}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
              {/* Mobile Image - Fixed: Proper container with aspect ratio */}
              <div className="lg:hidden order-1 relative w-full max-w-[300px] aspect-[3/4] mx-auto pt-4 pb-1">
                <Image
                  src="/cta/owner-real.png"
                  alt="NEVAS Political Consultancy Team"
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 300px, 100vw"
                />
              </div>

              {/* Left Column - Form (Order: Second on mobile, First on desktop) */}
              <div className="p-5 sm:p-6 lg:p-8 relative z-20 order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="neuomorphic-icon w-10 h-10 bg-red-500/10 border-red-500/20">
                    <Mail className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Send Us a Message</h3>
                    <p className="text-xs text-zinc-500 font-light tracking-wide">
                      We&apos;ll respond within 24 hours
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="group">
                      <label className="text-zinc-300 text-sm font-medium block mb-1 tracking-wide">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="First name" 
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0f0f0f] border border-white/5 text-white placeholder:text-zinc-500 focus:border-red-500/30 focus:outline-none transition-all duration-300 group-hover:border-white/10 text-sm"
                      />
                    </div>
                    <div className="group">
                      <label className="text-zinc-300 text-sm font-medium block mb-1 tracking-wide">
                        Last Name
                      </label>
                      <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name" 
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0f0f0f] border border-white/5 text-white placeholder:text-zinc-500 focus:border-red-500/30 focus:outline-none transition-all duration-300 group-hover:border-white/10 text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="group">
                    <label className="text-zinc-300 text-sm font-medium block mb-1 tracking-wide">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email" 
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-red-500/10 text-white placeholder:text-zinc-500 focus:border-red-500/50 focus:outline-none transition-all duration-300 group-hover:border-red-500/30 text-sm"
                    />
                  </div>
                  
                  {/* Phone */}
                  <div className="group">
                    <label className="text-zinc-300 text-sm font-medium block mb-1 tracking-wide">
                      Phone Number
                    </label>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number" 
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-red-500/10 text-white placeholder:text-zinc-500 focus:border-red-500/50 focus:outline-none transition-all duration-300 group-hover:border-red-500/30 text-sm"
                    />
                  </div>
                  
                  {/* Message */}
                  <div className="group">
                    <label className="text-zinc-300 text-sm font-medium block mb-1 tracking-wide">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us how we can help..." 
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-red-500/10 text-white placeholder:text-zinc-500 focus:border-red-500/50 focus:outline-none transition-all duration-300 group-hover:border-red-500/30 resize-none text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  {/* Success Message */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="neuomorphic-flat p-3 bg-emerald-400/10 border border-emerald-400/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-emerald-400 tracking-wide">Message Sent Successfully!</p>
                            <p className="text-xs text-emerald-400/70 font-light tracking-wide">
                              We&apos;ll get back to you within 24 hours.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error Message */}
                  <AnimatePresence>
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="neuomorphic-flat p-3 bg-red-400/10 border border-red-400/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-400 tracking-wide">Failed to Send</p>
                            <p className="text-xs text-red-400/70 font-light tracking-wide">
                              {errorMessage || 'Please try again later.'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium tracking-wide">
                    <Shield className="w-3.5 h-3.5 text-red-500" />
                    Encrypted
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium tracking-wide">
                    <Zap className="w-3.5 h-3.5 text-red-500" />
                    Fast Response
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium tracking-wide">
                    <Users className="w-3.5 h-3.5 text-red-500" />
                    Expert Team
                  </span>
                </div>
              </div>

              {/* Right Column - Spacer for image (Desktop only) */}
              <div className="relative min-h-[500px] lg:min-h-[600px] hidden lg:block order-2" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}