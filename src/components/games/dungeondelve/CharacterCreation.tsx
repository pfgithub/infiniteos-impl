import React from 'react';
import { todoImplement } from '../../../todo';

interface CharacterCreationProps {
  onBack: () => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onBack }) => {
  const [name, setName] = React.useState('');
  const [characterClass, setCharacterClass] = React.useState('Warrior');

  const handleStart = () => {
    if (!name.trim()) return;
    todoImplement(`Start Dungeon Delve game with character: ${name} (Class: ${characterClass})`);
  };

  return (
    <div className="bg-black/70 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-2xl">
      <h2 className="text-4xl font-extrabold text-yellow-300 mb-6 font-['MedievalSharp'] text-center">Create Your Hero</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="char_name" className="block text-lg text-yellow-200 mb-2">Character Name</label>
          <input
            id="char_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-900/50 border border-yellow-400/30 rounded-md text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            placeholder="Enter your hero's name"
          />
        </div>

        <div>
          <label className="block text-lg text-yellow-200 mb-2">Class</label>
          <div className="grid grid-cols-3 gap-4">
            {['Warrior', 'Mage', 'Rogue'].map((cls) => (
              <button
                key={cls}
                onClick={() => setCharacterClass(cls)}
                className={`p-4 border-2 rounded-md transition-all ${
                  characterClass === cls
                    ? 'bg-yellow-400/30 border-yellow-300 text-white'
                    : 'bg-black/50 border-yellow-400/50 hover:bg-yellow-400/20'
                }`}
              >
                <p className="font-bold text-lg">{cls}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button 
          id="dungeondelve_back_to_main_menu"
          onClick={onBack}
          className="px-6 py-3 text-lg text-yellow-200 bg-black/50 border-2 border-yellow-400/50 rounded-md shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:bg-yellow-400/20 hover:text-white"
        >
          Back
        </button>
        <button
          id="dungeondelve_start_adventure"
          onClick={handleStart}
          disabled={!name.trim()}
          className="px-6 py-3 text-lg text-green-300 bg-green-900/50 border-2 border-green-400/50 rounded-md shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:bg-green-400/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Adventure
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
