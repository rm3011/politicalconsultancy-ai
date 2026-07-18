'use client';

import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Users, TrendingUp, Target, BarChart3, Award, 
  ChevronDown, Quote, CheckCircle
} from 'lucide-react';
import PartyLogoLoop from "./PartyLogoLoop";
import POLITICAL_PARTIES from "../../constants/parties";
import type { PoliticalParty } from '@/types/parties';
// Constants
const IMAGE_QUALITY = 85;
const ANIMATION_DELAY_BASE = 0.1;

// Types
interface StackItem {
  src: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Constants
const STACK_ITEMS: readonly StackItem[] = [
  { src: 'https://imgnew.outlookindia.com/uploadimage/library/16_9/16_9_5/IMAGE_1660797062.webp', label: 'Strategy', icon: Target },
  { src: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2014/05/16/19/india-graphic.jpg?quality=75&width=640&auto=webp', label: 'Data', icon: BarChart3 },
  { src: 'https://tse4.mm.bing.net/th/id/OIP.MHWOp4eQp_zncpvgf11wxAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', label: 'Happiness', icon: TrendingUp },
  { src: 'https://tse4.mm.bing.net/th/id/OIP.bw7OZRPVzYdISgoEWN0rHwAAAA?r=0&w=474&h=266&rs=1&pid=ImgDetMain&o=7&rm=3', label: 'Action', icon: Users },
  { src: 'https://claritycircuit.com/wp-content/uploads/2024/07/Impact-of-social-media-on-political-campaigns-in-India-2-768x432.jpg', label: 'Impact', icon: Award },
] as const;

const EXPERTISE_ITEMS = [
  'Data-Driven Decision Making',
  'Grassroots Strategy & Execution',
  'Real-Time Political Intelligence',
  'Voter Behavior Analytics',
  'Campaign Optimization',
  'Crisis Communication Management',
] as const;

const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eXh6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==";

// ============================================================
// IMAGE CARD COMPONENT
// ============================================================
const ImageCard = memo(({ item, index, height, onInteraction }: {
  item: StackItem;
  index: number;
  height: string;
  onInteraction?: (label: string) => void;
}) => {
  const Icon = item.icon;
  
  const handleClick = useCallback(() => {
    onInteraction?.(item.label);
  }, [item.label, onInteraction]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onInteraction?.(item.label);
    }
  }, [item.label, onInteraction]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * ANIMATION_DELAY_BASE }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      className={`relative ${height} rounded-lg overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#020202] neuomorphic-card-hover`}
      role="listitem"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Image
        src={item.src}
        alt={`${item.label} - NEVAS political consultancy capability`}
        fill
        quality={IMAGE_QUALITY}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      
      <div className="absolute inset-0 bg-linear-to-t from-[#020202]/90 via-[#020202]/30 to-transparent" />
      
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <div className="neuomorphic-icon w-6 h-6 rounded-md bg-[#020202]/80 border border-red-500/10 flex items-center justify-center">
          <Icon className="w-3 h-3 text-red-500" aria-hidden="true" />
        </div>
        <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-semibold">
          {item.label}
        </span>
      </div>
      
      <div className="absolute inset-0 border border-transparent group-hover:border-red-500/20 rounded-lg transition-all duration-300" />
    </motion.div>
  );
});

ImageCard.displayName = 'ImageCard';

// ============================================================
// SCROLLABLE PANEL
// ============================================================
const ScrollablePanel = memo(({ children }: { children: React.ReactNode }) => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <div 
        className="h-[380px] md:h-[420px] lg:h-[460px] overflow-y-auto pr-3 neuomorphic-scroll"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="space-y-6 pr-1">
          {children}
        </div>
      </div>

      {showScrollHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-[#020202] to-transparent flex items-end justify-center pb-2 pointer-events-none"
        >
          <ChevronDown className="w-4 h-4 text-red-500/40 animate-bounce" />
        </motion.div>
      )}
    </div>
  );
});

