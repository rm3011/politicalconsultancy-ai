'use client';

import { memo } from 'react';
import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';

const STATS_DATA = [
  {
    label: 'Campaigns Won',
    image:
      'https://d3i6fh83elv35t.cloudfront.net/static/2024/06/2024-06-04T145340Z_337282965_RC2E48AQ1GUP_RTRMADP_3_INDIA-ELECTION-MODI-1024x683.jpg',
    alt: 'Campaign success rate chart',
  },
  {
    label: 'States Covered',
    image:
      'https://i.pinimg.com/736x/11/db/89/11db89a9c535a9ec17c5c1e72cdd4703.jpg',
    alt: 'Voter data analysis',
  },
  {
    label: 'Success Rate',
    image:
      'https://cdn.magzter.com/1574404609/1704925421/articles/dNvNVvzsz85dRta3ERjsys/STALIN-LAUNCHES-DISTRIBUTION-OF-PONGAL-GIFT-TO-RICECARD-HOLDERS.jpg',
    alt: 'Client satisfaction metrics',
  },
  {
    label: 'Projects Completed',
    image:
      'https://amma.org/wp-content/uploads/thoothukudi-flood-relief_mata-amritanandamayi-math_04_1200x800-1024x683.jpg',
    alt: 'Completed projects showcase',
  },
] as const;

// Animation Variants
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: index * 0.1 },
  }),
};

const valueVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.1 + 0.2 },
  }),
};

// ============================================================
// STAT CARD COMPONENT
// ============================================================
const StatCard = memo(
  ({
    stat,
    index,
  }: {
    stat: (typeof STATS_DATA)[number];
    index: number;
  }) => (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl aspect-4/5 border border-red-500/10 hover:border-red-500/30 transition-all duration-500 neuomorphic-card-hover"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={stat.image}
          alt={stat.alt}
          fill
          quality={85}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Dark overlay - darker at bottom for text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-[#020202]/90 via-[#020202]/50 to-[#020202]/20 group-hover:from-[#020202]/80 transition-all duration-500" />

        {/* Red overlay on hover */}
        <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-all duration-500" />
      </div>

      {/* Decorative corner accents - Red theme */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-red-500/30 group-hover:border-red-500/60 transition-all duration-300" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-red-500/30 group-hover:border-red-500/60 transition-all duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-6 text-center">
        {/* Value */}
        <motion.p
          custom={index}
          variants={valueVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight leading-[1.1]"
        >
        </motion.p>

        {/* Label */}
        <p className="text-xs md:text-sm text-zinc-300 font-medium tracking-wide">
          {stat.label}
        </p>

        {/* Decorative line - Red theme */}
        <div className="w-12 h-px bg-red-500/30 group-hover:bg-red-500/60 transition-all duration-300 mt-3" />
      </div>
    </motion.div>
  )
);
StatCard.displayName = 'StatCard';

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Impacts() {
  return (
    <section
      id="impacts"
      className="py-12 md:py-20 relative overflow-hidden bg-[#020202]"
    >
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
      <div className="absolute inset-0 bg-red-500/2 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-red-500/20 bg-[#020202]/40 backdrop-blur-sm neuomorphic-flat mb-5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[10px] md:text-xs text-red-500 font-medium tracking-[0.2em] uppercase">
              Our Impact
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Measurable <span className="text-red-500">Results</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mt-4 text-sm md:text-base font-light tracking-wide">
            Real outcomes that drive political success across India.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS_DATA.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}