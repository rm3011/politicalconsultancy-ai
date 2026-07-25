'use client';

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';

const NAVBAR_HEIGHT = 56;

interface HeroProps {
  className?: string;
}

// Animation Variants
const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.2 } },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, delay: 0.1 } },
};

const descriptionVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.35 } },
};

const scrollIndicatorVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, delay: 0.8 } },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.45 } },
};

// Typography clamp helper
const headingClamp = (mobile: string, tablet: string, desktop: string) =>
  `clamp(${mobile}) sm:clamp(${tablet}) lg:clamp(${desktop})`;

const HeroTitle = memo(() => (
  <motion.div variants={titleVariants} initial="hidden" animate="visible" className="text-left">
    <h1 className="leading-[0.8] font-[family-name:var(--font-anton)] font-normal uppercase tracking-[-0.02em]">
      <span className="block text-[clamp(64px,18vw,80px)] xs:text-[clamp(72px,20vw,88px)] sm:text-[clamp(48px,12vw,72px)] md:text-[clamp(56px,14vw,88px)] lg:text-[clamp(68px,16vw,104px)] text-white">
        THE FUTURE
      </span>
      <br />
      <span className="block text-[clamp(58px,16vw,74px)] xs:text-[clamp(66px,18vw,82px)] sm:text-[clamp(48px,12vw,72px)] md:text-[clamp(56px,14vw,88px)] lg:text-[clamp(68px,16vw,104px)] text-white">
        OF NEW GEN
      </span>
      <br />
      <span className="block text-[clamp(64px,18vw,80px)] xs:text-[clamp(72px,20vw,88px)] sm:text-[clamp(48px,12vw,72px)] md:text-[clamp(56px,14vw,88px)] lg:text-[clamp(68px,16vw,104px)] text-red-600 drop-shadow-[0_0_18px_rgba(220,38,38,.15)]">
        POLITICS.
      </span>
    </h1>
  </motion.div>
));
HeroTitle.displayName = 'HeroTitle';

const ScrollIndicator = memo(() => (
  <motion.div
    variants={scrollIndicatorVariants}
    initial="hidden"
    animate="visible"
    className="mt-4 sm:mt-8 md:mt-10 lg:mt-14 text-left"
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

const CTAButton = memo(() => {
  const scrollToCTA = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div variants={ctaVariants} initial="hidden" animate="visible" className="mt-3 sm:mt-6 md:mt-7 flex justify-start">
      <button
        onClick={scrollToCTA}
        className="group relative inline-flex items-center gap-2 sm:gap-2.5 md:gap-3
          border border-red-600/30 bg-transparent
          px-4 xs:px-5 sm:px-7 md:px-8 lg:px-9 xl:px-10
          py-2.5 xs:py-3 sm:py-3.5 md:py-4 lg:py-4.5 xl:py-5
          uppercase tracking-[0.12em] xs:tracking-[0.15em] sm:tracking-[0.18em] md:tracking-[0.2em]
          text-[9px] xs:text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px]
          font-semibold transition-all duration-700
          hover:border-red-600/60 hover:bg-red-600/5 hover:shadow-[0_0_60px_rgba(220,38,38,0.25)]
          focus:outline-none focus:ring-2 focus:ring-red-500/30
          overflow-hidden rounded-md cursor-pointer"
      >
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/15 to-transparent animate-flow-smooth"
          style={{ backgroundSize: '300% 100%', backgroundPosition: '-100% 0%' }}
        />
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/30 to-transparent
            -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ width: '300%', background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.25), transparent)' }}
        />
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <span className="absolute -inset-px bg-gradient-to-r from-red-500/20 via-red-400/30 to-red-500/20 blur-md" />
        </span>
        <span className="relative z-10 flex items-center gap-2 sm:gap-3 text-white/90 group-hover:text-white transition-colors duration-700">
          <span className="relative font-medium tracking-wider">
            EXPLORE THE HUB
            <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-gradient-to-r from-red-400 to-red-500 group-hover:w-full transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
          </span>
          <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 transition-all duration-700 group-hover:translate-x-2 group-hover:text-red-400 group-hover:scale-110" />
        </span>
      </button>
    </motion.div>
  );
});
CTAButton.displayName = 'CTAButton';

