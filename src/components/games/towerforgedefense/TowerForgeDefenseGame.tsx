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
    'Archer Tower': { cost: 100, color: '#c19a6b', name: 'Archer Tower', range: 3 * TILE_SIZE, damage: 10, attackSpeed: 1000, projectileColor: '#966919', projectileSpeed: 5 },
    'Cannon Tower': { cost: 150, color: '#808080', name: 'Cannon Tower', range: 2 * TILE_SIZE, damage: 25, attackSpeed: 2000, projectileColor: '#36454F', projectileSpeed: 4 },
    'Mage Tower': { cost: 200, color: '#8a2be2', name: 'Mage Tower', range: 4 * TILE_SIZE, damage: 15, attackSpeed: 1500, projectileColor: '#DA70D6', projectileSpeed: 6 },
    'Slow Tower': { cost: 80, color: '#add8e6', name: 'Slow Tower', range: 2.5 * TILE_SIZE, damage: 0, attackSpeed: 2500, projectileColor: '#87CEEB', projectileSpeed: 5 },
};
type TowerType = keyof typeof TOWER_TYPES;

interface Tower {
    id: number;
    x: number;
    y: number;
    type: TowerType;
    lastShotTime: number;
}

interface Enemy {
    id: number;
    x: number;
    y: number;
    health: number;
    maxHealth: number;
    speed: number;
    pathIndex: number;
    goldOnKill: number;
}

interface Projectile {
    id: number;
    x: number;
    y: number;
    targetId: number;
    speed: number;
    damage: number;
    color: string;
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
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>(null);
    const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
    const [mousePos, setMousePos] = useState({ x: -1, y: -1 });
    const spawnIntervalRef = useRef<number | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const lastTimeRef = useRef(0);

    // Use a ref to hold the latest state for the game loop and event handlers
    const stateRef = useRef({ gold, towers, selectedTowerType, mousePos, enemies, health, wave, gameStatus, gameOver, projectiles });
    stateRef.current = { gold, towers, selectedTowerType, mousePos, enemies, health, wave, gameStatus, gameOver, projectiles };

    const handleSelectTower = (type: TowerType) => {
        if (TOWER_TYPES[type].cost > gold) {
            console.log("Not enough gold");
            return;
        }
        setSelectedTowerType(current => current === type ? null : type);
    };

