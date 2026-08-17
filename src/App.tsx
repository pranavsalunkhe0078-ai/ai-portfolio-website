import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FilmsShowcase from './components/FilmsShowcase';
import Services from './components/Services';
import ResolveWorkflow from './components/ResolveWorkflow';
import Testimonials from './components/Testimonials';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { UserSession } from './types';
import { auth, onAuthStateChanged, ALLOWED_ADMIN_EMAIL } from './lib/firebase';

function getModeForPath(path: string, isAuthenticated: boolean): 'public' | 'admin-login' | 'admin-dashboard' {
  const cleanPath = path.replace(/\/$/, '') || '/';
  if (cleanPath === '/admin' || cleanPath === '/admin/login') {
    return isAuthenticated ? 'admin-dashboard' : 'admin-login';
  }
  return 'public';
}

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [presetService, setPresetService] = useState<string | undefined>(undefined);
  const [adminSession, setAdminSession] = useState<UserSession | null>(null);
  const [viewMode, setViewMode] = useState<'public' | 'admin-login' | 'admin-dashboard'>(() => {
    return getModeForPath(window.location.pathname, false);
  });
  const [glowKey, setGlowKey] = useState(0);

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';

      if (firebaseUser && firebaseUser.email === ALLOWED_ADMIN_EMAIL) {
        const token = await firebaseUser.getIdToken();
        const session: UserSession = {
          user: {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Pranav Salunkhe',
            role: 'Super Admin',
            lastActive: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          token,
        };
        setAdminSession(session);

        if (path === '/admin' || path === '/admin/login') {
          setViewMode('admin-dashboard');
          if (path !== '/admin') {
            window.history.replaceState({}, '', '/admin');
          }
        }
      } else {
        setAdminSession(null);
        if (path === '/admin' || path === '/admin/login') {
          setViewMode('admin-login');
          if (path !== '/admin/login') {
            window.history.replaceState({}, '', '/admin/login');
          }
        } else {
          setViewMode('public');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync route path on browser back/forward navigation
  useEffect(() => {
    const handleLocation = () => {
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
      const mode = getModeForPath(currentPath, !!adminSession);
      setViewMode(mode);
    };

    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, [adminSession]);

  const scrollToSection = (sectionId: string) => {
    setGlowKey((prev) => prev + 1);

    if (viewMode !== 'public') {
      setViewMode('public');
      window.history.pushState({}, '', '/');
    }

    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  };

  const handleInquireService = (serviceName: string) => {
    setPresetService(serviceName);
    scrollToSection('contact');
  };

  const openAdminView = () => {
    setGlowKey((prev) => prev + 1);
    if (adminSession) {
      setViewMode('admin-dashboard');
      window.history.pushState({}, '', '/admin');
    } else {
      setViewMode('admin-login');
      window.history.pushState({}, '', '/admin/login');
    }
  };

  const handleBackToSite = () => {
    setGlowKey((prev) => prev + 1);
    setViewMode('public');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={(session) => {
          setAdminSession(session);
          setViewMode('admin-dashboard');
          window.history.pushState({}, '', '/admin');
        }}
        onBackToSite={handleBackToSite}
      />
    );
  }

  if (viewMode === 'admin-dashboard' && adminSession) {
    return (
      <AdminDashboard
        session={adminSession}
        onLogout={() => {
          setAdminSession(null);
          setViewMode('public');
          window.history.pushState({}, '', '/');
        }}
        onBackToSite={handleBackToSite}
      />
    );
  }

  return (
    <div className="bg-black text-white min-h-screen selection:bg-red-600 selection:text-white font-sans relative">
      {/* Cinematic Red Glow Navigation Transition Overlay */}
      {glowKey > 0 && (
        <motion.div
          key={`nav-glow-${glowKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden motion-reduce:hidden"
        >
          {/* Subtle top edge bar light leak */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent blur-sm" />

          {/* Top center soft lens flare */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[320px] sm:w-[480px] h-[100px] bg-red-600/15 blur-[60px] rounded-full" />

          {/* Top-left corner ambient glow */}
          <div className="absolute -top-16 -left-16 w-[180px] sm:w-[260px] h-[180px] sm:h-[260px] bg-red-600/12 blur-[70px] rounded-full" />

          {/* Top-right corner ambient glow */}
          <div className="absolute -top-16 -right-16 w-[180px] sm:w-[260px] h-[180px] sm:h-[260px] bg-red-600/12 blur-[70px] rounded-full" />
        </motion.div>
      )}

      {/* Navigation Bar */}
      <Navbar
        onNavigate={scrollToSection}
        activeSection={activeSection}
        onOpenAdmin={openAdminView}
      />

      {/* Hero / Landing */}
      <Hero
        onWatchFilms={() => scrollToSection('films')}
        onHireMe={() => scrollToSection('contact')}
      />

      {/* About Me */}
      <About />

      {/* Films Showcase */}
      <FilmsShowcase />

      {/* Services */}
      <Services onInquire={handleInquireService} />

      {/* DaVinci Resolve Workflow */}
      <ResolveWorkflow />

      {/* Testimonials */}
      <Testimonials onContact={() => scrollToSection('contact')} />

      {/* Contact Section */}
      <ContactSection presetService={presetService} />

      {/* Footer */}
      <Footer
        onOpenAdmin={openAdminView}
        onNavigate={scrollToSection}
      />
    </div>
  );
}
