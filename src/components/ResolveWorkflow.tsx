import { useState } from 'react';
import { ResolveStep } from '../types';
import {
  FolderOpen,
  Scissors,
  Film,
  Sparkles,
  Palette,
  Volume2,
  Send,
  Cpu
} from 'lucide-react';

export default function ResolveWorkflow() {
  const steps: ResolveStep[] = [
    {
      id: 'media',
      name: 'Media',
      tagline: 'Organizing Footage & Bins',
      description: 'Importing video clips, organizing project folders, tagging scenes, and preparing lightweight editing proxies for smooth timeline playback.',
      keyFeatures: ['Folder & Bin Organization', 'Clip Metadata Tagging', 'Editing Proxy Generation'],
      shortcut: 'Shift + 2',
      accentColor: 'border-blue-500 text-blue-400 bg-blue-500/10',
    },
    {
      id: 'cut',
      name: 'Cut',
      tagline: 'Fast Assembly & Trim',
      description: 'Quickly reviewing source clips, making fast ripple trims, and assembling the rough cut structure of a story.',
      keyFeatures: ['Source Tape Review', 'Quick Assembly Edits', 'Precision Trimming'],
      shortcut: 'Shift + 3',
      accentColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
    },
    {
      id: 'edit',
      name: 'Edit',
      tagline: 'Story Pacing & Fine Cut',
      description: 'The core editing timeline. Crafting narrative pacing, multi-track audio placement, J & L cuts, and refining the scene flow.',
      keyFeatures: ['Track-Based Editing', 'J & L Audio Transitions', 'Pacing & Speed Refinements'],
      shortcut: 'Shift + 4',
      accentColor: 'border-cyan-500 text-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'fusion',
      name: 'Fusion',
      tagline: 'Motion Graphics & Titles',
      description: 'Creating clean title cards, lower thirds, smooth text animations, and simple visual enhancements directly inside Resolve.',
      keyFeatures: ['Node-Based Graphics', 'Text & Title Animations', 'Clean Visual Touches'],
      shortcut: 'Shift + 5',
      accentColor: 'border-purple-500 text-purple-400 bg-purple-500/10',
    },
    {
      id: 'color',
      name: 'Color',
      tagline: 'Node Color Grading & Mood',
      description: 'Balancing shot exposure, setting tone and warmth, isolating skin tones, and creating a cohesive aesthetic across every scene.',
      keyFeatures: ['Primary Exposure & Balance', 'Skin Tone Adjustments', 'Node-Based Look Creation'],
      shortcut: 'Shift + 6',
      accentColor: 'border-red-500 text-red-400 bg-red-500/10',
    },
    {
      id: 'fairlight',
      name: 'Fairlight',
      tagline: 'Audio Mixing & Sound Design',
      description: 'Cleaning up dialogue audio, balancing music levels with voiceover, adding subtle sound effects, and polishing the final audio mix.',
      keyFeatures: ['Dialogue EQ & Noise Control', 'Audio Level Balancing', 'Background Music Ducking'],
      shortcut: 'Shift + 7',
      accentColor: 'border-amber-500 text-amber-400 bg-amber-500/10',
    },
    {
      id: 'deliver',
      name: 'Deliver',
      tagline: 'Export & File Delivery',
      description: 'Rendering final video files formatted for web, YouTube, or client sharing using optimized export settings.',
      keyFeatures: ['Custom Codec Presets', 'Web & Social Media Formats', 'Batch Render Queue'],
      shortcut: 'Shift + 8',
      accentColor: 'border-green-500 text-green-400 bg-green-500/10',
    },
  ];

  const [activeStepId, setActiveStepId] = useState<string>('color');

  const getIcon = (id: string) => {
    switch (id) {
      case 'media': return FolderOpen;
      case 'cut': return Scissors;
      case 'edit': return Film;
      case 'fusion': return Sparkles;
      case 'color': return Palette;
      case 'fairlight': return Volume2;
      case 'deliver': return Send;
      default: return Film;
    }
  };

  return (
    <section id="resolve" className="py-28 bg-black text-white relative overflow-hidden border-t border-white/5">
      {/* Soft Ambient Red Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Film Grain Subtle Texture Overlay (Identical to Hero & About) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-6 gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#e50914] opacity-90 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                DaVinci Resolve 21 Pipeline
              </span>
              <div className="hidden sm:block h-[1px] flex-grow mx-8 mb-1 bg-white opacity-10" />
              <div className="text-[10px] font-mono text-white/40">04 — 05</div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif italic text-white tracking-tight leading-none">
              DaVinci Resolve Workflow
            </h2>
          </div>
          <p className="text-neutral-400 font-mono text-xs max-w-sm">
            THE 7 OFFICIAL DAVINCI RESOLVE 21 WORKFLOW PAGES THAT POWER EVERY CUT.
          </p>
        </div>

        {/* Desktop Step Flow Horizontal Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-neutral-900/80 p-2 rounded-2xl border border-white/10">
          {steps.map((step) => {
            const Icon = getIcon(step.id);
            const isActive = activeStepId === step.id;
            return (
              <button
                key={step.id}
                id={`resolve-step-tab-${step.id}`}
                onClick={() => setActiveStepId(step.id)}
                className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-transparent text-white font-bold border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                    : 'text-neutral-400 hover:text-white bg-transparent border border-transparent hover:border-red-500/30 hover:shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-400' : 'text-neutral-400'}`} />
                <span className="text-xs uppercase tracking-wider font-mono font-semibold">{step.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
