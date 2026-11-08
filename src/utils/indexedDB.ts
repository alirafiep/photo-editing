import { PhotoProject, VideoProject, UserProfile } from '../types/editor';

const DB_NAME = 'SnapEdit_Studio_DB';
const DB_VERSION = 2;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('photo_projects')) {
        const pStore = db.createObjectStore('photo_projects', { keyPath: 'id' });
        pStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        pStore.createIndex('userId', 'userId', { unique: false });
      }
      if (!db.objectStoreNames.contains('video_projects')) {
        const vStore = db.createObjectStore('video_projects', { keyPath: 'id' });
        vStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        vStore.createIndex('userId', 'userId', { unique: false });
      }
      if (!db.objectStoreNames.contains('custom_fonts')) {
        db.createObjectStore('custom_fonts', { keyPath: 'name' });
      }
      if (!db.objectStoreNames.contains('user_settings')) {
        db.createObjectStore('user_settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ----------------- PHOTO PROJECTS ----------------- //
export async function savePhotoProject(project: PhotoProject): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('photo_projects', 'readwrite');
      const store = tx.objectStore('photo_projects');
      const req = store.put({
        ...project,
        updatedAt: Date.now(),
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error saving photo project:', err);
  }
}

export async function getPhotoProject(id: string): Promise<PhotoProject | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('photo_projects', 'readonly');
      const store = tx.objectStore('photo_projects');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error loading photo project:', err);
    return null;
  }
}

export async function getAllPhotoProjects(): Promise<PhotoProject[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('photo_projects', 'readonly');
      const store = tx.objectStore('photo_projects');
      const req = store.getAll();
      req.onsuccess = () => {
        const list: PhotoProject[] = req.result || [];
        list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error getting all photo projects:', err);
    return [];
  }
}

export async function deletePhotoProject(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('photo_projects', 'readwrite');
      const store = tx.objectStore('photo_projects');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error deleting photo project:', err);
  }
}

// ----------------- VIDEO PROJECTS ----------------- //
export async function saveVideoProject(project: VideoProject): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('video_projects', 'readwrite');
      const store = tx.objectStore('video_projects');
      const req = store.put({
        ...project,
        updatedAt: Date.now(),
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error saving video project:', err);
  }
}

export async function getVideoProject(id: string): Promise<VideoProject | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('video_projects', 'readonly');
      const store = tx.objectStore('video_projects');
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error loading video project:', err);
    return null;
  }
}

export async function getAllVideoProjects(): Promise<VideoProject[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('video_projects', 'readonly');
      const store = tx.objectStore('video_projects');
      const req = store.getAll();
      req.onsuccess = () => {
        const list: VideoProject[] = req.result || [];
        list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error getting all video projects:', err);
    return [];
  }
}

export async function deleteVideoProject(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('video_projects', 'readwrite');
      const store = tx.objectStore('video_projects');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error deleting video project:', err);
  }
}

// ----------------- CUSTOM IMPORTED FONTS ----------------- //
export interface CustomFontRecord {
  name: string;
  dataUrl: string;
  format: 'truetype' | 'opentype' | 'woff2';
  addedAt: number;
}

export async function saveCustomFont(font: CustomFontRecord): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('custom_fonts', 'readwrite');
      const store = tx.objectStore('custom_fonts');
      const req = store.put(font);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error saving custom font:', err);
  }
}

export async function getAllCustomFonts(): Promise<CustomFontRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('custom_fonts', 'readonly');
      const store = tx.objectStore('custom_fonts');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error reading custom fonts:', err);
    return [];
  }
}

// Aliases for compatibility
export const saveProjectToDB = savePhotoProject;
export const getAllProjectsFromDB = getAllPhotoProjects;
