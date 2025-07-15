import React from 'react';
import { todoImplement } from '../todo';
import useWindowStore from '../store/windowStore';
import { WINDOW_DEFS } from '../windows';

const games = [
  {
    id: 'starfall',
    title: 'Starfall',
    description: 'Explore a vast, procedurally generated galaxy.',
    cover: '/filesystem/Games/Starfall/cover.jpg'
  },
  {
    id: 'cyberrunner',
    title: 'CyberRunner 2077',
    description: 'Race through neon-lit streets in a high-octane future.',
    cover: '/filesystem/Games/CyberRunner/cover.jpg'
  },
  {
    id: 'dungeondelve',
    title: 'Dungeon Delve',
    description: 'A classic fantasy role-playing adventure.',
    cover: '/filesystem/Games/DungeonDelve/cover.jpg'
  },
  {
    id: 'islandescape',
    title: 'Island Escape',
    description: 'Solve puzzles to escape a mysterious island.',
    cover: '/filesystem/Games/IslandEscape/cover.jpg'
  },
  {
    id: 'mechwarriors',
    title: 'Mech Warriors 5',
    description: 'Pilot giant mechs in devastating combat.',
    cover: '/filesystem/Games/MechWarriors/cover.jpg'
  },
  {
    id: 'cityskylines',
    title: 'City Skylines II',
    description: 'Build and manage the city of your dreams.',
    cover: '/filesystem/Games/CitySkylines/cover.jpg'
  }
];

const GameCard = ({ game }: { game: typeof games[0] }) => {
  const { openWindow } = useWindowStore();

  const handlePlay = () => {
    if (game.id === 'dungeondelve') {
      openWindow(WINDOW_DEFS.DUNGEON_DELVE);
    } else {
      todoImplement(`The 'Play' button for "${game.title}" was clicked. Implement launching the game.`);
    }
  };

  return (
    <div className="bg-black/20 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
      <img src={game.cover} alt={`${game.title} cover`} className="w-full h-48 object-cover bg-gray-700" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{game.description}</p>
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          onClick={handlePlay}
        >
          Play
        </button>
      </div>
    </div>
  );
};

function GamesContent({ id }: { id: string }) {
  return (
    <div className="flex-grow p-6 overflow-y-auto bg-gray-900/50">
      <h2 className="text-3xl font-bold mb-6 text-white">My Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

export default GamesContent;
