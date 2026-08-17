export interface Film {
  id: string;
  title: string;
  genre: string; // e.g. "Short Film", "Color Grading", "Commercial", "YouTube", "Music Video"
  duration: string; // e.g. "12:45"
  year: number;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  featured?: boolean;
  createdAt: string;
  aspectRatio?: string; // e.g. "16:9", "2.39:1"
  director?: string;
  role?: string; // e.g. "Director & Editor", "Lead Colorist", "Video Editor"
}

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  iconName: string;
  tools: string[];
}

export interface ResolveStep {
  id: string;
  name: 'Media' | 'Cut' | 'Edit' | 'Fusion' | 'Color' | 'Fairlight' | 'Deliver';
  tagline: string;
  description: string;
  keyFeatures: string[];
  shortcut: string;
  accentColor: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Editor' | 'Viewer';
  lastActive: string;
  createdAt: string;
}

export interface AnalyticsData {
  totalFilms: number;
  totalViews: number;
  storageUsedMB: number;
  storageLimitMB: number;
  monthlyViews: { month: string; views: number }[];
  topFilms: { filmId: string; title: string; views: number }[];
}

export interface UserSession {
  user: AdminUser;
  token: string;
}
