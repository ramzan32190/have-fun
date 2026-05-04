import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Coins, Crosshair, Zap, Heart, Shield, Settings, Activity } from 'lucide-react';
import { GameStats } from '../types';

interface HUDProps {
  stats: GameStats;
  currentHealth?: number;
  maxHealth?: number;
  currentKills?: number;
  currentScore?: number;
  currentSpeed?: number;
  isGameOver?: boolean;
  onRestart?: () => void;
  onMenu?: () => void;
}

export function HUD({ 
  stats, 
  currentHealth, 
  maxHealth, 
  currentKills, 
  currentScore, 
  currentSpeed,
  isGameOver,
  onRestart,
  onMenu
}: HUDProps) {
  const modeTitle = currentKills !== undefined ? 'Fighting' : (currentSpeed !== undefined ? 'Racing' : 'Flappy Bird');
  const sessionLabel = currentKills !== undefined ? 'Eliminations' : (currentSpeed !== undefined ? 'Distance' : 'Score');

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 pointer-events-auto">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Sector Dynamics</span>
            <span className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">{modeTitle} Mode</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block"></div>
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">Status: Active</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase text-slate-500 tracking-widest">Wallet Balance</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono font-bold text-amber-400">{stats.coins.toLocaleString()}</span>
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-[10px]">C</div>
            </div>
          </div>
          <button className="bg-white/5 hover:bg-white/10 p-2 rounded-lg border border-white/10 transition-all text-slate-400">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Stats */}
        <aside className="w-72 bg-black/60 border-r border-white/5 p-6 flex flex-col gap-6 pointer-events-auto overflow-y-auto">
          {/* Health Section */}
          {currentHealth !== undefined && maxHealth !== undefined && (
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                 <Activity className="w-3 h-3" />
                 <span className="text-[10px] uppercase tracking-widest">Operative Health</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400"
                  animate={{ width: `${(currentHealth / maxHealth) * 100}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-400">
                <span>{Math.ceil(currentHealth)} / {maxHealth}</span>
                <span className={currentHealth < 30 ? "text-red-500 animate-pulse" : ""}>
                   {currentHealth < 30 ? "CRITICAL" : "STABLE"}
                </span>
              </div>
            </div>
          )}

          {/* Active Stats */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
            <span className="text-[10px] uppercase text-slate-500 block mb-3 tracking-widest font-bold">Mission Data</span>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-2xl font-bold text-white font-mono">
                   {currentKills ?? currentScore ?? 0}
                </p>
                <p className="text-[10px] uppercase text-slate-500">{sessionLabel}</p>
              </div>
              {currentSpeed !== undefined && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-500 font-mono italic">
                    {Math.floor(currentSpeed * 10)}
                  </p>
                  <p className="text-[10px] uppercase text-slate-500">KM/H</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="p-2 bg-black/40 rounded border border-white/5 flex justify-between items-center px-3">
                <span className="text-[10px] text-slate-500 uppercase">Personal Best</span>
                <span className="text-xs text-slate-300 font-mono">{stats.highScoreRacing}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button 
                onClick={onRestart}
                className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(220,38,38,0.2)] border border-red-500/50 transition-all active:scale-[0.98]"
            >
              Quick Restart
            </button>
            <button 
                onClick={onMenu}
                className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold uppercase tracking-widest text-[10px] border border-white/10 transition-all text-slate-400 active:scale-[0.98]"
            >
              Exit Lobby
            </button>
          </div>
        </aside>

        {/* Center: The Game is rendered here by the parent component (canvas) */}
        <div className="flex-1 relative">
           {/* Floating HUD Alerts from design */}
           <div className="absolute top-10 right-10 flex flex-col gap-2 items-end">
              <AnimatePresence>
                {currentKills !== undefined && currentKills > 0 && currentKills % 5 === 0 && (
                   <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="bg-amber-500/90 text-black px-4 py-2 rounded font-black text-xs uppercase italic"
                   >
                     Combo Bonus! +50 Coins
                   </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Right thin bar */}
        <aside className="w-16 bg-black border-l border-white/5 flex flex-col items-center py-6 gap-8 pointer-events-auto">
           <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 glass">
              <Shield className="w-5 h-5" />
           </div>
           <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
              <Trophy className="w-5 h-5" />
           </div>
           <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
              <Coins className="w-5 h-5" />
           </div>
        </aside>
      </div>

      {/* Footer Navigation */}
      <footer className="h-20 bg-[#0a0a0b] border-t border-white/5 flex items-center justify-between px-8 pointer-events-auto">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase text-slate-500 tracking-tighter mb-1">Operative Controls</span>
          <span className="text-xs font-mono text-slate-300">
            {currentKills !== undefined ? '[W][A][S][D] Move | [SPACE] Fire' : (currentSpeed !== undefined ? '[A][D] Change Lane' : '[SPACE] to Fly')}
          </span>
        </div>

        {/* Mode Info */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <div className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg ${currentKills !== undefined ? 'bg-red-600 shadow-red-600/20' : (currentSpeed !== undefined ? 'bg-cyan-600 shadow-cyan-600/20' : 'bg-purple-600 shadow-purple-600/20')} text-white transition-all`}>
            {modeTitle} Protocol
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
             <span className="text-[9px] uppercase text-slate-500 mb-1 block">Sector Intelligence</span>
             <p className="text-xs font-bold text-amber-500">Next Unlock: Level {Math.floor(stats.coins / 1000) + 1}</p>
          </div>
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
             <div className="w-8 h-4 bg-amber-500/50 rotate-45 border border-amber-400"></div>
          </div>
        </div>
      </footer>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl pointer-events-auto flex items-center justify-center p-6"
          >
            <div className="text-center">
              <motion.h2 
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="text-7xl font-black text-white mb-2 italic tracking-tighter"
              >
                SYSTEM <span className="text-red-500">FAILURE</span>
              </motion.h2>
              <p className="text-white/40 mb-12 tracking-widest text-sm uppercase">Mission terminated / Connection lost</p>
              
              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <button 
                  onClick={onRestart}
                  className="w-full bg-red-600 text-white py-4 font-bold rounded-lg hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30 active:scale-95"
                >
                  REBOOT CORE
                </button>
                <button 
                  onClick={onMenu}
                  className="w-full bg-white/5 text-white border border-white/20 py-4 font-bold rounded-lg hover:bg-white/10 transition-colors active:scale-95"
                >
                  RETURN TO SECTOR
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

