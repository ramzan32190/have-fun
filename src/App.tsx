import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GameMode } from './types';
import { useGameState } from './hooks/useGameState';
import { Menu } from './components/Menu';
import { ShooterMode } from './components/ShooterMode';
import { RacingMode } from './components/RacingMode';
import { FlappyMode } from './components/FlappyMode';

export default function App() {
  const [mode, setMode] = useState<GameMode>(GameMode.MENU);
  const { stats, updateKills, updateRacingScore } = useGameState();

  const handleReturnToMenu = useCallback(() => {
    setMode(GameMode.MENU);
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {mode === GameMode.MENU && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <Menu onSelectMode={(m) => setMode(m)} />
          </motion.div>
        )}

        {mode === GameMode.SHOOTER && (
          <motion.div
            key="shooter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <ShooterMode 
              stats={stats} 
              onExit={handleReturnToMenu} 
              onGameEnd={updateKills}
            />
          </motion.div>
        )}

        {mode === GameMode.RACING && (
          <motion.div
            key="racing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <RacingMode 
              stats={stats} 
              onExit={handleReturnToMenu} 
              onGameEnd={updateRacingScore}
            />
          </motion.div>
        )}

        {mode === GameMode.FLAPPY && (
          <motion.div
            key="flappy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <FlappyMode 
              stats={stats} 
              onExit={handleReturnToMenu} 
              onGameEnd={updateRacingScore} // Sharing score logic for coins
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
