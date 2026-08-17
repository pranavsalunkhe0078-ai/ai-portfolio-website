import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../../lib/api';
import { AnalyticsData } from '../../types';
import { BarChart3, Eye, HardDrive, Film as FilmIcon, TrendingUp, ShieldCheck } from 'lucide-react';

export default function AnalyticsView() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics().then(setData);
  }, []);

  if (!data) {
    return <div className="text-neutral-500 font-mono text-xs p-8">Loading analytics engine...</div>;
  }

  const storageGB = (data.storageUsedMB / 1024).toFixed(1);
  const storageLimitGB = (data.storageLimitMB / 1024).toFixed(0);
  const storagePercentage = Math.round((data.storageUsedMB / data.storageLimitMB) * 100);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold font-serif uppercase tracking-wide text-white">
            Portfolio Performance Analytics
          </h3>
          <p className="text-xs font-mono text-neutral-400">
            AUDIENCE ENGAGEMENT & CLOUD STORAGE MONITOR
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
          LIVE METRICS
        </div>
      </div>

      {/* Top Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Published Films</span>
            <FilmIcon className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{data.totalFilms}</div>
          <div className="text-[11px] text-neutral-500 font-mono">Active on public website</div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Video Views</span>
            <Eye className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{data.totalViews.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +28% this month
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase tracking-wider">Storage Usage</span>
            <HardDrive className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{storageGB} GB</div>
          <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-neutral-800">
            <div className="bg-red-600 h-full" style={{ width: `${storagePercentage}%` }} />
          </div>
          <div className="text-[10px] text-neutral-500 font-mono flex justify-between">
            <span>{storagePercentage}% Used</span>
            <span>Limit: {storageLimitGB} GB</span>
          </div>
        </div>
      </div>

      {/* Monthly Views Graph Simulation & Top Viewed Films */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-7 bg-neutral-900 rounded-2xl p-6 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white font-mono uppercase">
              Monthly Video Views Growth
            </h4>
            <span className="text-xs font-mono text-neutral-500">2026 TRAFFIC</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-neutral-800 pb-2">
            {data.monthlyViews.map((m) => {
              const heightPercent = Math.round((m.views / 5000) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-neutral-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.views}
                  </div>
                  <div className="w-full bg-neutral-800 hover:bg-red-600 rounded-t-lg transition-all" style={{ height: `${heightPercent}%` }} />
                  <span className="text-[10px] font-mono text-neutral-500">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Films Table */}
        <div className="lg:col-span-5 bg-neutral-900 rounded-2xl p-6 border border-white/10 space-y-4">
          <h4 className="text-sm font-bold text-white font-mono uppercase">
            Top Viewed Films
          </h4>

          <div className="space-y-3 font-mono text-xs">
            {data.topFilms.map((tf, i) => (
              <div key={tf.filmId} className="flex items-center justify-between p-3 rounded-xl bg-black border border-neutral-800">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center font-bold text-[10px]">
                    0{i + 1}
                  </span>
                  <span className="text-white font-bold font-serif">{tf.title}</span>
                </div>
                <div className="text-red-500 font-bold">{tf.views} views</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
