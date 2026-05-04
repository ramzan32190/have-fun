import React, { useRef, useEffect, useState } from 'react';
import { GameStats } from '../types';
import { GAME_CONFIG } from '../constants';
import { HUD } from './HUD';

interface FlappyModeProps {
  stats: GameStats;
  onExit: () => void;
  onGameEnd: (score: number) => void;
}

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

export function FlappyMode({ stats, onExit, onGameEnd }: FlappyModeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState({
    score: 0,
    isGameOver: false
  });

  const birdImg = useRef(new Image());
  const bgImg = useRef(new Image());

  useEffect(() => {
    birdImg.current.src = GAME_CONFIG.ASSETS.BIRD;
    bgImg.current.src = GAME_CONFIG.ASSETS.CITY_NIGHT;
  }, []);

  useEffect(() => {
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

    let bird = {
      x: 100,
      y: canvas.height / 2,
      width: 40,
      height: 40,
      velocity: 0
    };

    let pipes: Pipe[] = [];
    let lastSpawnTime = 0;
    let frameScore = 0;
    let animationFrameId: number;

    const handleAction = () => {
      if (gameState.isGameOver) return;
      bird.velocity = GAME_CONFIG.FLAPPY.FLAP_STRENGTH;
    };

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        handleAction();
      }
    });
    window.addEventListener('mousedown', handleAction);

    const update = (time: number) => {
      // Bird Physics
      bird.velocity += GAME_CONFIG.FLAPPY.GRAVITY;
      bird.y += bird.velocity;

      if (bird.y < 0 || bird.y > canvas.height - bird.height) {
        endGame();
      }

      // Pipe Management
      if (time - lastSpawnTime > GAME_CONFIG.FLAPPY.PIPE_SPAWN_RATE) {
        const topHeight = 100 + Math.random() * (canvas.height - GAME_CONFIG.FLAPPY.GAP_SIZE - 200);
        pipes.push({ x: canvas.width, topHeight, passed: false });
        lastSpawnTime = time;
      }

      pipes = pipes.filter(pipe => {
        pipe.x -= GAME_CONFIG.FLAPPY.PIPE_SPEED;

        // Collision Check
        const pipeWidth = 60;
        if (
          bird.x + bird.width > pipe.x &&
          bird.x < pipe.x + pipeWidth &&
          (bird.y < pipe.topHeight || bird.y + bird.height > pipe.topHeight + GAME_CONFIG.FLAPPY.GAP_SIZE)
        ) {
          endGame();
        }

        if (!pipe.passed && pipe.x < bird.x) {
          pipe.passed = true;
          frameScore++;
          setGameState(prev => ({ ...prev, score: frameScore }));
        }

        return pipe.x + pipeWidth > 0;
      });
    };

    const endGame = () => {
      if (gameState.isGameOver) return;
      setGameState(prev => ({ ...prev, isGameOver: true }));
      onGameEnd(frameScore);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw BG
      ctx.drawImage(bgImg.current, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid lines for "Cyber" feel
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
      ctx.lineWidth = 1;
      for(let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Draw Pipes
      pipes.forEach(pipe => {
        const pipeWidth = 70;
        const grad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.5, '#312e81');
        grad.addColorStop(1, '#1e1b4b');

        ctx.fillStyle = grad;
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;

        // Top Pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.topHeight);

        // Bottom Pipe
        ctx.fillRect(pipe.x, pipe.topHeight + GAME_CONFIG.FLAPPY.GAP_SIZE, pipeWidth, canvas.height);
        ctx.strokeRect(pipe.x, pipe.topHeight + GAME_CONFIG.FLAPPY.GAP_SIZE, pipeWidth, canvas.height);
        
        // Neon highlights at the edges
        ctx.fillStyle = '#a855f7';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#a855f7';
        ctx.fillRect(pipe.x - 2, pipe.topHeight - 10, pipeWidth + 4, 10);
        ctx.fillRect(pipe.x - 2, pipe.topHeight + GAME_CONFIG.FLAPPY.GAP_SIZE, pipeWidth + 4, 10);
        ctx.shadowBlur = 0;
      });

      // Draw Bird (Drone)
      ctx.save();
      ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
      ctx.rotate(Math.max(-0.5, Math.min(0.5, bird.velocity / 10)));
      
      // Engine Glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#a855f7';
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(-bird.width/4, bird.height/4, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.drawImage(birdImg.current, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
      ctx.restore();
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
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', handleAction);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState.isGameOver]);

  const handleRestart = () => {
    setGameState({ score: 0, isGameOver: false });
  };

  return (
    <div className="relative w-full h-full bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <HUD 
        stats={stats}
        currentScore={gameState.score}
        isGameOver={gameState.isGameOver}
        onRestart={handleRestart}
        onMenu={onExit}
      />
    </div>
  );
}
