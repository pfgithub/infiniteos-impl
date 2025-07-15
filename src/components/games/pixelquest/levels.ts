// Define types for level data
export type TileType = 'floor' | 'wall' | 'goal';

interface BaseEntity {
  id: number;
  pos: { x: number; y: number };
}

export interface NPC extends BaseEntity {
  type: 'npc';
  name: string;
  message: string;
}

export interface Enemy extends BaseEntity {
  type: 'enemy';
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  xp: number;
}

export type Entity = NPC | Enemy;


export interface Level {
  map: TileType[][];
  playerStart: { x: number; y: number };
  entities: Entity[];
}

export const levels: Level[] = [
  // Level 1: Introduction
  {
    playerStart: { x: 2, y: 7 },
    entities: [
      { id: 1, type: 'npc', name: 'Old Man', pos: { x: 4, y: 7 }, message: "Welcome, hero! Bump into enemies to fight them. Find the yellow tile to proceed." },
      { id: 2, type: 'enemy', name: 'Goblin', pos: { x: 10, y: 5 }, hp: 10, maxHp: 10, attack: 3, defense: 1, xp: 10 },
      { id: 3, type: 'enemy', name: 'Slime', pos: { x: 12, y: 11 }, hp: 15, maxHp: 15, attack: 2, defense: 2, xp: 12 },
      { id: 4, type: 'enemy', name: 'Goblin', pos: { x: 17, y: 7 }, hp: 10, maxHp: 10, attack: 3, defense: 1, xp: 10 },
    ],
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'goal', 'wall'],
      ['wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'wall', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'floor', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
  },
  // Level 2: More enemies and a bit harder
  {
    playerStart: { x: 1, y: 7 },
    entities: [
      { id: 5, type: 'npc', name: 'Adventurer', pos: { x: 18, y: 1 }, message: "I saw a huge Orc in the next room! Be careful!" },
      { id: 6, type: 'enemy', name: 'Goblin Archer', pos: { x: 4, y: 2 }, hp: 15, maxHp: 15, attack: 5, defense: 1, xp: 15 },
      { id: 7, type: 'enemy', name: 'Slime', pos: { x: 4, y: 12 }, hp: 20, maxHp: 20, attack: 3, defense: 3, xp: 15 },
      { id: 8, type: 'enemy', name: 'Goblin Archer', pos: { x: 15, y: 5 }, hp: 15, maxHp: 15, attack: 5, defense: 1, xp: 15 },
      { id: 9, type: 'enemy', name: 'Orc', pos: { x: 10, y: 7 }, hp: 30, maxHp: 30, attack: 6, defense: 3, xp: 50 },
    ],
    map: [
        ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'floor', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'floor', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'goal', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'floor', 'wall'],
        ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
  },
];
