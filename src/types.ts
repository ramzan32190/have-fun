
export enum GameMode {
  MENU = 'MENU',
  SHOOTER = 'SHOOTER',
  RACING = 'RACING',
  FLAPPY = 'FLAPPY',
}

export interface GameStats {
  coins: number;
  totalKills: number;
  highScoreRacing: number;
}

export interface Entity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Player extends Entity {
  health: number;
  maxHealth: number;
}

export interface Enemy extends Entity {
  health: number;
  type: 'basic' | 'elite';
}

export interface Projectile extends Entity {
  damage: number;
}

export interface RacingObstacle extends Entity {
  obstacleType: 'car' | 'bus' | 'bike' | 'truck' | 'barrier';
}
