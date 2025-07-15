import React, { useState, useEffect } from 'react';
import useWindowStore from '../../../store/windowStore';
import { todoImplement } from '../../../todo';
import { readFile } from '../../../filesystem';
import PixelQuestGame from './PixelQuestGame';

interface PixelQuestMainMenuProps {
  id: string; // window id
}

type Screen = 'main_menu' | 'in_game';

const MainMenuButton = ({ children, onClick, id }: { children: React.ReactNode, onClick: () => void, id: string }) => (
  <button
    id={id}
    className="w-full max-w-xs px-6 py-3 text-lg font-mono text-white bg-indigo-600 border-b-4 border-indigo-800 rounded-none shadow-lg hover:bg-indigo-500 active:border-b-2 active:mt-[2px] transition-all duration-100"
    onClick={onClick}
  >
    {children}
  </button>
);

const PixelQuestMainMenu: React.FC<PixelQuestMainMenuProps> = ({ id }) => {
  const { closeWindow } = useWindowStore();
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [screen, setScreen] = useState<Screen>('main_menu');

  useEffect(() => {
    const loadBg = async () => {
      try {
        const bgFile = await readFile('/Games/PixelQuest/main_menu_bg.jpg');
        if (bgFile && bgFile.url) {
          setBackgroundUrl(bgFile.url);
        }
      } catch (e) {
        console.error("Failed to load Pixel Quest main menu background", e);
      }
    };
    loadBg();
  }, []);

  if (screen === 'in_game') {
    return <PixelQuestGame onQuit={() => setScreen('main_menu')} />;
  }
  
  const handleQuitToDesktop = () => {
    closeWindow(id);
  };

  const menuContent = (
    <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl flex flex-col items-center">
      <h1 className="text-7xl font-bold font-mono text-white mb-2" style={{ textShadow: '4px 4px 0px #2563eb' }}>
        Pixel Quest
      </h1>
      <p className="text-gray-300 mb-10 text-xl font-mono">A classic 2D RPG adventure.</p>
      
      <div className="flex flex-col gap-4">
        <MainMenuButton id="pixelquest_new_game" onClick={() => setScreen('in_game')}>
          New Game
        </MainMenuButton>
        <MainMenuButton id="pixelquest_load_game" onClick={() => todoImplement('Implement "Load Game" for Pixel Quest. This should show a list of saved games.')}>
          Load Game
        </MainMenuButton>
        <MainMenuButton id="pixelquest_options" onClick={() => todoImplement('Implement "Options" for Pixel Quest. This should show settings for audio, graphics, etc.')}>
          Options
        </MainMenuButton>
        <MainMenuButton id="pixelquest_quit" onClick={handleQuitToDesktop}>
          Quit to Desktop
        </MainMenuButton>
      </div>
    </div>
  );

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none', filter: 'blur(2px) brightness(0.7)' }}
      />
      <div className="relative flex-grow w-full flex items-center justify-center p-4">
        {menuContent}
      </div>
    </div>
  );
};

export default PixelQuestMainMenu;
