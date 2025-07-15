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
    className="w-full max-w-xs px-8 py-3 text-xl font-semibold text-white bg-black/40 rounded-sm shadow-lg hover:bg-blue-600/50 backdrop-blur-sm transition-all duration-300 ease-in-out transform hover:scale-105"
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

  if (screen === 'in_game') {
    return <CitySkylinesGame onQuit={() => setScreen('main_menu')} />;
  }
  
  const handleQuitToDesktop = () => {
    closeWindow(id);
  };

  const menuContent = (
    <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg shadow-2xl flex flex-col items-center">
      <h1 className="text-7xl font-bold text-white mb-2 tracking-wide" style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.5)' }}>
        City Skylines II
      </h1>
      <p className="text-gray-200 mb-12 text-xl font-light">Build the city of your dreams.</p>
      
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

export default CitySkylinesMainMenu;
