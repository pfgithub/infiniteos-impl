const DB_NAME = 'CuOS-FS';
const STORE_NAME = 'files';
const DB_VERSION = 1;
const TRASH_DIR = '/.trash/';

interface FsEntry {
    path: string;
    data: any;
}

const initialFilesystem = {
    "/": {},
    "/Users/": {},
    "/Users/Admin/": {},
    "/Users/Admin/Desktop/": {},
    "/Users/Admin/Desktop/Browser.desktop": {},
    "/Users/Admin/Desktop/File Explorer.desktop": {},
    "/Users/Admin/Desktop/Recycle Bin.desktop": {},
    "/Users/Admin/Desktop/Settings.desktop": {},
    "/Users/Admin/Desktop/Games.desktop": {},
    "/Users/Admin/Desktop/Clock.desktop": {},
    "/Users/Admin/Documents/": {},
    "/Users/Admin/Documents/Work/": {},
    "/Users/Admin/Documents/Work/Project_Proposal.pdf": {},
    "/Users/Admin/Documents/Work/Meeting_Notes.txt": {},
    "/Users/Admin/Documents/Personal/": {},
    "/Users/Admin/Documents/Personal/resume_2025.pdf": {},
    "/Users/Admin/Documents/Personal/travel_itinerary.xlsx": {},
    "/Users/Admin/Documents/Personal/recipes.txt": {},
    "/Users/Admin/Pictures/": {},
    "/Users/Admin/Pictures/Wallpapers/": {},
    "/Users/Admin/Pictures/Wallpapers/default_wallpaper.jpg": {
        "url": "https://images.unsplash.com/photo-1747985323857-5c1c16b2ac47?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "/Users/Admin/Pictures/Wallpapers/snowy_mountain.jpg": {
        "url": "https://images.unsplash.com/photo-1573671935871-77305106a2f2?q=80&w=1464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "/Users/Admin/Pictures/Wallpapers/galaxy.jpg": {
        "url": "https://images.unsplash.com/photo-1741282198587-65bf77e6075d?q=80&w=1091&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "/Users/Admin/Pictures/Wallpapers/hills.jpg": {
        "url": "https://images.unsplash.com/photo-1746937807433-05748b80caf4?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "/Users/Admin/Pictures/Wallpapers/dolomites.jpg": {
        "url": "https://images.unsplash.com/photo-1745669754254-c30c98e5f8b1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "/Users/Admin/Pictures/Wallpapers/sunset.jpg": {},
    "/Users/Admin/Pictures/Wallpapers/abstract.png": {},
    "/Users/Admin/Pictures/Family/": {},
    "/Users/Admin/Pictures/Family/2024_birthday_party_01.jpg": {},
    "/Users/Admin/Pictures/Family/2024_holiday_gathering.png": {},
    "/Users/Admin/Pictures/Screenshots/": {},
    "/Users/Admin/Pictures/Screenshots/screenshot_2025-07-15.png": {},
    "/Users/Admin/Downloads/": {},
    "/Users/Admin/Downloads/project_presentation.pptx": {},
    "/Users/Admin/Downloads/software_update_installer.exe": {},
    "/Users/Admin/Downloads/ebook_collection.zip": {},
    "/Users/Admin/Music/": {},
    "/Users/Admin/Music/Favorite_Artists/": {},
    "/Users/Admin/Music/Favorite_Artists/Artist_A/album1_song1.mp3": {},
    "/Users/Admin/Music/Favorite_Artists/Artist_B/album2_song3.flac": {},
    "/Users/Admin/Music/workout_playlist.m3u": {},
    "/Users/Admin/Music/chill_mix.pls": {},
    "/Users/Admin/Videos/": {},
    "/Users/Admin/Videos/Vacation_2024/": {},
    "/Users/Admin/Videos/Vacation_2024/day_1_highlights.mp4": {},
    "/Users/Admin/Videos/Vacation_2024/scenic_views.mov": {},
    "/Users/Admin/Videos/Funny_Clips/cat_video.avi": {},
    "/Users/Admin/settings.ini": {
        "contents": "desktop_background=/Users/Admin/Pictures/Wallpapers/galaxy.jpg"
    },
    "/Games/": {},
    "/Games/Starfall/": {},
    "/Games/CyberRunner/": {},
    "/Games/CyberRunner/main_menu_bg.jpg": {
        "url": "https://images.unsplash.com/photo-1618962059365-c323d8c2d96c?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "/Games/DungeonDelve/": {},
    "/Games/DungeonDelve/main_menu_bg.jpg": {
        "url": "https://images.unsplash.com/photo-1531383956816-1a2c5a7238c3?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "/Games/IslandEscape/": {},
    "/Games/IslandEscape/main_menu_bg.jpg": {
        "url": "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    "/Games/MechWarriors/": {},
    "/Games/CitySkylines/": {},
    "/System/": {},
    "/System/SystemInfo.txt": {},
    "/System/config/": {},
    "/System/config/system.conf": {},
    "/System/config/network.conf": {},
    "/System/drivers/": {},
    "/System/drivers/network.sys": {},
    "/System/drivers/audio.sys": {},
    "/System/drivers/video.sys": {},
    "/System/drivers/input.sys": {},
    "/System/fonts/": {},
    "/System/fonts/arial.ttf": {},
    "/System/fonts/times_new_roman.ttf": {},
    "/System/boot.ini": {},
    "/System/kernel.sys": {},
    "/System/log/": {},
    "/System/log/system_events.log": {},
    "/System/log/error_log.txt": {},
    "/Applications/": {},
    "/Applications/Browser.app": {},
    "/Applications/FileExplorer.app": {},
    "/Applications/Settings.app": {},
    "/Applications/TextEditor.app": {},
    "/Applications/MusicPlayer.app": {},
    "/Applications/ImageViewer.app": {},
    "/Applications/Feedback.app": {},
    "/Applications/Calculator.app": {},
    "/Applications/Terminal.app": {},
    "/Applications/EmailClient.app": {},
    "/Applications/Calendar.app": {},
    "/Applications/Maps.app": {},
    "/Applications/Weather.app": {},
    "/Applications/Photos.app": {},
    "/Applications/VideoPlayer.app": {},
    "/Applications/Spreadsheet.app": {},
    "/Applications/Presentation.app": {},
    "/Applications/WordProcessor.app": {},
    "/Applications/CodeEditor.app": {},
    "/Applications/GameCenter.app": {},
    "/Applications/Notes.app": {},
    "/Applications/Contacts.app": {},
    "/Applications/Clock.app": {},
    "/Applications/Antivirus.app": {},
    "/Applications/PDF_Reader.app": {},
    "/Applications/CloudStorage.app": {},
    "/Applications/VPN.app": {},
    "/Applications/SpaceAdventures.app": {},
    "/.trash/": {},
    "/.trash/1721052000000-Q3_Financial_Report.docx": {
        "originalPath": "/Users/Admin/Documents/Work/Q3_Financial_Report.docx",
        "deletedAt": "2025-07-15T14:00:00.000Z",
        "data": { "contents": "This was the Q3 financial report. It has been deleted." }
    }
};

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
            const children = allKeys
                .filter(key => key.startsWith(dirPath) && key !== dirPath)
                .map(key => {
                    const relativePath = key.substring(dirPath.length);
                    // A direct child is one that does not contain any intermediate slashes.
                    if (relativePath.slice(0, -1).includes('/')) {
                        return null;
                    }
                    const isDir = key.endsWith('/');
                    const name = isDir ? relativePath.slice(0, -1) : relativePath;
                    return { name, path: key, isDir };
                })
                .filter((item): item is { name: string; path: string; isDir: boolean } => item !== null);
            resolve(children);
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
