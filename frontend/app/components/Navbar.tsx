'use client';

import { useState, useEffect, useCallback, useMemo, memo, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// ============================================================================
// Constants
// ============================================================================

const SCROLL_THRESHOLD = 50;
const NAVIGATION_DEBOUNCE_MS = 300;

interface NavLink {
  name: string;
  href: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Who We Are', href: '/#about' },
  { name: 'What We Do', href: '/#services' },
  { name: 'Our Impacts', href: '/#impacts' },
] as const;

// ============================================================================
// Sub-components
// ============================================================================

const NavLinkItem = memo(({
  link,
  isActive,
  isMobile = false,
  onNavigate,
  onClose,
}: {
  link: NavLink;
  isActive: boolean;
  isMobile?: boolean;
  onNavigate: (href: string) => void;
  onClose?: () => void;
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(link.href);
    if (isMobile && onClose) {
      onClose();
    }
  }, [link.href, onNavigate, isMobile, onClose]);

  return (
    <Link
      href={link.href}
      className={`
        relative px-2 md:px-3 py-2.5 md:py-0 
        text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] 
        font-medium transition-all duration-200
        ${isActive 
          ? 'text-red-500' 
          : 'text-neutral-400 hover:text-white'
        }
        ${isMobile ? 'block w-full border-b border-red-600/5 last:border-0' : ''}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020202]
      `}
      aria-current={isActive ? 'page' : undefined}
      prefetch={link.href === '/' ? true : undefined}
      onClick={handleClick}
    >
      {link.name}
      {isActive && !isMobile && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-red-500 rounded-full shadow-[0_0_20px_rgba(255,0,0,0.5)]"
          transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
        />
      )}
      {isActive && isMobile && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_20px_rgba(255,0,0,0.5)]" />
      )}
    </Link>
  );
});

NavLinkItem.displayName = 'NavLinkItem';

// ============================================================================
// Custom Hooks
// ============================================================================

/**
 * Hook to manage scroll state with throttling for reliability
 * Fixed: No setState in useEffect body
 */
function useScrollState(threshold: number): boolean {
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (timeoutRef.current) return;
      
      timeoutRef.current = setTimeout(() => {
        const shouldBeScrolled = window.scrollY > threshold;
        setScrolled(shouldBeScrolled);
        timeoutRef.current = null;
      }, 30);
    };

    // Set initial state using useLayoutEffect instead
    // We'll handle this with a separate effect or use a ref
    if (!isInitializedRef.current) {
      // Use a timeout to avoid setState during render
      const initialTimeout = setTimeout(() => {
        setScrolled(window.scrollY > threshold);
        isInitializedRef.current = true;
      }, 0);
      
      return () => {
        clearTimeout(initialTimeout);
        window.removeEventListener('scroll', handleScroll);
      };
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return scrolled;
}

/**
 * Hook to manage mobile menu with body scroll lock
 * Fixed: No setState in useEffect
 */
function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  // Close menu on route change - using useLayoutEffect to avoid setState during render
  useLayoutEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      // Use a timeout to avoid setState during render
      const timeoutId = setTimeout(() => {
        setIsOpen(false);
        previousPathnameRef.current = pathname;
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  // Lock body scroll when menu is open
  useLayoutEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, { capture: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
    };
  }, [isOpen]);

  return { isOpen, setIsOpen, menuRef };
}

/**
 * Hook to manage active navigation state with scroll-spy
 */
function useActiveNavigation(pathname: string) {
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isNavigatingRef = useRef(false);

  // Function to check which section is active
  const checkActiveSection = useCallback(() => {
    if (typeof window === 'undefined' || pathname !== '/') return;
    
    const scrollY = window.scrollY;
    
    if (scrollY < SCROLL_THRESHOLD) {
      setActiveHash(null);
      return;
    }

    const sections = NAV_LINKS
      .filter((link) => link.href.startsWith('/#'))
      .map((link) => ({
        id: link.href.split('#')[1],
        element: document.getElementById(link.href.split('#')[1])
      }))
      .filter((item): item is { id: string; element: HTMLElement } => 
        Boolean(item.element)
      );

    for (const section of sections) {
      const rect = section.element.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 100) {
        setActiveHash(`#${section.id}`);
        return;
      }
    }
  }, [pathname]);

  // Handle navigation clicks
  const handleNavigate = useCallback((href: string) => {
    const hash = href.includes('#') ? `#${href.split('#')[1]}` : null;
    setActiveHash(hash);
    
    if (hash) {
      isNavigatingRef.current = true;
      setTimeout(() => {
        isNavigatingRef.current = false;
        checkActiveSection();
      }, NAVIGATION_DEBOUNCE_MS);
    } else {
      setActiveHash(null);
    }
  }, [checkActiveSection]);

  // Check if a link is active
  const isActive = useCallback((href: string): boolean => {
    if (pathname !== '/') {
      return href === '/';
    }
    
    if (href === '/') {
      return !activeHash;
    }
    
    if (href.startsWith('/#')) {
      const hash = `#${href.split('#')[1]}`;
      return activeHash === hash;
    }
    
    return pathname === href;
  }, [pathname, activeHash]);

  // Setup scroll-spy observer
  useEffect(() => {
    if (typeof window === 'undefined' || pathname !== '/') {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const sections = NAV_LINKS
      .filter((link) => link.href.startsWith('/#'))
      .map((link) => document.getElementById(link.href.split('#')[1]))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current) return;

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const rectA = a.boundingClientRect;
            const rectB = b.boundingClientRect;
            return Math.abs(rectA.top) - Math.abs(rectB.top);
          });

        if (visibleEntries.length > 0) {
          const targetId = visibleEntries[0].target.id;
          setActiveHash(`#${targetId}`);
        } else {
          checkActiveSection();
        }
      },
      {
        rootMargin: '-20% 0px -30% 0px',
        threshold: [0, 0.1, 0.3, 0.5],
      }
    );

    sections.forEach((el) => observerRef.current!.observe(el));

    // Add scroll listener as fallback for Home detection
    const handleScrollFallback = () => {
      if (isNavigatingRef.current) return;
      
      const scrollY = window.scrollY;
      if (scrollY < SCROLL_THRESHOLD) {
        setActiveHash(null);
      }
    };

    window.addEventListener('scroll', handleScrollFallback, { passive: true });

    // Initial check
    const initialCheckTimeout = setTimeout(() => {
      checkActiveSection();
    }, 100);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      clearTimeout(initialCheckTimeout);
      window.removeEventListener('scroll', handleScrollFallback);
    };
  }, [pathname, checkActiveSection]);

  return { activeHash, handleNavigate, isActive };
}

