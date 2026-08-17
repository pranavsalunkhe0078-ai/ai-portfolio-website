import { MessageSquareQuote, Sparkles, Send } from 'lucide-react';

interface TestimonialsProps {
  onContact: () => void;
}

export default function Testimonials({ onContact }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-24 bg-black text-white relative overflow-hidden border-t border-white/5">
      {/* Soft Ambient Red Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Film Grain Subtle Texture Overlay (Identical to Hero & About) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4" />
            CLIENT FEEDBACK & REVIEWS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-serif tracking-tight">
            Collaborations & Testimonials
          </h2>
        </div>

        {/* Honest Tasteful Placeholder Card */}
        <div className="rounded-3xl bg-gradient-to-b from-neutral-900 to-black p-8 sm:p-12 border border-white/10 text-center space-y-6 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Red Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <p className="text-xl sm:text-3xl font-light text-neutral-200 font-serif italic max-w-3xl mx-auto leading-relaxed">
            "Currently building my portfolio. Looking forward to collaborating with passionate creators, directors, and brands."
          </p>

          <div className="space-y-1 font-mono text-xs text-neutral-400 pt-2">
            <div className="text-white font-bold uppercase tracking-wider">PRANAV SALUNKHE</div>
            <div className="text-neutral-500 text-[11px]">Directing • Editing • Color Grading</div>
          </div>

          <div className="pt-6">
            <button
              id="testimonials-collaborate-btn"
              onClick={onContact}
              className="px-8 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-black" />
              <span>Be My Next Collaborator</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
