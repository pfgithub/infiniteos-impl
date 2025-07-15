import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { levels, Level, Entity, TileType } from './levels';
import { todoImplement } from '../../../todo';

// --- GAME CONFIG ---
const TILE_SIZE = 32; // in pixels

interface PixelQuestGameProps {
  onQuit: () => void;
}

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
            boxShadow: '0 0 8px blue',
        }}
    />
);

const Enemy = ({ x, y }: { x: number, y: number }) => (
    <div
        className="absolute transition-all duration-100 ease-linear"
        style={{
            left: x * TILE_SIZE,
            top: y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            backgroundColor: 'red',
            border: '2px solid darkred',
            boxShadow: '0 0 8px red',
        }}
    />
);

const NPC = ({ x, y }: { x: number, y: number }) => (
    <div
        className="absolute transition-all duration-100 ease-linear"
        style={{
            left: x * TILE_SIZE,
            top: y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            backgroundColor: 'green',
            border: '2px solid darkgreen',
            boxShadow: '0 0 8px green',
        }}
    />
);

const GameGrid = ({ level }: { level: Level }) => {
  const { map } = level;
  const GRID_WIDTH = map[0].length;
  const GRID_HEIGHT = map.length;

  const getTileColor = (tileType: TileType) => {
    switch (tileType) {
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
      {map.map((row, y) =>
        row.map((tileType, x) => (
          <div
            key={`${x}-${y}`}
            className="w-full h-full"
            style={{ backgroundColor: getTileColor(tileType) }}
          />
        ))
      )}
    </div>
  );
};

const DialogueBox = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 border-t-4 border-blue-500 p-4 text-white">
        <p className="text-lg">{message}</p>
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>
        <p className="text-sm text-gray-400 mt-2">Press 'E' or 'Enter' to close.</p>
    </div>
);

const GameOverlay = ({ status, onRestart, onQuit }: { status: 'won' | 'gameOver', onRestart: () => void, onQuit: () => void }) => {
    const isWon = status === 'won';
    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <h3 className={`text-5xl font-bold mb-4 ${isWon ? 'text-amber-400' : 'text-red-500'}`}>
                {isWon ? "You Win!" : "Game Over"}
            </h3>
            <div className="flex gap-4">
                <button 
                    onClick={onRestart}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-lg"
                >
                    {isWon ? "Play Again" : "Retry"}
                </button>
                <button 
                    onClick={onQuit}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-lg"
                >
                    Main Menu
                </button>
            </div>
        </div>
    );
};


const PixelQuestGame: React.FC<PixelQuestGameProps> = ({ onQuit }) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [level, setLevel] = useState<Level>(levels[currentLevelIndex]);
  const [playerPos, setPlayerPos] = useState(level.playerStart);
  const [entities, setEntities] = useState<Entity[]>(level.entities);
  const [gameState, setGameState] = useState<'playing' | 'dialogue' | 'won' | 'gameOver'>('playing');
  const [dialogueMessage, setDialogueMessage] = useState('');

  // Memoize grid dimensions to avoid re-calculating on every render
  const gridDimensions = useMemo(() => ({
      width: level.map[0].length,
      height: level.map.length
  }), [level]);
  
  const loadLevel = (levelIndex: number) => {
    if (levelIndex >= levels.length) {
      setGameState('won');
      return;
    }
    const newLevel = levels[levelIndex];
    setLevel(newLevel);
    setCurrentLevelIndex(levelIndex);
    setPlayerPos(newLevel.playerStart);
    setEntities(newLevel.entities);
    setGameState('playing');
    todoImplement("Enemy movement should be implemented and reset when a new level loads.");
  };

  const restartGame = () => {
    loadLevel(0);
  };
  
  const handleInteraction = () => {
      for(const entity of entities) {
          if (entity.type === 'npc' && entity.message) {
              const dx = Math.abs(playerPos.x - entity.pos.x);
              const dy = Math.abs(playerPos.y - entity.pos.y);
              if (dx <= 1 && dy <= 1 && (dx + dy <=1)) { // Is adjacent
                  setDialogueMessage(entity.message);
                  setGameState('dialogue');
                  return;
              }
          }
      }
  };

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (
        newX < 0 || newX >= gridDimensions.width ||
        newY < 0 || newY >= gridDimensions.height ||
        level.map[newY][newX] === 'wall'
    ) {
        return; // Wall collision
    }

    // Check for entity collisions
    for (const entity of entities) {
        if (entity.pos.x === newX && entity.pos.y === newY) {
            if (entity.type === 'enemy') {
                setGameState('gameOver');
                return;
            }
            if (entity.type === 'npc') {
                return; // Cannot move into an NPC's space
            }
        }
    }

    // Check for goal
    if (level.map[newY][newX] === 'goal') {
        loadLevel(currentLevelIndex + 1);
        return;
    }
    
    setPlayerPos({ x: newX, y: newY });
  }, [gameState, playerPos, gridDimensions, level, entities, currentLevelIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (gameState === 'dialogue') {
          if (e.key === 'e' || e.key === 'E' || e.key === 'Enter' || e.key === ' ') {
              setGameState('playing');
          }
          return;
      }

      if (gameState === 'playing') {
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
          case 'e':
          case 'E':
          case ' ':
             handleInteraction();
             break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, gameState]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white select-none">
      <div className="flex-shrink-0 bg-gray-800 p-2 flex justify-between items-center border-b border-black/20">
        <h2 className="text-xl font-bold">Pixel Quest - Level {currentLevelIndex + 1}</h2>
        <button
            onClick={onQuit}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded"
        >
            Quit to Menu
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center overflow-auto p-4 bg-black/20">
        <div className="relative">
            <GameGrid level={level} />
            <Player x={playerPos.x} y={playerPos.y} />
            {entities.map(entity => {
                if (entity.type === 'enemy') {
                    return <Enemy key={entity.id} x={entity.pos.x} y={entity.pos.y} />;
                }
                if (entity.type === 'npc') {
                    return <NPC key={entity.id} x={entity.pos.x} y={entity.pos.y} />;
                }
                return null;
            })}
            
            {(gameState === 'won' || gameState === 'gameOver') && (
                <GameOverlay status={gameState} onRestart={restartGame} onQuit={onQuit} />
            )}

            {gameState === 'dialogue' && (
                <DialogueBox message={dialogueMessage} onClose={() => setGameState('playing')} />
            )}
        </div>
      </div>
       <div className="flex-shrink-0 bg-gray-800 p-2 text-center border-t border-black/20">
        <p>
            Use Arrow Keys or WASD to move. Press 'E' or 'Space' near a <span className="text-green-400 font-bold">green</span> character to talk. 
            Avoid <span className="text-red-400 font-bold">red</span> enemies!
            Reach the <span className="text-amber-400 font-bold">yellow</span> square!
        </p>
      </div>
    </div>
  );
};

export default PixelQuestGame;
