import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, setDoc, increment } from 'firebase/firestore';
import { db, auth, ALLOWED_ADMIN_EMAIL } from './firebase';
import { Film, AdminUser, AnalyticsData, ContactMessage } from '../types';

export const API_BASE = '/api';

export async function fetchFilms(): Promise<Film[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'films'));
    const films: Film[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      films.push({
        id: docSnap.id,
        title: data.title || '',
        genre: data.genre || 'Short Film',
        duration: data.duration || '00:00',
        year: data.year || new Date().getFullYear(),
        description: data.description || '',
        thumbnailUrl: data.thumbnailUrl || '',
        videoUrl: data.videoUrl || '',
        views: data.views || 0,
        featured: data.featured ?? false,
        createdAt: data.createdAt || new Date().toISOString(),
        aspectRatio: data.aspectRatio || '16:9',
        director: data.director || 'Pranav Salunkhe',
        role: data.role || 'Editor',
      });
    });
    return films;
  } catch (err) {
    console.warn('Firestore fetch error:', err);
    return [];
  }
}

export async function createFilm(filmData: Partial<Film>): Promise<Film> {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: Please log in as admin.');
  }

  const newFilm = {
    title: filmData.title || 'Untitled',
    genre: filmData.genre || 'Short Film',
    duration: filmData.duration || '00:00',
    year: filmData.year || new Date().getFullYear(),
    description: filmData.description || '',
    thumbnailUrl: filmData.thumbnailUrl || '',
    videoUrl: filmData.videoUrl || '',
    views: 0,
    featured: filmData.featured ?? false,
    createdAt: new Date().toISOString(),
    aspectRatio: filmData.aspectRatio || '16:9',
    director: filmData.director || 'Pranav Salunkhe',
    role: filmData.role || 'Director & Editor',
  };

  try {
    const docRef = await addDoc(collection(db, 'films'), newFilm);
    const created: Film = { id: docRef.id, ...newFilm };
    
    // Also sync to backend for redundancy
    try {
      const idToken = await currentUser.getIdToken();
      await fetch(`${API_BASE}/films`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(created),
      });
    } catch (syncErr) {
      console.warn('Backend sync error:', syncErr);
    }

    return created;
  } catch (err: any) {
    console.error('Firestore create error:', err);
    throw new Error(`Failed to create film in Firestore: ${err.message || 'Permission denied'}`);
  }
}

export async function updateFilm(id: string, filmData: Partial<Film>): Promise<Film> {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  
  // Allow view increment without admin auth check
  const isViewOnlyUpdate = Object.keys(filmData).length === 1 && 'views' in filmData;

  if (!isViewOnlyUpdate && !currentUser) {
    throw new Error('Authentication required: Please log in as admin.');
  }

  try {
    const docRef = doc(db, 'films', id);
    await updateDoc(docRef, filmData);
    
    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken();
        await fetch(`${API_BASE}/films/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify(filmData),
        });
      } catch (syncErr) {
        console.warn('Backend sync error:', syncErr);
      }
    }

    return { id, ...filmData } as Film;
  } catch (err: any) {
    console.error('Firestore update error:', err);
    throw new Error(`Failed to update film in Firestore: ${err.message || 'Permission denied'}`);
  }
}

export async function deleteFilm(id: string): Promise<boolean> {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: Please log in as admin to delete films.');
  }

  if (currentUser.email !== ALLOWED_ADMIN_EMAIL && currentUser.uid !== 'vNRfqdX0xueDmU4RipMYhQCWV6H2') {
    throw new Error('Access denied: Unauthorized user account.');
  }

  // 1. Delete document directly from Firestore using authenticated credentials
  try {
    await deleteDoc(doc(db, 'films', id));
  } catch (err: any) {
    console.error('Firestore deleteDoc failed:', err);
    throw new Error(`Firestore deletion failed: ${err.message || 'Permission denied'}`);
  }

  // 2. Sync deletion with Express backend passing the Firebase ID token
  try {
    const idToken = await currentUser.getIdToken();
    await fetch(`${API_BASE}/films/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });
  } catch (syncErr) {
    console.warn('Backend sync delete error:', syncErr);
  }

  return true;
}

export async function trackFilmView(id: string): Promise<number> {
  try {
    const docRef = doc(db, 'films', id);
    await updateDoc(docRef, { views: increment(1) });
    return 1;
  } catch (err) {
    console.error('Failed to track view in Firestore:', err);
  }
  return 0;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API error fetching analytics:', err);
  }
  return {
    totalFilms: 5,
    totalViews: 9780,
    storageUsedMB: 2520,
    storageLimitMB: 50000,
    monthlyViews: [
      { month: 'Mar', views: 820 },
      { month: 'Apr', views: 1240 },
      { month: 'May', views: 1980 },
      { month: 'Jun', views: 2450 },
      { month: 'Jul', views: 3100 },
      { month: 'Aug', views: 4280 },
    ],
    topFilms: [],
  };
}

