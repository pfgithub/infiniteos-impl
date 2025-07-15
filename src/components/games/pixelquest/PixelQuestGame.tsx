import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { levels, Level, Entity, Enemy as EnemyType } from './levels';
import { todoImplement } from '../../../todo';

// --- GAME CONFIG ---
const TILE_SIZE = 32; // in pixels

interface PixelQuestGameProps {
  onQuit: () => void;
}

// --- UI COMPONENTS ---
const Player = ({ x, y }: { x: number, y: number }) => (
    <div
        className="absolute transition-all duration-100 ease-linear"
        style={{
            left: x * TILE_SIZE,
            top: y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
        }}
    >
        <div className="w-full h-full bg-blue-500 rounded-full border-2 border-blue-300 shadow-[0_0_8px_blue]" />
    </div>
);

const Enemy = ({ entity }: { entity: EnemyType }) => (
    <div
        className="absolute transition-all duration-100 ease-linear"
        style={{
            left: entity.pos.x * TILE_SIZE,
            top: entity.pos.y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
        }}
    >
        <div
            className="w-full h-full"
            style={{
                backgroundColor: 'red',
                border: '2px solid darkred',
                boxShadow: '0 0 8px red',
            }}
        />
        <div className="absolute -bottom-2 w-full h-1.5 bg-gray-600 border border-gray-800 rounded-full">
            <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${(entity.hp / entity.maxHp) * 100}%` }}
            />
        </div>
    </div>
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

  const getTileColor = (tileType: 'floor' | 'wall' | 'goal') => {
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

const StatusBar = ({ stats }: { stats: any }) => (
    <div className="flex gap-4 text-sm font-semibold">
        <span className="text-yellow-300">LVL: {stats.level}</span>
        <div className="flex items-center gap-1">
            <span className="text-red-400">HP:</span>
            <div className="w-24 h-4 bg-gray-700 rounded-sm"><div className="h-full bg-red-500" style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}></div></div>
        </div>
        <div className="flex items-center gap-1">
            <span className="text-blue-400">XP:</span>
            <div className="w-24 h-4 bg-gray-700 rounded-sm"><div className="h-full bg-blue-500" style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}></div></div>
        </div>
        <span className="text-gray-300">ATK: {stats.attack}</span>
        <span className="text-gray-300">DEF: {stats.defense}</span>
    </div>
);

const GameLog = ({ messages }: { messages: string[] }) => (
    <div className="h-24 bg-black/30 p-2 overflow-y-auto flex flex-col-reverse text-sm">
        {messages.map((msg, i) => <p key={i} className="leading-tight">{msg}</p>)}
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

// --- MAIN GAME COMPONENT ---
const PixelQuestGame: React.FC<PixelQuestGameProps> = ({ onQuit }) => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [level, setLevel] = useState<Level>(() => JSON.parse(JSON.stringify(levels[currentLevelIndex])));
    const [playerPos, setPlayerPos] = useState(level.playerStart);
    const [playerStats, setPlayerStats] = useState({ hp: 30, maxHp: 30, attack: 5, defense: 2, level: 1, xp: 0, nextLevelXp: 50 });
    const [entities, setEntities] = useState<Entity[]>(level.entities);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'gameOver'>('playing');
    const [gameLog, setGameLog] = useState<string[]>(["Welcome to Pixel Quest RPG!"]);

    const gridDimensions = useMemo(() => ({
        width: level.map[0].length,
        height: level.map.length
    }), [level]);

    const addToLog = (message: string) => {
        setGameLog(prevLog => [message, ...prevLog.slice(0, 49)]);
    };
    
    const loadLevel = (levelIndex: number) => {
        if (levelIndex >= levels.length) {
            setGameState('won');
            return;
        }
        const newLevel = JSON.parse(JSON.stringify(levels[levelIndex]));
        setLevel(newLevel);
        setCurrentLevelIndex(levelIndex);
        setPlayerPos(newLevel.playerStart);
        setEntities(newLevel.entities);
        setGameState('playing');
    };

    const restartGame = () => {
        const firstLevel = JSON.parse(JSON.stringify(levels[0]));
        setCurrentLevelIndex(0);
        setLevel(firstLevel);
        setPlayerPos(firstLevel.playerStart);
        setEntities(firstLevel.entities);
        setPlayerStats({ hp: 30, maxHp: 30, attack: 5, defense: 2, level: 1, xp: 0, nextLevelXp: 50 });
        setGameState('playing');
        setGameLog(["Welcome back to Pixel Quest RPG!"]);
    };

    const handleCombat = (enemyId: number) => {
        const enemy = entities.find(e => e.id === enemyId) as EnemyType;
        if (!enemy || enemy.hp <= 0) return;
    
        // Player attacks
        const damageToEnemy = Math.max(1, playerStats.attack - enemy.defense);
        const newEnemyHp = enemy.hp - damageToEnemy;
        addToLog(`You hit the ${enemy.name} for ${damageToEnemy} damage.`);
    
        if (newEnemyHp <= 0) {
            addToLog(`You defeated the ${enemy.name}! You gain ${enemy.xp} XP.`);
            setEntities(currentEntities => currentEntities.filter(e => e.id !== enemyId));
            
            const newXp = playerStats.xp + enemy.xp;
            if (newXp >= playerStats.nextLevelXp) {
                const newPlayerStats = {
                    ...playerStats,
                    level: playerStats.level + 1,
                    xp: newXp - playerStats.nextLevelXp,
                    nextLevelXp: Math.floor(playerStats.nextLevelXp * 1.5),
                    maxHp: playerStats.maxHp + 10,
                    hp: playerStats.maxHp + 10,
                    attack: playerStats.attack + 2,
                    defense: playerStats.defense + 1,
                };
                setPlayerStats(newPlayerStats);
                addToLog(`LEVEL UP! You are now level ${newPlayerStats.level}!`);
            } else {
                setPlayerStats(stats => ({ ...stats, xp: newXp }));
            }
            return;
        }
        
        // Enemy is alive, update its HP and then it attacks
        setEntities(currentEntities => currentEntities.map(e => e.id === enemyId ? { ...e, hp: newEnemyHp } as EnemyType : e));
        
        const damageToPlayer = Math.max(1, enemy.attack - playerStats.defense);
        const newPlayerHp = playerStats.hp - damageToPlayer;
        addToLog(`The ${enemy.name} hits you for ${damageToPlayer} damage.`);
        
        if (newPlayerHp <= 0) {
            setPlayerStats(stats => ({ ...stats, hp: 0 }));
            setGameState('gameOver');
            addToLog("You have been defeated...");
        } else {
            setPlayerStats(stats => ({ ...stats, hp: newPlayerHp }));
        }
    };
    
    const movePlayer = useCallback((dx: number, dy: number) => {
        if (gameState !== 'playing') return;
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (newX < 0 || newX >= gridDimensions.width || newY < 0 || newY >= gridDimensions.height || level.map[newY][newX] === 'wall') {
            return;
        }

        const targetEntity = entities.find(e => e.pos.x === newX && e.pos.y === newY);
        if (targetEntity) {
            if (targetEntity.type === 'enemy') {
                handleCombat(targetEntity.id);
            } else if (targetEntity.type === 'npc') {
                addToLog(`[${targetEntity.name}]: ${targetEntity.message}`);
            }
            return;
        }
        
        if (level.map[newY][newX] === 'goal') {
            addToLog(`You found the exit to level ${currentLevelIndex + 1}!`);
            loadLevel(currentLevelIndex + 1);
            return;
        }
        
        setPlayerPos({ x: newX, y: newY });
        todoImplement("Make enemies move after the player moves.");

    }, [gameState, playerPos, gridDimensions.width, gridDimensions.height, level.map, entities, currentLevelIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp': case 'w': movePlayer(0, -1); break;
                case 'ArrowDown': case 's': movePlayer(0, 1); break;
                case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
                case 'ArrowRight': case 'd': movePlayer(1, 0); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer, gameState]);

    return (
        <div className="w-full h-full flex flex-col bg-gray-900 text-white select-none">
            <div className="flex-shrink-0 bg-gray-800 p-2 flex justify-between items-center border-b border-black/20">
                <h2 className="text-xl font-bold">Pixel Quest RPG - Level {currentLevelIndex + 1}</h2>
                <StatusBar stats={playerStats} />
                <button onClick={onQuit} className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded">
                    Quit
                </button>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center overflow-hidden p-4 bg-black/20">
                <div className="relative">
                    <GameGrid level={level} />
                    <Player x={playerPos.x} y={playerPos.y} />
                    {entities.map(entity => {
                        if (entity.type === 'enemy') {
                            return <Enemy key={entity.id} entity={entity} />;
                        }
                        if (entity.type === 'npc') {
                            return <NPC key={entity.id} x={entity.pos.x} y={entity.pos.y} />;
                        }
                        return null;
                    })}
                    {(gameState === 'won' || gameState === 'gameOver') && (
                        <GameOverlay status={gameState} onRestart={restartGame} onQuit={onQuit} />
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 bg-gray-800 p-2 border-t border-black/20">
                <GameLog messages={gameLog} />
            </div>
        </div>
    );
};

export default PixelQuestGame;
