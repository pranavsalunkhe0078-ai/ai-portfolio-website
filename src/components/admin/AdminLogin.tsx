import { useState, FormEvent } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { auth, signInWithEmailAndPassword, signOut, ALLOWED_ADMIN_EMAIL } from '../../lib/firebase';
import { UserSession } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (session: UserSession) => void;
  onBackToSite: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToSite }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.email !== ALLOWED_ADMIN_EMAIL) {
        await signOut(auth);
        setErrorMsg(`Access denied: Only ${ALLOWED_ADMIN_EMAIL} is authorized to access the Admin Portal.`);
        setLoading(false);
        return;
      }

      const idToken = await user.getIdToken();
      const session: UserSession = {
        user: {
          id: user.uid,
          email: user.email || ALLOWED_ADMIN_EMAIL,
          name: user.displayName || 'Pranav Salunkhe',
          role: 'Super Admin',
          lastActive: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        token: idToken,
      };

      onLoginSuccess(session);
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg(`Invalid password or email (${email}). Please ensure this admin account is created in your Firebase Authentication console and the password matches.`);
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Too many failed attempts. Please try again later.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Red Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900/90 rounded-3xl p-8 sm:p-10 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-white">
            Admin Vault Access
          </h2>
          <p className="text-neutral-400 font-mono text-xs">
            PRANAV SALUNKHE PORTFOLIO MANAGEMENT
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Secret Key / Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black border border-neutral-800 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Enter Admin Dashboard'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-500">
          <button
            onClick={onBackToSite}
            className="hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Public Website
          </button>

          <span className="text-[10px]">AUTH V2.4</span>
        </div>
      </div>
    </div>
  );
}
