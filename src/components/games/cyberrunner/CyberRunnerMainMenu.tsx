import React, { useState, useEffect } from 'react';
import useWindowStore from '../../../store/windowStore';
import { todoImplement } from '../../../todo';
import { readFile } from '../../../filesystem';
import CyberRunnerGame from './CyberRunnerGame';

interface CyberRunnerMainMenuProps {
  id: string; // window id
}

type Screen = 'main_menu' | 'in_game';

const MainMenuButton = ({ children, onClick, id }: { children: React.ReactNode, onClick: () => void, id: string }) => (
  <button
    id={id}
    className="w-full max-w-xs px-6 py-3 text-lg font-bold font-mono text-cyan-300 bg-black/50 border-2 border-cyan-400/80 rounded-none shadow-[0_0_15px_#22d3ee,inset_0_0_5px_#22d3ee] hover:bg-cyan-400/20 hover:text-white hover:shadow-[0_0_25px_#22d3ee,inset_0_0_10px_#22d3ee] transition-all duration-300 ease-in-out transform hover:scale-105"
    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
    onClick={onClick}
  >
    {children}
  </button>
);

const CyberRunnerMainMenu: React.FC<CyberRunnerMainMenuProps> = ({ id }) => {
  const { closeWindow } = useWindowStore();
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [screen, setScreen] = useState<Screen>('main_menu');

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

  if (screen === 'in_game') {
    return <CyberRunnerGame onQuit={() => setScreen('main_menu')} />;
  }
  
  const handleQuit = () => {
    closeWindow(id);
  };

  const menuContent = (
    <div className="bg-black/50 backdrop-blur-sm p-8 flex flex-col items-center" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}>
      <h1 className="text-7xl font-black font-mono text-pink-400 mb-2 uppercase" style={{ textShadow: '0 0 15px #f472b6' }}>
        CyberRunner 2077
      </h1>
      <p className="text-cyan-200 mb-12 text-xl tracking-widest font-mono">The Future is Now.</p>
      
      <div className="flex flex-col gap-4">
        <MainMenuButton id="cyberrunner_new_game" onClick={() => setScreen('in_game')}>
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

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none', filter: 'blur(2px) brightness(0.6)' }}
      />
      <div className="relative flex-grow w-full flex items-center justify-center p-4">
        {menuContent}
      </div>
    </div>
  );
};

export default CyberRunnerMainMenu;
