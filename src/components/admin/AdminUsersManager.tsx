import { useState, useEffect, FormEvent } from 'react';
import { AdminUser } from '../../types';
import { fetchAdmins, addAdmin, removeAdmin } from '../../lib/api';
import { ShieldAlert, UserPlus, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminUsersManager() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Super Admin' | 'Editor' | 'Viewer'>('Editor');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    const data = await fetchAdmins();
    setAdmins(data);
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setLoading(true);
    setMsg('');
    try {
      await addAdmin(newEmail, newRole);
      setMsg(`Admin access granted to ${newEmail}`);
      setNewEmail('');
      loadAdmins();
    } catch (err: any) {
      setMsg(err.message || 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  const [adminToRemove, setAdminToRemove] = useState<{ id: string; email: string } | null>(null);

  const confirmRemove = async () => {
    if (!adminToRemove) return;
    const ok = await removeAdmin(adminToRemove.id);
    if (ok) {
      setMsg(`Revoked admin access for ${adminToRemove.email}`);
      loadAdmins();
    } else {
      setMsg('Cannot remove the primary Super Admin account.');
    }
    setAdminToRemove(null);
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold font-serif uppercase tracking-wide text-white">
            Admin Accounts & Permissions
          </h3>
          <p className="text-xs font-mono text-neutral-400">
            SUPER ADMIN SCHEMA & SECURITY MANAGEMENT
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold uppercase">
          SUPER ADMIN ROLE
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Add Admin Form */}
      <div className="bg-neutral-900 rounded-2xl p-6 border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-red-500" /> Add New Admin Account
        </h4>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs font-mono text-neutral-400 uppercase">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="editor@pranavsalunkhe.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs font-mono text-neutral-400 uppercase">
              Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl bg-black border border-neutral-800 text-white text-xs font-mono focus:border-red-500 focus:outline-none"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              Grant Access
            </button>
          </div>
        </form>
      </div>

      {/* Admins List Table */}
      <div className="bg-neutral-900 rounded-2xl p-6 border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white font-mono uppercase">
          Authorized Accounts ({admins.length})
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-neutral-300">
            <thead className="bg-black text-neutral-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Last Active</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-800/40">
                  <td className="p-3">
                    <div className="font-bold text-white">{a.name || 'Admin'}</div>
                    <div className="text-[10px] text-neutral-500">{a.email}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded bg-red-950/80 text-red-400 border border-red-800 font-bold text-[10px]">
                      {a.role}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-400">{new Date(a.lastActive).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setAdminToRemove({ id: a.id, email: a.email })}
                      className="p-1.5 rounded bg-neutral-800 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 cursor-pointer"
                      title="Revoke Admin Access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {adminToRemove && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="space-y-2">
              <h4 className="text-lg font-bold font-serif text-white">Revoke Admin Access?</h4>
              <p className="text-xs font-sans text-neutral-400">
                Are you sure you want to revoke admin access for <span className="text-white font-mono">{adminToRemove.email}</span>?
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setAdminToRemove(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
