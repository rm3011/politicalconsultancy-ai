'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Mail, 
  Clock, 
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
    name: '',
    email: '',
    subject: '',
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
      const subject = encodeURIComponent(`Contact Form: ${formData.subject}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Subject: ${formData.subject}\n\n` +
        `Message:\n${formData.message}\n\n` +
        `---\nSent from NEVAS Political Consultancy Contact Form`
      );
      
      window.location.href = `mailto:theedgewithjohn@gmail.com?subject=${subject}&body=${body}`;
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
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

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Location',
      subValue: 'Serving Nationwide'
    },
    {
      icon: Mail,
      label: 'Email',
      subValue: 'Response within 24 hours'
    },
    {
      icon: Clock,
      label: 'Response Time',
      subValue: 'AI-powered assistance'
    }
  ];

  return (
    <section id="contact" className="py-16 md:py-24 relative overflow-hidden bg-[#020202]">
      {/* Gradient dividers - Matching other sections */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      </div>

      {/* Subtle textured background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/2 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-red-500/[0.02] blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header - FIXED: Using same font as other sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-red-500/20 bg-[#020202]/40 backdrop-blur-sm neuomorphic-flat mb-5">
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
            
            <p className="text-zinc-400 max-w-2xl mx-auto mt-4 text-sm md:text-base font-light tracking-wide">
              Let&apos;s discuss how NEVAS can transform your political campaign.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {contactInfo.map((info, index) => (
              <div key={index} className="neuomorphic-flat p-4 text-center group">
                <div className="neuomorphic-icon w-12 h-12 mx-auto mb-3 border-red-500/10">
                  <info.icon className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-medium mb-1">
                  {info.label}
                </p>
                <p className="text-xs text-zinc-500 mt-1 font-light tracking-wide">
                  {info.subValue}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <div className="neuomorphic-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
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
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="group">
                  <label className="text-zinc-300 text-sm font-medium block mb-2 tracking-wide">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name" 
                    className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/5 text-white placeholder:text-zinc-500 focus:border-red-500/30 focus:outline-none transition-all duration-300 group-hover:border-red-500/30 text-sm"
                  />
                </div>
                
                {/* Email Field */}
                <div className="group">
                  <label className="text-zinc-300 text-sm font-medium block mb-2 tracking-wide">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email" 
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-red-500/10 text-white placeholder:text-zinc-500 focus:border-red-500/50 focus:outline-none transition-all duration-300 group-hover:border-red-500/30 text-sm"
                  />
                </div>
                
                {/* Subject Field */}
                <div className="group">
                  <label className="text-zinc-300 text-sm font-medium block mb-2 tracking-wide">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What&apos;s this about?" 
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-red-500/10 text-white placeholder:text-zinc-500 focus:border-red-500/50 focus:outline-none transition-all duration-300 group-hover:border-red-500/30 text-sm"
                  />
                </div>
                
                {/* Message Field */}
                <div className="group">
                  <label className="text-zinc-300 text-sm font-medium block mb-2 tracking-wide">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how we can help..." 
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border border-red-500/10 text-white placeholder:text-zinc-500 focus:border-red-500/50 focus:outline-none transition-all duration-300 group-hover:border-red-500/30 resize-none text-sm"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98]"
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
                      className="neuomorphic-flat p-4 bg-emerald-400/10 border border-emerald-400/20"
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
                      className="neuomorphic-flat p-4 bg-red-400/10 border border-red-400/20"
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

              {/* Trust Badge */}
              <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-4">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}