import { useState, useEffect } from 'react';
import { Film } from '../types';
import { fetchFilms } from '../lib/api';
import { Play, Sparkles, Film as FilmIcon, Eye, Clock, Calendar, Filter, Flame } from 'lucide-react';
import VideoPlayerModal from './VideoPlayerModal';

interface FilmsShowcaseProps {
  onGlowTrigger?: () => void;
}

export default function FilmsShowcase({ onGlowTrigger }: FilmsShowcaseProps = {}) {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    setLoading(true);
    const data = await fetchFilms();
    setFilms(data);
    setLoading(false);
  };

  const genres = ['All', 'Short Film', 'Color Grading', 'Commercial', 'YouTube'];

  const filteredFilms = selectedGenre === 'All'
    ? films
    : films.filter((f) => f.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

  const featuredFilm = films.find((f) => f.featured) || films[0];

  return (
    <section id="films" className="py-28 bg-black text-white relative overflow-hidden border-t border-white/5">
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
        {/* Section Title & Divider Line (Editorial Aesthetic) */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-6 gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-xs uppercase tracking-[0.3em] font-mono font-bold text-[#e50914] opacity-90">
                Selected Works
              </h2>
              <div className="hidden sm:block h-[1px] flex-grow mx-8 mb-1 bg-white opacity-10" />
              <div className="text-[10px] font-mono text-white/40">01 — 05</div>
            </div>
            <h3 className="text-3xl sm:text-5xl font-serif italic text-white tracking-tight leading-none">
              Featured Short Films & Editing Reel
            </h3>
          </div>

          {/* Genre Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-neutral-900/80 p-1.5 border border-white/10 rounded-full">
            {genres.map((genre) => (
              <button
                key={genre}
                id={`genre-tab-${genre.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 text-[10px] uppercase font-mono tracking-widest transition-all duration-300 cursor-pointer rounded-full ${
                  selectedGenre === genre
                    ? 'bg-transparent text-white font-bold border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                    : 'text-neutral-400 hover:text-white bg-transparent border border-transparent hover:border-red-500/30 hover:shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Banner (Netflix Billboard Style) */}
        {featuredFilm && selectedGenre === 'All' && (
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 group shadow-2xl">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
              <img
                src={featuredFilm.thumbnailUrl}
                alt={featuredFilm.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105 filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
            </div>

            {/* Billboard Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12 space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-current" /> FEATURED RELEASE
                </span>
                <span className="text-neutral-300 font-mono text-xs">{featuredFilm.year}</span>
                <span className="text-neutral-300 font-mono text-xs">•</span>
                <span className="text-neutral-300 font-mono text-xs">{featuredFilm.duration}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase font-serif tracking-tight leading-none">
                {featuredFilm.title}
              </h3>

              <p className="text-neutral-300 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 font-sans font-light">
                {featuredFilm.description}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <button
                  id={`play-featured-${featuredFilm.id}`}
                  onClick={() => setSelectedFilm(featuredFilm)}
                  className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-xl hover:scale-105 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-black" />
                  <span>Watch Full Film</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Film Cards Grid (Netflix-inspired Hover Reveal) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-video rounded-2xl bg-neutral-900 animate-pulse border border-neutral-800" />
            ))}
          </div>
        ) : filteredFilms.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 font-mono space-y-2">
            <FilmIcon className="w-10 h-10 mx-auto text-neutral-700" />
            <p>No films found in this genre category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFilms.map((film) => (
              <div
                key={film.id}
                onClick={() => setSelectedFilm(film)}
                className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-red-500/50 transition-all duration-500 hover:scale-[1.03] shadow-xl hover:shadow-2xl hover:shadow-red-950/40 cursor-pointer flex flex-col justify-between"
              >
                {/* Film Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  <img
                    src={film.thumbnailUrl}
                    alt={film.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 filter contrast-105"
                  />
                  {/* Dark Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                  {/* Play Hover Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Genre Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-red-500 font-semibold uppercase tracking-wider">
                    {film.genre}
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded bg-black/90 text-[10px] font-mono text-neutral-300 flex items-center gap-1 border border-neutral-800">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>{film.duration}</span>
                  </div>
                </div>

                {/* Film Info Footer */}
                <div className="p-5 space-y-2 bg-gradient-to-b from-neutral-900 to-black">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors uppercase font-serif line-clamp-1">
                      {film.title}
                    </h4>
                    <span className="text-xs font-mono text-neutral-500">{film.year}</span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-sans font-light">
                    {film.description}
                  </p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span className="text-neutral-400">{film.role || 'Editor'}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-neutral-500" /> {film.views || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedFilm && (
        <VideoPlayerModal
          film={selectedFilm}
          onClose={() => setSelectedFilm(null)}
        />
      )}
    </section>
  );
}
