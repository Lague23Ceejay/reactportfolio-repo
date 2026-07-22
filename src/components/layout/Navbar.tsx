// src/components/layout/Navbar.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';

type NavLink = { name: string; href: string };

export function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentDimension } = useThemeStore();

  const navLinks: NavLink[] = [
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#work' },
    { name: 'Memories', href: '#sandbox' },
    { name: 'Contact', href: '#contact' },
  ];

  const currentConfig = {
    cosmic: {
      headerScrolled: 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/50',
      headerUnscrolled: 'bg-zinc-950/50 backdrop-blur-sm border-b border-zinc-900/50',
      logo: 'hover:text-emerald-400 text-zinc-100',
      logoDot: 'text-emerald-500',
      linksDefault: 'text-zinc-400 hover:text-zinc-100',
      linksActiveMobile: 'hover:text-emerald-400 text-zinc-400',
      mobileMenuBg: 'bg-zinc-950/95 backdrop-blur-lg',
      hamburger: 'text-zinc-400 hover:text-zinc-100'
    },
    arctic: {
      headerScrolled: 'bg-[#0a0514]/80 backdrop-blur-md border-b border-[#B069DB]/40 shadow-[0_4px_20px_rgba(176,105,219,0.15)]',
      headerUnscrolled: 'bg-[#6E00B3] border-b border-[#B069DB]/30',
      logo: 'hover:text-cyan-400 text-slate-100 cursor-target',
      logoDot: 'text-[#B069DB] cursor-target',
      linksDefault: 'text-slate-400 hover:text-cyan-400 cursor-target',
      linksActiveMobile: 'hover:text-cyan-400 text-slate-400',
      mobileMenuBg: 'bg-[#030006]/95 backdrop-blur-lg',
      hamburger: 'text-slate-400 hover:text-[#B069DB]'
    },
    creamy: {
      headerScrolled: 'bg-[#FFFFC5] border-b border-stone-200/50 shadow-[0_4px_25px_rgba(255,238,140,0.5)] text-stone-900',
      headerUnscrolled: 'bg-[#FFFFC5] border-b border-stone-200/40',
      logo: 'hover:text-stone-900 text-stone-800',
      logoDot: 'text-rose-500',
      linksDefault: 'text-stone-600 hover:text-stone-900',
      linksActiveMobile: 'hover:text-stone-900 text-stone-600',
      mobileMenuBg: 'bg-[#FFFFC5]/98 backdrop-blur-lg',
      hamburger: 'text-stone-600 hover:text-stone-900'
    }
  }[currentDimension] ?? {
    headerScrolled: 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/50',
    headerUnscrolled: 'bg-zinc-950/50 backdrop-blur-sm border-b border-zinc-900/50',
    logo: 'hover:text-emerald-400 text-zinc-100',
    logoDot: 'text-emerald-500',
    linksDefault: 'text-zinc-400 hover:text-zinc-100',
    linksActiveMobile: 'hover:text-emerald-400 text-zinc-400',
    mobileMenuBg: 'bg-zinc-950/95 backdrop-blur-lg',
    hamburger: 'text-zinc-400 hover:text-zinc-100'
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
          scrolled ? `${currentConfig.headerScrolled} py-4` : `${currentConfig.headerUnscrolled} py-4`
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onMouseEnter={() => {
              /* small CSS-only rotation handled by class below if desired */
            }}
            className={`font-mono text-sm tracking-tight font-bold transition-colors inline-flex items-center gap-2 ${currentConfig.logo}`}
            aria-label="Home"
          >
            

            <span className="hidden sm:inline">Ceejay<span className={`${currentConfig.logoDot}`}>.dev</span></span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-mono font-medium">
            {navLinks.map((link) => {
              return (
                <div
                  key={link.name}
                  className="cursor-target inline-block"
                  data-cursor-color={currentDimension === 'arctic' ? 'var(--accent)' : undefined}
                >
                  <a
                    href={link.href}
                    className={`transition-colors ${currentConfig.linksDefault} px-1`}
                    aria-label={link.name}
                  >
                    <span className="relative inline-flex items-center">
                      <span className="pill-label">{link.name}</span>
                    </span>
                  </a>
                </div>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen((s) => !s)}
            className={`md:hidden flex flex-col gap-1.5 p-2 relative z-50 outline-none transition-colors ${currentConfig.hamburger}`}
            aria-label="Toggle navigation drawer"
            aria-expanded={isOpen}
          >
            <span className={`w-5 h-0.5 bg-current transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-opacity duration-200 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`fixed inset-0 z-30 md:hidden flex flex-col justify-start pt-32 px-8 pb-12 overflow-hidden h-screen w-screen ${currentConfig.mobileMenuBg}`}
            style={{ touchAction: 'none' }}
          >
            <nav className={`flex flex-col gap-8 tracking-tight w-full ${currentDimension === 'creamy' ? 'text-stone-800' : 'text-zinc-100'}`}>
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: idx * 0.04 }}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-3xl font-bold transition-colors font-sans w-fit ${currentConfig.linksActiveMobile}`}
                >
                  <div
                    className="cursor-target inline-block"
                    data-cursor-color={currentDimension === 'arctic' ? 'var(--accent)' : undefined}
                  >
                    {link.name}
                  </div>
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
