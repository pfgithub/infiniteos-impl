import React, { useState, useEffect, useRef } from 'react';
import { readFile } from '../../../filesystem';

// --- GAME DATA ---

interface Item {
  id: string;
  name: string;
  description: string;
}

interface Choice {
  text: string;
  action: 'GOTO' | 'ACTION';
  target: string;
}

interface GameFlags {
  [key: string]: boolean;
}

interface GameLocation {
  id: string;
  description: (flags: GameFlags) => string;
  getImagePath: (flags: GameFlags) => string;
  choices: (flags: GameFlags, inventory: string[]) => Choice[];
}

const ITEMS: Record<string, Item> = {
  SHELL: { id: 'SHELL', name: 'Seashell', description: 'A beautiful, iridescent seashell.' },
  VINE: { id: 'VINE', name: 'Sturdy Vine', description: 'A long, tough vine. It could be useful for pulling something.' },
  KEY: { id: 'KEY', name: 'Rusted Key', description: 'An old, rusted key. What does it open?' },
};

const LOCATIONS: Record<string, GameLocation> = {
  BEACH: {
    id: 'BEACH',
    description: (flags) => `You are on a sandy beach. Waves gently lap the shore. A path leads into a dense jungle.${
      !flags.foundShell ? " Something shiny glints in the sand." : ""
    }`,
    getImagePath: () => '/Games/IslandEscape/locations/beach.jpg',
    choices: (flags) => [
      { text: 'Go into the jungle', action: 'GOTO', target: 'JUNGLE' },
      ...(!flags.foundShell ? [{ text: 'Examine the shiny object', action: 'ACTION', target: 'GET_SHELL' } as Choice] : []),
      { text: 'Walk along the shore', action: 'GOTO', target: 'CLIFF_BASE' },
    ],
  },
  JUNGLE: {
    id: 'JUNGLE',
    description: (flags) => `You are in a dense, humid jungle. The air is thick with the scent of unknown flowers. Paths lead back to the beach and deeper into the overgrowth.${
      !flags.foundVine ? ' A particularly sturdy-looking vine hangs from a large tree.' : ''
    }`,
    getImagePath: () => '/Games/IslandEscape/locations/jungle.jpg',
    choices: (flags) => [
      { text: 'Go back to the beach', action: 'GOTO', target: 'BEACH' },
      { text: 'Go deeper into the jungle', action: 'GOTO', target: 'CAVE_ENTRANCE' },
      ...(!flags.foundVine ? [{ text: 'Take the sturdy vine', action: 'ACTION', target: 'GET_VINE' } as Choice] : []),
    ],
  },
  CLIFF_BASE: {
    id: 'CLIFF_BASE',
    description: () => 'You are at the base of a towering cliff. The rock face is too sheer to climb. A small, locked chest is half-buried in the sand here.',
    getImagePath: () => '/Games/IslandEscape/locations/cliff.jpg',
    choices: (flags, inventory) => [
      { text: 'Go back to the beach', action: 'GOTO', target: 'BEACH' },
      ...(inventory.includes('KEY') ? [{ text: 'Use Rusted Key on chest', action: 'ACTION', target: 'UNLOCK_CHEST' } as Choice] : []),
      ...(!inventory.includes('KEY') ? [{ text: 'Examine the chest', action: 'ACTION', target: 'EXAMINE_CHEST' } as Choice] : []),
    ]
  },
  CAVE_ENTRANCE: {
    id: 'CAVE_ENTRANCE',
    description: (flags) => flags.boulderMoved
      ? 'The cave entrance is now clear, leading into darkness. The sturdy vine is still tied between the tree and the moved boulder.'
      : 'The entrance to a dark cave is blocked by a massive boulder. A sturdy tree stands nearby.',
    getImagePath: (flags) => flags.boulderMoved ? '/Games/IslandEscape/locations/cave_open.jpg' : '/Games/IslandEscape/locations/cave_blocked.jpg',
    choices: (flags, inventory) => [
      { text: 'Go back to the jungle', action: 'GOTO', target: 'JUNGLE' },
      ...(flags.boulderMoved ? [{ text: 'Enter the cave', action: 'GOTO', target: 'CAVE_INSIDE' } as Choice] : []),
      ...(!flags.boulderMoved ? [{ text: 'Try to push the boulder', action: 'ACTION', target: 'PUSH_BOULDER' } as Choice] : []),
      ...(!flags.boulderMoved && inventory.includes('VINE') ? [{ text: 'Use vine to move boulder', action: 'ACTION', target: 'MOVE_BOULDER' } as Choice] : []),
    ],
  },
  CAVE_INSIDE: {
    id: 'CAVE_INSIDE',
    description: (flags) => flags.foundKey
      ? 'The cave is damp and smells of earth. The skeleton lies in the alcove, its bony hand now empty.'
      : 'The cave is damp and smells of earth. In a small alcove, you see something skeletal. On closer inspection, it is a long-dead pirate, clutching a rusted key.',
    getImagePath: () => '/Games/IslandEscape/locations/cave_inside.jpg',
    choices: (flags) => [
      ...(!flags.foundKey ? [{ text: 'Take the key', action: 'ACTION', target: 'GET_KEY' } as Choice] : []),
      { text: 'Leave the cave', action: 'GOTO', target: 'CAVE_ENTRANCE' },
    ],
  },
  WIN: {
    id: 'WIN',
    description: () => "You unlock the chest and find a working satellite phone! You call for rescue. You have escaped the island!",
    getImagePath: () => '/Games/IslandEscape/locations/win.jpg',
    choices: () => [],
  },
};


