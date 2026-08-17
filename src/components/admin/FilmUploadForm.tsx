import { useState, FormEvent } from 'react';
import { Upload, Film as FilmIcon, CheckCircle2, ArrowRight, Video, Image as ImageIcon, Sparkles } from 'lucide-react';
import { createFilm, uploadMedia } from '../../lib/api';
import { Film } from '../../types';

interface FilmUploadFormProps {
  onSuccess: (newFilm: Film) => void;
}

export default function FilmUploadForm({ onSuccess }: FilmUploadFormProps) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Short Film');
  const [duration, setDuration] = useState('04:30');
  const [year, setYear] = useState<number | string>(new Date().getFullYear());
  const [description, setDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState('2.39:1');
  const [role, setRole] = useState('Director, Editor & Colorist');
  const [featured, setFeatured] = useState(true);

  // Video source choice
  const [videoSourceType, setVideoSourceType] = useState<'url' | 'file'>('url');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Thumbnail source choice
  const [thumbSourceType, setThumbSourceType] = useState<'url' | 'file'>('url');
  const [thumbnailUrl, setThumbnailUrl] = useState('/src/assets/images/cinematic_film_scene_1786121174294.jpg');
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setErrorMsg('Please enter a Title and Description.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let finalVideoUrl = videoUrl;
      let finalThumbUrl = thumbnailUrl;

      // Handle file upload if files provided
      if ((videoSourceType === 'file' && videoFile) || (thumbSourceType === 'file' && thumbFile)) {
        const uploadRes = await uploadMedia(
          videoSourceType === 'file' && videoFile ? videoFile : undefined,
          thumbSourceType === 'file' && thumbFile ? thumbFile : undefined
        );
        if (uploadRes.videoUrl) finalVideoUrl = uploadRes.videoUrl;
        if (uploadRes.thumbnailUrl) finalThumbUrl = uploadRes.thumbnailUrl;
      }

      const created = await createFilm({
        title,
        genre,
        duration,
        year,
        description,
        aspectRatio,
        role,
        featured,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbUrl,
      });

      setSuccessMsg(`Film "${title}" successfully published and live on the public website!`);
      onSuccess(created);

      // Reset form
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish film');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-white/10 space-y-8 max-w-4xl font-sans">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold font-serif uppercase tracking-wide text-white">
            Publish New Film Project
          </h3>
          <p className="text-xs font-mono text-neutral-400">
            UPLOAD MP4 & THUMBNAIL TO SHOWCASE LIVE ON PUBLIC WEBSITE
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold uppercase">
          LIVE DB SYNC
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Film Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nocturnal Echoes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Genre / Category *
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="Short Film">Short Film</option>
              <option value="Color Grading">Color Grading</option>
              <option value="Commercial">Commercial</option>
              <option value="YouTube">YouTube</option>
              <option value="Music Video">Music Video</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Duration (mm:ss)
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Release Year
            </label>
            <input
              type="number"
              value={year ?? ''}
              onChange={(e) => setYear(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="2.39:1">2.39:1 Anamorphic</option>
              <option value="16:9">16:9 Widescreen</option>
              <option value="4:3">4:3 Academy</option>
              <option value="9:16">9:16 Vertical Reel</option>
            </select>
          </div>
        </div>

        {/* Role & Featured toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Pranav's Role on Project
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 accent-red-600 rounded cursor-pointer"
            />
            <label htmlFor="featured-checkbox" className="text-xs font-mono text-white cursor-pointer">
              Set as Featured Release Billboard
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Film Synopsis & Technical Notes *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the film concept, editing choices, LUTs used..."
            className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* MP4 Video Source Selection */}
        <div className="p-5 rounded-xl bg-black border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-300 font-bold uppercase flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" /> MP4 Video File / Source
            </span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setVideoSourceType('url')}
                className={`px-3 py-1 rounded-lg ${videoSourceType === 'url' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400'}`}
              >
                URL Link
              </button>
              <button
                type="button"
                onClick={() => setVideoSourceType('file')}
                className={`px-3 py-1 rounded-lg ${videoSourceType === 'file' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400'}`}
              >
                Upload File
              </button>
            </div>
          </div>

          {videoSourceType === 'url' ? (
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
            />
          ) : (
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-xs font-mono text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:font-bold file:cursor-pointer"
            />
          )}
        </div>

        {/* Thumbnail Image Source Selection */}
        <div className="p-5 rounded-xl bg-black border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-300 font-bold uppercase flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-red-500" /> Thumbnail Image Source
            </span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setThumbSourceType('url')}
                className={`px-3 py-1 rounded-lg ${thumbSourceType === 'url' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400'}`}
              >
                URL Link
              </button>
              <button
                type="button"
                onClick={() => setThumbSourceType('file')}
                className={`px-3 py-1 rounded-lg ${thumbSourceType === 'file' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400'}`}
              >
                Upload File
              </button>
            </div>
          </div>

          {thumbSourceType === 'url' ? (
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or /src/assets/..."
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-xs font-mono text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:font-bold file:cursor-pointer"
            />
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          <span>{loading ? 'Publishing Film...' : 'Publish Film to Live Portfolio'}</span>
        </button>
      </form>
    </div>
  );
}
