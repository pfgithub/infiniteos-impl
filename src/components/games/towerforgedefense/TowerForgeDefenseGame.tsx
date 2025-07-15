import React, { useRef, useEffect, useState } from 'react';
import { todoImplement } from '../../../todo';

const TILE_SIZE = 40;
const MAP_WIDTH_TILES = 20;
const MAP_HEIGHT_TILES = 15;
const MAP_WIDTH = TILE_SIZE * MAP_WIDTH_TILES;
const MAP_HEIGHT = TILE_SIZE * MAP_HEIGHT_TILES;

// A simple path for enemies to follow
const path = [
    { x: 0, y: 5 }, { x: 3, y: 5 },
    { x: 3, y: 10 }, { x: 8, y: 10 },
    { x: 8, y: 2 }, { x: 15, y: 2 },
    { x: 15, y: 12 }, { x: 20, y: 12 }
];

const TOWER_TYPES = {
    'Archer Tower': { cost: 100, color: '#c19a6b', name: 'Archer Tower' },
    'Cannon Tower': { cost: 150, color: '#808080', name: 'Cannon Tower' },
    'Mage Tower': { cost: 200, color: '#8a2be2', name: 'Mage Tower' },
    'Slow Tower': { cost: 80, color: '#add8e6', name: 'Slow Tower' },
};
type TowerType = keyof typeof TOWER_TYPES;

interface Tower {
    x: number;
    y: number;
    type: TowerType;
}

type GameStatus = 'idle' | 'wave_in_progress' | 'game_over';

const isPath = (tileX: number, tileY: number): boolean => {
    for (let i = 0; i < path.length - 1; i++) {
        const p1 = path[i];
        const p2 = path[i + 1];

        // Horizontal path segment
        if (p1.y === p2.y && tileY === p1.y) {
            if (tileX >= Math.min(p1.x, p2.x) && tileX <= Math.max(p1.x, p2.x)) {
                return true;
            }
        }
        // Vertical path segment
        if (p1.x === p2.x && tileX === p1.x) {
            if (tileY >= Math.min(p1.y, p2.y) && tileY <= Math.max(p1.y, p2.y)) {
                return true;
            }
        }
    }
    return false;
};

