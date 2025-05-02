import { openDB } from 'idb';

const dbPromise = typeof window !== 'undefined' 
  ? openDB('etcm-settings', 1, {
      upgrade(db) {
        db.createObjectStore('settings');
      },
    })
  : null;

export const Settings = {
  async get(key: string) {
    if (!dbPromise) return null;
    return (await dbPromise).get('settings', key);
  },
  async set(key: string, val: any) {
    if (!dbPromise) return null;
    return (await dbPromise).put('settings', val, key);
  },
  async delete(key: string) {
    if (!dbPromise) return null;
    return (await dbPromise).delete('settings', key);
  },
};
