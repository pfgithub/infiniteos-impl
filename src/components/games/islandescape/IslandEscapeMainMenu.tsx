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
    className="w-full max-w-xs px-6 py-3 text-lg text-cyan-200 bg-black/50 border-2 border-cyan-400/50 rounded-md shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:bg-cyan-400/20 hover:text-white hover:border-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105"
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

  const handleQuitGame = () => {
    setScreen('main_menu');
  };

  const handleQuitToDesktop = () => {
    closeWindow(id);
  };

  const renderContent = () => {
    switch (screen) {
      case 'in_game':
        return <IslandEscapeGame onQuit={handleQuitGame} />;
      case 'main_menu':
      default:
        return (
          <div className="bg-black/60 backdrop-blur-sm p-8 rounded-lg shadow-2xl flex flex-col items-center">
            <h1 className="text-6xl font-bold text-cyan-300 mb-2" style={{ textShadow: '2px 2px 8px #22d3ee' }}>
              Island Escape
            </h1>
            <p className="text-blue-200 mb-10 text-lg">Can you solve the mystery and find a way home?</p>
            
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
    }
  };

  return (
    <div 
      className="flex-grow flex flex-col items-center justify-center text-white bg-cover bg-center bg-black overflow-y-auto"
      style={{ backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none' }}
    >
      {renderContent()}
    </div>
  );
};

export default IslandEscapeMainMenu;
