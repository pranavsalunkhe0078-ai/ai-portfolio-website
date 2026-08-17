import { useState, useEffect } from 'react';
import { UserSession, Film } from '../../types';
import { fetchFilms } from '../../lib/api';
import { auth, signOut } from '../../lib/firebase';
import FilmUploadForm from './FilmUploadForm';
import FilmListTable from './FilmListTable';
import AnalyticsView from './AnalyticsView';
import AdminUsersManager from './AdminUsersManager';
import AboutPhotoManager from './AboutPhotoManager';
import InquiriesView from './InquiriesView';
import VideoPlayerModal from '../VideoPlayerModal';
import {
  LayoutDashboard,
  Film as FilmIcon,
  Upload,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Globe,
  Plus,
  Eye,
  Lock,
  Sparkles,
  Inbox
} from 'lucide-react';

interface AdminDashboardProps {
  session: UserSession;
  onLogout: () => void;
  onBackToSite: () => void;
}

export default function AdminDashboard({ session, onLogout, onBackToSite }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inquiries' | 'films' | 'upload' | 'analytics' | 'admins' | 'settings'>('dashboard');
  const [films, setFilms] = useState<Film[]>([]);
  const [playingFilm, setPlayingFilm] = useState<Film | null>(null);

  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    const data = await fetchFilms();
    setFilms(data);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Inquiries', icon: Inbox },
    { id: 'films', label: 'Films', icon: FilmIcon },
    { id: 'upload', label: 'Upload Film', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admins', label: 'Admins', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const totalViews = films.reduce((acc, f) => acc + (f.views || 0), 0);

  return (
    <div className="min-h-screen w-full bg-black text-white flex font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-neutral-950 border-r border-white/10 p-6 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-950/50">
              <FilmIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-black tracking-widest uppercase text-sm text-white">
                PRANAV ADMIN
              </div>
              <div className="text-[10px] font-mono uppercase text-red-500 font-bold">
                {session.user.role}
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 font-mono text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-950/60'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-neutral-800 font-mono text-xs">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-red-500" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={async () => {
              try {
                await signOut(auth);
              } catch (err) {
                console.error('Logout error:', err);
              }
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white transition-colors cursor-pointer border border-red-900/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-black overflow-y-auto">
        {/* Top Header */}
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Selector */}
            <div className="md:hidden flex items-center gap-2 overflow-x-auto py-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono ${
                    activeTab === item.id ? 'bg-red-600 text-white font-bold' : 'bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <h2 className="hidden md:block text-xl font-bold font-serif uppercase tracking-tight text-white">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'inquiries' && 'Inquiries & Contact Messages'}
              {activeTab === 'films' && 'Manage Published Films'}
              {activeTab === 'upload' && 'Upload New Film'}
              {activeTab === 'analytics' && 'Analytics Engine'}
              {activeTab === 'admins' && 'Admin Accounts & Roles'}
              {activeTab === 'settings' && 'System Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('upload')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-red-950/50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Film</span>
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-neutral-800">
              <div className="text-right font-mono text-xs">
                <div className="text-white font-bold">{session.user.name}</div>
                <div className="text-neutral-500 text-[10px]">{session.user.email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Body View Container */}
        <div className="p-6 sm:p-10 space-y-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-neutral-400 uppercase">Total Films</div>
                  <div className="text-3xl font-black text-white font-mono">{films.length}</div>
                </div>
                <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-neutral-400 uppercase">Total Views</div>
                  <div className="text-3xl font-black text-white font-mono">{totalViews.toLocaleString()}</div>
                </div>
                <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-neutral-400 uppercase">Editing Suite</div>
                  <div className="text-xl font-bold text-red-500 font-mono">DaVinci Resolve 21</div>
                </div>
              </div>

              {/* Quick Actions & Recent Films */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-serif uppercase text-white">Recent Releases</h3>
                  <button
                    onClick={() => setActiveTab('films')}
                    className="text-xs font-mono text-red-500 hover:underline"
                  >
                    View All Films →
                  </button>
                </div>

                <FilmListTable
                  films={films.slice(0, 5)}
                  onRefresh={loadFilms}
                  onPlayFilm={(f) => setPlayingFilm(f)}
                />
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && <InquiriesView />}

          {activeTab === 'films' && (
            <FilmListTable
              films={films}
              onRefresh={loadFilms}
              onPlayFilm={(f) => setPlayingFilm(f)}
            />
          )}

          {activeTab === 'upload' && (
            <FilmUploadForm
              onSuccess={(newFilm) => {
                loadFilms();
                setActiveTab('films');
              }}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'admins' && <AdminUsersManager />}

          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <AboutPhotoManager />

              <div className="bg-neutral-900 rounded-2xl p-6 border border-white/10 space-y-6 font-mono text-xs">
                <h3 className="text-lg font-bold font-serif text-white uppercase">
                  System Metadata
                </h3>
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="text-neutral-400 uppercase">Public Site Name</label>
                    <input
                      type="text"
                      disabled
                      value="Pranav Salunkhe — Filmmaker & Video Editor"
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase">Inquiry Notification Email</label>
                    <input
                      type="email"
                      disabled
                      value="salunkhepranav2502@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase">Default Accent Color</label>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-white" />
                      <span className="text-white">A24 / Netflix Soft Red (#e50914)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Video Player Modal */}
      {playingFilm && (
        <VideoPlayerModal
          film={playingFilm}
          onClose={() => setPlayingFilm(null)}
        />
      )}
    </div>
  );
}
