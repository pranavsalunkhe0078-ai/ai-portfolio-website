import { useState, useEffect } from 'react';
import { ContactMessage } from '../../types';
import { fetchContactMessages, deleteContactMessage } from '../../lib/api';
import {
  Inbox,
  RefreshCw,
  Trash2,
  Mail,
  Calendar,
  DollarSign,
  Tag,
  User,
  AlertCircle,
  Eye,
  X,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function InquiriesView() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState<ContactMessage | null>(null);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadMessages = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await fetchContactMessages();
      setMessages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load inquiries.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (msg: ContactMessage) => {
    setDeletingId(msg.id);
    setError('');
    try {
      await deleteContactMessage(msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(null);
      }
      setDeleteConfirmMsg(null);
      setActionSuccess('Inquiry deleted successfully.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete inquiry.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/90 p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif uppercase tracking-tight text-white">
                Contact Inquiries
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Direct messages submitted via your portfolio contact form
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadMessages(true)}
            disabled={loading || refreshing}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 border border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-red-500' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Inquiries'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-green-950/60 border border-green-800 text-green-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadMessages()}
            className="px-3 py-1 bg-red-900 hover:bg-red-800 text-white rounded-lg text-[10px] uppercase font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content State */}
      {loading ? (
        <div className="p-16 text-center space-y-4 bg-neutral-900/50 rounded-2xl border border-white/5">
          <RefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            Loading inquiries from Firestore...
          </p>
        </div>
      ) : messages.length === 0 ? (
        <div className="p-16 text-center space-y-4 bg-neutral-900/50 rounded-2xl border border-white/5 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-serif text-white uppercase">No Inquiries Yet</h3>
            <p className="text-xs font-mono text-neutral-400 leading-relaxed">
              When clients or collaborators submit project details through the website contact section, their messages will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
            <span>SHOWING {messages.length} INQUIRIES</span>
            <span className="text-neutral-500">SORTED BY NEWEST</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-6 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-neutral-700 transition-all space-y-4"
              >
                {/* Message Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base font-bold text-white flex items-center gap-2 font-serif">
                        <User className="w-4 h-4 text-red-500" />
                        {msg.name}
                      </span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs font-mono text-red-400 hover:text-red-300 underline flex items-center gap-1 bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-900/50"
                      >
                        <Mail className="w-3 h-3" />
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Read Full Message"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-300" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmMsg(msg)}
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors border border-red-900/50 cursor-pointer"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Badges & Meta */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-neutral-300">
                  <div className="flex items-center gap-1.5 bg-neutral-800/80 px-3 py-1 rounded-lg border border-white/5">
                    <Tag className="w-3 h-3 text-red-500" />
                    <span>{msg.projectType || 'General Project'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-neutral-800/80 px-3 py-1 rounded-lg border border-white/5">
                    <DollarSign className="w-3 h-3 text-green-500" />
                    <span>{msg.budget || 'Undisclosed Budget'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-neutral-800/80 px-3 py-1 rounded-lg border border-white/5 text-neutral-400 ml-auto">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span>{formatDate(msg.createdAt)}</span>
                  </div>
                </div>

                {/* Message Body Preview */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/5 text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-mono uppercase text-red-500 font-bold tracking-wider">
                Inquiry Details
              </div>
              <h3 className="text-2xl font-bold font-serif text-white">
                {selectedMessage.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                <div className="text-neutral-500 uppercase text-[10px]">Email Address</div>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-red-400 hover:underline flex items-center gap-1.5 font-bold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {selectedMessage.email}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                <div className="text-neutral-500 uppercase text-[10px]">Received Date</div>
                <div className="text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                <div className="text-neutral-500 uppercase text-[10px]">Project Category</div>
                <div className="text-white font-bold">{selectedMessage.projectType || 'N/A'}</div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                <div className="text-neutral-500 uppercase text-[10px]">Estimated Budget</div>
                <div className="text-green-400 font-bold">{selectedMessage.budget || 'N/A'}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-neutral-400">Full Message</div>
              <div className="p-4 rounded-xl bg-black/80 border border-white/10 text-sm text-neutral-200 leading-relaxed font-sans max-h-60 overflow-y-auto whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re:%20${encodeURIComponent(selectedMessage.projectType)}%20Inquiry`}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-red-950/50 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>

              <button
                onClick={() => {
                  setDeleteConfirmMsg(selectedMessage);
                  setSelectedMessage(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmMsg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-900/50 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white uppercase">
                Confirm Deletion
              </h3>
            </div>

            <p className="text-xs font-mono text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete the inquiry from{' '}
              <strong className="text-white">{deleteConfirmMsg.name}</strong> ({deleteConfirmMsg.email})?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmMsg(null)}
                disabled={deletingId === deleteConfirmMsg.id}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmMsg)}
                disabled={deletingId === deleteConfirmMsg.id}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/50"
              >
                {deletingId === deleteConfirmMsg.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Message
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
