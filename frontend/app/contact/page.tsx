'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Mail, 
  Clock, 
  Send, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
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
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-500/[0.02] blur-3xl" />
      </div>

      {/* Subtle textured background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-b from-red-500/2 to-transparent" />
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-all duration-300 mb-8 group neuomorphic-flat px-4 py-2.5 rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="tracking-wide">Back to Home</span>
        </Link>
      </div>

      <section id="contact" className="pb-12 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.05]">
              Get In{' '}
              <span className="text-red-500">Touch</span>
            </h1>
            <p className="text-subtle max-w-2xl mx-auto mt-4">
              Let&apos;s discuss how NEVAS can transform your political campaign.
            </p>
          </motion.div>

          {/* Contact Info Cards - Neomorphic */}
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
                <p className="text-small text-zinc-500 uppercase mb-1">{info.label}</p>
                <p className="text-small text-zinc-500 mt-1">{info.subValue}</p>
              </div>
            ))}
          </motion.div>

          {/* Form Card - Neomorphic */}
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
                  <h3 className="heading-sub text-lg text-white">Send Us a Message</h3>
                  <p className="text-small text-zinc-500">We&apos;ll respond within 24 hours</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="group">
                  <label className="text-zinc-300 text-sm font-medium block mb-2 tracking-wide">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name" 
                      // In Contact page - Update input fields
className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/5 text-white placeholder:text-zinc-500 focus:border-red-500/30 focus:outline-none transition-all duration-300 group-hover:border-white/10 text-sm"
                    />
                  </div>
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
                        <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-emerald-400 tracking-wide">Message Sent Successfully!</p>
                          <p className="text-small text-emerald-400/70">We&apos;ll get back to you within 24 hours.</p>
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
                        <div className="w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-400 tracking-wide">Failed to Send</p>
                          <p className="text-small text-red-400/70">{errorMessage || 'Please try again later.'}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Trust Badge */}
              <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-4">
                <span className="flex items-center gap-1.5 text-small text-zinc-500">
                  <Shield className="w-3.5 h-3.5 text-red-500" />
                  Encrypted
                </span>
                <span className="flex items-center gap-1.5 text-small text-zinc-500">
                  <Zap className="w-3.5 h-3.5 text-red-500" />
                  Fast Response
                </span>
                <span className="flex items-center gap-1.5 text-small text-zinc-500">
                  <Users className="w-3.5 h-3.5 text-red-500" />
                  Expert Team
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 