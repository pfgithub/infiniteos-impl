import React, { useState, useEffect, useCallback } from 'react';
import { todoImplement } from '../../../todo';

// --- GAME CONFIG ---
const TILE_SIZE = 48;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

type Tile = 'grass' | 'tree' | 'water' | 'path';

interface ArcaneLegacyGameProps {
  onQuit: () => void;
}

// --- MOCK DATA ---
const createMap = (): Tile[][] => {
    const map: Tile[][] = Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill('grass'));
    for (let i = 0; i < MAP_WIDTH; i++) {
        map[0][i] = 'tree';
        map[MAP_HEIGHT - 1][i] = 'tree';
    }
    for (let i = 0; i < MAP_HEIGHT; i++) {
        map[i][0] = 'tree';
        map[i][MAP_WIDTH - 1][i] = 'tree';
    }
    map[5][5] = 'tree';
    map[5][6] = 'tree';
    map[6][5] = 'tree';
    map[7][8] = 'water';
    map[7][9] = 'water';
    map[8][8] = 'water';
    map[8][9] = 'water';
    map[3][3] = 'path';
    map[3][4] = 'path';
    map[4][4] = 'path';
    map[5][4] = 'path';
    map[6][4] = 'path';
    
    return map;
}

// --- COMPONENTS ---
const Player = ({ x, y }: { x: number, y: number }) => (
    <div
        className="absolute transition-transform duration-100 ease-linear"
        style={{
            transform: `translate(${x}px, ${y}px)`,
            width: TILE_SIZE,
            height: TILE_SIZE,
            zIndex: 10,
        }}
    >
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-green-300 shadow-md" />
        </div>
    </div>
);

const GameMap = ({ mapData }: { mapData: Tile[][] }) => {
    const getTileStyle = (tile: Tile) => {
        switch(tile) {
            case 'grass': return 'bg-green-600';
            case 'tree': return 'bg-green-800';
            case 'water': return 'bg-blue-700';
            case 'path': return 'bg-yellow-700';
            default: return 'bg-black';
        }
    };

    return (
        <div 
            className="relative bg-black grid"
            style={{
                width: MAP_WIDTH * TILE_SIZE,
                height: MAP_HEIGHT * TILE_SIZE,
                gridTemplateColumns: `repeat(${MAP_WIDTH}, ${TILE_SIZE}px)`,
                gridTemplateRows: `repeat(${MAP_HEIGHT}, ${TILE_SIZE}px)`,
            }}
        >
            {mapData.map((row, y) => 
                row.map((tile, x) => (
                    <div key={`${x}-${y}`} className={`w-full h-full ${getTileStyle(tile)}`} />
                ))
            )}
        </div>
    );
};

// --- MAIN GAME COMPONENT ---
const ArcaneLegacyGame: React.FC<ArcaneLegacyGameProps> = ({ onQuit }) => {
    const [playerPos, setPlayerPos] = useState({ x: 2 * TILE_SIZE, y: 2 * TILE_SIZE });
    const [map] = useState(createMap());
    const [health, setHealth] = useState(3);
    const gameAreaRef = React.useRef<HTMLDivElement>(null);

    const movePlayer = useCallback((dx: number, dy: number) => {
        setPlayerPos(prevPos => {
            const newX = prevPos.x + dx;
            const newY = prevPos.y + dy;
            
            // Central point of player for collision
            const centerX = newX + TILE_SIZE / 2;
            const centerY = newY + TILE_SIZE / 2;

            const mapX = Math.floor(centerX / TILE_SIZE);
            const mapY = Math.floor(centerY / TILE_SIZE);

            if (mapX < 0 || mapX >= MAP_WIDTH || mapY < 0 || mapY >= MAP_HEIGHT) {
                return prevPos;
            }
            
            // Check for collision with center of player against map grid
            if (map[mapY]?.[mapX] === 'tree' || map[mapY]?.[mapX] === 'water') {
                return prevPos;
            }

            // Boundary checks for the game area
            const boundedX = Math.max(0, Math.min(newX, MAP_WIDTH * TILE_SIZE - TILE_SIZE));
            const boundedY = Math.max(0, Math.min(newY, MAP_HEIGHT * TILE_SIZE - TILE_SIZE));

            return { x: boundedX, y: boundedY };
        });
    }, [map]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            const speed = 8;
            switch(e.key) {
                case 'ArrowUp': case 'w': movePlayer(0, -speed); break;
                case 'ArrowDown': case 's': movePlayer(0, speed); break;
                case 'ArrowLeft': case 'a': movePlayer(-speed, 0); break;
                case 'ArrowRight': case 'd': movePlayer(speed, 0); break;
                case ' ': // Action key
                    todoImplement("Player pressed action key (Space). Implement interactions with NPCs, items, or sword attack.");
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer]);
    
    useEffect(() => {
        // Focus the game area to capture key events
        gameAreaRef.current?.focus();
    }, []);

    const hearts = Array.from({ length: 3 }, (_, i) => (
        <span key={i} className={i < health ? 'text-red-500' : 'text-gray-600'}>♥</span>
    ));

    return (
        <div 
            ref={gameAreaRef}
            className="w-full h-full flex flex-col bg-black text-white select-none overflow-hidden focus:outline-none"
            tabIndex={-1} // Make it focusable
        >
            <div className="flex-shrink-0 bg-gray-800 p-2 flex justify-between items-center border-b border-black/20">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold">Arcane Legacy</h2>
                    <div className="text-2xl">{hearts}</div>
                </div>
                <button onClick={() => todoImplement("Open inventory screen for Arcane Legacy.")} className="px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded">Inventory</button>
                <button onClick={onQuit} className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded">Quit</button>
            </div>
            
            <div className="flex-grow flex items-center justify-center p-4">
                <div 
                    className="relative overflow-hidden border-2 border-gray-700"
                    style={{
                        width: MAP_WIDTH * TILE_SIZE,
                        height: MAP_HEIGHT * TILE_SIZE,
                    }}
                >
                    <GameMap mapData={map} />
                    <Player x={playerPos.x} y={playerPos.y} />
                    {/* Add other entities here, e.g. enemies, NPCs */}
                    <div className="absolute text-yellow-300 p-2 rounded bg-black/50" style={{left: TILE_SIZE * 10, top: TILE_SIZE * 10}}>NPC</div>
                </div>
            </div>

            <div className="flex-shrink-0 bg-gray-800 p-2 border-t border-black/20 h-24">
                <p>Welcome to Arcane Legacy! Use arrow keys or WASD to move.</p>
                <p className="text-yellow-400">Hint: Explore the world to uncover its secrets.</p>
            </div>
        </div>
    );
};

export default ArcaneLegacyGame;
