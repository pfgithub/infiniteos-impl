import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { levels, Level, Entity, Enemy as EnemyType } from './levels';

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
                transform: `rotate(${entity.id * 45}deg) scale(0.8)`, // make them look slightly different
                borderRadius: '30%',
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
        }}
    >
        <div className="w-full h-full bg-green-500 rounded-md border-2 border-green-300 shadow-[0_0_8px_green]" />
    </div>
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
    const [gameLog, setGameLog] = useState<string[]>(["Welcome to Pixel Quest RPG! Use arrow keys or WASD to move."]);

    const gridDimensions = useMemo(() => ({
        width: level.map[0].length,
        height: level.map.length
    }), [level]);
    
    const addToLog = useCallback((message: string) => {
        setGameLog(prevLog => [message, ...prevLog.slice(0, 49)]);
    }, []);

    const loadLevel = useCallback((levelIndex: number) => {
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
    }, []);

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

    const takeTurn = useCallback((dx: number, dy: number) => {
        if (gameState !== 'playing') return;

        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (newX < 0 || newX >= gridDimensions.width || newY < 0 || newY >= gridDimensions.height || level.map[newY][newX] === 'wall') {
            return;
        }

        let logs: string[] = [];
        let newPlayerPos = { ...playerPos };
        let newEntities = JSON.parse(JSON.stringify(entities));
        let newPlayerStats = { ...playerStats };

        // 1. Player Action
        const targetEntity = newEntities.find(e => e.pos.x === newX && e.pos.y === newY);
        if (targetEntity) {
            if (targetEntity.type === 'enemy') {
                const enemy = targetEntity;
                const damageToEnemy = Math.max(1, newPlayerStats.attack - enemy.defense);
                enemy.hp -= damageToEnemy;
                logs.push(`You hit the ${enemy.name} for ${damageToEnemy} damage.`);
            
                if (enemy.hp <= 0) {
                    logs.push(`You defeated the ${enemy.name}! You gain ${enemy.xp} XP.`);
                    newEntities = newEntities.filter(e => e.id !== enemy.id);
                    
                    const newXp = newPlayerStats.xp + enemy.xp;
                    if (newXp >= newPlayerStats.nextLevelXp) {
                        newPlayerStats.level += 1;
                        newPlayerStats.xp = newXp - newPlayerStats.nextLevelXp;
                        newPlayerStats.nextLevelXp = Math.floor(newPlayerStats.nextLevelXp * 1.5);
                        newPlayerStats.maxHp += 10;
                        newPlayerStats.hp = newPlayerStats.maxHp;
                        newPlayerStats.attack += 2;
                        newPlayerStats.defense += 1;
                        logs.push(`LEVEL UP! You are now level ${newPlayerStats.level}!`);
                    } else {
                        newPlayerStats.xp = newXp;
                    }
                }
            } else if (targetEntity.type === 'npc') {
                addToLog(`[${targetEntity.name}]: ${targetEntity.message}`);
                return;
            }
        } else if (level.map[newY][newX] === 'goal') {
            addToLog(`You found the exit to level ${currentLevelIndex + 1}!`);
            loadLevel(currentLevelIndex + 1);
            return;
        } else {
            newPlayerPos = { x: newX, y: newY };
        }

        // 2. Enemy Actions
        let gameOver = false;
        
        const finalPositions = new Map<number, {x: number, y: number}>();
        newEntities.forEach(e => finalPositions.set(e.id, {...e.pos}));
        
        for (const entity of newEntities) {
            if (entity.type !== 'enemy' || entity.hp <= 0) continue;
            
            const distToPlayer = Math.abs(newPlayerPos.x - entity.pos.x) + Math.abs(newPlayerPos.y - entity.pos.y);
            
            if (distToPlayer === 1) { // Attack
                const damageToPlayer = Math.max(1, entity.attack - newPlayerStats.defense);
                newPlayerStats.hp -= damageToPlayer;
                logs.push(`The ${entity.name} hits you for ${damageToPlayer} damage.`);
                if (newPlayerStats.hp <= 0) {
                    newPlayerStats.hp = 0;
                    gameOver = true;
                    logs.push("You have been defeated...");
                    break;
                }
            } else { // Move
                let bestMove = { x: entity.pos.x, y: entity.pos.y };
                let minDistance = distToPlayer;

                const moves = [[0, -1], [0, 1], [-1, 0], [1, 0]];
                for (let i = moves.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [moves[i], moves[j]] = [moves[j], moves[i]];
                }

                for (const [moveDx, moveDy] of moves) {
                    const nextX = entity.pos.x + moveDx;
                    const nextY = entity.pos.y + moveDy;

                    if (nextX < 0 || nextX >= gridDimensions.width || nextY < 0 || nextY >= gridDimensions.height || level.map[nextY][nextX] === 'wall') continue;
                    
                    const isPlayerOccupied = newPlayerPos.x === nextX && newPlayerPos.y === nextY;
                    if(isPlayerOccupied) continue;

                    const isEntityOccupied = Array.from(finalPositions.entries()).some(([id, pos]) => id !== entity.id && pos.x === nextX && pos.y === nextY);
                    if (isEntityOccupied) continue;

                    const distance = Math.abs(newPlayerPos.x - nextX) + Math.abs(newPlayerPos.y - nextY);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestMove = { x: nextX, y: nextY };
                    }
                }
                finalPositions.set(entity.id, bestMove);
            }
        }
        
        // 3. Apply all state changes
        newEntities.forEach(e => {
            const newPos = finalPositions.get(e.id);
            if (newPos) e.pos = newPos;
        });
        
        logs.forEach(log => addToLog(log));
        setPlayerPos(newPlayerPos);
        setPlayerStats(newPlayerStats);
        setEntities(newEntities);
        if (gameOver) {
            setGameState('gameOver');
        }
    }, [gameState, playerPos, entities, playerStats, gridDimensions, level.map, currentLevelIndex, loadLevel, addToLog]);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp': case 'w': takeTurn(0, -1); break;
                case 'ArrowDown': case 's': takeTurn(0, 1); break;
                case 'ArrowLeft': case 'a': takeTurn(-1, 0); break;
                case 'ArrowRight': case 'd': takeTurn(1, 0); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [takeTurn, gameState]);

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
