'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#020202]">
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

      {/* Background glow - Red theme */}
      <div className="absolute inset-0 bg-red-500/[0.02] blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-3xl p-6 md:p-12 lg:p-20 text-center max-w-4xl mx-auto border border-red-500/10 bg-[#020202]/60 backdrop-blur-sm hover:border-red-500/30 transition-all duration-500 neuomorphic-card"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20 neuomorphic-flat">
            <Sparkles className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Ready to Transform Your{' '}
            <span className="text-red-500">Campaign?</span>
          </h2>
          
          <p className="text-zinc-400 text-base md:text-lg mb-8 max-w-2xl mx-auto font-light tracking-wide">
            Join the future of political intelligence. Get started with NEVAS today.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <button className="group px-6 md:px-8 py-3.5 md:py-4.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 active:scale-95 tracking-wide">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          {/* Trust indicator */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="tracking-wide">Trusted by political parties across India</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}