'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const stats = [
  { 
    label: 'Campaigns Won',
    image: 'https://d3i6fh83elv35t.cloudfront.net/static/2024/06/2024-06-04T145340Z_337282965_RC2E48AQ1GUP_RTRMADP_3_INDIA-ELECTION-MODI-1024x683.jpg',
    alt: 'Campaign success rate chart'
  },
  { 
    label: 'States Covered',
    image: 'https://cdn.dnaindia.com/sites/default/files/2018/10/07/740544-poll-bound-states.jpg',
    alt: 'Voter data analysis'
  },
  { 
    label: 'Success Rate',
    image: 'https://files.prokerala.com/news/photos/imgs/1024/polling-staff-carrying-evms-and-other-polling-1736913.jpg',
    alt: 'Client satisfaction metrics'
  },
  { 
    label: 'Projects Completed',
    image: 'https://image.slidesharecdn.com/roleofpoliticalconsultingfirminelections-210204094700/75/Role-of-Political-Consulting-Firm-in-Elections-1-2048.jpg',
    alt: 'Completed projects showcase'
  },
];

export default function Impacts() {
  return (
    <section id="impacts" className="py-12 md:py-20 relative overflow-hidden bg-[#020202]">
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-red-500/20 bg-[#020202]/40 backdrop-blur-sm neuomorphic-flat mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            <span className="text-[10px] md:text-xs text-red-500 font-medium tracking-[0.2em] uppercase">Our Impact</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Measurable{' '}
            <span className="text-red-500">Results</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mt-4 text-sm md:text-base font-light tracking-wide">
            Real outcomes that drive political success across India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] border border-red-500/10 hover:border-red-500/30 transition-all duration-500 neuomorphic-card-hover"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={stat.image}
                  alt={stat.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                  className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight leading-[1.1]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
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
          ))}
        </div>
      </div>
    </section>
  );
}