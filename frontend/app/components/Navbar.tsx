'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Who We Are', href: '/#about' },
  { name: 'What We Do', href: '/#services' },
  { name: 'Our Impacts', href: '/#impacts' },
] as const;

type NavLink = typeof NAV_LINKS[number];

// Animation variants moved outside component to prevent recreation
// Using proper Framer Motion easing types
const mobileMenuVariants = {
  initial: { 
    height: 0, 
    opacity: 0,
    scaleY: 0.8,
    transformOrigin: 'top'
  },
  animate: { 
    height: 'auto', 
    opacity: 1,
    scaleY: 1,
    transformOrigin: 'top',
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const, // Use string literal type
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    scaleY: 0.8,
    transformOrigin: 'top',
    transition: {
      duration: 0.25,
      ease: 'easeIn' as const // Use string literal type
    }
  }
};

const itemVariants = {
  initial: { 
    opacity: 0, 
    x: -20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: 'easeOut' as const // Use string literal type
    }
  },
  exit: { 
    opacity: 0, 
    x: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn' as const // Use string literal type
    }
  }
};

const useScrollState = (threshold = 50) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const next = window.scrollY > threshold;
      setScrolled(prev => prev === next ? prev : next);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  
  return scrolled;
};

const NavLinkItem = ({ link, isActive, isMobile = false, onClick }: { 
  link: NavLink; 
  isActive: boolean; 
  isMobile?: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={link.href}
    className={`
      relative px-2 md:px-3 py-2.5 md:py-0 
      text-[15px] md:text-[17px] lg:text-[18px] 
      font-medium transition-colors duration-200
      ${isActive ? 'text-red-500' : 'text-neutral-400 hover:text-white'}
      ${isMobile ? 'block w-full border-b border-red-600/5 last:border-0' : ''}
      focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
    `}
    onClick={onClick}
  >
    {link.name}
    {isActive && !isMobile && (
      <motion.div
        layoutId="navbar-indicator"
        className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-red-500 rounded-full shadow-[0_0_20px_rgba(255,0,0,0.5)]"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrollState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const menuRef = useRef<HTMLDivElement>(null);
  const isHomePage = pathname === '/';

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Scroll spy - improved with robust section detection
  useEffect(() => {
    // Only observe sections on home page
    if (!isHomePage) return;

    const sectionIds = ['hero', 'about', 'services', 'impacts'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    // Use IntersectionObserver with multiple thresholds for better detection
    const observer = new IntersectionObserver(
      () => {
        let current = 'hero';
        const viewportCenter = window.innerHeight * 0.35; // 35% from top

        // Find which section is most visible
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          
          // Section is considered active when its top is above viewport center
          // and its bottom is below viewport center
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            current = section.id;
            break;
          }
          
          // If we're past the last section, keep the last one active
          if (rect.top <= viewportCenter) {
            current = section.id;
          }
        }

        // Only update if changed to prevent unnecessary renders
        setActiveSection(prev => prev === current ? prev : current);
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for stability
        rootMargin: '-35% 0px -35% 0px' // Active when in the center 30% of viewport
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [isHomePage]);

  // Determine active state - single source of truth
  const isActive = (href: string) => {
    if (!isHomePage) {
      return pathname === href;
    }

    if (href === '/') {
      return activeSection === 'hero';
    }

    return activeSection === href.slice(2);
  };

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        px-3 md:px-6 lg:px-8 h-14 md:h-16 lg:h-18
        ${scrolled ? 'bg-[#141414]/95 backdrop-blur-md border-b border-white/5 shadow-lg' : 'bg-transparent'}
      `}>
        <div className="w-full h-full flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link 
            href="/" 
            className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
            onClick={closeMenu}
          >
            <div className="relative w-24 sm:w-28 md:w-32 lg:w-36 h-8 sm:h-10 md:h-11 lg:h-12">
              <Image src="/icon.png" alt="THE EDGE" fill priority className="object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-auto">
            {NAV_LINKS.map(link => (
              <NavLinkItem 
                key={link.name} 
                link={link} 
                isActive={isActive(link.href)}
                onClick={closeMenu}
              />
            ))}
            <Link 
              href="/contact" 
              prefetch
              className="ml-2 border-2 border-red-600 px-5 xl:px-6 py-1.5 xl:py-2 text-sm xl:text-base text-white font-semibold transition-all hover:bg-red-600/10 shadow-[0_0_25px_rgba(255,0,0,0.3)] hover:shadow-[0_0_50px_rgba(255,0,0,0.5)] whitespace-nowrap rounded-md group"
              onClick={closeMenu}
            >
              <span className="flex items-center gap-2">Get Started <span className="transition-transform duration-300 group-hover:translate-x-1">→</span></span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(open => !open)}
            className="lg:hidden w-10 h-10 rounded-lg bg-[#0a0a0a] border border-red-600/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 ml-2 shrink-0"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {isMobileMenuOpen && (
            <motion.div
              ref={menuRef}
              variants={mobileMenuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="lg:hidden overflow-hidden bg-[#141414]/98 backdrop-blur-lg border-t border-white/5"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={itemVariants}
                  >
                    <NavLinkItem 
                      link={link} 
                      isActive={isActive(link.href)} 
                      isMobile
                      onClick={closeMenu}
                    />
                  </motion.div>
                ))}
                <motion.div 
                  variants={itemVariants}
                  className="pt-4 mt-3 border-t border-white/5"
                >
                  <Link 
                    href="/contact" 
                    className="w-full px-6 py-3.5 border-2 border-red-600 text-white font-semibold text-base transition-all hover:bg-red-600/10 shadow-[0_0_30px_rgba(255,0,0,0.35)] flex items-center justify-center gap-2 rounded-md group"
                    onClick={closeMenu}
                  >
                    Get Started <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-14 md:h-16 lg:h-18" />
    </>
  );
}