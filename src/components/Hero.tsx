import { useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Send, Clapperboard } from 'lucide-react';
import CursorGlow from './CursorGlow';

interface HeroProps {
  onWatchFilms: () => void;
  onHireMe: () => void;
}

export default function Hero({ onWatchFilms, onHireMe }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between items-center overflow-hidden pt-28 pb-12 px-4 sm:px-6"
    >
      {/* Soft Ambient Red Glow Layer */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Custom Cursor Light Glow */}
      <CursorGlow containerRef={containerRef} />

      {/* Film Grain Subtle Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top Tagline Badge / Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-20 mt-4 mb-2 uppercase tracking-[0.4em] text-[11px] text-[#e50914] font-mono font-bold opacity-90 flex items-center gap-2"
      >
        <Clapperboard className="w-3.5 h-3.5 text-[#e50914]" />
        <span>PORTFOLIO 2026</span>
      </motion.div>

      {/* Main Content Area */}
      <div className="z-20 max-w-5xl mx-auto text-center space-y-8 my-auto py-8">
        <motion.h1
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif italic mb-6 leading-[1.05] tracking-tight text-white text-balance"
        >
          Crafting Stories <br />
          <span className="not-italic font-sans font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-red-500/90 text-4xl sm:text-6xl md:text-7xl block mt-2 tracking-widest">
            Through Every Frame
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl font-light text-neutral-400 tracking-[0.15em] font-sans max-w-2xl mx-auto uppercase"
        >
          Filmmaker <span className="text-[#e50914] px-1.5">•</span> Video Editor{' '}
          <span className="text-[#e50914] px-1.5">•</span> DaVinci Resolve 21
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
        >
          <button
            id="hero-watch-films-btn"
            onClick={onWatchFilms}
            className="group w-full sm:w-auto px-8 py-3.5 border border-white/20 hover:border-white transition-all duration-300 text-[11px] uppercase tracking-[0.2em] font-mono bg-white/5 backdrop-blur-sm text-white flex items-center justify-center gap-3 cursor-pointer shadow-2xl hover:bg-white/10"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#e50914] group-hover:scale-110 transition-transform" />
            <span>🎬 Watch My Films</span>
          </button>

          <button
            id="hero-hire-me-btn"
            onClick={onHireMe}
            className="group w-full sm:w-auto px-8 py-3.5 border border-white/20 hover:border-white transition-all duration-300 text-[11px] uppercase tracking-[0.2em] font-mono text-white flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-900"
          >
            <Send className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#e50914] transition-colors" />
            <span>🤝 Hire Me</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="z-20 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-mono pt-8 border-t border-white/5 gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span>AVAILABLE FOR DIRECTING & COLOR GRADING</span>
        </div>

        <div className="hidden sm:block">
          <span>SUITE: DAVINCI RESOLVE 21 • EDIT & COLOR</span>
        </div>
      </motion.div>

      {/* Subtle Letterbox Cinema Bars Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600/40 to-transparent pointer-events-none" />
    </section>
  );
}
