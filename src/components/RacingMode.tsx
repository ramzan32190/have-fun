import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GameStats, RacingObstacle } from '../types';
import { GAME_CONFIG } from '../constants';
import { HUD } from './HUD';

interface RacingModeProps {
  stats: GameStats;
  onExit: () => void;
  onGameEnd: (score: number) => void;
}

export function RacingMode({ stats, onExit, onGameEnd }: RacingModeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vehicle, setVehicle] = useState<'car' | 'bus' | 'bike' | 'truck' | null>(null);
  const [gameState, setGameState] = useState({
    score: 0,
    speed: GAME_CONFIG.RACING.INITIAL_SPEED,
    isGameOver: false
  });

  const carImg = useRef(new Image());
  const busImg = useRef(new Image());
  const bikeImg = useRef(new Image());
  const truckImg = useRef(new Image());

  useEffect(() => {
    carImg.current.src = GAME_CONFIG.ASSETS.PLAYER_CAR;
    busImg.current.src = GAME_CONFIG.ASSETS.BUS;
    bikeImg.current.src = GAME_CONFIG.ASSETS.BIKE;
    truckImg.current.src = GAME_CONFIG.ASSETS.TRUCK;
  }, []);

  useEffect(() => {
    if (!vehicle) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();
    
    const LANE_WIDTH = Math.min(canvas.width / 4, 150);
    const lanes = [
      canvas.width/2 - LANE_WIDTH * 1.5,
      canvas.width/2 - LANE_WIDTH * 0.5,
      canvas.width/2 + LANE_WIDTH * 0.5,
      canvas.width/2 + LANE_WIDTH * 1.5,
    ];

    let playerWidth = 60;
    let playerHeight = 110;
    let playerImg = carImg.current;

    if (vehicle === 'bus') {
      playerWidth = 80; playerHeight = 180;
      playerImg = busImg.current;
    } else if (vehicle === 'bike') {
      playerWidth = 45; playerHeight = 85;
      playerImg = bikeImg.current;
    } else if (vehicle === 'truck') {
      playerWidth = 85; playerHeight = 170;
      playerImg = truckImg.current;
    }

    let player = {
      x: lanes[1],
      y: canvas.height - 180,
      width: playerWidth,
      height: playerHeight,
      lane: 1
    };

    let obstacles: RacingObstacle[] = [];
    let roadOffset = 0;
    let lastSpawnTime = 0;
    let speed = GAME_CONFIG.RACING.INITIAL_SPEED;
    let score = 0;
    let animationFrameId: number;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isGameOver) return;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        player.lane = Math.max(0, player.lane - 1);
        player.x = lanes[player.lane];
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        player.lane = Math.min(lanes.length - 1, player.lane + 1);
        player.x = lanes[player.lane];
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const update = (time: number) => {
      speed = Math.min(GAME_CONFIG.RACING.MAX_SPEED, speed + GAME_CONFIG.RACING.ACCELERATION);
      roadOffset = (roadOffset + speed) % 100;
      score += speed / 60;

      // Spawn
      if (time - lastSpawnTime > GAME_CONFIG.RACING.SPAWN_RATE / (speed / 5)) {
        const laneIdx = Math.floor(Math.random() * lanes.length);
        const typeRand = Math.random();
        let type: RacingObstacle['obstacleType'] = 'car';
        let w = 70, h = 130;

        if (typeRand > 0.9) {
          type = 'truck';
          w = 85; h = 170;
        } else if (typeRand > 0.75) {
          type = 'bus';
          w = 80; h = 180;
        } else if (typeRand > 0.6) {
          type = 'bike';
          w = 50; h = 90;
        }

        obstacles.push({
          id: Math.random().toString(),
          x: lanes[laneIdx],
          y: -300,
          width: w,
          height: h,
          speed: speed * 0.7,
          obstacleType: type
        });
        lastSpawnTime = time;
      }

      // Move & Collide
      obstacles = obstacles.filter(obs => {
        obs.y += speed;

        const px = player.x - player.width / 2 + LANE_WIDTH / 2;
        const py = player.y;

        if (
          px < obs.x - obs.width / 2 + LANE_WIDTH / 2 + obs.width &&
          px + player.width > obs.x - obs.width / 2 + LANE_WIDTH / 2 &&
          py < obs.y + obs.height &&
          py + player.height > obs.y
        ) {
          setGameState(prev => ({ ...prev, isGameOver: true }));
          onGameEnd(Math.floor(score));
          return false;
        }

        return obs.y < canvas.height + 300;
      });

      setGameState(prev => ({ ...prev, score: Math.floor(score), speed }));
    };

    const draw = () => {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road markings
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 4;
      lanes.forEach(lane => {
        ctx.beginPath();
        ctx.moveTo(lane - LANE_WIDTH / 2, 0);
        ctx.lineTo(lane - LANE_WIDTH / 2, canvas.height);
        ctx.stroke();
      });

      // Center double line
      ctx.setLineDash([40, 40]);
      ctx.lineDashOffset = -roadOffset;
      ctx.strokeStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Player Vehicle
      ctx.save();
      ctx.shadowBlur = 20;
      const shadowColor = vehicle === 'bike' ? '#22c55e' : (vehicle === 'bus' ? '#f59e0b' : (vehicle === 'truck' ? '#94a3b8' : '#06b6d4'));
      ctx.shadowColor = shadowColor;
      ctx.drawImage(playerImg, player.x - player.width / 2 + LANE_WIDTH / 2, player.y, player.width, player.height);
      ctx.restore();

      // Draw Obstacles
      obstacles.forEach(obs => {
        ctx.save();
        let img = carImg.current;
        if (obs.obstacleType === 'bus') {
            img = busImg.current;
            ctx.shadowColor = '#f59e0b';
        } else if (obs.obstacleType === 'bike') {
            img = bikeImg.current;
            ctx.shadowColor = '#22c55e';
        } else if (obs.obstacleType === 'truck') {
            img = truckImg.current;
            ctx.shadowColor = '#94a3b8';
        } else {
            ctx.shadowColor = '#ef4444';
        }
        ctx.shadowBlur = 10;
        ctx.drawImage(img, obs.x - obs.width / 2 + LANE_WIDTH / 2, obs.y, obs.width, obs.height);
        ctx.restore();
      });
    };

    const loop = (time: number) => {
      if (!gameState.isGameOver) {
        update(time);
        draw();
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState.isGameOver, vehicle]);

  const handleRestart = () => {
    setGameState({
      score: 0,
      speed: GAME_CONFIG.RACING.INITIAL_SPEED,
      isGameOver: false
    });
  };

  if (!vehicle) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1920&h=1080')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <div className="relative z-10 w-full max-w-4xl text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-5xl font-black text-white italic mb-12 tracking-tighter uppercase">Select Your <span className="text-cyan-500">Ride</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 'car', name: 'Supercar', desc: 'Balanced & Fast', icon: '🏎️', color: 'border-cyan-500/50 text-cyan-400 group-hover:border-cyan-500' },
              { id: 'bus', name: 'Heavy Bus', desc: 'Massive & Durable', icon: '🚌', color: 'border-amber-500/50 text-amber-400 group-hover:border-amber-500' },
              { id: 'bike', name: 'Lite Bike', desc: 'Agile & Swift', icon: '🏍️', color: 'border-green-500/50 text-green-400 group-hover:border-green-500' },
              { id: 'truck', name: 'Big Truck', desc: 'Powerful & Boss', icon: '🚛', color: 'border-slate-500/50 text-slate-400 group-hover:border-slate-500' },
            ].map((v, i) => (
              <motion.button
                key={v.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setVehicle(v.id as any)}
                className={`p-6 bg-white/5 border-2 rounded-3xl hover:bg-white/10 transition-all group ${v.color}`}
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">{v.icon}</div>
                <h3 className="text-xl font-bold mb-1 uppercase italic">{v.name}</h3>
                <p className="text-[8px] tracking-widest text-white/40 uppercase">{v.desc}</p>
              </motion.button>
            ))}
          </div>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onExit}
            className="mt-12 text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            ← Return to Sector
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <HUD 
        stats={stats}
        currentScore={gameState.score}
        currentSpeed={gameState.speed}
        isGameOver={gameState.isGameOver}
        onRestart={handleRestart}
        onMenu={onExit}
      />
    </div>
  );
}
