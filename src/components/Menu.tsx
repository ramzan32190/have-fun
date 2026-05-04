import React from 'react';
import { motion } from 'motion/react';
import { Crosshair, Car, Shield, FastForward } from 'lucide-react';
import { GameMode } from '../types';

interface MenuProps {
  onSelectMode: (mode: GameMode) => void;
}

export function Menu({ onSelectMode }: MenuProps) {
  const modes = [
    {
      id: GameMode.SHOOTER,
      title: 'FIGHTING',
      desc: 'Tactical urban shooter. Sector cleanup operations.',
      icon: <Crosshair className="w-8 h-8" />,
      color: 'from-red-600 to-red-800',
      tag: 'ZONE 01',
      accent: 'text-red-500'
    },
    {
      id: GameMode.RACING,
      title: 'RACING',
      desc: 'Traffic racer evasion. Custom vehicle selection.',
      icon: <Car className="w-8 h-8" />,
      color: 'from-cyan-600 to-blue-800',
      tag: 'ZONE 02',
      accent: 'text-cyan-500'
    },
    {
      id: GameMode.FLAPPY,
      title: 'FLAPPY BIRD',
      desc: 'Cyber drone precision grid navigation.',
      icon: <FastForward className="w-8 h-8" />,
      color: 'from-purple-600 to-indigo-800',
      tag: 'ZONE 03',
      accent: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0b]">
      <div className="absolute inset-0 overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[140px] animate-pulse" />
      </div>
      
      <div className="relative z-10 w-full max-w-6xl">
        <header className="text-center mb-16">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold tracking-[0.4em] rounded mb-6 uppercase"
          >
            System Version 2.0.0
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.8] mb-6 uppercase"
          >
            ACTION <span className="text-red-500">SECTORS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 font-mono text-sm max-w-lg mx-auto tracking-widest uppercase border-y border-white/5 py-4"
          >
            CRITICAL ACCESS GRANTED: 3 SECTORS ACTIVE
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {modes.map((mode, idx) => (
            <motion.button
              key={mode.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode(mode.id)}
              className="relative group overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-10 text-left hover:border-white/20 transition-all hover:bg-white/[0.05]"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`} />
              
              <div className="flex justify-between items-center mb-16">
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${mode.accent} group-hover:scale-110 transition-transform shadow-2xl`}>
                  {mode.icon}
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black tracking-[0.2em] text-white/20 group-hover:text-white/40 mb-1">{mode.tag}</span>
                   <div className={`h-1 w-8 bg-current ${mode.accent} opacity-50`} />
                </div>
              </div>

              <h2 className="text-4xl font-black text-white mb-4 italic tracking-tight uppercase group-hover:translate-x-2 transition-transform">
                {mode.title}
              </h2>
              <p className="text-slate-500 text-sm mb-12 leading-relaxed font-medium">
                {mode.desc}
              </p>
              
              <div className="flex items-center gap-3 text-xs font-black text-white/30 group-hover:text-white transition-all tracking-widest uppercase">
                Initialize Protocol <FastForward className={`w-4 h-4 ${mode.accent}`} />
              </div>
            </motion.button>
          ))}
        </div>

        <footer className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-bold text-white/10 tracking-[0.3em] uppercase">
          <div className="flex items-center gap-2 border-r border-white/5 pr-12"><Shield className="w-3 h-3" /> Secure Auth v1.4</div>
          <div className="flex items-center gap-2">Protocol: {GameMode.MENU}</div>
          <div className="border-l border-white/5 pl-12 text-slate-700">© 2026 Sector Dynamics</div>
        </footer>
      </div>
    </div>
  );
}

