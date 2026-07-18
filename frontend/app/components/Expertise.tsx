'use client';

import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import LogoLoop from '@/components/LogoLoop';
import LogoItem from './LogoItem';
import { POLITICAL_PARTIES } from '@/constants/parties';
import type { PoliticalParty } from '@/types/parties';

const ANIMATION_DURATION = 0.6;
const LOGO_LOOP_SPEED = 50;

// Type for Google Analytics
interface WindowWithGtag extends Window {
  gtag: (command: string, eventName: string, params: Record<string, unknown>) => void;
}

export default function Expertise() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  const handleLogoInteraction = useCallback((partyId: string) => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as WindowWithGtag;
      if (win.gtag) {
        win.gtag('event', 'expertise_logo_click', {
          event_category: 'engagement',
          event_label: partyId,
          value: 1,
        });
      }
    }
  }, []);

  const logoItems = useMemo(() => {
    if (!POLITICAL_PARTIES || POLITICAL_PARTIES.length === 0) {
      return [];
    }

    return POLITICAL_PARTIES.map((party: PoliticalParty) => ({
      node: (
        <LogoItem 
          key={party.id} 
          party={party} 
          onInteraction={handleLogoInteraction}
        />
      ),
      title: `${party.name} - ${party.fullName}`,
      href: "#",
      ariaLabel: `${party.name} - ${party.fullName}`
    }));
  }, [handleLogoInteraction]);

  return (
    <section 
      id="expertise" 
      className="relative overflow-hidden bg-[#020202] py-16 md:py-24"
      aria-labelledby="expertise-heading"
    >
      <h2 id="expertise-heading" className="sr-only">
        Our Expertise - Serving Political Parties Across India
      </h2>

      {/* Subtle textured background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-b from-red-500/2 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION_DURATION, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-red-500/20 bg-[#020202]/40 backdrop-blur-sm neuomorphic-flat mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              <span className="text-[10px] md:text-xs text-red-500 font-medium tracking-[0.2em] uppercase">
                Trusted Partners
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            </div>
            
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-[1.1] tracking-tight">
              Serving Across The{' '}
              <span className="relative">
                <span className="text-red-500">Political Spectrum</span>
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-red-500/50 to-transparent" aria-hidden="true" />
              </span>
            </h3>
            
            <p className="text-zinc-400 max-w-2xl mx-auto mt-4 text-sm md:text-base leading-relaxed font-light tracking-wide">
              Trusted by leading political parties across India for strategic intelligence, 
              data-driven insights, and advisory services.
            </p>
          </div>

          <div className="relative">
            {/* Gradient overlays - ONLY for fade effect, no extra layer */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-r from-[#020202] to-transparent z-10 pointer-events-none" aria-hidden="true" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-l from-[#020202] to-transparent z-10 pointer-events-none" aria-hidden="true" />
            
            <LogoLoop
              logos={logoItems}
              speed={prefersReducedMotion ? 0 : LOGO_LOOP_SPEED}
              direction="left"
              logoHeight={90}
              gap={60}
              hoverSpeed={prefersReducedMotion ? 0 : 10}
              scaleOnHover={!prefersReducedMotion}
              fadeOut={false}
              logoShape="circle"
              ariaLabel="Indian Political Parties we work with"
              className="bg-transparent!"
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: ANIMATION_DURATION, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-zinc-600 text-xs md:text-sm mt-8 tracking-wide"
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-red-500/30" aria-hidden="true" />
              {POLITICAL_PARTIES?.length || 0}+ political parties across the political spectrum
              <span className="w-1 h-1 rounded-full bg-red-500/30" aria-hidden="true" />
            </span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}