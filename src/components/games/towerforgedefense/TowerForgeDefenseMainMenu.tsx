import React, { useState } from 'react';
import TowerForgeDefenseGame from './TowerForgeDefenseGame';

const TowerForgeDefenseMainMenu: React.FC<{ id: string }> = ({ id }) => {
  const [isGameStarted, setGameStarted] = useState(false);

  if (isGameStarted) {
    return <TowerForgeDefenseGame onBackToMenu={() => setGameStarted(false)} />;
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/filesystem/Games/TowerForgeDefense/main_menu_bg.jpg')" }}
    >
      <div className="bg-black/60 p-12 rounded-lg text-center backdrop-blur-sm">
        <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: 'MedievalSharp, cursive' }}>TowerForge Defense</h1>
        <p className="text-xl mb-8">Defend the realm from monstrous hordes!</p>
        <button
          onClick={() => setGameStarted(true)}
          className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg text-2xl transition-transform transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default TowerForgeDefenseMainMenu;
