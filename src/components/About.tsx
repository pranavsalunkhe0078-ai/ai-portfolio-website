import { useState, useEffect } from 'react';
import { fetchAboutPhoto } from '../lib/api';

export default function About() {
  const [photoUrl, setPhotoUrl] = useState('/src/assets/images/pranav_portrait_1786121160560.jpg');

  useEffect(() => {
    let isMounted = true;
    fetchAboutPhoto().then((url) => {
      if (isMounted && url) {
        setPhotoUrl(url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="about" className="py-28 bg-black text-white relative overflow-hidden border-t border-white/5">
      {/* Soft Ambient Red Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Film Grain Subtle Texture Overlay (Identical to Hero) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 border-b border-white/10 pb-6 gap-4">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#e50914] opacity-90">
                Director's Statement
              </span>
              <div className="hidden sm:block h-[1px] flex-grow mx-8 mb-1 bg-white opacity-10" />
              <div className="text-[10px] font-mono text-white/40">02 — 05</div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif italic text-white tracking-tight leading-none">
              About Pranav Salunkhe
            </h2>
          </div>
          <p className="text-neutral-400 font-mono text-xs max-w-xs text-left md:text-right">
            PASSIONATE ABOUT VISUAL TONE, EDITING RHYTHM, AND EMOTIONAL RESONANCE.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Portrait Photo with Dark Gradient Overlay */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 aspect-[3/4]">
              <img
                src={photoUrl}
                alt="Pranav Salunkhe — Filmmaker & Video Editor"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter contrast-105"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Bottom Image Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>PRANAV SALUNKHE</span>
                  <span className="text-red-500">REMOTE</span>
                </div>
                <div className="text-neutral-400 text-[11px]">
                  Filmmaker • Video Editor
                </div>
              </div>
            </div>

            {/* Subtle Frame Accent */}
            <div className="absolute -inset-2 rounded-3xl border border-red-600/20 pointer-events-none -z-10 group-hover:border-red-600/40 transition-colors" />
          </div>

          {/* Right Column: Editorial Storytelling Copy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6 text-neutral-300 text-base sm:text-lg leading-relaxed font-sans">
              <p className="text-xl sm:text-2xl font-light text-white leading-snug border-l-2 border-red-600 pl-4 font-serif italic">
                "I'm Pranav Salunkhe, a filmmaker who believes every frame should make people feel something. I'm constantly learning, experimenting, and creating stories through editing and filmmaking."
              </p>

              <p>
                My philosophy centers on visual restraint and emotional rhythm. Editing isn't merely stringing clips together on a timeline—it's shaping pacing, sound design, and color tonality to construct immersive cinematic worlds. Whether working on a dramatic short film, a high-impact commercial, or a polished YouTube documentary, I craft each cut with deliberate purpose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

