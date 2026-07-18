'use client';

import { useState, useRef, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const NAVBAR_HEIGHT = 56;

interface HeroProps {
  className?: string;
}

const HeroTitle = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 0.2 }}
    className="text-left"
  >
    <h1 className="leading-[0.85] font-[family-name:var(--font-anton)] font-normal uppercase tracking-[-0.02em]">
      <span className="block text-[clamp(36px,10vw,56px)] sm:text-[clamp(48px,12vw,72px)] md:text-[clamp(56px,14vw,88px)] lg:text-[clamp(68px,16vw,104px)] text-white">
        THE FUTURE
      </span>
      <br />
      <span className="block text-[clamp(36px,10vw,56px)] sm:text-[clamp(48px,12vw,72px)] md:text-[clamp(56px,14vw,88px)] lg:text-[clamp(68px,16vw,104px)] text-white">
        OF NEW GEN
      </span>
      <br />
      <span className="block text-[clamp(36px,10vw,56px)] sm:text-[clamp(48px,12vw,72px)] md:text-[clamp(56px,14vw,88px)] lg:text-[clamp(68px,16vw,104px)] text-red-600 drop-shadow-[0_0_18px_rgba(220,38,38,.15)]">
        POLITICS.
      </span>
    </h1>
  </motion.div>
));
HeroTitle.displayName = 'HeroTitle';

const ScrollIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.8 }}
    className="mt-6 sm:mt-8 md:mt-10 lg:mt-14 text-left"
  >
    <p className="mb-2 md:mb-3 lg:mb-4 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em] lg:tracking-[0.45em] text-[#8d8d8d] font-medium">
      Scroll To Discover
    </p>
    <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
      <div className="h-px w-12 sm:w-16 md:w-20 lg:w-32 bg-gradient-to-r from-red-600 to-transparent" aria-hidden="true" />
      <svg
        className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 text-red-500 animate-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </motion.div>
));
ScrollIndicator.displayName = 'ScrollIndicator';

// CTA Button with shiny effect always visible and grander hover
const CTAButton = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: 0.45 }}
    className="mt-4 sm:mt-6 md:mt-7 flex justify-start"
  >
    <Link
      href="/contact"
      className="group relative inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 
        border-2 border-red-600 bg-transparent px-4 xs:px-5 sm:px-7 md:px-8 lg:px-9 xl:px-10 
        py-2.5 xs:py-3 sm:py-3.5 md:py-4 lg:py-4.5 xl:py-5 uppercase tracking-[0.12em] 
        xs:tracking-[0.15em] sm:tracking-[0.18em] md:tracking-[0.2em] text-[9px] 
        xs:text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] 
        font-semibold transition-all duration-500 
        shadow-[0_0_40px_rgba(255,0,0,0.2)] 
        hover:shadow-[0_0_80px_rgba(255,0,0,0.6)] 
        hover:scale-105 hover:border-red-400
        focus:outline-none focus:shadow-[0_0_80px_rgba(255,0,0,0.7)]
        overflow-hidden rounded-md"
      prefetch
    >
      {/* Permanent shiny/glossy effect */}
      <span className="absolute inset-0 bg-gradient-to-br from-white/5 via-red-600/10 to-transparent" />
      
      {/* Shiny diagonal sweep - always visible, subtle */}
      <span 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
          animate-[shimmer_3s_infinite]"
        style={{
          width: '200%',
          transform: 'skewX(-20deg)',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        }}
      />
      
      {/* Hover: dramatic red glow sweep */}
      <span 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/50 to-transparent 
          -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
        style={{
          width: '200%',
          background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.6), transparent)',
        }}
      />
      
      {/* Hover: secondary glow from opposite direction */}
      <span 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/30 to-transparent 
          translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-in-out delay-200"
        style={{
          width: '200%',
          background: 'linear-gradient(270deg, transparent, rgba(220,38,38,0.4), transparent)',
        }}
      />
      
      {/* Hover: pulsing border glow */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="absolute inset-[-3px] bg-gradient-to-r from-red-600 via-red-400 to-red-600 blur-md animate-pulse" 
          style={{ animationDuration: '1.5s' }} 
        />
      </span>
      
      {/* Text with shiny effect */}
      <span className="relative z-10 flex items-center gap-2 sm:gap-3 text-white group-hover:text-white transition-colors duration-300">
        <span className="relative">
          EXPLORE THE HUB
          {/* Shiny underline that appears on hover */}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-400 group-hover:w-full transition-all duration-700" />
        </span>
        <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110 group-hover:text-red-400" />
      </span>
    </Link>
  </motion.div>
));
CTAButton.displayName = 'CTAButton';

const Hero = memo(({ className = '' }: HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-[100vh] overflow-hidden bg-[#020202] ${className}`}
      style={{ 
        paddingTop: `${NAVBAR_HEIGHT}px`,
      }}
      aria-label="Hero section"
    >
      <h1 className="sr-only">
        THE EDGE WITH JOHN - The Future of New Gen Politics. AI Driven, Data Backed, Impact Focused.
      </h1>

      {/* Background image - properly scaled to show full image */}
      <div className="absolute inset-0 z-0">
        {!imageError ? (
          <>
            <Image
              src="/india-2.png"
              alt="India map background"
              fill
              priority
              quality={100}
              sizes="100vw"
              className="transition-opacity duration-700 will-change-transform"
              style={{
                opacity: imageLoaded ? 1 : 0,
                objectFit: 'contain',
                objectPosition: 'center center',
                transform: `translateY(${y.get()}px)`,
                filter: 'brightness(1.3) contrast(1.15) saturate(1.2) drop-shadow(0 0 30px rgba(220,38,38,0.15))',
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {/* Gradients for readability - much softer now */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#020202] to-[#1a0a0a]" />
        )}
      </div>
      
      {/* Subtle red glow */}
      <div className="absolute z-10 pointer-events-none right-[5%] sm:right-[8%] md:right-[10%] top-[30%] sm:top-[25%]">
        <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[380px] md:h-[380px] rounded-full bg-red-600/15 blur-[150px] animate-pulse" 
          style={{ animationDuration: '4s' }} 
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center min-h-[calc(100vh-56px)] pb-12 sm:pb-16 md:pb-20">
        <div className="flex w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[640px] flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3"
          >
            <div className="h-px w-5 sm:w-6 md:w-8 bg-red-600 shadow-[0_0_20px_rgba(255,0,0,0.5)]" aria-hidden="true" />
            <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[12px] uppercase tracking-[0.15em] xs:tracking-[0.2em] sm:tracking-[0.24em] md:tracking-[0.28em] text-neutral-400 font-medium whitespace-nowrap">
              <span className="text-red-500">DATA BACKED.</span> IMPACT FOCUSED.
            </span>
          </motion.div>

          <HeroTitle />

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="mt-3 sm:mt-5 border-l-2 border-red-500 pl-3 sm:pl-4 md:pl-5 text-left"
          >
            <p className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] leading-[1.6] sm:leading-[1.7] md:leading-[1.8] lg:leading-[1.9] font-normal text-neutral-400">
              Strategic intelligence.<br />
              Real insights.<br />
              Stronger campaigns.<br />
              Lasting impact.
            </p>
          </motion.div>

          <CTAButton />
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;