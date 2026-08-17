import { useState } from 'react';
import { Film } from '../../types';
import { deleteFilm, updateFilm } from '../../lib/api';
import { Trash2, Star, Eye, Edit2, Play, Check, X, Clock, AlertTriangle } from 'lucide-react';

interface FilmListTableProps {
  films: Film[];
  onRefresh: () => void;
  onPlayFilm: (film: Film) => void;
}

export default function FilmListTable({ films, onRefresh, onPlayFilm }: FilmListTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filmToDelete, setFilmToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!filmToDelete) return;
    setIsDeleting(true);
    try {
      setErrorMsg(null);
      await deleteFilm(filmToDelete.id);
      setFilmToDelete(null);
      onRefresh();
    } catch (err: any) {
      console.error('Delete film failed:', err);
      setErrorMsg(err.message || 'Failed to delete film. Please ensure you are logged in as admin.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async (film: Film) => {
    try {
      setErrorMsg(null);
      await updateFilm(film.id, { featured: !film.featured });
      onRefresh();
    } catch (err: any) {
      console.error('Update film failed:', err);
      setErrorMsg(err.message || 'Failed to update film.');
    }
  };

  const startEdit = (film: Film) => {
    setEditingId(film.id);
    setEditTitle(film.title || '');
    setEditGenre(film.genre || '');
  };

  const saveEdit = async (id: string) => {
    try {
      setErrorMsg(null);
      await updateFilm(id, { title: editTitle, genre: editGenre });
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      console.error('Save edit failed:', err);
      setErrorMsg(err.message || 'Failed to save film edits.');
    }
  };

  return (
    <div className="bg-neutral-900 rounded-2xl border border-white/10 p-6 space-y-6 font-sans">
      {errorMsg && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 rounded-xl text-xs font-mono flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white text-sm font-bold">
            ×
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold font-serif uppercase tracking-wide text-white">
            Manage Published Films
          </h3>
          <p className="text-xs font-mono text-neutral-400">
            TOTAL FILMS IN DATABASE: {films.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono text-neutral-300">
          <thead className="bg-black text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
            <tr>
              <th className="p-3">Thumbnail</th>
              <th className="p-3">Title & Info</th>
              <th className="p-3">Genre</th>
              <th className="p-3">Year / Duration</th>
              <th className="p-3">Views</th>
              <th className="p-3">Featured</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {films.map((film) => (
              <tr key={film.id} className="hover:bg-neutral-800/50 transition-colors">
                <td className="p-3">
                  <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-black group border border-neutral-800">
                    <img
                      src={film.thumbnailUrl}
                      alt={film.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onPlayFilm(film)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </td>

                <td className="p-3">
                  {editingId === film.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="px-2 py-1 bg-black border border-neutral-700 text-white rounded text-xs w-full"
                    />
                  ) : (
                    <div>
                      <div className="font-bold text-white text-sm font-serif">{film.title}</div>
                      <div className="text-[10px] text-neutral-500">{film.role || 'Editor'}</div>
                    </div>
                  )}
                </td>

                <td className="p-3">
                  {editingId === film.id ? (
                    <input
                      type="text"
                      value={editGenre}
                      onChange={(e) => setEditGenre(e.target.value)}
                      className="px-2 py-1 bg-black border border-neutral-700 text-white rounded text-xs w-24"
                    />
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-semibold text-[10px]">
                      {film.genre}
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <div className="text-neutral-300">{film.year}</div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-500" /> {film.duration}
                  </div>
                </td>

                <td className="p-3">
                  <span className="flex items-center gap-1 text-neutral-300">
                    <Eye className="w-3 h-3 text-neutral-500" /> {film.views || 0}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleToggleFeatured(film)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      film.featured
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-neutral-800 text-neutral-600 border-neutral-700'
                    }`}
                    title={film.featured ? 'Featured on Billboard' : 'Set as Featured'}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </td>

                <td className="p-3 text-right space-x-2">
                  {editingId === film.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(film.id)}
                        className="p-1.5 rounded bg-emerald-600 text-white"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded bg-neutral-800 text-neutral-400"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(film)}
                        className="p-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                        title="Edit Film Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setFilmToDelete({ id: film.id, title: film.title })}
                        className="p-1.5 rounded bg-red-950/80 text-red-400 border border-red-800 hover:bg-red-900 hover:text-white"
                        title="Delete Film"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* React Confirmation Modal for Deletion */}
      {filmToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-950/80 text-red-500 border border-red-800/80 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold font-serif text-white">Delete Film Project?</h4>
                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                  Are you sure you want to delete <span className="text-white font-semibold font-serif">"{filmToDelete.title}"</span>? This will permanently remove the film from Firestore database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setFilmToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>Deleting...</>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
