import React, { useState, useEffect } from 'react';
import useWindowStore from '../../../store/windowStore';
import { todoImplement } from '../../../todo';
import { readFile } from '../../../filesystem';
import ArcaneLegacyGame from './ArcaneLegacyGame';

interface ArcaneLegacyMainMenuProps {
  id: string; // window id
}

type Screen = 'main_menu' | 'in_game';

const MainMenuButton = ({ children, onClick, id }: { children: React.ReactNode, onClick: () => void, id: string }) => (
  <button
    id={id}
    className="w-full max-w-xs px-6 py-3 text-lg text-yellow-100 bg-gray-800/70 border-2 border-yellow-400/50 rounded-md shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:bg-gray-700/70 hover:text-white hover:border-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
    onClick={onClick}
  >
    {children}
  </button>
);

const ArcaneLegacyMainMenu: React.FC<ArcaneLegacyMainMenuProps> = ({ id }) => {
  const { closeWindow } = useWindowStore();
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [screen, setScreen] = useState<Screen>('main_menu');

  useEffect(() => {
    const loadBg = async () => {
      try {
        const bgFile = await readFile('/Games/ArcaneLegacy/main_menu_bg.jpg');
        if (bgFile && bgFile.url) {
          setBackgroundUrl(bgFile.url);
        }
      } catch (e) {
        console.error("Failed to load Arcane Legacy main menu background", e);
      }
    };
    loadBg();
  }, []);

  const handleQuitToDesktop = () => {
    closeWindow(id);
  };

  const renderContent = () => {
    switch (screen) {
      case 'in_game':
        return <ArcaneLegacyGame onQuit={() => setScreen('main_menu')} />;
      case 'main_menu':
      default:
        return (
          <div className="bg-black/60 backdrop-blur-sm p-8 rounded-lg shadow-2xl flex flex-col items-center">
            <h1 className="text-6xl font-extrabold text-yellow-200 mb-2" style={{ textShadow: '2px 2px 8px #ca8a04' }}>
              Arcane Legacy
            </h1>
            <p className="text-yellow-100 mb-10 text-lg">An adventure awaits.</p>
            
            <div className="flex flex-col gap-4">
              <MainMenuButton id="arcanelegacy_new_game" onClick={() => setScreen('in_game')}>
                New Adventure
              </MainMenuButton>
              <MainMenuButton id="arcanelegacy_load_game" onClick={() => todoImplement('Implement "Load Game" for Arcane Legacy.')}>
                Continue
              </MainMenuButton>
              <MainMenuButton id="arcanelegacy_options" onClick={() => todoImplement('Implement "Options" for Arcane Legacy.')}>
                Options
              </MainMenuButton>
              <MainMenuButton id="arcanelegacy_quit" onClick={handleQuitToDesktop}>
                Quit to Desktop
              </MainMenuButton>
            </div>
          </div>
        );
    }
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

export default ArcaneLegacyMainMenu;
