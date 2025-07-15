// Define types for level data
export type TileType = 'floor' | 'wall' | 'goal';
export type EntityType = 'enemy' | 'npc';

export interface Entity {
  id: number;
  type: EntityType;
  pos: { x: number; y: number };
  message?: string; // For NPCs
  // Future: movePattern for enemies, etc.
}

export interface Level {
  map: TileType[][];
  playerStart: { x: number; y: number };
  entities: Entity[];
}

export const levels: Level[] = [
  // Level 1: Introduction
  {
    playerStart: { x: 1, y: 1 },
    entities: [
      { id: 1, type: 'npc', pos: { x: 5, y: 5 }, message: "Welcome, hero! Use WASD or Arrow Keys to move. Find the yellow tile to proceed." },
      { id: 2, type: 'enemy', pos: { x: 10, y: 12 } },
    ],
    map: [
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
    ],
  },
  // Level 2: More enemies
  {
    playerStart: { x: 1, y: 7 },
    entities: [
      { id: 3, type: 'npc', pos: { x: 18, y: 1 }, message: "Watch out for the patrols! They move back and forth. But not yet, that's not implemented." },
      { id: 4, type: 'enemy', pos: { x: 4, y: 2 } },
      { id: 5, type: 'enemy', pos: { x: 4, y: 12 } },
      { id: 6, type: 'enemy', pos: { x: 15, y: 5 } },
    ],
    map: [
        ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'goal', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
  },
];