// ============================================================================
// Main Component
// ============================================================================

export default function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrollState(SCROLL_THRESHOLD);
  const { isOpen, setIsOpen, menuRef } = useMobileMenu();
  const { handleNavigate, isActive } = useActiveNavigation(pathname);

  const navLinks = useMemo(() => NAV_LINKS, []);
  
  const desktopNavLinks = useMemo(() => 
    navLinks.map((link) => (
      <NavLinkItem
        key={link.name}
        link={link}
        isActive={isActive(link.href)}
        onNavigate={handleNavigate}
      />
    )),
    [navLinks, isActive, handleNavigate]
  );

  const mobileNavLinks = useMemo(() =>
    navLinks.map((link) => (
      <NavLinkItem
        key={link.name}
        link={link}
        isActive={isActive(link.href)}
        isMobile
        onNavigate={handleNavigate}
        onClose={() => setIsOpen(false)}
      />
    )),
    [navLinks, isActive, handleNavigate, setIsOpen]
  );

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 
          transition-all duration-300 
          px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 
          h-14 sm:h-16 md:h-18 lg:h-20
          ${scrolled
            ? 'bg-[#141414]/95 backdrop-blur-md border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent'
          }
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="THE EDGE WITH JOHN - Political Consultancy - Home"
            className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020202] rounded"
            onClick={() => handleNavigate('/')}
          >
            <div className="relative w-20 sm:w-25 md:w-30 lg:w-35 h-8 sm:h-10 md:h-12 lg:h-14">
              <Image
                src="/logo-final.png"
                alt="THE EDGE"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 600px) 80px, (max-width: 768px) 100px, (max-width: 1024px) 120px, (max-width: 1280px) 140px, 160px"
                quality={100}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-3 lg:gap-4 2xl:gap-6 ml-auto">
            {desktopNavLinks}

            <Link href="/contact" prefetch>
              <button
                className="
                  border-2 border-red-600 px-5 sm:px-6 lg:px-7 py-1.5 sm:py-2 lg:py-2.5 
                  text-sm sm:text-base lg:text-lg tracking-wider 
                  text-white font-semibold 
                  transition-all duration-300 
                  hover:bg-red-600/10 
                  shadow-[0_0_25px_rgba(255,0,0,0.3)] hover:shadow-[0_0_50px_rgba(255,0,0,0.5)] 
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020202]
                  whitespace-nowrap relative overflow-hidden group rounded-md
                "
                aria-label="Get Started"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </span>
                <span className="absolute inset-0 bg-linear-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="
              xl:hidden w-10 h-10 sm:w-11 sm:h-11 
              rounded-lg bg-[#0a0a0a] border border-red-600/10 
              flex items-center justify-center 
              text-zinc-400 hover:text-white hover:border-red-600/30 
              transition-all duration-300 
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020202]
              shrink-0 ml-2
            "
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-menu"
          >
            {isOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              ref={menuRef}
              id="mobile-nav-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="
                xl:hidden overflow-hidden 
                bg-[#141414]/98 backdrop-blur-lg 
                border-t border-white/5 
                mt-0.5 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8
              "
              role="menu"
              aria-label="Mobile navigation"
            >
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 space-y-1">
                {mobileNavLinks}

                <div className="pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-white/5">
                  <Link 
                    href="/contact" 
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020202] rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <button
                      className="
                        w-full px-6 py-3.5 sm:py-4 
                        border-2 border-red-600 
                        text-white font-semibold text-base sm:text-lg 
                        transition-all duration-300 
                        hover:bg-red-600/10 
                        shadow-[0_0_30px_rgba(255,0,0,0.35)] hover:shadow-[0_0_50px_rgba(255,0,0,0.5)] 
                        focus:outline-none 
                        flex items-center justify-center gap-2 rounded-md
                      "
                      aria-label="Get Started"
                    >
                      Get Started
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer to prevent content from hiding behind navbar */}
      <div className="h-14 sm:h-16 md:h-18 lg:h-20" />
    </>
  );
}