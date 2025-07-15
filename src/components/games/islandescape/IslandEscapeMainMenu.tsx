import React, { useState, useEffect } from 'react';
import useWindowStore from '../../../store/windowStore';
import { todoImplement } from '../../../todo';
import { readFile } from '../../../filesystem';
import IslandEscapeGame from './IslandEscapeGame';

interface IslandEscapeMainMenuProps {
  id: string; // window id
}

type Screen = 'main_menu' | 'in_game';

const MainMenuButton = ({ children, onClick, id }: { children: React.ReactNode, onClick: () => void, id: string }) => (
  <button
    id={id}
    className="w-full max-w-xs px-6 py-3 text-lg font-semibold text-amber-900 bg-amber-500/80 border-2 border-amber-600/50 rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.3)] hover:bg-amber-400/90 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105"
    onClick={onClick}
  >
    {children}
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

  const menuContent = (
    <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl shadow-2xl flex flex-col items-center">
      <h1 className="text-7xl font-bold text-white mb-2" style={{ fontFamily: "Papyrus, fantasy", textShadow: '3px 3px 0px #047857, 6px 6px 0px rgba(0,0,0,0.2)' }}>
        Island Escape
      </h1>
      <p className="text-amber-100 mb-10 text-xl font-semibold">Can you solve the mystery and find a way home?</p>
      
      <div className="flex flex-col gap-4">
        <MainMenuButton id="islandescape_new_game" onClick={() => setScreen('in_game')}>
          New Game
        </MainMenuButton>
        <MainMenuButton id="islandescape_load_game" onClick={() => todoImplement('Implement "Load Game" for Island Escape. This should show a list of saved games.')}>
          Load Game
        </MainMenuButton>
        <MainMenuButton id="islandescape_options" onClick={() => todoImplement('Implement "Options" for Island Escape. This should show settings for audio, etc.')}>
          Options
        </MainMenuButton>
        <MainMenuButton id="islandescape_quit" onClick={handleQuitToDesktop}>
          Quit
        </MainMenuButton>
      </div>
    </div>
  );

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none', filter: 'blur(2px) brightness(0.8)' }}
      />
      <div className="relative flex-grow w-full flex items-center justify-center p-4">
        {menuContent}
      </div>
    </div>
  );
};

export default IslandEscapeMainMenu;
