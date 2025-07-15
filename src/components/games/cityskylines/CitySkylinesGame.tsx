import React, { useState, useCallback } from 'react';
import { todoImplement } from '../../../todo';

// --- GAME CONFIG ---
const TILE_SIZE = 24; // in pixels
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

// --- TYPES ---
type Tool = 'select' | 'bulldoze' | 'road' | 'residential' | 'commercial' | 'industrial';
type TileType = 'empty' | 'road';
interface Tile {
  type: TileType;
  // future properties: buildingId, etc.
}

interface CitySkylinesGameProps {
  onQuit: () => void;
}

// --- INITIAL STATE ---
const createEmptyGrid = (): Tile[][] => {
  return Array.from({ length: GRID_HEIGHT }, () => 
    Array.from({ length: GRID_WIDTH }, () => ({ type: 'empty' }))
  );
};

// --- COMPONENTS ---
const GameGrid = ({ grid, onTileClick }: { grid: Tile[][], onTileClick: (x: number, y: number) => void }) => {
  return (
    <div 
      className="bg-green-800 grid cursor-pointer"
      style={{
        width: TILE_SIZE * GRID_WIDTH,
        height: TILE_SIZE * GRID_HEIGHT,
        gridTemplateColumns: `repeat(${GRID_WIDTH}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${GRID_HEIGHT}, ${TILE_SIZE}px)`,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
      }}
    >
      {grid.map((row, y) => 
        row.map((tile, x) => (
          <div
            key={`${x}-${y}`}
            className="w-full h-full"
            style={{
              backgroundColor: tile.type === 'road' ? '#4a5568' : 'transparent',
              border: tile.type === 'road' ? '1px solid #718096' : 'none',
              boxSizing: 'border-box',
            }}
            onClick={() => onTileClick(x, y)}
          >
            {/* Future: Render buildings, cars, etc. */}
          </div>
        ))
      )}
    </div>
  );
};

const Toolbar = ({ activeTool, onToolSelect }: { activeTool: Tool, onToolSelect: (tool: Tool) => void }) => {
  const tools: { id: Tool, label: string }[] = [
    { id: 'select', label: 'Select' },
    { id: 'road', label: 'Road' },
    { id: 'residential', label: 'Residential Zone' },
    { id: 'commercial', label: 'Commercial Zone' },
    { id: 'industrial', label: 'Industrial Zone' },
    { id: 'bulldoze', label: 'Bulldoze' },
  ];

  return (
    <div className="bg-gray-800 p-2 flex flex-col gap-2">
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`p-2 rounded w-full text-left ${activeTool === tool.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          onClick={() => onToolSelect(tool.id)}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
};

const CitySkylinesGame: React.FC<CitySkylinesGameProps> = ({ onQuit }) => {
  const [grid, setGrid] = useState<Tile[][]>(createEmptyGrid);
  const [activeTool, setActiveTool] = useState<Tool>('road');
  const [money, setMoney] = useState(50000);
  const [population, setPopulation] = useState(0);

  const handleToolSelect = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleTileClick = useCallback((x: number, y: number) => {
    switch(activeTool) {
      case 'road':
        if (money < 100) {
          // TODO: show a notification
          console.warn("Not enough money to build road.");
          return;
        }
        const newGrid = [...grid.map(row => [...row])];
        if (newGrid[y][x].type === 'empty') {
          newGrid[y][x] = { type: 'road' };
          setGrid(newGrid);
          setMoney(m => m - 100);
        }
        break;
      case 'bulldoze':
      case 'residential':
      case 'commercial':
      case 'industrial':
        todoImplement(`Using the '${activeTool}' tool on tile (${x}, ${y}). Implement its functionality.`);
        break;
      case 'select':
        // Do nothing or show info panel
        break;
    }
  }, [activeTool, grid, money]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {/* Top Info Bar */}
      <div className="flex-shrink-0 bg-gray-800 p-2 flex justify-between items-center border-b border-black/20">
        <div className="flex gap-4">
          <span>💰 ${money.toLocaleString()}</span>
          <span>👥 {population.toLocaleString()}</span>
        </div>
        <button 
            onClick={onQuit} 
            className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded"
        >
            Quit to Menu
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Toolbar */}
        <div className="flex-shrink-0 w-48 overflow-y-auto">
          <Toolbar activeTool={activeTool} onToolSelect={handleToolSelect} />
        </div>
        
        {/* Game Area */}
        <div className="flex-grow flex items-center justify-center overflow-auto p-4 bg-black/20">
          <GameGrid grid={grid} onTileClick={handleTileClick} />
        </div>
      </div>
    </div>
  );
};

export default CitySkylinesGame;
