import { Lock, Instagram, Youtube, Mail, Film } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onOpenAdmin, onNavigate }: FooterProps) {
  return (
    <footer className="bg-black text-neutral-400 py-16 border-t border-white/10 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-bold tracking-widest text-base uppercase font-serif">
                PRANAV SALUNKHE<span className="text-red-600">.</span>
              </div>
              <div className="text-[10px] font-mono uppercase text-neutral-500">
                Filmmaker • Video Editor
              </div>
            </div>
          </div>

          {/* Nav Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-400">
            <button onClick={() => onNavigate('films')} className="hover:text-white transition-colors">
              Films
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
              Services
            </button>
            <button onClick={() => onNavigate('resolve')} className="hover:text-white transition-colors">
              Resolve Workflow
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
              Contact
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/pranavv___96"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Instagram: @pranavv___96"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCvRXoNBDixWtofhgxXwMaBw"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="YouTube Channel"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="mailto:salunkhepranav2502@gmail.com"
              className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Email: salunkhepranav2502@gmail.com"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* DaVinci Resolve Workflow Ribbon (Editorial Aesthetic) */}
        <div className="hidden lg:flex items-center justify-center gap-4 py-4 border-y border-white/5 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
          <span className="hover:text-white transition-colors">Media</span>
          <span className="text-neutral-700">→</span>
          <span className="hover:text-white transition-colors">Cut</span>
          <span className="text-neutral-700">→</span>
          <span className="hover:text-white transition-colors">Edit</span>
          <span className="text-neutral-700">→</span>
          <span className="hover:text-white transition-colors">Fusion</span>
          <span className="text-neutral-700">→</span>
          <span className="text-[#e50914] font-bold">Color</span>
          <span className="text-neutral-700">→</span>
          <span className="hover:text-white transition-colors">Fairlight</span>
          <span className="text-neutral-700">→</span>
          <span className="hover:text-white transition-colors">Deliver</span>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4">
          <div>
            © 2026 Pranav Salunkhe. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>DaVinci Resolve 21 Pipeline</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
