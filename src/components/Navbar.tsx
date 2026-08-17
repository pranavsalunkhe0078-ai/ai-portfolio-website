import { useState, useEffect } from 'react';
import { Film, FilmIcon, Lock, Menu, X, Play } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
}

export default function Navbar({ onNavigate, activeSection, onOpenAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'films', label: 'Films' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'resolve', label: 'DaVinci Workflow' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          className="group flex items-center gap-3 text-white focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
            <FilmIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-base sm:text-lg tracking-widest text-white uppercase group-hover:text-red-500 transition-colors">
              PRANAV SALUNKHE<span className="text-red-600">.</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-mono -mt-1">
              Filmmaker & Editor
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-full border border-white/10 backdrop-blur-lg">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                id={`nav-item-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-neutral-800/80 text-white border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.35)] font-semibold'
                    : 'text-neutral-300 hover:text-white bg-transparent hover:bg-neutral-800/40 border border-transparent hover:border-red-500/30 hover:shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            DaVinci Resolve 21
          </div>

          <button
            id="nav-hire-me-btn"
            onClick={() => handleLinkClick('contact')}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-medium text-xs tracking-wide border border-white/20 transition-all duration-300"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-neutral-800 px-4 py-6 space-y-3 mt-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === link.id
                  ? 'bg-red-600/20 text-red-500 border border-red-500/30'
                  : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-neutral-800">
            <button
              onClick={() => handleLinkClick('contact')}
              className="w-full text-center py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs tracking-wider uppercase"
            >
              Hire Me
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
