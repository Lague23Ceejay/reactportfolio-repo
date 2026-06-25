import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { currentDimension } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#work' },
    { name: 'Memories', href: '#sandbox' },
    { name: 'Contact', href: '#contact' },
  ];

  const currentConfig = {
    cosmic: {
      headerScrolled: 'bg-zinc-950/70 backdrop-blur-md border-b border-zinc-900/50',
      headerUnscrolled: 'bg-transparent',
      logo: 'hover:text-emerald-400 text-zinc-100',
      logoDot: 'text-emerald-500',
      linksDefault: 'text-zinc-400 hover:text-zinc-100',
      linksActiveMobile: 'hover:text-emerald-400 text-zinc-400',
      mobileMenuBg: 'bg-zinc-950/95 backdrop-blur-lg',
      hamburger: 'text-zinc-400 hover:text-zinc-100'
    },
    arctic: {
      headerScrolled: 'bg-[#0a0514]/80 backdrop-blur-md border-b border-[#B069DB]/40 shadow-[0_4px_20px_rgba(176,105,219,0.15)]',
      headerUnscrolled: 'bg-[#6E00B3]',
      logo: 'hover:text-cyan-400 text-slate-100',
      logoDot: 'text-[#B069DB]',
      linksDefault: 'text-slate-400 hover:text-cyan-400',
      linksActiveMobile: 'hover:text-cyan-400 text-slate-400',
      mobileMenuBg: 'bg-[#030006]/95 backdrop-blur-lg border-b border-[#B069DB]/30',
      hamburger: 'text-slate-400 hover:text-[#B069DB]'
    },
    creamy: {
      headerScrolled: 'bg-[#FFFFC5] border-b border-stone-200/50 shadow-[0_4px_25px_rgba(255,238,140,0.5)] text-stone-900',
      headerUnscrolled: 'bg-[#FFFFC5]', 
      logo: 'hover:text-stone-900 text-stone-800',
      logoDot: 'text-rose-500',
      linksDefault: 'text-stone-600 hover:text-stone-900',
      linksActiveMobile: 'hover:text-stone-900 text-stone-600',
      mobileMenuBg: 'bg-[#FFFFC5]/98 backdrop-blur-lg',
      hamburger: 'text-stone-600 hover:text-stone-900'
    }
  }[currentDimension] || {
    headerScrolled: 'bg-zinc-950/70 backdrop-blur-md border-b border-zinc-900/50',
    headerUnscrolled: 'bg-transparent',
    logo: 'hover:text-emerald-400 text-zinc-100',
    logoDot: 'text-emerald-500',
    linksDefault: 'text-zinc-400 hover:text-zinc-100',
    linksActiveMobile: 'hover:text-emerald-400 text-zinc-400',
    mobileMenuBg: 'bg-zinc-950/95 backdrop-blur-lg',
    hamburger: 'text-zinc-400 hover:text-zinc-100'
  };

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? `${currentConfig.headerScrolled} py-4` : `${currentConfig.headerUnscrolled} py-6`
      }`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <a href="#" className={`font-mono text-sm tracking-tight font-bold transition-colors ${currentConfig.logo}`}>
            Cejay<span className={`transition-colors ${currentConfig.logoDot}`}>.dev</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-mono font-medium">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`transition-colors ${currentConfig.linksDefault}`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden flex flex-col gap-1.5 p-2 relative z-50 outline-none transition-colors ${currentConfig.hamburger}`}
            aria-label="Toggle navigation drawer"
          >
            <span className={`w-5 h-0.5 bg-current transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-opacity duration-200 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-current transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-30 md:hidden flex flex-col justify-center p-8 ${currentConfig.mobileMenuBg}`}
          >
            <nav className={`flex flex-col gap-6 text-2xl font-bold tracking-tight ${
              currentDimension === 'creamy' ? 'text-stone-800' : 'text-zinc-400'
            }`}>
              {navLinks.map((link, idx) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`transition-colors font-sans ${currentConfig.linksActiveMobile}`}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
