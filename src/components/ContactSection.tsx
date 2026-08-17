import { useState, useEffect, FormEvent } from 'react';
import { Mail, Instagram, Youtube, Send, CheckCircle2, MessageSquare, DollarSign, Sparkles } from 'lucide-react';
import { submitContact } from '../lib/api';

interface ContactSectionProps {
  presetService?: string;
}

export default function ContactSection({ presetService }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: presetService || 'Short Film Editing',
    budget: '₹25,000 - ₹50,000 ($300 - $600)',
    message: '',
  });

  useEffect(() => {
    if (presetService) {
      setFormData((prev) => ({ ...prev, projectType: presetService }));
    }
  }, [presetService]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in your name, email, and project message.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await submitContact(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        projectType: 'Short Film Editing',
        budget: '₹25,000 - ₹50,000 ($300 - $600)',
        message: '',
      });
    } catch (err) {
      setErrorMsg('Failed to send message. Please email directly at salunkhepranav2502@gmail.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 bg-black text-white relative overflow-hidden border-t border-white/5">
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
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-6 gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#e50914] opacity-90 flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                Let's Create Together
              </span>
              <div className="hidden sm:block h-[1px] flex-grow mx-8 mb-1 bg-white opacity-10" />
              <div className="text-[10px] font-mono text-white/40">05 — 05</div>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif italic text-white tracking-tight leading-none">
              Get In Touch
            </h2>
          </div>
          <p className="text-neutral-400 font-mono text-xs max-w-sm">
            HAVE A SHORT FILM, COMMERCIAL, OR YOUTUBE PROJECT IN MIND? LET'S DISCUSS VISUAL STYLE AND PACING.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Links & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-serif uppercase tracking-wide">
                Direct Channels
              </h3>
              <p className="text-neutral-400 text-sm font-sans font-light leading-relaxed">
                Feel free to drop a message through the contact form or reach out directly via Instagram, YouTube, or Email.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              {/* Email Card */}
              <a
                href="mailto:salunkhepranav2502@gmail.com"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    DIRECT EMAIL
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    salunkhepranav2502@gmail.com
                  </div>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href="https://instagram.com/pranavv___96"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    INSTAGRAM
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    @pranavv___96
                  </div>
                </div>
              </a>

              {/* YouTube Card */}
              <a
                href="https://www.youtube.com/channel/UCvRXoNBDixWtofhgxXwMaBw"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    YOUTUBE CHANNEL
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    Pranav Salunkhe
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-neutral-900/80 rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl relative">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white uppercase">
                  Message Sent Successfully!
                </h3>
                <p className="text-neutral-400 text-sm font-sans max-w-md mx-auto">
                  Thank you for reaching out. Pranav will review your project details and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs font-mono uppercase text-white transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-400 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Service / Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                    >
                      <option value="Short Film Editing">Short Film Editing</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Color Grading">Color Grading</option>
                      <option value="YouTube Editing">YouTube Editing</option>
                      <option value="Social Media Editing">Social Media Editing</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                      Estimated Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                    >
                      <option value="₹10,000 - ₹25,000 ($120 - $300)">₹10,000 - ₹25,000 ($120 - $300)</option>
                      <option value="₹25,000 - ₹50,000 ($300 - $600)">₹25,000 - ₹50,000 ($300 - $600)</option>
                      <option value="₹50,000 - ₹1,00,000 ($600 - $1200)">₹50,000 - ₹1,00,000 ($600 - $1200)</option>
                      <option value="₹1,00,000+ ($1200+)">₹1,00,000+ ($1200+)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Project Details & Vision *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your footage, deadline, and reference video style..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Sending Request...' : 'Send Inquiry To Pranav'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
