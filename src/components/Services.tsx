import { Film, Palette, Youtube, Smartphone, Scissors, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ServicesProps {
  onInquire: (serviceName: string) => void;
}

export default function Services({ onInquire }: ServicesProps) {
  const servicesList = [
    {
      id: 'short-film',
      title: 'Short Film Editing',
      icon: Film,
      shortDesc: 'Narrative pacing, emotional rhythm, and structural story assembly for short cinema.',
      fullDesc: 'Building dramatic tension through precise cuts, scene transitions, and character beats.',
      deliverables: ['Assembly & Rough Cut', 'Fine Edit & Pace Shaping', 'XML / AAF Timeline Export'],
      tools: ['DaVinci Resolve 21', 'Edit Page'],
    },
    {
      id: 'video-editing',
      title: 'Video Editing',
      icon: Scissors,
      shortDesc: 'Commercial, corporate, and narrative editing built for clarity and story flow.',
      fullDesc: 'Transforming raw video clips into polished, cohesive visual stories.',
      deliverables: ['Multi-camera sync', 'Title cards & graphics', 'Audio cleanup & balancing'],
      tools: ['DaVinci Resolve 21', 'Fairlight'],
    },
    {
      id: 'color-grading',
      title: 'Color Grading',
      icon: Palette,
      shortDesc: 'Node-based color passes, shot matching, mood setting, and clean skin tone correction.',
      fullDesc: 'Establishing custom color palettes and mood mapping in Rec.709 color space.',
      deliverables: ['Primary & Secondary Nodes', 'Shot-to-Shot Matching', 'Custom Look Styles'],
      tools: ['DaVinci Color Page', 'Rec.709'],
    },
    {
      id: 'youtube-editing',
      title: 'YouTube Editing',
      icon: Youtube,
      shortDesc: 'High-retention editorial storytelling for tech, travel, and essay content creators.',
      fullDesc: 'Engaging hook edits, fast B-roll pacing, lower thirds, and animated Fusion titles.',
      deliverables: ['Retention-optimized hook', 'Custom thumbnail concepts', 'SFX & music ducking'],
      tools: ['DaVinci Fusion', 'DaVinci Resolve'],
    },
    {
      id: 'social-editing',
      title: 'Social Media Editing',
      icon: Smartphone,
      shortDesc: 'Vertical 9:16 high-impact reels, TikToks, and Shorts engineered to capture attention instantly.',
      fullDesc: 'Dynamic motion captions, kinetic transitions, and rhythm-synced beats for maximum reach.',
      deliverables: ['9:16 & 4:5 vertical cuts', 'Animated subtitles', 'Sound design & mixing'],
      tools: ['DaVinci Cut Page', 'DaVinci Resolve'],
    },
  ];

  return (
    <section id="services" className="py-28 bg-black text-white relative overflow-hidden border-t border-white/5">
      {/* Soft Ambient Red Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Film Grain Subtle Texture Overlay (Identical to Hero & About) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-6 gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#e50914] opacity-90">
                Post Production Capabilities
              </span>
              <div className="hidden sm:block h-[1px] flex-grow mx-8 mb-1 bg-white opacity-10" />
              <div className="text-[10px] font-mono text-white/40">03 — 05</div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif italic text-white tracking-tight leading-none">
              Services Offered
            </h2>
          </div>
          <p className="text-neutral-400 font-mono text-xs max-w-sm">
            END-TO-END EDITORIAL, COLOR GRADING, AND SOUND DESIGN WORKFLOWS FOR FILMMAKERS AND CREATORS.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="group relative rounded-2xl bg-neutral-900/60 p-8 border border-white/10 hover:border-red-500/50 transition-all duration-500 hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-red-950/30 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Top Bar Icon & Number */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-neutral-600 font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white font-serif uppercase tracking-wide group-hover:text-red-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-neutral-300 leading-relaxed font-sans font-light">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Key Deliverables */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
                      DELIVERABLES
                    </span>
                    <ul className="space-y-1.5">
                      {service.deliverables.map((item, i) => (
                        <li key={i} className="text-xs text-neutral-400 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Tools & Action CTA */}
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {service.tools.slice(0, 2).map((tool, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-black text-[10px] font-mono text-neutral-400 border border-neutral-800"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <button
                    id={`inquire-service-${service.id}`}
                    onClick={() => onInquire(service.title)}
                    className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-red-600 transition-all cursor-pointer"
                    title={`Inquire about ${service.title}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
