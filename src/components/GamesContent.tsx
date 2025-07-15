import React, { useState, useEffect } from 'react';
import { todoImplement } from '../todo';
import useWindowStore from '../store/windowStore';
import { WINDOW_DEFS } from '../windows';
import { readFile, writeFile } from '../filesystem';

const games = [
  {
    id: 'starfall',
    title: 'Starfall',
    folderName: 'Starfall',
    description: 'Explore a vast, procedurally generated galaxy.',
    cover: '/filesystem/Games/Starfall/cover.jpg'
  },
  {
    id: 'cyberrunner',
    title: 'CyberRunner 2077',
    folderName: 'CyberRunner',
    description: 'Race through neon-lit streets in a high-octane future.',
    cover: '/filesystem/Games/CyberRunner/cover.jpg'
  },
  {
    id: 'dungeondelve',
    title: 'Dungeon Delve',
    folderName: 'DungeonDelve',
    description: 'A classic fantasy role-playing adventure.',
    cover: '/filesystem/Games/DungeonDelve/cover.jpg'
  },
  {
    id: 'islandescape',
    title: 'Island Escape',
    folderName: 'IslandEscape',
    description: 'Solve puzzles to escape a mysterious island.',
    cover: '/filesystem/Games/IslandEscape/cover.jpg'
  },
  {
    id: 'mechwarriors',
    title: 'Mech Warriors 5',
    folderName: 'MechWarriors',
    description: 'Pilot giant mechs in devastating combat.',
    cover: '/filesystem/Games/MechWarriors/cover.jpg'
  },
  {
    id: 'cityskylines',
    title: 'City Skylines II',
    folderName: 'CitySkylines',
    description: 'Build and manage the city of your dreams.',
    cover: '/filesystem/Games/CitySkylines/cover.jpg'
  }
];

type Game = typeof games[0];
type GameStatus = 'uninstalled' | 'installing' | 'installed' | 'checking';

const GameCard = ({ game, status, onInstall }: { game: Game, status: GameStatus, onInstall: (game: Game) => void }) => {
  const { openWindow } = useWindowStore();

  const handlePlay = () => {
    if (game.id === 'dungeondelve') {
      openWindow(WINDOW_DEFS.DUNGEON_DELVE);
    } else if (game.id === 'cyberrunner') {
      openWindow(WINDOW_DEFS.CYBER_RUNNER);
    } else if (game.id === 'islandescape') {
      openWindow(WINDOW_DEFS.ISLAND_ESCAPE);
    } else {
      todoImplement(`The 'Play' button for "${game.title}" was clicked. Implement launching the game.`);
    }
  };

  const renderButton = () => {
    switch (status) {
      case 'installed':
        return (
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            onClick={handlePlay}
          >
            Play
          </button>
        );
      case 'installing':
        return (
          <button
            className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors cursor-not-allowed"
            disabled
          >
            Installing...
          </button>
        );
      case 'uninstalled':
        return (
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            onClick={() => onInstall(game)}
          >
            Install
          </button>
        );
      case 'checking':
        return (
            <button 
              className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors cursor-wait"
              disabled
            >
              ...
            </button>
          );
    }
  };

  return (
    <div className="bg-black/20 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
      <img src={game.cover} alt={`${game.title} cover`} className="w-full h-48 object-cover bg-gray-700" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{game.description}</p>
        {renderButton()}
      </div>
    </div>
  );
};

function GamesContent({ id }: { id: string }) {
    const [gameStatuses, setGameStatuses] = useState<Map<string, GameStatus>>(
        new Map(games.map(g => [g.id, 'checking']))
    );

    useEffect(() => {
        const checkInstallationStatus = async () => {
          const newStatuses = new Map<string, GameStatus>();
          for (const game of games) {
            try {
              await readFile(`/Games/${game.folderName}/installed.flag`);
              newStatuses.set(game.id, 'installed');
            } catch (error) {
              newStatuses.set(game.id, 'uninstalled');
            }
          }
          setGameStatuses(newStatuses);
        };
    
        checkInstallationStatus();
    }, []);

    const handleInstallGame = async (game: Game) => {
        setGameStatuses(prev => new Map(prev).set(game.id, 'installing'));
    
        // Simulate install time
        await new Promise(resolve => setTimeout(resolve, 3000));
    
        try {
          await writeFile(`/Games/${game.folderName}/installed.flag`, { installedOn: new Date().toISOString() });
          setGameStatuses(prev => new Map(prev).set(game.id, 'installed'));
        } catch (e) {
          console.error(`Failed to install ${game.title}`, e);
          setGameStatuses(prev => new Map(prev).set(game.id, 'uninstalled'));
          todoImplement(`Installation for ${game.title} failed. This might be because the directory /Games/${game.folderName}/ does not exist. Implement directory creation or handle this gracefully.`);
        }
    };


  return (
    <div className="flex-grow p-6 overflow-y-auto bg-gray-900/50">
      <h2 className="text-3xl font-bold mb-6 text-white">My Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map(game => (
          <GameCard 
            key={game.id} 
            game={game} 
            status={gameStatuses.get(game.id) || 'checking'}
            onInstall={handleInstallGame}
          />
        ))}
      </div>
    </div>
  );
}

export default GamesContent;
