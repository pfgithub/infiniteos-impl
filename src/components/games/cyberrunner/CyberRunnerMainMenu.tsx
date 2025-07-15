import React, { useState, useEffect } from 'react';
import useWindowStore from '../../../store/windowStore';
import { todoImplement } from '../../../todo';
import { readFile } from '../../../filesystem';

interface CyberRunnerMainMenuProps {
  id: string; // window id
}

const MainMenuButton = ({ children, onClick, id }: { children: React.ReactNode, onClick: () => void, id: string }) => (
  <button
    id={id}
    className="w-full max-w-xs px-6 py-3 text-lg text-cyan-300 bg-black/60 border-2 border-cyan-400/50 rounded-md shadow-[0_0_15px_rgba(45,212,191,0.4)] hover:bg-cyan-400/20 hover:text-white hover:border-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105"
    onClick={onClick}
  >
    {children}
  </button>
);

const CyberRunnerMainMenu: React.FC<CyberRunnerMainMenuProps> = ({ id }) => {
  const { closeWindow } = useWindowStore();
  const [backgroundUrl, setBackgroundUrl] = useState('');

  useEffect(() => {
    const loadBg = async () => {
      try {
        const bgFile = await readFile('/Games/CyberRunner/main_menu_bg.jpg');
        if (bgFile && bgFile.url) {
          setBackgroundUrl(bgFile.url);
        }
      } catch (e) {
        console.error("Failed to load CyberRunner main menu background", e);
      }
    };
    loadBg();
  }, []);

  const handleQuit = () => {
    closeWindow(id);
  };

  const renderContent = () => {
    return (
      <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-pink-500 mb-2" style={{ textShadow: '2px 2px 8px #f472b6' }}>
          CyberRunner 2077
        </h1>
        <p className="text-cyan-200 mb-10 text-lg">The Future is Now.</p>
        
        <div className="flex flex-col gap-4">
          <MainMenuButton id="cyberrunner_new_game" onClick={() => todoImplement('Implement "New Game" for CyberRunner. This should start a new game session.')}>
            New Game
          </MainMenuButton>
          <MainMenuButton id="cyberrunner_load_game" onClick={() => todoImplement('Implement "Load Game" for CyberRunner. This should show a list of saved games.')}>
            Load Game
          </MainMenuButton>
          <MainMenuButton id="cyberrunner_options" onClick={() => todoImplement('Implement "Options" for CyberRunner. This should show settings for audio, graphics, and controls.')}>
            Options
          </MainMenuButton>
          <MainMenuButton id="cyberrunner_quit" onClick={handleQuit}>
            Quit
          </MainMenuButton>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="flex-grow flex flex-col items-center justify-center text-white bg-cover bg-center bg-black"
      style={{ backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none' }}
    >
      {renderContent()}
    </div>
  );
};

export default CyberRunnerMainMenu;
