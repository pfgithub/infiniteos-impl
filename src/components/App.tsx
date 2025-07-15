import React, { useState, useEffect } from 'react';
import Desktop from './Desktop';
import Taskbar from './Taskbar';
import useWindowStore from '../store/windowStore';
import Window from './Window';
import { initialize, readFile } from '../filesystem';
import StartMenu from './StartMenu';

function App() {
  const { windows } = useWindowStore();
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [isFsReady, setIsFsReady] = useState(false);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);

  const loadBackground = async () => {
    try {
      const settings = await readFile('/Users/Admin/settings.ini');
      if (settings && settings.contents) {
        const bgPathMatch = settings.contents.match(/desktop_background=(.*)/);
        if (bgPathMatch && bgPathMatch[1]) {
          const bgPath = bgPathMatch[1];
          const bgFile = await readFile(bgPath);
          if (bgFile && bgFile.url) {
            setBackgroundUrl(bgFile.url);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load background:", error);
    }
  };

  const toggleStartMenu = () => {
    setStartMenuOpen(prev => !prev);
  };
  const closeStartMenu = () => {
    setStartMenuOpen(false);
  };

  useEffect(() => {
    const init = async () => {
      await initialize();
      await loadBackground();
      setIsFsReady(true);
    };
    init();

    const handleSettingsChange = () => {
      loadBackground();
    };

    window.addEventListener('settings-changed', handleSettingsChange);
    return () => {
      window.removeEventListener('settings-changed', handleSettingsChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isStartMenuOpen) {
        const startButton = document.getElementById('start_button');
        const startMenu = document.getElementById('start_menu');
        if (startButton && startButton.contains(event.target as Node)) return;
        if (startMenu && startMenu.contains(event.target as Node)) return;
        closeStartMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStartMenuOpen]);


  const backgroundStyle = {
    backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none',
    backgroundColor: '#000',
  };

  if (!isFsReady) {
    return <div className="h-screen w-screen bg-black flex items-center justify-center text-white">Initializing Filesystem...</div>;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-cover bg-center" style={backgroundStyle}>
      <div className="h-full w-full flex flex-col">
        <div className="flex-grow relative">
          <Desktop />
          {windows.map((window) => (
            <Window key={window.id} window={window} />
          ))}
        </div>
        <StartMenu isOpen={isStartMenuOpen} onClose={closeStartMenu} />
        <Taskbar onStartClick={toggleStartMenu} />
      </div>
    </div>
  );
}

export default App;
