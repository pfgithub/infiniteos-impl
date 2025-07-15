import React, { useState, useEffect } from 'react';
import useWindowStore from '../../../store/windowStore';
import { todoImplement } from '../../../todo';
import { readFile } from '../../../filesystem';
import IslandEscapeGame from './IslandEscapeGame';

interface IslandEscapeMainMenuProps {
  id: string; // window id
}

type Screen = 'main_menu' | 'in_game';

// A button styled to look like a piece of driftwood or a wooden sign.
const MainMenuButton = ({ children, onClick, id }: { children: React.ReactNode, onClick: () => void, id: string }) => (
  <button
    id={id}
    className="w-48 px-4 py-2 text-2xl text-amber-100 bg-yellow-900/70 border-2 border-amber-700/50 rounded-sm shadow-2xl transform -skew-x-12 hover:bg-yellow-800/80 hover:scale-105 hover:border-amber-600 transition-all duration-300"
    style={{ fontFamily: "'Papyrus', 'fantasy'", textShadow: '2px 2px 2px #000' }}
    onClick={onClick}
  >
    <span className="block transform skew-x-12">{children}</span>
  </button>
);


const IslandEscapeMainMenu: React.FC<IslandEscapeMainMenuProps> = ({ id }) => {
  const { closeWindow } = useWindowStore();
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [screen, setScreen] = useState<Screen>('main_menu');

  useEffect(() => {
    const loadBg = async () => {
      try {
        const bgFile = await readFile('/Games/IslandEscape/main_menu_bg.jpg');
        if (bgFile && bgFile.url) {
          setBackgroundUrl(bgFile.url);
        }
      } catch (e) {
        console.error("Failed to load Island Escape main menu background", e);
      }
    };
    loadBg();
  }, []);

  if (screen === 'in_game') {
    return <IslandEscapeGame onQuit={() => setScreen('main_menu')} />;
  }
  
  const handleQuitToDesktop = () => {
    closeWindow(id);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white bg-black select-none">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none',
          filter: 'brightness(0.9)',
        }}
      />
      <div className="relative flex-grow w-full flex flex-col items-center justify-between p-12">
        {/* Title Section */}
        <div className="text-center">
            <h1 className="text-8xl font-bold text-white mb-2" style={{ fontFamily: "Papyrus, fantasy", textShadow: '3px 3px 6px rgba(0,0,0,0.7)' }}>
                Island Escape
            </h1>
            <p className="text-amber-100 text-xl font-semibold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                The tide is coming in. Can you get away?
            </p>
        </div>
        
        {/* Buttons Section */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
            <MainMenuButton id="islandescape_new_game" onClick={() => setScreen('in_game')}>
                Begin
            </MainMenuButton>
            <MainMenuButton id="islandescape_load_game" onClick={() => todoImplement('Implement "Load Game" for Island Escape. This should show a list of saved games.')}>
                Continue
            </MainMenuButton>
            <MainMenuButton id="islandescape_options" onClick={() => todoImplement('Implement "Options" for Island Escape. This should show settings for audio, etc.')}>
                Options
            </MainMenuButton>
            <MainMenuButton id="islandescape_quit" onClick={handleQuitToDesktop}>
                Quit
            </MainMenuButton>
        </div>
      </div>
    </div>
  );
};

export default IslandEscapeMainMenu;
