import React, { useState, useEffect } from 'react';
import useWindowStore from '../../../store/windowStore';
import { todoImplement } from '../../../todo';
import { readFile } from '../../../filesystem';

interface DungeonDelveMainMenuProps {
  id: string; // window id
}

const MainMenuButton = ({ children, onClick, id }: { children: React.ReactNode, onClick: () => void, id: string }) => (
  <button
    id={id}
    className="w-full max-w-xs px-6 py-3 text-lg text-yellow-200 bg-black/50 border-2 border-yellow-400/50 rounded-md shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:bg-yellow-400/20 hover:text-white hover:border-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
    onClick={onClick}
  >
    {children}
  </button>
);

const DungeonDelveMainMenu: React.FC<DungeonDelveMainMenuProps> = ({ id }) => {
  const { closeWindow } = useWindowStore();
  const [backgroundUrl, setBackgroundUrl] = useState('');

  useEffect(() => {
    const loadBg = async () => {
      try {
        const bgFile = await readFile('/Games/DungeonDelve/main_menu_bg.jpg');
        if (bgFile && bgFile.url) {
          setBackgroundUrl(bgFile.url);
        }
      } catch (e) {
        console.error("Failed to load Dungeon Delve main menu background", e);
      }
    };
    loadBg();
  }, []);


  const handleQuit = () => {
    closeWindow(id);
  };

  return (
    <div 
      className="flex-grow flex flex-col items-center justify-center text-white bg-cover bg-center bg-black"
      style={{ backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none' }}
    >
      <div className="bg-black/60 backdrop-blur-sm p-8 rounded-lg shadow-2xl flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-red-500 mb-2 font-['MedievalSharp']" style={{ textShadow: '2px 2px 4px #000' }}>
          Dungeon Delve
        </h1>
        <p className="text-yellow-300 mb-10 text-lg">A Classic Fantasy RPG</p>
        
        <div className="flex flex-col gap-4">
          <MainMenuButton id="dungeondelve_new_game" onClick={() => todoImplement('Implement "New Game" for Dungeon Delve. This should lead to character creation.')}>
            New Game
          </MainMenuButton>
          <MainMenuButton id="dungeondelve_load_game" onClick={() => todoImplement('Implement "Load Game" for Dungeon Delve. This should show a list of saved games.')}>
            Load Game
          </MainMenuButton>
          <MainMenuButton id="dungeondelve_options" onClick={() => todoImplement('Implement "Options" for Dungeon Delve. This should show settings for audio, graphics, and controls.')}>
            Options
          </MainMenuButton>
          <MainMenuButton id="dungeondelve_quit" onClick={handleQuit}>
            Quit
          </MainMenuButton>
        </div>
      </div>
    </div>
  );
};

export default DungeonDelveMainMenu;
