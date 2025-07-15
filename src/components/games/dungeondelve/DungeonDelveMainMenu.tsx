import React, { useState, useEffect } from 'react';
import useWindowStore from '../../../store/windowStore';
import { todoImplement } from '../../../todo';
import { readFile } from '../../../filesystem';
import CharacterCreation from './CharacterCreation';
import DungeonDelveGame from './DungeonDelveGame';

interface DungeonDelveMainMenuProps {
  id: string; // window id
}

interface CharacterData {
  name: string;
  characterClass: string;
}

type Screen = 'main_menu' | 'character_creation' | 'in_game';

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
  const [screen, setScreen] = useState<Screen>('main_menu');
  const [character, setCharacter] = useState<CharacterData | null>(null);

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

  const handleQuitGame = () => {
    // Reset state and go back to main menu
    setScreen('main_menu');
    setCharacter(null);
  };
  
  const handleCharacterCreated = (characterData: CharacterData) => {
    setCharacter(characterData);
    setScreen('in_game');
  };

  const handleQuitToDesktop = () => {
    closeWindow(id);
  };

  const renderContent = () => {
    switch (screen) {
      case 'in_game':
        if (!character) {
            // Should not happen, but as a fallback
            setScreen('main_menu');
            return null;
        }
        return <DungeonDelveGame character={character} onQuit={handleQuitGame} />;
      case 'character_creation':
        return <CharacterCreation onBack={() => setScreen('main_menu')} onCharacterCreated={handleCharacterCreated} />;
      case 'main_menu':
      default:
        return (
          <div className="bg-black/60 backdrop-blur-sm p-8 rounded-lg shadow-2xl flex flex-col items-center">
            <h1 className="text-6xl font-extrabold text-red-500 mb-2 font-['MedievalSharp']" style={{ textShadow: '2px 2px 4px #000' }}>
              Dungeon Delve
            </h1>
            <p className="text-yellow-300 mb-10 text-lg">A Classic Fantasy RPG</p>
            
            <div className="flex flex-col gap-4">
              <MainMenuButton id="dungeondelve_new_game" onClick={() => setScreen('character_creation')}>
                New Game
              </MainMenuButton>
              <MainMenuButton id="dungeondelve_load_game" onClick={() => todoImplement('Implement "Load Game" for Dungeon Delve. This should show a list of saved games.')}>
                Load Game
              </MainMenuButton>
              <MainMenuButton id="dungeondelve_options" onClick={() => todoImplement('Implement "Options" for Dungeon Delve. This should show settings for audio, graphics, and controls.')}>
                Options
              </MainMenuButton>
              <MainMenuButton id="dungeondelve_quit" onClick={handleQuitToDesktop}>
                Quit
              </MainMenuButton>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="flex-grow flex flex-col items-center justify-center text-white bg-cover bg-center bg-black overflow-y-scroll"
      style={{ backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : 'none' }}
    >
      {renderContent()}
    </div>
  );
};

export default DungeonDelveMainMenu;
