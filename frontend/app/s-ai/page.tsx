'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

{/*import ChatAssistant from '../components/s-ai/ChatAssistant';*/}
import TrendForecasting from '../components/s-ai/TrendForecasting';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SAI_Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid cascading renders
    const rafId = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#020202] relative overflow-x-hidden">
      
      {/* Subtle textured background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-b from-red-500/2 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
      </div>

      {/* Chat Assistant - 
      <ChatAssistant /> Floating Component */}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        {/* Gradient dividers */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
        </div>
      </section>

      {/* Main Components Grid - Centered */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              {/* Trend Forecasting - Centered */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4 justify-center px-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-0.5 sm:w-1 h-4 sm:h-5 bg-red-500 rounded-full" />
                    <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight">Trend Forecasting</h2>
                  </div>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] text-red-500 bg-red-500/10 px-2 sm:px-3 py-0.5 rounded-full border border-red-500/20 whitespace-nowrap tracking-wide">
                    India & International
                  </span>
                </div>
                <TrendForecasting />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-50px' }}
            className="neuomorphic-card p-5 sm:p-6 md:p-8 lg:p-12 text-center max-w-3xl mx-auto rounded-2xl border border-red-500/10 bg-[#020202]/60 backdrop-blur-sm"
          >
            {/* Icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5 border border-red-500/20 neuomorphic-flat">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-500" />
            </div>

            {/* Heading */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-[1.1] tracking-tight mb-2 sm:mb-3 px-2">
              Ready to leverage{' '}
              <span className="text-red-500">AI Intelligence</span>
            </h3>

            {/* Description */}
            <p className="text-zinc-400 max-w-2xl mx-auto mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base px-2 font-light tracking-wide">
              Get started with S-AI today and transform your political campaign with cutting-edge AI technology.
            </p>

            {/* CTA Button */}
            <Link href="/contact" className="inline-block">
              <button 
                className="px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 flex items-center gap-2 sm:gap-3 mx-auto shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-base rounded-xl tracking-wide"
              >
                Get Started Now
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}