import { initialFilesystem } from "./initialFilesystem";

const DB_NAME = 'CuOS-FS';
const STORE_NAME = 'files';
const DB_VERSION = 1;
const TRASH_DIR = '/.trash/';

interface FsEntry {
    path: string;
    data: any;
}

let db: IDBDatabase;

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'path' });
            }
        };
    });
}

async function getDb() {
    if (db) return db;
    db = await openDatabase();
    return db;
}


export async function initialize() {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const countReq = store.count();
    
    return new Promise<void>((resolve, reject) => {
        countReq.onsuccess = () => {
            if (countReq.result === 0) {
                console.log("Initializing filesystem in IndexedDB...");
                const writeTx = db.transaction(STORE_NAME, 'readwrite');
                const writeStore = writeTx.objectStore(STORE_NAME);
                Object.entries(initialFilesystem).forEach(([path, data]) => {
                    writeStore.put({ path, data });
                });
                writeTx.oncomplete = () => {
                    console.log("Filesystem initialized.");
                    resolve();
                };
                writeTx.onerror = () => {
                    reject(writeTx.error);
                };
            } else {
                console.log("Filesystem already exists.");
                resolve();
            }
        };
        countReq.onerror = () => reject(countReq.error);
    });
}

export async function readFile(path: string): Promise<any> {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(path);
    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            if (!req.result) return reject(new Error("File not found"));
            resolve(req.result?.data);
        };
        req.onerror = () => reject(req.error);
    });
}

export async function writeFile(path: string, data: any): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put({ path, data });
    return new Promise<void>((resolve, reject) => {
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

export async function deleteFile(path: string): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(path);
    return new Promise<void>((resolve, reject) => {
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

export async function trashFile(path: string): Promise<void> {
    if (path === TRASH_DIR || path.startsWith(TRASH_DIR)) {
        throw new Error("Cannot trash items from the recycle bin.");
    }
    const fileData = await readFile(path);
    const fileName = path.substring(path.lastIndexOf('/') + 1) || path;
    const trashPath = `${TRASH_DIR}${Date.now()}-${fileName}`;
    
    const trashInfo = {
        originalPath: path,
        deletedAt: new Date().toISOString(),
        data: fileData,
    };

    await writeFile(trashPath, trashInfo);
    await deleteFile(path);
}

export async function getTrashItems(): Promise<{ path: string, name: string, originalPath: string, deletedAt: string }[]> {
    const trashDirContents = await readDir(TRASH_DIR);
    const items = await Promise.all(
        trashDirContents.map(async (item) => {
            if (item.isDir) return null;
            try {
                const trashInfo = await readFile(item.path);
                if (trashInfo && trashInfo.originalPath && trashInfo.deletedAt) {
                    return {
                        path: item.path,
                        name: item.name,
                        originalPath: trashInfo.originalPath,
                        deletedAt: trashInfo.deletedAt,
                    };
                }
            } catch (e) {
                console.error(`Could not read trash item metadata for ${item.path}`, e);
            }
            return null;
        })
    );
    return items.filter(Boolean) as any;
}

export async function restoreTrashItem(trashPath: string): Promise<void> {
    const trashInfo = await readFile(trashPath);
    if (!trashInfo || !trashInfo.originalPath) {
        throw new Error("Invalid trash item: missing original path metadata.");
    }
    await mkdirp(trashInfo.originalPath);
    await writeFile(trashInfo.originalPath, trashInfo.data);
    await deleteFile(trashPath);
}

export async function deleteTrashItem(trashPath: string): Promise<void> {
    await deleteFile(trashPath);
}

export async function emptyTrash(): Promise<void> {
    const trashDirContents = await readDir(TRASH_DIR);
    const deletePromises = trashDirContents.map(item => deleteFile(item.path));
    await Promise.all(deletePromises);
}

export async function mkdirp(path: string): Promise<void> {
    let dirPath = path;
    if (!dirPath.endsWith('/')) {
        dirPath = dirPath.substring(0, dirPath.lastIndexOf('/') + 1);
    }
    if (!dirPath) return;
    
    const parts = dirPath.split('/').filter(p => p.length > 0);
    let currentPath = '/';
    for (const part of parts) {
        currentPath += part + '/';
        try {
            await readFile(currentPath);
        } catch (e) {
            if (e instanceof Error && e.message.includes("File not found")) {
                await writeFile(currentPath, {});
            } else {
                throw e; // rethrow other errors
            }
        }
    }
}

export async function readDir(dirPath: string): Promise<{name: string, path: string, isDir: boolean}[]> {
    if (!dirPath.endsWith('/')) {
        dirPath += '/';
    }

    const db = await getDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAllKeys();

    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            const allKeys = req.result as string[];
            const children = new Map<string, {name: string, path: string, isDir: boolean}>();

            allKeys.forEach(key => {
                if (key.startsWith(dirPath) && key !== dirPath) {
                    const relativePath = key.substring(dirPath.length);
                    const segments = relativePath.split('/');
                    const childName = segments[0];

                    if (childName && !children.has(childName)) {
                        const isDir = segments.length > 1;
                        const childPath = isDir ? `${dirPath}${childName}/` : `${dirPath}${childName}`;
                        children.set(childName, {
                            name: childName,
                            path: childPath,
                            isDir: isDir,
                        });
                    }
                }
            });

            resolve(Array.from(children.values()));
        };
        req.onerror = () => reject(req.error);
    });
}

export async function clearDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (db) {
            db.close();
            // We need to undefine db so that getDb will re-open it if needed (although we will reload).
            (db as any) = undefined;
        }

        const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

        deleteRequest.onsuccess = () => {
            console.log(`Database ${DB_NAME} deleted successfully.`);
            resolve();
        };

        deleteRequest.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            console.error(`Error deleting database ${DB_NAME}:`, error);
            reject(error);
        };

        deleteRequest.onblocked = (event) => {
            const error = new Error("Database deletion is blocked. Please close all other tabs with this app open and try again.");
            console.warn(`Database deletion blocked.`, event);
            reject(error);
        };
    });
}
