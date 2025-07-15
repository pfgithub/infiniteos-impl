import React, { useRef, useEffect } from 'react';
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

const TowerForgeDefenseGame: React.FC<{ onBackToMenu: () => void }> = ({ onBackToMenu }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const drawMap = (context: CanvasRenderingContext2D) => {
            // Draw background
            context.fillStyle = '#3a5943'; // A grassy green
            context.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

            // Draw grid
            context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            for (let x = 0; x < MAP_WIDTH; x += TILE_SIZE) {
                context.beginPath();
                context.moveTo(x, 0);
                context.lineTo(x, MAP_HEIGHT);
                context.stroke();
            }
            for (let y = 0; y < MAP_HEIGHT; y += TILE_SIZE) {
                context.beginPath();
                context.moveTo(0, y);
                context.lineTo(MAP_WIDTH, y);
                context.stroke();
            }
            
            // Draw path
            context.fillStyle = '#8c6b4f'; // Dirt path color
            path.forEach((p, i) => {
                if (i < path.length - 1) {
                    const p1 = path[i];
                    const p2 = path[i + 1];

                    const x1 = p1.x * TILE_SIZE;
                    const y1 = p1.y * TILE_SIZE;
                    
                    if (p1.x === p2.x) { // Vertical path
                        context.fillRect(x1, Math.min(p1.y, p2.y) * TILE_SIZE, TILE_SIZE, Math.abs(p1.y - p2.y) * TILE_SIZE + TILE_SIZE);
                    } else { // Horizontal path
                        context.fillRect(Math.min(p1.x, p2.x) * TILE_SIZE, y1, Math.abs(p1.x - p2.x) * TILE_SIZE + TILE_SIZE, TILE_SIZE);
                    }
                }
            });
        };

        const gameLoop = () => {
            ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
            drawMap(ctx);
            // TODO: Draw enemies, towers, projectiles
            animationFrameId = window.requestAnimationFrame(gameLoop);
        };
        gameLoop();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const TowerButton = ({ name, cost }: { name: string, cost: number }) => (
        <button
            onClick={() => todoImplement(`Implement selecting and placing the ${name} tower.`)}
            className="p-2 border border-yellow-700 bg-black/30 rounded-lg text-left hover:bg-yellow-800/50 w-full"
        >
            <p className="font-bold">{name}</p>
            <p className="text-sm text-yellow-400">Cost: {cost}</p>
        </button>
    );

    return (
        <div className="flex flex-col h-full w-full bg-gray-800 text-white">
            {/* Top Stats Bar */}
            <div className="flex-shrink-0 bg-black/50 p-2 flex justify-between items-center border-b border-yellow-700/50">
                <div className="flex gap-6">
                    <div>❤️ Health: <span className="font-bold text-green-400">100</span></div>
                    <div>💰 Gold: <span className="font-bold text-yellow-400">250</span></div>
                    <div>🌊 Wave: <span className="font-bold">1 / 20</span></div>
                </div>
                <div>
                    <button onClick={() => todoImplement('Implement starting the next wave, including spawning enemies.')} className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded">Start Wave</button>
                    <button onClick={onBackToMenu} className="bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded ml-2">Menu</button>
                </div>
            </div>

            <div className="flex-grow flex">
                {/* Game Canvas */}
                <div className="flex-grow flex items-center justify-center bg-black p-2">
                    <canvas ref={canvasRef} width={MAP_WIDTH} height={MAP_HEIGHT} />
                </div>

                {/* Right Sidebar for Towers */}
                <div className="w-48 bg-black/30 p-4 border-l border-yellow-700/50 flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center border-b border-yellow-700/50 pb-2">Towers</h2>
                    <TowerButton name="Archer Tower" cost={100} />
                    <TowerButton name="Cannon Tower" cost={150} />
                    <TowerButton name="Mage Tower" cost={200} />
                    <TowerButton name="Slow Tower" cost={80} />
                    <div className="mt-auto text-center">
                        <h3 className="font-bold">Selected Tower:</h3>
                        <p className="text-gray-400">None</p>
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
