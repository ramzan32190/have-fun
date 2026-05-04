import { useState, useEffect } from 'react';
import { GameStats } from '../types';
import { GAME_CONFIG } from '../constants';

const INITIAL_STATS: GameStats = {
  coins: 0,
  totalKills: 0,
  highScoreRacing: 0,
};

export function useGameState() {
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.STATS);
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  useEffect(() => {
    localStorage.setItem(GAME_CONFIG.STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  const addCoins = (amount: number) => {
    setStats(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const updateKills = (kills: number) => {
    setStats(prev => ({ 
        ...prev, 
        totalKills: prev.totalKills + kills,
        coins: prev.coins + (kills * GAME_CONFIG.SHOOTER.COIN_PER_KILL)
    }));
  };

  const updateRacingScore = (score: number) => {
    setStats(prev => ({
      ...prev,
      highScoreRacing: Math.max(prev.highScoreRacing, score),
      coins: prev.coins + Math.floor(score * GAME_CONFIG.RACING.COIN_PER_DISTANCE)
    }));
  };

  return {
    stats,
    addCoins,
    updateKills,
    updateRacingScore
  };
}
