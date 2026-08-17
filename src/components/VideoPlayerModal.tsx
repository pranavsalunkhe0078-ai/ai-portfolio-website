import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Film } from '../types';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Sparkles, Clock, Eye, Film as FilmIcon } from 'lucide-react';
import { trackFilmView } from '../lib/api';

interface VideoPlayerModalProps {
  film: Film | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ film, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('00:00');
  const [durationStr, setDurationStr] = useState('00:00');
  const [volume, setVolume] = useState(1);
  const [viewsCount, setViewsCount] = useState<number>(0);

  useEffect(() => {
    if (film) {
      setViewsCount(film.views || 0);
      // Track view count
      trackFilmView(film.id).then((newViews) => {
        if (newViews > 0) setViewsCount(newViews);
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [film]);

  if (!film) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setProgress((cur / dur) * 100);

      const formatTime = (timeInSec: number) => {
        const mins = Math.floor(timeInSec / 60);
        const secs = Math.floor(timeInSec % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      setCurrentTimeStr(formatTime(cur));
      if (!isNaN(dur)) {
        setDurationStr(formatTime(dur));
      }
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && videoRef.current.duration) {
      const seekTo = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTo;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch((err) => console.error(err));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden">
      {/* Top Header Controls */}
      <div className="p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-900/50">
            <FilmIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide font-serif">{film.title}</h3>
            <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
              <span className="text-red-500 font-semibold">{film.genre}</span>
              <span>•</span>
              <span>{film.year}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-neutral-400" /> {viewsCount} views
              </span>
            </div>
          </div>
        </div>

        <button
          id="close-video-modal-btn"
          onClick={onClose}
          className="p-3 rounded-full bg-white/10 hover:bg-red-600 text-white transition-all duration-300 border border-white/20 hover:scale-105 cursor-pointer"
          title="Close Player (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Video Viewport */}
      <div className="relative flex-1 w-full flex items-center justify-center bg-black overflow-hidden group">
        <video
          ref={videoRef}
          src={film.videoUrl}
          poster={film.thumbnailUrl}
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
          className="w-full h-full object-contain max-h-[82vh] cursor-pointer"
        />

        {/* Big Play Overlay indicator on pause */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute p-6 rounded-full bg-red-600/90 text-white shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-red-400/50"
          >
            <Play className="w-10 h-10 fill-current ml-1" />
          </button>
        )}
      </div>

      {/* Bottom Custom Cinematic Control Bar */}
      <div className="p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-20 space-y-3">
        {/* Progress Seek Bar */}
        <div className="flex items-center gap-3 font-mono text-xs text-neutral-400">
          <span>{currentTimeStr}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-2.5 transition-all"
          />
          <span>{durationStr || film.duration}</span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg text-neutral-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-neutral-400 font-mono pl-4 border-l border-neutral-800">
              <span className="text-white font-medium">{film.role || 'Lead Editor'}</span>
              <span>•</span>
              <span>{film.aspectRatio || '2.39:1'} Aspect Ratio</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300">
              4K DCI • PRORES
            </span>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
