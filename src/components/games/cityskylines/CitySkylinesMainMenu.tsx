import React, { useState, useEffect } from 'react';
import useWindowStore from '../../../store/windowStore';
import { todoImplement } from '../../../todo';
import { readFile } from '../../../filesystem';
import CitySkylinesGame from './CitySkylinesGame';

interface CitySkylinesMainMenuProps {
  id: string; // window id
}

type Screen = 'main_menu' | 'in_game';

const MainMenuButton = ({ children, onClick, id }: { children: React.ReactNode, onClick: () => void, id: string }) => (
  <button
    id={id}
    className="w-full max-w-xs px-6 py-3 text-lg text-white bg-blue-800/70 border-2 border-blue-400/50 rounded-md shadow-[0_0_15px_rgba(96,165,250,0.4)] hover:bg-blue-700/70 hover:text-white hover:border-blue-300 transition-all duration-300 ease-in-out transform hover:scale-105"
    onClick={onClick}
  >
    {children}
  </button>
);

const CitySkylinesMainMenu: React.FC<CitySkylinesMainMenuProps> = ({ id }) => {
  const { closeWindow } = useWindowStore();
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [screen, setScreen] = useState<Screen>('main_menu');

  useEffect(() => {
    const loadBg = async () => {
      try {
        const bgFile = await readFile('/Games/CitySkylines/main_menu_bg.jpg');
        if (bgFile && bgFile.url) {
          setBackgroundUrl(bgFile.url);
        }
      } catch (e) {
        console.error("Failed to load City Skylines main menu background", e);
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
        return <CitySkylinesGame onQuit={() => setScreen('main_menu')} />;
      case 'main_menu':
      default:
        return (
          <div className="bg-black/60 backdrop-blur-sm p-8 rounded-lg shadow-2xl flex flex-col items-center">
            <h1 className="text-6xl font-extrabold text-blue-300 mb-2" style={{ textShadow: '2px 2px 8px #60a5fa' }}>
              City Skylines II
            </h1>
            <p className="text-blue-100 mb-10 text-lg">Build the city of your dreams.</p>
            
            <div className="flex flex-col gap-4">
              <MainMenuButton id="cityskylines_new_game" onClick={() => setScreen('in_game')}>
                New City
              </MainMenuButton>
              <MainMenuButton id="cityskylines_load_game" onClick={() => todoImplement('Implement "Load City" for City Skylines. This should show a list of saved cities.')}>
                Load City
              </MainMenuButton>
              <MainMenuButton id="cityskylines_options" onClick={() => todoImplement('Implement "Options" for City Skylines. This should show settings for audio, graphics, etc.')}>
                Options
              </MainMenuButton>
              <MainMenuButton id="cityskylines_quit" onClick={handleQuitToDesktop}>
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

export default CitySkylinesMainMenu;