export async function fetchAdmins(): Promise<AdminUser[]> {
  try {
    const res = await fetch(`${API_BASE}/admins`);
    if (res.ok) {
      const serverAdmins: AdminUser[] = await res.json();
      try {
        const querySnapshot = await getDocs(collection(db, 'admins'));
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (!serverAdmins.some((a) => (a.email || '').toLowerCase() === (data.email || '').toLowerCase())) {
            serverAdmins.push({
              id: docSnap.id,
              email: data.email,
              name: data.name || data.email?.split('@')[0] || 'Admin',
              role: data.role || 'Editor',
              lastActive: data.lastActive || new Date().toISOString(),
              createdAt: data.createdAt || new Date().toISOString(),
            });
          }
        });
      } catch (fsErr) {
        console.warn('Firestore admins fetch warning:', fsErr);
      }
      return serverAdmins;
    }
  } catch (err) {
    console.warn('API error fetching admins:', err);
  }
  return [];
}

export async function addAdmin(email: string, role: 'Super Admin' | 'Editor' | 'Viewer'): Promise<AdminUser> {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: Please log in as admin.');
  }
  const idToken = await currentUser.getIdToken();

  const res = await fetch(`${API_BASE}/admins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ email, role }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to add admin');
  }
  const newAdmin: AdminUser = await res.json();

  // Sync to Firestore 'admins' collection
  try {
    await setDoc(doc(db, 'admins', newAdmin.id), {
      email: newAdmin.email,
      name: newAdmin.name,
      role: newAdmin.role,
      lastActive: newAdmin.lastActive,
      createdAt: newAdmin.createdAt,
    });
  } catch (fsErr) {
    console.warn('Firestore admin doc sync warning:', fsErr);
  }

  return newAdmin;
}

export async function removeAdmin(id: string): Promise<boolean> {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: Please log in as admin.');
  }
  const idToken = await currentUser.getIdToken();

  const res = await fetch(`${API_BASE}/admins/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  });

  if (res.ok) {
    try {
      await deleteDoc(doc(db, 'admins', id));
    } catch (fsErr) {
      console.warn('Firestore admin doc delete warning:', fsErr);
    }
  }

  return res.ok;
}

export async function submitContact(data: {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}): Promise<boolean> {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  try {
    await addDoc(collection(db, 'contact_messages'), payload);
  } catch (err) {
    console.warn('Firestore contact submission warning:', err);
  }

  try {
    await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Backend contact submission warning:', err);
  }

  return true;
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: Please log in as admin to view inquiries.');
  }

  if (currentUser.email !== ALLOWED_ADMIN_EMAIL && currentUser.uid !== 'vNRfqdX0xueDmU4RipMYhQCWV6H2') {
    throw new Error('Access denied: Unauthorized user account.');
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'contact_messages'));
    const messages: ContactMessage[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      messages.push({
        id: docSnap.id,
        name: data.name || 'Anonymous',
        email: data.email || 'No email',
        projectType: data.projectType || 'General Inquiry',
        budget: data.budget || 'Undisclosed',
        message: data.message || '',
        createdAt: data.createdAt || new Date().toISOString(),
        status: data.status || 'new',
      });
    });

    // Sort newest messages first
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return messages;
  } catch (err: any) {
    console.error('Firestore contact_messages fetch error:', err);
    throw new Error(`Failed to load inquiries: ${err.message || 'Permission denied'}`);
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: Please log in as admin to delete inquiries.');
  }

  if (currentUser.email !== ALLOWED_ADMIN_EMAIL && currentUser.uid !== 'vNRfqdX0xueDmU4RipMYhQCWV6H2') {
    throw new Error('Access denied: Unauthorized user account.');
  }

  try {
    await deleteDoc(doc(db, 'contact_messages', id));
    return true;
  } catch (err: any) {
    console.error('Firestore contact message delete error:', err);
    throw new Error(`Failed to delete inquiry: ${err.message || 'Permission denied'}`);
  }
}

export async function fetchAboutPhoto(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/settings/about`);
    if (res.ok) {
      const data = await res.json();
      return data.aboutPhotoUrl || '/src/assets/images/pranav_portrait_1786121160560.jpg';
    }
  } catch (err) {
    console.warn('API error fetching about photo:', err);
  }
  return '/src/assets/images/pranav_portrait_1786121160560.jpg';
}

export async function updateAboutPhoto(photoUrl: string): Promise<string> {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: Please log in as admin.');
  }
  const idToken = await currentUser.getIdToken();

  const res = await fetch(`${API_BASE}/settings/about`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ aboutPhotoUrl: photoUrl }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to update about photo');
  }
  const data = await res.json();
  return data.aboutPhotoUrl;
}

export async function uploadMedia(
  videoFile?: File,
  thumbnailFile?: File
): Promise<{ videoUrl?: string; thumbnailUrl?: string }> {
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required: Please log in as admin to upload files.');
  }
  const idToken = await currentUser.getIdToken();

  const formData = new FormData();
  if (videoFile) formData.append('video', videoFile);
  if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Upload failed');
  }
  return await res.json();
}
