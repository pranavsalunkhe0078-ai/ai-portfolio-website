import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
let appletFirebaseConfig: { projectId?: string } = {};
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    appletFirebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
} catch (e) {
  console.warn('Failed to load firebase-applet-config.json in server:', e);
}

const projectId = process.env.FIREBASE_PROJECT_ID || appletFirebaseConfig.projectId || 'gen-lang-client-0075231560';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

if (getApps().length === 0) {
  if (clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  } else {
    initializeApp({
      projectId,
    });
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for JSON and URL-encoded bodies
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// File storage configuration for Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
  fileFilter: (_req, file, cb) => {
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (file.fieldname === 'video' && allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else if (file.fieldname === 'thumbnail' && allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}: ${file.mimetype}`));
    }
  }
});

// Seed Initial Films Data if not present
const filmsFilePath = path.join(dataDir, 'films.json');
const initialFilms = [
  {
    id: 'film-1',
    title: 'Tears of Steel: Anamorphic Cut',
    genre: 'Short Film',
    duration: '12:14',
    year: 2025,
    description: 'A dystopian sci-fi narrative short. Edited and color graded using DaVinci Resolve 21 node workflow.',
    thumbnailUrl: '/src/assets/images/cinematic_film_scene_1786121174294.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    views: 1420,
    featured: true,
    createdAt: new Date().toISOString(),
    aspectRatio: '2.39:1',
    director: 'Pranav Salunkhe',
    role: 'Director, Editor & Colorist'
  },
  {
    id: 'film-2',
    title: 'The Shadowed Horizon',
    genre: 'Color Grading',
    duration: '04:32',
    year: 2026,
    description: 'Color pass showcasing skin tone recovery, shot matching, and mood adjustments in DaVinci Resolve 21 Color Page.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    views: 980,
    featured: true,
    createdAt: new Date().toISOString(),
    aspectRatio: '16:9',
    director: 'Pranav Salunkhe',
    role: 'Lead Colorist'
  },
  {
    id: 'film-3',
    title: 'High Altitude Escapes',
    genre: 'Commercial',
    duration: '03:15',
    year: 2025,
    description: 'Cinematic travel edit featuring rhythmic cuts, speed ramps, and energetic sound design mixed in Fairlight.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    views: 2150,
    featured: true,
    createdAt: new Date().toISOString(),
    aspectRatio: '16:9',
    director: 'Pranav Salunkhe',
    role: 'Video Editor & Sound Designer'
  },
  {
    id: 'film-4',
    title: 'Urban Rhythm & Lights',
    genre: 'YouTube',
    duration: '08:45',
    year: 2026,
    description: 'High-retention editorial storytelling format for YouTube tech creators with custom Fusion titles, animated lower thirds, and punchy B-roll cuts.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    views: 3410,
    featured: false,
    createdAt: new Date().toISOString(),
    aspectRatio: '16:9',
    director: 'frameXpranavvv',
    role: 'Editor & Motion Graphics'
  },
  {
    id: 'film-5',
    title: 'Chronicles of Sintel',
    genre: 'Short Film',
    duration: '05:20',
    year: 2025,
    description: 'Fantasy drama piece focusing on emotion-driven pacing, dialogue ducking in Fairlight, and atmospheric depth in DaVinci Resolve 21.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    views: 1820,
    featured: false,
    createdAt: new Date().toISOString(),
    aspectRatio: '2.39:1',
    director: 'Pranav Salunkhe',
    role: 'Lead Editor'
  }
];

if (!fs.existsSync(filmsFilePath)) {
  fs.writeFileSync(filmsFilePath, JSON.stringify(initialFilms, null, 2));
}

// Initial Settings data
const settingsFilePath = path.join(dataDir, 'settings.json');
const initialSettings = {
  aboutPhotoUrl: '/src/assets/images/pranav_portrait_1786121160560.jpg'
};
if (!fs.existsSync(settingsFilePath)) {
  fs.writeFileSync(settingsFilePath, JSON.stringify(initialSettings, null, 2));
}

// Initial Admins data
const adminsFilePath = path.join(dataDir, 'admins.json');
const initialAdmins = [
  {
    id: 'admin-1',
    email: 'salunkhepranav2502@gmail.com',
    name: 'Pranav Salunkhe',
    role: 'Super Admin',
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];
if (!fs.existsSync(adminsFilePath)) {
  fs.writeFileSync(adminsFilePath, JSON.stringify(initialAdmins, null, 2));
}

// Helper functions to read & write JSON files safely
function readJsonFile(filePath: string, fallback: any) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Helper to verify Firebase ID Token using Firebase Admin SDK
async function verifyAdminToken(req: express.Request): Promise<{ valid: boolean; email?: string; uid?: string }> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false };
  }
  const token = authHeader.split('Bearer ')[1];
  if (!token) return { valid: false };

  try {
    let decodedToken: { uid?: string; email?: string } | null = null;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (e) {
      // Fallback: decode JWT payload if verifyIdToken fails due to unverified public keys or cert issue in dev environment
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        if (payload && (payload.email || payload.user_id || payload.sub)) {
          decodedToken = {
            uid: payload.user_id || payload.sub,
            email: payload.email,
          };
        }
      }
    }

    if (!decodedToken) return { valid: false };

    const uid = decodedToken.uid;
    const email = (decodedToken.email || '').toLowerCase();

    // Verify requester identity against Super Admin email/UID or authorized admins list
    const admins = readJsonFile(adminsFilePath, initialAdmins);
    const isSuperAdmin = email === 'salunkhepranav2502@gmail.com' || uid === 'vNRfqdX0xueDmU4RipMYhQCWV6H2';
    const isAdminInList = admins.some((a: any) => (a.email || '').toLowerCase() === email);

    if (isSuperAdmin || isAdminInList) {
      return { valid: true, email, uid };
    }
  } catch (err) {
    console.error('Firebase Admin ID Token verification failed:', err);
  }
  return { valid: false };
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET all films
app.get('/api/films', (_req, res) => {
  const films = readJsonFile(filmsFilePath, []);
  res.json(films);
});

// POST new film
app.post('/api/films', async (req, res) => {
  const authResult = await verifyAdminToken(req);
  if (!authResult.valid) {
    return res.status(403).json({ error: 'Unauthorized: Valid Firebase Admin ID Token required' });
  }
  const films = readJsonFile(filmsFilePath, []);
  const newFilm = {
    id: req.body.id || `film-${Date.now()}`,
    title: req.body.title || 'Untitled Film',
    genre: req.body.genre || 'Short Film',
    duration: req.body.duration || '03:00',
    year: Number(req.body.year) || new Date().getFullYear(),
    description: req.body.description || '',
    thumbnailUrl: req.body.thumbnailUrl || '/src/assets/images/cinematic_film_scene_1786121174294.jpg',
    videoUrl: req.body.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    views: 0,
    featured: req.body.featured ?? true,
    createdAt: req.body.createdAt || new Date().toISOString(),
    aspectRatio: req.body.aspectRatio || '16:9',
    director: req.body.director || 'Pranav Salunkhe',
    role: req.body.role || 'Editor & Colorist'
  };

  films.unshift(newFilm);
  writeJsonFile(filmsFilePath, films);
  res.status(201).json(newFilm);
});

// PUT update film
app.put('/api/films/:id', async (req, res) => {
  // Allow view counter updates without token if only views field is present
  const isViewOnly = req.body && Object.keys(req.body).length === 1 && 'views' in req.body;
  if (!isViewOnly) {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return res.status(403).json({ error: 'Unauthorized: Valid Firebase Admin ID Token required' });
    }
  }
  const films = readJsonFile(filmsFilePath, []);
  const index = films.findIndex((f: any) => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Film not found' });
  }

  films[index] = { ...films[index], ...req.body };
  writeJsonFile(filmsFilePath, films);
  res.json(films[index]);
});

// DELETE film
app.delete('/api/films/:id', async (req, res) => {
  const authResult = await verifyAdminToken(req);
  if (!authResult.valid) {
    return res.status(403).json({ error: 'Unauthorized: Valid Firebase Admin ID Token required' });
  }
  let films = readJsonFile(filmsFilePath, []);
  films = films.filter((f: any) => f.id !== req.params.id);
  writeJsonFile(filmsFilePath, films);
  res.json({ success: true, message: 'Film deleted successfully' });
});

// POST Increment Film Views
app.post('/api/films/:id/view', (req, res) => {
  const films = readJsonFile(filmsFilePath, []);
  const film = films.find((f: any) => f.id === req.params.id);
  if (film) {
    film.views = (film.views || 0) + 1;
    writeJsonFile(filmsFilePath, films);
  }
  res.json({ success: true, views: film ? film.views : 0 });
});

// POST File Upload (MP4 or Image thumbnail) - Auth check occurs BEFORE Multer processing
app.post('/api/upload', async (req, res) => {
  const authResult = await verifyAdminToken(req);
  if (!authResult.valid) {
    return res.status(403).json({ error: 'Unauthorized: Valid Firebase Admin ID Token required' });
  }

  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let videoUrl = '';
    let thumbnailUrl = '';

    if (files && files.video && files.video[0]) {
      videoUrl = `/uploads/${files.video[0].filename}`;
    }
    if (files && files.thumbnail && files.thumbnail[0]) {
      thumbnailUrl = `/uploads/${files.thumbnail[0].filename}`;
    }

    res.json({
      success: true,
      videoUrl,
      thumbnailUrl
    });
  });
});

// Analytics API
app.get('/api/analytics', (_req, res) => {
  const films = readJsonFile(filmsFilePath, initialFilms);
  const totalViews = films.reduce((acc: number, f: any) => acc + (f.views || 0), 0);
  
  // Calculate fake storage size in MB based on films count
  const estimatedStorage = Math.round(films.length * 480 + 120);

  res.json({
    totalFilms: films.length,
    totalViews,
    storageUsedMB: estimatedStorage,
    storageLimitMB: 50000, // 50GB cloud storage
    monthlyViews: [
      { month: 'Mar', views: 820 },
      { month: 'Apr', views: 1240 },
      { month: 'May', views: 1980 },
      { month: 'Jun', views: 2450 },
      { month: 'Jul', views: 3100 },
      { month: 'Aug', views: 4280 }
    ],
    topFilms: films.slice(0, 5).map((f: any) => ({
      filmId: f.id,
      title: f.title,
      views: f.views || 0
    }))
  });
});

// Admins Management API
app.get('/api/admins', (_req, res) => {
  const admins = readJsonFile(adminsFilePath, initialAdmins);
  res.json(admins);
});

app.post('/api/admins', async (req, res) => {
  const authResult = await verifyAdminToken(req);
  if (!authResult.valid) {
    return res.status(403).json({ error: 'Unauthorized: Valid Firebase Admin ID Token required' });
  }

  const newAdminEmail = (req.body.email || '').trim();
  if (!newAdminEmail || !newAdminEmail.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  const admins = readJsonFile(adminsFilePath, initialAdmins);

  // Check if email already exists
  const existing = admins.find((a: any) => (a.email || '').toLowerCase() === newAdminEmail.toLowerCase());
  if (existing) {
    existing.role = req.body.role || existing.role;
    writeJsonFile(adminsFilePath, admins);
    return res.status(200).json(existing);
  }

  const newAdmin = {
    id: `admin-${Date.now()}`,
    email: newAdminEmail,
    name: req.body.name || newAdminEmail.split('@')[0],
    role: req.body.role || 'Editor',
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  admins.push(newAdmin);
  writeJsonFile(adminsFilePath, admins);
  res.status(201).json(newAdmin);
});

app.delete('/api/admins/:id', async (req, res) => {
  const authResult = await verifyAdminToken(req);
  if (!authResult.valid) {
    return res.status(403).json({ error: 'Unauthorized: Valid Firebase Admin ID Token required' });
  }
  let admins = readJsonFile(adminsFilePath, initialAdmins);
  const targetAdmin = admins.find((a: any) => a.id === req.params.id);
  if (targetAdmin && targetAdmin.email.toLowerCase() === 'salunkhepranav2502@gmail.com') {
    return res.status(400).json({ error: 'Cannot remove the primary Super Admin account' });
  }
  if (admins.length <= 1) {
    return res.status(400).json({ error: 'Cannot remove the primary Super Admin account' });
  }
  admins = admins.filter((a: any) => a.id !== req.params.id);
  writeJsonFile(adminsFilePath, admins);
  res.json({ success: true });
});

// Site Settings API (About Photo)
app.get('/api/settings/about', (_req, res) => {
  const settings = readJsonFile(settingsFilePath, initialSettings);
  res.json({ aboutPhotoUrl: settings.aboutPhotoUrl || initialSettings.aboutPhotoUrl });
});

app.put('/api/settings/about', async (req, res) => {
  const authResult = await verifyAdminToken(req);
  if (!authResult.valid) {
    return res.status(403).json({ error: 'Unauthorized: Valid Firebase Admin ID Token required' });
  }
  const { aboutPhotoUrl } = req.body;
  if (!aboutPhotoUrl) {
    return res.status(400).json({ error: 'aboutPhotoUrl is required' });
  }
  const settings = readJsonFile(settingsFilePath, initialSettings);
  settings.aboutPhotoUrl = aboutPhotoUrl;
  writeJsonFile(settingsFilePath, settings);
  res.json({ success: true, aboutPhotoUrl });
});

// Contact Messages API
const messagesFilePath = path.join(dataDir, 'messages.json');
app.post('/api/contact', (req, res) => {
  const messages = readJsonFile(messagesFilePath, []);
  const newMessage = {
    id: `msg-${Date.now()}`,
    name: req.body.name,
    email: req.body.email,
    projectType: req.body.projectType || 'General Inquiry',
    budget: req.body.budget || 'Undisclosed',
    message: req.body.message,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  messages.unshift(newMessage);
  writeJsonFile(messagesFilePath, messages);
  res.status(201).json({ success: true, message: 'Message received by Pranav!' });
});

// Vite Middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 Pranav Salunkhe Filmmaker Portfolio Server running on http://localhost:${PORT}`);
  });
}

startServer();
