import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface RulersMyDB extends DBSchema {
  progress: {
    key: string;
    value: {
      id: string; // "era-name" unique key
      status: 'learning' | 'learned';
      updatedAt: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<RulersMyDB>>;

if (typeof window !== 'undefined') {
  dbPromise = openDB<RulersMyDB>('RulersPWA', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'id' });
      }
    },
  });
}

export async function saveProgress(id: string, status: 'learning' | 'learned') {
  const db = await dbPromise;
  await db.put('progress', {
    id,
    status,
    updatedAt: Date.now()
  });
}

export async function getProgress(id: string) {
  const db = await dbPromise;
  return db.get('progress', id);
}

export async function getAllProgress() {
  const db = await dbPromise;
  return db.getAll('progress');
}

export async function resetProgress() {
  const db = await dbPromise;
  await db.clear('progress');
}
