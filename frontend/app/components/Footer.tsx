'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

// SVG Social Icons
const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Impacts', href: '/#impacts' },
  { name: 'S-AI', href: '/s-ai' },
  { name: 'Contact', href: '/contact' },
];

const services = [
  'Sentiment Analysis',
  'Voter Analytics',
  'Campaign Strategy',
  'Risk Assessment',
  'Trend Forecasting',
  'AI Chat Assistant',
];

const socialLinks = [
  { 
    name: 'Twitter', 
    href: '#', 
    icon: TwitterIcon,
    color: 'hover:text-[#1DA1F2]'
  },
  { 
    name: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/johnsolomonnevas', 
    icon: LinkedinIcon,
    color: 'hover:text-[#0A66C2]'
  },
  { 
    name: 'YouTube', 
    href: 'https://www.youtube.com/@TheEdgewithJohn',
    icon: YoutubeIcon,
    color: 'hover:text-[#FF0000]'
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#020202] border-t border-red-500/10 overflow-hidden">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
      
      {/* Subtle textured background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-red-500/[0.02] blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-3">
                <div className="w-30 h-12 rounded-xxl bg-transparent flex items-center justify-center shadow-red-500/20">
                  <img src="/logo-final.png" alt="THE EDGE WITH JOHN" className="h-12 w-auto" />
                </div>
              </div>
            </Link>
            
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs font-light tracking-wide">
              AI-powered political intelligence and campaign analytics platform for modern political campaigns.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-9 h-9 rounded-full bg-[#0a0a0a] border border-red-500/10 flex items-center justify-center text-zinc-400 ${social.color} hover:border-red-500/30 transition-all duration-300 hover:scale-110`}
                >
                  <social.icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-[0.15em] uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 hover:text-red-500 transition-colors duration-300 text-sm flex items-center gap-2 group tracking-wide"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-500/30 group-hover:bg-red-500 transition-colors duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-[0.15em] uppercase">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-zinc-400 text-sm hover:text-red-500 transition-colors duration-300 cursor-default flex items-center gap-2 group tracking-wide">
                    <span className="w-1 h-1 rounded-full bg-red-500/20 group-hover:bg-red-500/50 transition-colors duration-300" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-[0.15em] uppercase">
              Contact Us
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-red-500" />
                </div>
                <Link href="mailto:theedgewithjohn@gmail.com">
                  <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 tracking-wide">
                    theedgewithjohn@gmail.com
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-red-500/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 text-center md:text-left tracking-wide">
            &copy; {new Date().getFullYear()} NEVAS Technologies Pvt Ltd. All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs">
            <Link href="#" className="text-zinc-500 hover:text-zinc-400 transition-colors duration-300 tracking-wide">
              Privacy Policy
            </Link>
            <span className="w-px h-3 bg-red-500/10 hidden sm:block" />
            <Link href="#" className="text-zinc-500 hover:text-zinc-400 transition-colors duration-300 tracking-wide">
              Terms of Service
            </Link>
            <span className="w-px h-3 bg-red-500/10 hidden sm:block" />
            <Link href="#" className="text-zinc-500 hover:text-zinc-400 transition-colors duration-300 tracking-wide">
              Cookie Policy
            </Link>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-500 transition-colors duration-300 group tracking-wide"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
}