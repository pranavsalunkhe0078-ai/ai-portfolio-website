import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { fetchAboutPhoto, updateAboutPhoto, uploadMedia } from '../../lib/api';
import { Image, Upload, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Check } from 'lucide-react';

export default function AboutPhotoManager() {
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('/src/assets/images/pranav_portrait_1786121160560.jpg');
  const [stagedPhotoUrl, setStagedPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPhoto();
  }, []);

  const loadPhoto = async () => {
    setLoading(true);
    try {
      const url = await fetchAboutPhoto();
      setCurrentPhotoUrl(url);
      setStagedPhotoUrl(null);
      setSelectedFileName(null);
    } catch (err) {
      console.error('Error loading about photo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, WebP).' });
      return;
    }

    setSelectedFileName(file.name);
    setUploading(true);
    setMessage(null);

    try {
      // Upload via existing secure API
      const uploaded = await uploadMedia(undefined, file);
      if (uploaded.thumbnailUrl) {
        setStagedPhotoUrl(uploaded.thumbnailUrl);
        setMessage({
          type: 'success',
          text: `"${file.name}" uploaded successfully! Click "Save About Photo" to apply it to the public website.`
        });
      } else {
        throw new Error('Upload succeeded but did not return a valid image path.');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload photo.' });
      setStagedPhotoUrl(null);
      setSelectedFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const targetUrl = stagedPhotoUrl || currentPhotoUrl;

    if (!targetUrl) {
      setMessage({ type: 'error', text: 'No photo selected to save.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const updatedUrl = await updateAboutPhoto(targetUrl);
      setCurrentPhotoUrl(updatedUrl);
      setStagedPhotoUrl(null);
      setSelectedFileName(null);
      setMessage({
        type: 'success',
        text: 'About Page Photo updated and saved successfully! Changes are now live on the public website.'
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save about photo.' });
    } finally {
      setSaving(false);
    }
  };

  const activeDisplayUrl = stagedPhotoUrl || currentPhotoUrl;

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold font-serif text-white uppercase flex items-center gap-2">
            <Image className="w-5 h-5 text-red-500" />
            <span>Replace About Page Photo</span>
          </h3>
          <p className="text-neutral-400 text-xs font-sans mt-1">
            Upload a new portrait photo for the public About page. The photo will automatically upload and be ready to save.
          </p>
        </div>
        <button
          type="button"
          onClick={loadPhoto}
          disabled={loading || uploading || saving}
          className="p-2 rounded-xl bg-black hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh Current Photo"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 border ${
            message.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
              : 'bg-red-950/40 border-red-800/50 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs leading-relaxed">{message.text}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Photo Preview Card */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-neutral-400 uppercase font-bold text-[11px]">
              {stagedPhotoUrl ? 'New Photo Preview (Unsaved)' : 'Current Photo'}
            </label>
            {stagedPhotoUrl && (
              <span className="text-emerald-400 font-bold text-[10px] uppercase flex items-center gap-1">
                <Check className="w-3 h-3" /> Ready to Save
              </span>
            )}
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[3/4] shadow-xl group">
            <img
              src={activeDisplayUrl}
              alt="About Page Portrait Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-all duration-300"
              onError={(e) => {
                (e.target as HTMLElement).setAttribute('src', currentPhotoUrl);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] text-neutral-300">
              <div className="font-bold text-white">PRANAV SALUNKHE</div>
              <div className="text-red-500">REMOTE</div>
            </div>
          </div>
        </div>

        {/* Upload Controls & Save Form */}
        <form onSubmit={handleSave} className="md:col-span-7 space-y-6">
          {/* File Upload Zone */}
          <div className="space-y-2">
            <label className="text-neutral-400 uppercase font-bold text-[11px] block">
              Select New Photo
            </label>
            <div className="relative border-2 border-dashed border-neutral-800 hover:border-red-600/50 rounded-2xl p-8 text-center transition-all bg-black/50 group cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                disabled={uploading || saving}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed z-10"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <Upload className={`w-6 h-6 ${uploading ? 'animate-bounce' : ''}`} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-white font-bold">
                    {uploading
                      ? 'Uploading Photo to Server...'
                      : selectedFileName
                      ? `Selected: ${selectedFileName}`
                      : 'Click or Drag Image File Here'}
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    Supports JPG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-white/5">
            {stagedPhotoUrl ? (
              <button
                type="button"
                onClick={() => {
                  setStagedPhotoUrl(null);
                  setSelectedFileName(null);
                  setMessage(null);
                }}
                disabled={uploading || saving}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel Upload
              </button>
            ) : (
              <div className="text-[11px] text-neutral-500">
                Current photo is set. Select a new file above to replace.
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || saving || !stagedPhotoUrl}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-red-950/50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save About Photo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

