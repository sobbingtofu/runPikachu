// IndexedDB 유틸 함수
const DB_NAME = 'imgDB';
const STORE_NAME = 'imgs';

export function openImgDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function getImg(
  db: IDBDatabase,
  name: string,
): Promise<Blob | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(name);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function putImg(
  db: IDBDatabase,
  name: string,
  blob: Blob,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(blob, name);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