    const handleStartWave = () => {
        if (gameStatus === 'idle') {
            setGameStatus('wave_in_progress');
            const newWave = wave + 1;
            setWave(newWave);
            
            const enemiesToSpawn = 10 + newWave * 2;
            let enemiesSpawned = 0;
            
            const intervalId = window.setInterval(() => {
                if (enemiesSpawned < enemiesToSpawn) {
                    setEnemies(prev => [...prev, {
                        id: Date.now() + Math.random(),
                        x: path[0].x * TILE_SIZE + TILE_SIZE / 2,
                        y: path[0].y * TILE_SIZE + TILE_SIZE / 2,
                        health: 100 + newWave * 20,
                        maxHealth: 100 + newWave * 20,
                        speed: 1,
                        pathIndex: 0,
                        goldOnKill: 5 + newWave,
                    }]);
                    enemiesSpawned++;
                } else {
                    clearInterval(intervalId);
                    spawnIntervalRef.current = null;
                }
            }, 500);
            spawnIntervalRef.current = intervalId;
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

                // Draw tower range on hover or if selected (for later)
                // context.beginPath();
                // context.arc(tower.x * TILE_SIZE + TILE_SIZE/2, tower.y * TILE_SIZE + TILE_SIZE/2, towerInfo.range, 0, 2*Math.PI);
                // context.strokeStyle = "rgba(255,255,255,0.3)";
                // context.stroke();
            });
        };

        const drawPlacementPreview = (context: CanvasRenderingContext2D, currentSelectedTower: TowerType | null, currentTowers: Tower[], currentMousePos: {x:number, y:number}) => {
            if (!currentSelectedTower) return;
            const tileX = Math.floor(currentMousePos.x / TILE_SIZE);
            const tileY = Math.floor(currentMousePos.y / TILE_SIZE);
            if (tileX < 0 || tileX >= MAP_WIDTH_TILES || tileY < 0 || tileY >= MAP_HEIGHT_TILES) return;

            const towerInfo = TOWER_TYPES[currentSelectedTower];
            context.beginPath();
            context.arc(tileX * TILE_SIZE + TILE_SIZE/2, tileY * TILE_SIZE + TILE_SIZE/2, towerInfo.range, 0, 2*Math.PI);
            context.fillStyle = "rgba(255,255,255,0.1)";
            context.fill();
            context.strokeStyle = "rgba(255,255,255,0.4)";
            context.stroke();

            const canPlace = !isPath(tileX, tileY) && !currentTowers.some(t => t.x === tileX && t.y === tileY);
            context.globalAlpha = 0.5;
            context.fillStyle = canPlace ? 'white' : 'red';
            context.fillRect(tileX * TILE_SIZE, tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            context.globalAlpha = 1.0;
        };

        const drawEnemies = (context: CanvasRenderingContext2D, currentEnemies: Enemy[]) => {
            currentEnemies.forEach(enemy => {
                context.fillStyle = '#8b0000'; // Dark red for enemies
                context.beginPath();
                context.arc(enemy.x, enemy.y, TILE_SIZE / 3, 0, 2 * Math.PI);
                context.fill();

                // Health bar
                const healthBarWidth = TILE_SIZE * 0.8;
                const healthBarHeight = 5;
                const healthBarX = enemy.x - healthBarWidth / 2;
                const healthBarY = enemy.y - TILE_SIZE / 2;
                
                context.fillStyle = '#333';
                context.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

                const currentHealthWidth = healthBarWidth * (enemy.health / enemy.maxHealth);
                context.fillStyle = enemy.health / enemy.maxHealth > 0.5 ? '#22c55e' : enemy.health / enemy.maxHealth > 0.2 ? '#facc15' : '#ef4444';
                context.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
            });
        };

        const drawProjectiles = (context: CanvasRenderingContext2D, currentProjectiles: Projectile[]) => {
            currentProjectiles.forEach(p => {
                context.fillStyle = p.color;
                context.beginPath();
                context.arc(p.x, p.y, 5, 0, 2 * Math.PI);
                context.fill();
            });
        };
        
        const updateTowersAndShoot = (timestamp: number) => {
            if (stateRef.current.gameOver) return;
        
            const newProjectiles: Projectile[] = [];
            let towersChanged = false;
        
            const updatedTowers = stateRef.current.towers.map(tower => {
                const towerInfo = TOWER_TYPES[tower.type];
                if (timestamp - tower.lastShotTime >= towerInfo.attackSpeed) {
                    const target = stateRef.current.enemies.find(enemy => {
                        const towerCenterX = tower.x * TILE_SIZE + TILE_SIZE / 2;
                        const towerCenterY = tower.y * TILE_SIZE + TILE_SIZE / 2;
                        const dx = enemy.x - towerCenterX;
                        const dy = enemy.y - towerCenterY;
                        return Math.sqrt(dx * dx + dy * dy) <= towerInfo.range;
                    });
        
                    if (target) {
                        newProjectiles.push({
                            id: Date.now() + Math.random(),
                            x: tower.x * TILE_SIZE + TILE_SIZE / 2,
                            y: tower.y * TILE_SIZE + TILE_SIZE / 2,
                            targetId: target.id,
                            speed: towerInfo.projectileSpeed,
                            damage: towerInfo.damage,
                            color: towerInfo.projectileColor,
                        });
                        towersChanged = true;
                        return { ...tower, lastShotTime: timestamp };
                    }
                }
                return tower;
            });
        
            if (towersChanged) {
                setTowers(updatedTowers);
            }
            if (newProjectiles.length > 0) {
                setProjectiles(p => [...p, ...newProjectiles]);
            }
        };

        const updateProjectilesAndEnemies = () => {
            if (stateRef.current.gameOver) return;
          
            const damageToApply = new Map<number, number>();
            const enemiesMap = new Map(stateRef.current.enemies.map(e => [e.id, e]));
          
            // Update projectiles
            setProjectiles(currentProjectiles =>
              currentProjectiles.filter(p => {
                const target = enemiesMap.get(p.targetId);
                if (!target) return false;
          
                const dx = target.x - p.x;
                const dy = target.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
          
                if (dist < p.speed) {
                  const currentDamage = damageToApply.get(p.targetId) || 0;
                  damageToApply.set(p.targetId, currentDamage + p.damage);
                  return false; // remove projectile
                } else {
                  p.x += (dx / dist) * p.speed;
                  p.y += (dy / dist) * p.speed;
                  return true;
                }
              })
            );
          
            // Update enemies (damage, death, movement)
            setEnemies(currentEnemies => {
              let goldToAdd = 0;
              let healthToLose = 0;
          
              const updatedEnemies = currentEnemies.map(enemy => {
                if (damageToApply.has(enemy.id)) {
                  return { ...enemy, health: enemy.health - damageToApply.get(enemy.id)! };
                }
                return enemy;
              });
          
              const finalEnemies = updatedEnemies.reduce((acc, enemy) => {
                if (enemy.health <= 0) {
                  goldToAdd += enemy.goldOnKill;
                  return acc;
                }
          
                const nextWaypointIndex = enemy.pathIndex + 1;
                if (nextWaypointIndex >= path.length) {
                  healthToLose += 10;
                  return acc;
                }
          
                const targetWaypoint = path[nextWaypointIndex];
                const targetX = targetWaypoint.x * TILE_SIZE + TILE_SIZE / 2;
                const targetY = targetWaypoint.y * TILE_SIZE + TILE_SIZE / 2;
          
                const dx = targetX - enemy.x;
                const dy = targetY - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
          
                const newEnemy = { ...enemy };
                if (distance < newEnemy.speed) {
                  newEnemy.x = targetX;
                  newEnemy.y = targetY;
                  newEnemy.pathIndex = nextWaypointIndex;
                } else {
                  newEnemy.x += (dx / distance) * newEnemy.speed;
                  newEnemy.y += (dy / distance) * newEnemy.speed;
                }
                acc.push(newEnemy);
                return acc;
              }, [] as Enemy[]);
          
              if (goldToAdd > 0) setGold(g => g + goldToAdd);
              if (healthToLose > 0) setHealth(h => Math.max(0, h - healthToLose));
          
              return finalEnemies;
            });
        };

        const gameLoop = (timestamp: number) => {
            if (!lastTimeRef.current) {
                lastTimeRef.current = timestamp;
            }

            updateTowersAndShoot(timestamp);
            updateProjectilesAndEnemies();
            
            const { towers, selectedTowerType, mousePos, enemies: currentEnemies, projectiles: currentProjectiles, gameOver: isGameOver, wave: currentWave } = stateRef.current;
            
            ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
            drawMap(ctx);
            drawTowers(ctx, towers);
            drawEnemies(ctx, currentEnemies);
            drawProjectiles(ctx, currentProjectiles);
            drawPlacementPreview(ctx, selectedTowerType, towers, mousePos);
            
            if (isGameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
                ctx.fillStyle = 'red';
                ctx.font = '80px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', MAP_WIDTH / 2, MAP_HEIGHT / 2);
                ctx.font = '30px sans-serif';
                ctx.fillText(`You reached wave ${currentWave}`, MAP_WIDTH / 2, MAP_HEIGHT / 2 + 50);
            }

            lastTimeRef.current = timestamp;
            animationFrameId = window.requestAnimationFrame(gameLoop);
        };
        
        animationFrameId = window.requestAnimationFrame(gameLoop);

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
            if (stateRef.current.gameOver) return;
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
                setTowers(t => [...t, { id: Date.now() + Math.random(), x: tileX, y: tileY, type: selectedTowerType, lastShotTime: 0 }]);
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

    useEffect(() => {
        // Wave completion check
        if (gameStatus === 'wave_in_progress' && enemies.length === 0 && spawnIntervalRef.current === null) {
            setGameStatus('idle');
            setGold(g => g + 100 + wave * 10); // End of wave gold bonus
        }
    }, [enemies, gameStatus, wave]);

    useEffect(() => {
        // Game over check
        if (health <= 0 && !gameOver) {
            setGameOver(true);
            setGameStatus('game_over');
            if (spawnIntervalRef.current) {
                clearInterval(spawnIntervalRef.current);
                spawnIntervalRef.current = null;
            }
        }
    }, [health, gameOver]);
    
    // Cleanup interval on component unmount
    useEffect(() => {
        return () => {
            if (spawnIntervalRef.current) {
                clearInterval(spawnIntervalRef.current);
            }
        };
    }, []);


    const TowerButton = ({ type }: { type: TowerType }) => {
        const { name, cost } = TOWER_TYPES[type];
        const isSelected = selectedTowerType === type;
        const canAfford = gold >= cost;
        return (
            <button
                onClick={() => handleSelectTower(type)}
                disabled={(!canAfford && !isSelected) || gameOver}
                className={`p-2 border border-yellow-700 bg-black/30 rounded-lg text-left w-full transition-all
                    ${isSelected ? 'bg-yellow-800 ring-2 ring-yellow-400' : 'hover:bg-yellow-800/50'}
                    ${(!canAfford && !isSelected) || gameOver ? 'opacity-50 cursor-not-allowed' : ''}
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
                    <button onClick={handleStartWave} className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={gameStatus !== 'idle' || selectedTowerType !== null || gameOver}>
                        {gameOver ? 'Game Over' : gameStatus === 'wave_in_progress' ? `Wave ${wave} in Progress` : `Start Wave ${wave + 1}`}
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
