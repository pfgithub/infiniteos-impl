import React from 'react';
import { todoImplement } from '../../../todo';

interface CyberRunnerGameProps {
  onQuit: () => void;
}

const CyberRunnerGame: React.FC<CyberRunnerGameProps> = ({ onQuit }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white bg-black/80 p-8">
      <h2 className="text-4xl text-cyan-400 font-bold mb-4" style={{ textShadow: '0 0 10px #22d3ee' }}>New Game Session</h2>
      <p className="text-lg text-pink-300 mb-8" style={{ textShadow: '0 0 8px #ec4899' }}>The race is about to begin...</p>
      
      <div className="border-2 border-pink-500/50 p-8 rounded-lg text-center shadow-[0_0_20px_rgba(236,72,153,0.5)] bg-black/30">
        <p className="mb-4 text-gray-300">Gameplay UI and logic will be implemented here.</p>
        <button
          className="px-6 py-2 text-lg text-white bg-pink-600/80 border border-pink-400 rounded-md hover:bg-pink-500 transition-all duration-300 transform hover:scale-105"
          onClick={() => todoImplement("The actual CyberRunner game logic, like starting the race, handling player input, etc.")}
        >
          Start Race
        </button>
      </div>

      <button
        onClick={onQuit}
        className="mt-12 px-6 py-3 text-lg text-cyan-300 bg-black/60 border-2 border-cyan-400/50 rounded-md hover:bg-cyan-400/20 transition-all duration-300 transform hover:scale-105"
      >
        Quit to Main Menu
      </button>
    </div>
  );
};

export default CyberRunnerGame;