ScrollablePanel.displayName = 'ScrollablePanel';

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function About() {
  const handleImageInteraction = useCallback((label: string) => {
    console.log(`User interacted with ${label}`);
  }, []);

  // Memoized content for scrollable panel
  const scrollableContent = useMemo(() => (
    <>
      <div className="relative pl-5 border-l-2 border-red-500/30">
        <Quote className="w-6 h-6 text-red-500/20 absolute -top-1 -left-1" />
        <p className="text-zinc-300 text-sm md:text-base italic leading-relaxed pl-5 font-light tracking-wide">
          &quot;In modern politics, data is the new currency, and strategy is the art of converting it into electoral success.&quot;
        </p>
      </div>

      <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light tracking-wide">
        We are a premier political intelligence firm dedicated to transforming 
        how political campaigns are strategized, executed, and won in the modern era.
      </p>

      <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-light tracking-wide">
        With deep expertise in data analytics, grassroots strategy, and voter 
        psychology, we empower political leaders to make informed decisions 
        that drive real impact.
      </p>

      <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-light tracking-wide">
        Our approach combines cutting-edge AI technology with decades of political 
        experience to deliver insights that are both actionable and transformative.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {EXPERTISE_ITEMS.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#020202]/40 border border-white/5 hover:border-red-500/20 transition-all duration-300 neuomorphic-flat"
          >
            <CheckCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-zinc-300 text-xs md:text-sm font-light tracking-wide">{item}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2 pb-1">
        {[
          { value: '50+', label: 'Campaigns' },
          { value: '15+', label: 'States' },
          { value: '95%', label: 'Success Rate' },
        ].map((stat, index) => (
          <div key={index} className="text-center p-3.5 rounded-lg bg-[#020202]/40 border border-white/5 neuomorphic-flat">
            <p className="text-2xl font-bold text-red-500 tracking-tight">{stat.value}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-light">{stat.label}</p>
          </div>
        ))}
      </div>
    </>
  ), []);

  // Memoized expertise items
  const expertiseItems = useMemo(() => 
    EXPERTISE_ITEMS.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 text-zinc-400 text-xs md:text-sm font-light tracking-wide"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
        <span>{item}</span>
      </motion.div>
    )),
    []
  );

  // Memoized stack items
  const leftColumnItems = useMemo(() => 
    STACK_ITEMS.slice(0, 3).map((item, index) => (
      <ImageCard
        key={item.label}
        item={item}
        index={index}
        height="h-[160px] md:h-[200px]"
        onInteraction={handleImageInteraction}
      />
    )),
    [handleImageInteraction]
  );

  const rightColumnItems = useMemo(() => 
    STACK_ITEMS.slice(3).map((item, index) => (
      <ImageCard
        key={item.label}
        item={item}
        index={index + 3}
        height="h-[250px] md:h-[310px]"
        onInteraction={handleImageInteraction}
      />
    )),
    [handleImageInteraction]
  );

  const partiesArray = useMemo(() => POLITICAL_PARTIES as unknown as PoliticalParty[], []);

  return (
    <section 
      id="about" 
      className="bg-[#020202] py-16 md:py-12 relative overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-b from-red-500/2 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-red-500/1 blur-3xl rounded-full" />
      </div>

      <h2 id="about-heading" className="sr-only">
        About NEVAS - Political Intelligence Firm
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-8 relative z-10">

        {/* ROW 1 - About Section with Image at TOP */}
        <div className="grid lg:grid-cols-[420px_1fr] gap-8 md:gap-12 items-start">
          
          {/* LEFT: Owner Image - AT TOP with natural height */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <div className="relative w-full mx-auto overflow-hidden group">
              <div className="relative" style={{ aspectRatio: '3/4' }}>
                <Image
                  src="/about/owner-final.png"
                  alt="Founder and CEO of NEVAS Political Consultancy"
                  fill
                  priority
                  quality={IMAGE_QUALITY}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                  style={{ 
                    transform: 'scaleX(-1)',
                    objectPosition: 'top center'
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#020202]/80 via-[#020202]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-linear-to-t from-red-500/5 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-red-500/20 bg-[#020202]/40 backdrop-blur-sm neuomorphic-flat">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
              <span className="text-[10px] text-red-500 font-medium tracking-[0.2em] uppercase">Who We Are</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            </div>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
              POLITICAL INTELLIGENCE
              <br />
              <span className="text-red-500 tracking-[0.02em]">FOR THE NEXT</span>
              <br />
              <span className="text-red-500 tracking-[0.02em]">GENERATION</span>
            </h3>

            <div className="neuomorphic-card rounded-xl p-6 md:p-8 bg-[#020202]/60 backdrop-blur-sm border border-white/5">
              <ScrollablePanel>
                {scrollableContent}
              </ScrollablePanel>
            </div>
          </div>
        </div>

        {/* ROW 2 — Expertise */}
        <div className="mt-16 md:mt-32 grid lg:grid-cols-[1fr_1fr] gap-8 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-red-500/20 bg-[#020202]/40 backdrop-blur-sm neuomorphic-flat">
              <span className="text-[10px] text-red-500 font-medium tracking-[0.2em] uppercase">Our Expertise</span>
            </div>

            <h3 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
              DATA.
              <br />
              <span className="text-red-500 tracking-[0.02em]">STRATEGY.</span>
              <br />
              IMPACT.
            </h3>

            <p className="mt-2 leading-relaxed text-zinc-400 text-sm md:text-base font-light tracking-wide">
              We combine cutting-edge data analytics with deep political insight to 
              deliver strategies that win elections and shape policy.
            </p>

            <div className="mt-6 space-y-3" role="list">
              {expertiseItems}
            </div>
          </motion.div>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-3 md:gap-4" role="list">
              <div className="space-y-3 md:space-y-4">
                {leftColumnItems}
              </div>
              <div className="space-y-3 md:space-y-4">
                {rightColumnItems}
              </div>
            </div>
            <div className="absolute -inset-4 border border-red-500/5 rounded-xl -z-10" aria-hidden="true" />
          </motion.div>
        </div>

        {/* Political Partners - with reduced bottom padding */}
        <div className="mt-16 md:mt-20">
          <PartyLogoLoop
            parties={partiesArray}
            speed={60}
            direction="left"
            height={50}
            gap={35}
            fadeOut={false}
            onPartyInteraction={(partyId) => {
              console.log(`Party selected: ${partyId}`);
            }}
          />
        </div>
      </div>
    </section>
  );
}
