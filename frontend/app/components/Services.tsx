'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Brain, 
  Users, 
  TrendingUp, 
  BarChart3, 
  ArrowRight,
} from 'lucide-react';

const services = [
  {
    icon: Brain,
    title: 'Sentiment Analysis',
    description: 'Real-time analysis of political sentiment across all media platforms.',
    tag: 'Real-Time',
    gradient: 'from-red-500/20 to-rose-500/20',
    iconGradient: 'from-red-500 to-rose-500',
    image: 'https://cf-images.assettype.com/thequint/2026-05-11/8wuvm5jg/south-India-politicians.jpg?auto=format%2Ccompress&fmt=webp&width=720'
  },
  {
    icon: Users,
    title: 'Voter Analytics',
    description: 'Deep insights into voter behavior and preferences at every level.',
    tag: 'Data-Driven',
    gradient: 'from-red-500/20 to-orange-500/20',
    iconGradient: 'from-red-500 to-orange-500',
    image: 'https://english.cdn.zeenews.com/sites/default/files/2025/03/07/1692063-voters-tamil-nadu-pti.jpg'
  },
  {
    icon: TrendingUp,
    title: 'Campaign Strategy',
    description: 'Data-driven campaign strategies designed for maximum electoral impact.',
    tag: 'Strategic',
    gradient: 'from-red-500/20 to-pink-500/20',
    iconGradient: 'from-red-500 to-pink-500',
    image: 'https://images.mid-day.com/images/images/2026/mar/stalin-campaign-PTI-TN-news-news.jpg'
  },
  {
    icon: BarChart3,
    title: 'Trend Forecasting',
    description: 'Predict political trends with AI-powered predictive modeling.',
    tag: 'Predictive',
    gradient: 'from-red-500/20 to-purple-500/20',
    iconGradient: 'from-red-500 to-purple-500',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663184702328/4kNQvwwS2XFFrPSHwasfgs/blog-ai-political-intel-hero-XvuRcheH6xBukg8BVfqDE4.webp'
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-32 relative overflow-hidden bg-[#020202]">
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

      {/* Subtle background pattern - Red theme */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #dc2626 0%, transparent 50%)',
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with accent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-red-500/20 bg-[#020202]/40 backdrop-blur-sm neuomorphic-flat mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            <span className="text-[10px] md:text-xs text-red-500 font-medium tracking-[0.2em] uppercase">What We Do</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
            SOLUTIONS
            <span className="text-base md:text-lg lg:text-xl font-light text-zinc-400 mt-4 block tracking-wide">
              Comprehensive services for modern political campaigns
            </span>
          </h2>
        </motion.div>

        {/* Services Grid - Alternating Layout */}
        <div className="space-y-12 md:space-y-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`group flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 xl:gap-16 items-center`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative overflow-hidden rounded-2xl aspect-4/3 border border-red-500/10 group-hover:border-red-500/30 transition-all duration-500 bg-[#0a0a0a] neuomorphic-card-hover">
                  
                  {/* Image */}
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-linear-to-br ${service.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />

                  {/* Floating tag */}
                  <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-[#020202]/80 backdrop-blur-sm border border-red-500/20">
                    <span className="text-[10px] text-red-500 font-medium tracking-[0.15em] uppercase">{service.tag}</span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-all duration-500 z-10" />
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-4 md:space-y-5">
                {/* Number */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl md:text-5xl font-black text-red-500/10 group-hover:text-red-500/20 transition-colors duration-500 tracking-tight">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="h-px flex-1 bg-red-500/10 group-hover:bg-red-500/30 transition-all duration-500" />
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-linear-to-br ${service.iconGradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-red-500/10`}>
                  <service.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white group-hover:text-red-500 transition-colors duration-300 tracking-tight leading-[1.1]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-lg font-light tracking-wide">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-2 text-red-500 font-medium group/link hover:gap-4 transition-all duration-300 tracking-wide"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 