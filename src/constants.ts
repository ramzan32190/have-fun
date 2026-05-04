
export const GAME_CONFIG = {
  SHOOTER: {
    PLAYER_SPEED: 7,
    ENEMY_SPAWN_RATE: 2000, // ms
    BULLET_SPEED: 10,
    INITIAL_HEALTH: 100,
    COIN_PER_KILL: 10,
  },
  RACING: {
    INITIAL_SPEED: 5,
    ACCELERATION: 0.001,
    MAX_SPEED: 15,
    SPAWN_RATE: 1500, // ms
    COIN_PER_DISTANCE: 1,
  },
  FLAPPY: {
    GRAVITY: 0.6,
    FLAP_STRENGTH: -8,
    PIPE_SPEED: 4,
    PIPE_SPAWN_RATE: 1500,
    GAP_SIZE: 200,
  },
  STORAGE_KEYS: {
    STATS: 'street_domination_stats_v1',
  },
  ASSETS: {
    // Fallback professional assets
    PLAYER_SHOOTER: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&q=80&w=200&h=200',
    ENEMY: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=200&h=200',
    PLAYER_CAR: 'https://images.unsplash.com/photo-1542362567-b055002b97f4?auto=format&fit=crop&q=80&w=200&h=400',
    BUS: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=300&h=600',
    BIKE: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=150&h=300',
    TRUCK: 'https://images.unsplash.com/photo-1601584115197-04dc0ad317bc?auto=format&fit=crop&q=80&w=300&h=600',
    CITY_NIGHT: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1920&h=1080',
    CITY_INDUSTRIAL: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1920&h=1080',
    BIRD: 'https://images.unsplash.com/photo-1516233501162-3420d9c438bb?auto=format&fit=crop&q=80&w=100&h=100',
    STREET_BG: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1920&h=1080',
  }
};
