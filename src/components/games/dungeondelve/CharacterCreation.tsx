import React from 'react';

interface CharacterCreationProps {
  onBack: () => void;
  onCharacterCreated: (character: { name: string, characterClass: string }) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onBack, onCharacterCreated }) => {
  const [name, setName] = React.useState('');
  const [characterClass, setCharacterClass] = React.useState('Warrior');

  const handleStart = () => {
    if (!name.trim()) return;
    onCharacterCreated({ name: name.trim(), characterClass });
  };

  return (
    <div className="bg-black/70 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-2xl font-['MedievalSharp']">
      <h2 className="text-4xl font-bold text-amber-200 mb-8 text-center" style={{textShadow: '1px 1px 2px #000'}}>Create Your Hero</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="char_name" className="block text-lg text-amber-100 mb-2">Character Name</label>
          <input
            id="char_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-stone-900/70 border border-stone-600 rounded-sm text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
            placeholder="Enter your hero's name"
          />
        </div>

        <div>
          <label className="block text-lg text-amber-100 mb-2">Class</label>
          <div className="grid grid-cols-3 gap-4">
            {['Warrior', 'Mage', 'Rogue'].map((cls) => (
              <button
                key={cls}
                onClick={() => setCharacterClass(cls)}
                className={`p-4 border-2 rounded-sm transition-all text-amber-100 ${
                  characterClass === cls
                    ? 'bg-amber-800/50 border-amber-400'
                    : 'bg-stone-800/80 border-stone-600 hover:bg-stone-700/80 hover:border-amber-500'
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
          className="px-6 py-3 text-lg text-amber-100 bg-stone-800/80 border-2 border-stone-600 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.7)] hover:bg-stone-700/80 hover:text-white"
        >
          Back
        </button>
        <button
          id="dungeondelve_start_adventure"
          onClick={handleStart}
          disabled={!name.trim()}
          className="px-6 py-3 text-lg text-green-300 bg-green-900/50 border-2 border-green-600 rounded-sm shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:bg-green-800/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Adventure
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