const TowerForgeDefenseGame: React.FC<{ onBackToMenu: () => void }> = ({ onBackToMenu }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [health, setHealth] = useState(100);
    const [gold, setGold] = useState(250);
    const [wave, setWave] = useState(0);
    const [towers, setTowers] = useState<Tower[]>([]);
    const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>(null);
    const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
    const [mousePos, setMousePos] = useState({ x: -1, y: -1 });

    // Use a ref to hold the latest state for the game loop and event handlers
    const stateRef = useRef({ gold, towers, selectedTowerType, mousePos });
    stateRef.current = { gold, towers, selectedTowerType, mousePos };

    const handleSelectTower = (type: TowerType) => {
        if (TOWER_TYPES[type].cost > gold) {
            console.log("Not enough gold");
            return;
        }
        // Toggle selection
        setSelectedTowerType(current => current === type ? null : type);
    };

    const handleStartWave = () => {
        if (gameStatus === 'idle') {
            setGameStatus('wave_in_progress');
            setWave(w => w + 1);
            todoImplement(`Wave ${wave + 1} started. Implement spawning and moving enemies along the path. Enemies should damage player health if they reach the end.`);
        }
    };

    // Effect for game loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const drawMap = (context: CanvasRenderingContext2D) => {
            context.fillStyle = '#3a5943';
            context.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
            context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            for (let x = 0; x < MAP_WIDTH; x += TILE_SIZE) {
                context.beginPath(); context.moveTo(x, 0); context.lineTo(x, MAP_HEIGHT); context.stroke();
            }
            for (let y = 0; y < MAP_HEIGHT; y += TILE_SIZE) {
                context.beginPath(); context.moveTo(0, y); context.lineTo(MAP_WIDTH, y); context.stroke();
            }
            context.fillStyle = '#8c6b4f';
            path.forEach((p, i) => {
                if (i < path.length - 1) {
                    const p1 = path[i], p2 = path[i+1];
                    if (p1.x === p2.x) {
                        context.fillRect(p1.x * TILE_SIZE, Math.min(p1.y, p2.y) * TILE_SIZE, TILE_SIZE, Math.abs(p1.y - p2.y) * TILE_SIZE + TILE_SIZE);
                    } else {
                        context.fillRect(Math.min(p1.x, p2.x) * TILE_SIZE, p1.y * TILE_SIZE, Math.abs(p1.x - p2.x) * TILE_SIZE + TILE_SIZE, TILE_SIZE);
                    }
                }
            });
        };

        const drawTowers = (context: CanvasRenderingContext2D, currentTowers: Tower[]) => {
            currentTowers.forEach(tower => {
                const towerInfo = TOWER_TYPES[tower.type];
                context.fillStyle = towerInfo.color;
                context.fillRect(tower.x * TILE_SIZE, tower.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                context.strokeStyle = 'black';
                context.strokeRect(tower.x * TILE_SIZE, tower.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            });
        };

        const drawPlacementPreview = (context: CanvasRenderingContext2D, currentSelectedTower: TowerType | null, currentTowers: Tower[], currentMousePos: {x:number, y:number}) => {
            if (!currentSelectedTower) return;
            const tileX = Math.floor(currentMousePos.x / TILE_SIZE);
            const tileY = Math.floor(currentMousePos.y / TILE_SIZE);
            if (tileX < 0 || tileX >= MAP_WIDTH_TILES || tileY < 0 || tileY >= MAP_HEIGHT_TILES) return;
            const canPlace = !isPath(tileX, tileY) && !currentTowers.some(t => t.x === tileX && t.y === tileY);
            context.globalAlpha = 0.5;
            context.fillStyle = canPlace ? 'white' : 'red';
            context.fillRect(tileX * TILE_SIZE, tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            context.globalAlpha = 1.0;
        };

        const gameLoop = () => {
            const { towers, selectedTowerType, mousePos } = stateRef.current;
            ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
            drawMap(ctx);
            drawTowers(ctx, towers);
            drawPlacementPreview(ctx, selectedTowerType, towers, mousePos);
            animationFrameId = window.requestAnimationFrame(gameLoop);
        };
        gameLoop();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Effect for event handlers
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };
        
        const handleMouseClick = (e: MouseEvent) => {
            const { selectedTowerType, gold, towers } = stateRef.current;
            if (!selectedTowerType) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const tileX = Math.floor(x / TILE_SIZE);
            const tileY = Math.floor(y / TILE_SIZE);

            if (tileX < 0 || tileX >= MAP_WIDTH_TILES || tileY < 0 || tileY >= MAP_HEIGHT_TILES) return;
            
            const towerCost = TOWER_TYPES[selectedTowerType].cost;
            const canAfford = gold >= towerCost;
            const isValidPlacement = !isPath(tileX, tileY) && !towers.some(t => t.x === tileX && t.y === tileY);
            
            if (canAfford && isValidPlacement) {
                setGold(g => g - towerCost);
                setTowers(t => [...t, { x: tileX, y: tileY, type: selectedTowerType }]);
                setSelectedTowerType(null);
            } else {
                console.log("Cannot place tower here.");
            }
        };

        const handleRightClick = (e: MouseEvent) => {
            e.preventDefault();
            setSelectedTowerType(null);
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleMouseClick);
        canvas.addEventListener('contextmenu', handleRightClick);
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleMouseClick);
            canvas.removeEventListener('contextmenu', handleRightClick);
        };
    }, []);

    const TowerButton = ({ type }: { type: TowerType }) => {
        const { name, cost } = TOWER_TYPES[type];
        const isSelected = selectedTowerType === type;
        const canAfford = gold >= cost;
        return (
            <button
                onClick={() => handleSelectTower(type)}
                disabled={!canAfford && !isSelected}
                className={`p-2 border border-yellow-700 bg-black/30 rounded-lg text-left w-full transition-all
                    ${isSelected ? 'bg-yellow-800 ring-2 ring-yellow-400' : 'hover:bg-yellow-800/50'}
                    ${!canAfford && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <p className="font-bold">{name}</p>
                <p className="text-sm text-yellow-400">Cost: {cost}</p>
            </button>
        );
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-800 text-white select-none">
            {/* Top Stats Bar */}
            <div className="flex-shrink-0 bg-black/50 p-2 flex justify-between items-center border-b border-yellow-700/50">
                <div className="flex gap-6">
                    <div>❤️ Health: <span className="font-bold text-green-400">{health}</span></div>
                    <div>💰 Gold: <span className="font-bold text-yellow-400">{gold}</span></div>
                    <div>🌊 Wave: <span className="font-bold">{wave} / 20</span></div>
                </div>
                <div>
                    <button onClick={handleStartWave} className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={gameStatus === 'wave_in_progress' || selectedTowerType !== null}>
                        {gameStatus === 'wave_in_progress' ? `Wave ${wave} in Progress` : 'Start Next Wave'}
                    </button>
                    <button onClick={onBackToMenu} className="bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded ml-2">Menu</button>
                </div>
            </div>

            <div className="flex-grow flex">
                {/* Game Canvas */}
                <div className="flex-grow flex items-center justify-center bg-black p-2">
                    <canvas ref={canvasRef} width={MAP_WIDTH} height={MAP_HEIGHT} onContextMenu={e => e.preventDefault()} />
                </div>

                {/* Right Sidebar for Towers */}
                <div className="w-48 bg-black/30 p-4 border-l border-yellow-700/50 flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center border-b border-yellow-700/50 pb-2">Towers</h2>
                    {(Object.keys(TOWER_TYPES) as TowerType[]).map(type => (
                        <TowerButton key={type} type={type} />
                    ))}
                    
                    <div className="mt-auto text-center">
                        <h3 className="font-bold">Selected Tower:</h3>
                        <p className="text-gray-400 min-h-[1.5em]">{selectedTowerType || 'None'}</p>
                        {selectedTowerType && (
                            <button onClick={() => setSelectedTowerType(null)} className="text-xs text-red-400 hover:underline">
                                Cancel (Right-click)
                            </button>
                        )}
                        <button
                            onClick={() => todoImplement('Implement upgrading selected tower.')}
                            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded mt-4 disabled:opacity-50" disabled>Upgrade</button>
                        <button
                            onClick={() => todoImplement('Implement selling selected tower.')}
                            className="w-full bg-red-600 hover:bg-red-700 px-4 py-1 rounded mt-2 disabled:opacity-50" disabled>Sell</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TowerForgeDefenseGame;
