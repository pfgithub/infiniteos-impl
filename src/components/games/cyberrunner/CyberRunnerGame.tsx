import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game Constants
const GAME_WIDTH = 600;
const GAME_HEIGHT = 700;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 70;
const PLAYER_SPEED = 8;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_HEIGHT = 25;
const OBSTACLE_SPEED = 5;
const OBSTACLE_SPAWN_RATE = 60; // Lower is more frequent

type GameState = 'idle' | 'countdown' | 'playing' | 'gameOver';

interface Obstacle {
  id: number;
  x: number;
  y: number;
}

interface CyberRunnerGameProps {
  onQuit: () => void;
}

// Player Component (a cool futuristic car/ship)
const Player = ({ x }: { x: number }) => (
  <div
    className="absolute"
    style={{
      left: x,
      bottom: 20,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      clipPath: 'polygon(50% 0%, 100% 35%, 100% 100%, 0 100%, 0 35%)',
      backgroundColor: '#f472b6', // pink-400
      border: '2px solid #f9a8d4', // pink-300
      boxShadow: '0 0 15px #ec4899, 0 0 5px #fff inset',
      transition: 'left 50ms linear',
    }}
  />
);

// Obstacle Component
const Obstacle = ({ x, y }: { x: number; y: number }) => (
  <div
    className="absolute rounded"
    style={{
      left: x,
      top: y,
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_HEIGHT,
      backgroundColor: '#22d3ee', // cyan-400
      border: '2px solid #67e8f9', // cyan-300
      boxShadow: '0 0 15px #22d3ee',
    }}
  />
);

const CyberRunnerGame: React.FC<CyberRunnerGameProps> = ({ onQuit }) => {
  // State for React to render
  const [gameState, setGameState] = useState<GameState>('idle');
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState<number | string>(3);

  // Refs for synchronous game logic to avoid stale state in the loop
  const keysPressed = useRef(new Set<string>());
  const gameLoopRef = useRef<number>();
  const internalState = useRef({
    playerX: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    obstacles: [] as Obstacle[],
    score: 0,
    obstacleCounter: 0,
  });

  const resetGame = useCallback(() => {
    internalState.current = {
      playerX: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      obstacles: [],
      score: 0,
      obstacleCounter: 0,
    };
    setPlayerX(internalState.current.playerX);
    setObstacles(internalState.current.obstacles);
    setScore(internalState.current.score);
    keysPressed.current.clear();
  }, []);

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['arrowleft', 'a', 'arrowright', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      keysPressed.current.add(e.key.toLowerCase());
    };
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game Countdown logic
  useEffect(() => {
    if (gameState !== 'countdown') return;

    resetGame();
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown(c => {
        if (typeof c === 'number' && c > 1) return c - 1;
        clearInterval(timer);
        setCountdown('GO!');
        setTimeout(() => setGameState('playing'), 500);
        return 'GO!';
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, resetGame]);

  // Main Game Loop
  const gameLoop = useCallback(() => {
    // 1. Update player position from input
    let newX = internalState.current.playerX;
    if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) newX -= PLAYER_SPEED;
    if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) newX += PLAYER_SPEED;
    internalState.current.playerX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_WIDTH));

    // 2. Update obstacles
    internalState.current.obstacleCounter++;
    let newObstacles = internalState.current.obstacles
      .map(o => ({ ...o, y: o.y + OBSTACLE_SPEED }))
      .filter(o => o.y < GAME_HEIGHT);

    if (internalState.current.obstacleCounter % OBSTACLE_SPAWN_RATE === 0) {
      newObstacles.push({
        id: Date.now() + Math.random(),
        x: Math.random() * (GAME_WIDTH - OBSTACLE_WIDTH),
        y: -OBSTACLE_HEIGHT,
      });
    }
    internalState.current.obstacles = newObstacles;
    
    // 3. Update score
    internalState.current.score++;

    // 4. Collision Detection
    const playerRect = {
      x: internalState.current.playerX,
      y: GAME_HEIGHT - 20 - PLAYER_HEIGHT,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };

    for (const obstacle of internalState.current.obstacles) {
      const obstacleRect = { x: obstacle.x, y: obstacle.y, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT };
      if (
        playerRect.x < obstacleRect.x + obstacleRect.width &&
        playerRect.x + playerRect.width > obstacleRect.x &&
        playerRect.y < obstacleRect.y + obstacleRect.height &&
        playerRect.y + playerRect.height > obstacleRect.y
      ) {
        setGameState('gameOver');
        setScore(internalState.current.score); // Update final score for display
        return;
      }
    }

    // 5. Sync refs to state for rendering
    setPlayerX(internalState.current.playerX);
    setObstacles(internalState.current.obstacles);
    setScore(internalState.current.score);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, []);

  // Effect to start/stop the game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);
  
  const GameArea = ({ children }: { children: React.ReactNode }) => (
    <div
      className="relative bg-black border-4 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.5)] overflow-hidden flex items-center justify-center"
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundImage: `
          linear-gradient(rgba(22, 211, 238, 0.15) 1px, transparent 1px),
          linear-gradient(to right, rgba(22, 211, 238, 0.15) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }}
    >
      {children}
    </div>
  );

  const renderContent = () => {
    switch (gameState) {
      case 'idle':
        return (
          <div className="text-center bg-black/50 p-8 rounded-lg">
            <h2 className="text-4xl text-cyan-400 font-bold mb-4" style={{ textShadow: '0 0 10px #22d3ee' }}>CyberRunner</h2>
            <p className="text-lg text-pink-300 mb-8" style={{ textShadow: '0 0 8px #ec4899' }}>Race through the neon grid.</p>
            <button
              className="px-8 py-3 text-xl text-white bg-pink-600/80 border border-pink-400 rounded-md hover:bg-pink-500 transition-all duration-300 transform hover:scale-105"
              onClick={() => setGameState('countdown')}
            >
              Start Race
            </button>
          </div>
        );
      case 'countdown':
        return <p className="text-9xl font-black text-cyan-300" style={{ textShadow: '0 0 20px #22d3ee' }}>{countdown}</p>;
      case 'gameOver':
        return (
          <div className="text-center bg-black/70 p-8 rounded-lg">
            <h2 className="text-6xl text-red-500 font-black mb-4">CRASHED</h2>
            <p className="text-2xl text-white mb-6">Final Score: {score}</p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-2 text-lg text-white bg-green-600/80 border border-green-400 rounded-md hover:bg-green-500 transition-all"
                onClick={() => setGameState('countdown')}
              >
                Retry
              </button>
              <button
                className="px-6 py-2 text-lg text-cyan-300 bg-black/60 border-2 border-cyan-400/50 rounded-md hover:bg-cyan-400/20"
                onClick={onQuit}
              >
                Quit
              </button>
            </div>
          </div>
        );
      case 'playing':
        return (
          <>
            <div className="absolute top-2 left-2 text-xl text-pink-300 font-bold bg-black/50 px-2 py-1 rounded">SCORE: {score}</div>
            <Player x={playerX} />
            {obstacles.map(o => <Obstacle key={o.id} x={o.x} y={o.y} />)}
          </>
        );
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-white bg-black/90 p-4 select-none">
      <GameArea>
        {renderContent()}
      </GameArea>
      {gameState === 'idle' && (
        <button
          onClick={onQuit}
          className="mt-4 px-6 py-2 text-lg text-cyan-300 bg-black/60 border-2 border-cyan-400/50 rounded-md hover:bg-cyan-400/20"
        >
          Quit to Main Menu
        </button>
      )}
    </div>
  );
};

export default CyberRunnerGame;