// Image Config
interface ImageConfig {
  objectFit: 'contain' | 'cover';
  objectPosition: string;
  scale: number;
}

const getImageConfig = (width: number): ImageConfig => {
  if (width < 768) return { objectFit: 'cover', objectPosition: '60% 48%', scale: 1 };
  if (width < 1024) return { objectFit: 'contain', objectPosition: '60% 50%', scale: 1.3 };
  return { objectFit: 'contain', objectPosition: '50% 50%', scale: 1 };
};

const Hero = memo(({ className = '' }: HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageConfig, setImageConfig] = useState<ImageConfig>(() => ({
    objectFit: 'contain',
    objectPosition: '50% 50%',
    scale: 1,
  }));
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  useEffect(() => {
    const updateConfig = () => setImageConfig(getImageConfig(window.innerWidth));
    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen overflow-hidden bg-[#020202] ${className}`}
      style={{ paddingTop: NAVBAR_HEIGHT }}
      aria-label="Hero section"
    >
      <h1 className="sr-only">THE EDGE WITH JOHN - The Future of New Gen Politics.</h1>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {!imageError ? (
          <>
            <Image
              src="/india-img.png"
              alt="India map background"
              fill
              priority
              quality={95}
              sizes="100vw"
              className={`transition-opacity duration-700 will-change-transform ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{
                objectFit: imageConfig.objectFit,
                objectPosition: imageConfig.objectPosition,
                transform: `translateY(${y.get()}px) scale(${imageConfig.scale})`,
                filter: 'brightness(1.2) contrast(1.1) saturate(1.1) drop-shadow(0 0 30px rgba(220,38,38,0.1))',
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 md:from-black/50 md:via-transparent md:to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent md:from-black/40 md:via-transparent md:to-black/40" />
            <div className="absolute inset-0 bg-black/30 md:bg-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#020202] to-[#1a0a0a]" />
        )}
      </div>

      {/* Red Glow */}
      <div className="absolute z-10 pointer-events-none right-[5%] sm:right-[8%] md:right-[10%] top-[30%] sm:top-[25%]" aria-hidden="true">
        <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[380px] md:h-[380px] rounded-full bg-red-600/15 blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center min-h-[calc(100vh-56px)] pb-2 sm:pb-10 md:pb-14">
        <div className="flex w-full max-w-[92%] xs:max-w-[94%] sm:max-w-100 md:max-w-125 lg:max-w-150 xl:max-w-160 flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <motion.div variants={badgeVariants} initial="hidden" animate="visible" className="mb-1 sm:mb-4 flex items-center gap-2 sm:gap-3">
            <div className="h-px w-5 sm:w-6 md:w-8 bg-red-600 shadow-[0_0_20px_rgba(255,0,0,0.5)]" aria-hidden="true" />
            <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[12px] uppercase tracking-[0.15em] xs:tracking-[0.2em] sm:tracking-[0.24em] md:tracking-[0.28em] text-neutral-400 font-medium whitespace-nowrap">
              <span className="text-red-500">DATA BACKED.</span> IMPACT FOCUSED.
            </span>
          </motion.div>

          <HeroTitle />

          <motion.div variants={descriptionVariants} initial="hidden" animate="visible" className="mt-1 sm:mt-5 border-l-2 border-red-500 pl-3 sm:pl-4 md:pl-5 text-left">
            <p className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] leading-[1.6] sm:leading-[1.7] md:leading-[1.8] lg:leading-[1.9] font-normal text-neutral-400">
              Strategic intelligence.<br />Real insights.<br />Stronger campaigns.<br />Lasting impact.
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