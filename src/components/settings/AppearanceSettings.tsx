import React, { useState, useEffect } from 'react';
import { todoImplement } from '../../todo';
import { readDir, readFile, writeFile } from '../../filesystem';

const accentColors = [
  "bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500",
];

interface Wallpaper {
  path: string;
  url: string;
}

function AppearanceSettings() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [activeWallpaperPath, setActiveWallpaperPath] = useState('');
  const [activeAccent, setActiveAccent] = React.useState(accentColors[0]);

  useEffect(() => {
    const loadWallpapers = async () => {
        try {
            const files = await readDir('/Users/Admin/Pictures/Wallpapers/');
            const wallpaperPromises = files
                .filter(f => !f.isDir && (f.name.endsWith('.jpg') || f.name.endsWith('.png')))
                .map(async (file) => {
                    const meta = await readFile(file.path);
                    if (meta && meta.url) {
                        return { path: file.path, url: meta.url };
                    }
                    return null;
                });
            const loadedWallpapers = (await Promise.all(wallpaperPromises)).filter(Boolean) as Wallpaper[];
            setWallpapers(loadedWallpapers);
        } catch (error) {
            console.error("Failed to load wallpapers:", error);
        }
    };

    const loadCurrentWallpaper = async () => {
        try {
            const settings = await readFile('/Users/Admin/settings.ini');
            if (settings && settings.contents) {
                const bgPathMatch = settings.contents.match(/desktop_background=(.*)/);
                if (bgPathMatch && bgPathMatch[1]) {
                    setActiveWallpaperPath(bgPathMatch[1]);
                }
            }
        } catch (error) {
            console.error("Failed to load current wallpaper setting:", error);
        }
    };

    loadWallpapers();
    loadCurrentWallpaper();
  }, []);

  const handleSetWallpaper = async (wallpaper: Wallpaper) => {
      try {
          const settings = await readFile('/Users/Admin/settings.ini');
          const newContents = settings.contents.replace(/desktop_background=.*/, `desktop_background=${wallpaper.path}`);
          await writeFile('/Users/Admin/settings.ini', { ...settings, contents: newContents });
          setActiveWallpaperPath(wallpaper.path);
          window.dispatchEvent(new CustomEvent('settings-changed'));
      } catch(error) {
          console.error("Failed to set wallpaper:", error);
          todoImplement(`Failed to set wallpaper: ${error instanceof Error ? error.message : String(error)}`);
      }
  };

  const activeWallpaper = wallpapers.find(w => w.path === activeWallpaperPath);

  return (
    <div className="flex-grow p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Appearance</h2>
      <div className="space-y-6">
        
        {/* Theme */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Theme</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3 flex items-center justify-between">
            <span>Dark Mode</span>
            <label htmlFor="theme_toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="theme_toggle" 
                  className="sr-only peer" 
                  defaultChecked 
                  onChange={() => todoImplement("The theme toggle (Dark/Light mode) in Appearance settings was changed. Implement switching the UI between dark and light themes.")}
                />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className="absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-all peer-checked:translate-x-[1.5rem] peer-checked:bg-blue-500"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Accent Color</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
              {accentColors.map(color => (
                <button 
                  key={color}
                  aria-label={`Set accent color to ${color.split('-')[1]}`}
                  className={`w-12 h-12 rounded-full ${color} transition-transform hover:scale-110 ${activeAccent === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}
                  onClick={() => {
                    setActiveAccent(color);
                    todoImplement(`The accent color ${color.split('-')[1]} was selected. Implement applying this accent color system-wide.`);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Wallpaper */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">Wallpaper</h3>
          <div className="bg-black/20 p-4 rounded-lg mt-3">
            <p className="mb-3">Current Wallpaper:</p>
            {activeWallpaper && <img src={activeWallpaper.url} alt="Current Wallpaper" className="rounded-lg mb-4 w-full h-48 object-cover"/>}
            <p className="mb-3">Choose a new wallpaper:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wallpapers.map(wp => (
                <img 
                  key={wp.path} 
                  src={wp.url} 
                  alt="Wallpaper option" 
                  className={`rounded-md cursor-pointer h-24 w-full object-cover transition-all ${activeWallpaperPath === wp.path ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500' : 'hover:opacity-80'}`}
                  onClick={() => handleSetWallpaper(wp)}
                />
              ))}
            </div>
            <button 
              id="settings_upload_wallpaper" 
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors w-full sm:w-auto"
              onClick={() => todoImplement("The 'Upload new wallpaper' button was clicked. Implement a file picker to allow users to upload and set a new wallpaper.")}>
              Upload new wallpaper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppearanceSettings;
