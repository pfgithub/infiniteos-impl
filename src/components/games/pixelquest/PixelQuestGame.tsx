import React, { useState, useEffect, useCallback } from 'react';

// --- GAME CONFIG ---
const TILE_SIZE = 32; // in pixels
const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;

// --- TYPES ---
type TileType = 'floor' | 'wall' | 'goal';
interface Tile {
  type: TileType;
}

interface PixelQuestGameProps {
  onQuit: () => void;
}

// --- INITIAL MAP ---
const initialMap: TileType[][] = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'floor', 'wall'],
  ['wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'floor', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall'],
  ['wall', 'floor', 'floor', 'wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'goal', 'wall'],
  ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

const createGrid = (): Tile[][] => {
  return initialMap.map(row => row.map(tileType => ({ type: tileType })));
};

// --- COMPONENTS ---
const Player = ({ x, y }: { x: number, y: number }) => (
    <div
        className="absolute transition-all duration-100 ease-linear"
        style={{
            left: x * TILE_SIZE,
            top: y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            backgroundColor: 'blue',
            borderRadius: '50%',
            border: '2px solid lightblue',
        }}
    />
);

const GameGrid = ({ grid }: { grid: Tile[][] }) => {
  const getTileColor = (tile: Tile) => {
    switch (tile.type) {
      case 'floor': return '#6b7280'; // gray-500
      case 'wall': return '#1f2937'; // gray-800
      case 'goal': return '#f59e0b'; // amber-500
      default: return 'transparent';
    }
  };

  return (
    <div
      className="relative bg-gray-900 grid"
      style={{
        width: TILE_SIZE * GRID_WIDTH,
        height: TILE_SIZE * GRID_HEIGHT,
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_HEIGHT}, ${TILE_SIZE}px)`,
      }}
    >
      {grid.map((row, y) =>
        row.map((tile, x) => (
          <div
            key={`${x}-${y}`}
            className="w-full h-full"
            style={{ backgroundColor: getTileColor(tile) }}
          />
        ))
      )}
    </div>
  );
};


const PixelQuestGame: React.FC<PixelQuestGameProps> = ({ onQuit }) => {
  const [grid] = useState<Tile[][]>(createGrid);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    setPlayerPos(prevPos => {
      const newX = prevPos.x + dx;
      const newY = prevPos.y + dy;

      if (
        newX >= 0 && newX < GRID_WIDTH &&
        newY >= 0 && newY < GRID_HEIGHT &&
        grid[newY][newX].type !== 'wall'
      ) {
        if (grid[newY][newX].type === 'goal') {
          setGameState('won');
        }
        return { x: newX, y: newY };
      }
      return prevPos;
    });
  }, [grid, gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          movePlayer(1, 0);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white select-none">
      <div className="flex-shrink-0 bg-gray-800 p-2 flex justify-between items-center border-b border-black/20">
        <h2 className="text-xl font-bold">Pixel Quest</h2>
        <button
            onClick={onQuit}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded"
        >
            Quit to Menu
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center overflow-auto p-4 bg-black/20">
        <div className="relative">
            <GameGrid grid={grid} />
            <Player x={playerPos.x} y={playerPos.y} />
            {gameState === 'won' && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <h3 className="text-4xl font-bold text-amber-400 mb-4">You Win!</h3>
                    <button 
                        onClick={onQuit}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-lg"
                    >
                        Main Menu
                    </button>
                </div>
            )}
        </div>
      </div>
       <div className="flex-shrink-0 bg-gray-800 p-2 text-center border-t border-black/20">
        <p>Use Arrow Keys or WASD to move. Reach the <span className="text-amber-400 font-bold">yellow</span> square!</p>
      </div>
    </div>
  );
};

export default PixelQuestGame;