// --- COMPONENT ---

interface IslandEscapeGameProps {
  onQuit: () => void;
}

const initialGameState = {
  locationId: 'BEACH',
  inventory: [] as string[],
  flags: {} as GameFlags,
  message: 'You wake up on a deserted island, with no memory of how you got here.',
};

const IslandEscapeGame: React.FC<IslandEscapeGameProps> = ({ onQuit }) => {
  const [gameState, setGameState] = useState(initialGameState);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const location = LOCATIONS[gameState.locationId];
  const imagePath = location ? location.getImagePath(gameState.flags) : '';

  useEffect(() => {
    descriptionRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [gameState.locationId]);

  useEffect(() => {
    if (!imagePath) return;

    setIsLoadingImage(true);
    let isMounted = true;
    
    const loadImage = async () => {
      try {
        const imageFile = await readFile(imagePath);
        if (isMounted && imageFile && imageFile.url) {
          setImageUrl(imageFile.url);
        }
      } catch (e) {
        console.error(`Failed to load image at ${imagePath}`, e);
        if (isMounted) setImageUrl('');
      } finally {
        if (isMounted) setIsLoadingImage(false);
      }
    };
    loadImage();

    return () => { isMounted = false };
  }, [imagePath]);


  const handleAction = (action: string) => {
    const newGameState = JSON.parse(JSON.stringify(gameState)); // Deep copy
    let newMessage = '';

    const addItem = (itemId: string) => {
      if (!newGameState.inventory.includes(itemId)) {
        newGameState.inventory.push(itemId);
        newMessage = `You picked up: ${ITEMS[itemId].name}.`;
      }
    };

    const setFlag = (flag: string) => {
      newGameState.flags[flag] = true;
    };

    switch (action) {
      case 'GET_SHELL':
        if (!gameState.flags.foundShell) { addItem('SHELL'); setFlag('foundShell'); }
        break;
      case 'GET_VINE':
        if (!gameState.flags.foundVine) { addItem('VINE'); setFlag('foundVine'); }
        break;
      case 'PUSH_BOULDER':
        newMessage = "You push with all your might, but the boulder doesn't budge. It's way too heavy.";
        break;
      case 'MOVE_BOULDER':
        if (gameState.inventory.includes('VINE')) {
          setFlag('boulderMoved');
          newMessage = 'You tie the vine to the boulder and the sturdy tree, creating a makeshift pulley. With a great effort, you move the boulder aside!';
        }
        break;
      case 'GET_KEY':
        if (!gameState.flags.foundKey) { addItem('KEY'); setFlag('foundKey'); }
        break;
      case 'EXAMINE_CHEST':
        newMessage = "It's a heavy, sea-worn chest, firmly locked. It looks like it needs a key.";
        break;
      case 'UNLOCK_CHEST':
        if (gameState.inventory.includes('KEY')) {
          newGameState.locationId = 'WIN';
          newMessage = "The rusted key fits perfectly in the lock. With a creak, the chest opens.";
        }
        break;
    }
    
    newGameState.message = newMessage;
    setGameState(newGameState);
  };

  const handleChoice = (choice: Choice) => {
    if (choice.action === 'GOTO') {
      setGameState({ ...gameState, locationId: choice.target, message: '' });
    } else if (choice.action === 'ACTION') {
      handleAction(choice.target);
    }
  };

  const resetGame = () => {
    setGameState(initialGameState);
  }
  
  if (!location) {
    return <div className="p-4 text-red-500 bg-black">Error: Location '{gameState.locationId}' not found!</div>
  }

  const isWinState = location.id === 'WIN';

  return (
    <div className="bg-gray-800/90 backdrop-blur-sm p-4 w-full h-full flex flex-col text-gray-200 font-sans">
      <div className="flex-shrink-0 flex justify-between items-start mb-2 border-b-2 border-cyan-400/30 pb-2">
        <div>
          <h2 className="text-3xl font-bold text-cyan-300">Island Escape</h2>
        </div>
        <button
          onClick={isWinState ? resetGame : onQuit}
          className="px-4 py-2 text-lg text-cyan-200 bg-black/50 border-2 border-cyan-400/50 rounded-md shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:bg-cyan-400/20 hover:text-white"
        >
          {isWinState ? 'Play Again' : 'Quit'}
        </button>
      </div>
      
      <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
        <div className="md:w-3/5 flex flex-col gap-4">
          <div className="w-full h-48 md:h-64 bg-black/30 rounded-lg overflow-hidden flex items-center justify-center">
            {isLoadingImage && <div className="animate-spin h-8 w-8 border-4 border-cyan-400 border-t-transparent rounded-full"></div>}
            {!isLoadingImage && imageUrl && <img src={imageUrl} alt={location.id} className="w-full h-full object-cover"/>}
            {!isLoadingImage && !imageUrl && <p className="text-gray-500">Image not available</p>}
          </div>
          <div ref={descriptionRef} className="flex-grow bg-black/30 p-4 rounded-lg overflow-y-auto">
            <p className="text-lg whitespace-pre-wrap leading-relaxed">{location.description(gameState.flags)}</p>
          </div>
        </div>

        <div className="md:w-2/5 flex flex-col gap-4 overflow-hidden">
          <div className="bg-black/30 p-4 rounded-lg flex-shrink-0">
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Inventory</h3>
            <p className="text-gray-300">
              {gameState.inventory.length > 0
                ? gameState.inventory.map(id => ITEMS[id].name).join(', ')
                : 'Your pockets are empty.'}
            </p>
          </div>

          <div className="bg-black/30 p-4 rounded-lg flex-shrink-0 h-24">
              {gameState.message && <p className="italic text-cyan-200">{gameState.message}</p>}
          </div>

          <div className="flex-grow bg-black/30 p-4 rounded-lg overflow-y-auto">
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">Actions</h3>
            <div className="flex flex-col gap-3">
              {isWinState && <p className="text-green-400 text-lg font-bold">Congratulations!</p>}
              {location.choices(gameState.flags, gameState.inventory).map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="p-3 text-left text-lg text-cyan-200 bg-black/50 border-2 border-cyan-400/50 rounded-md shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:bg-cyan-400/20 hover:text-white transition-colors"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslandEscapeGame;
