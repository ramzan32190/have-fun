import React, { useRef, useEffect, useState } from 'react';
import { GameStats, Player, Enemy, Projectile } from '../types';
import { GAME_CONFIG } from '../constants';
import { HUD } from './HUD';

interface ShooterModeProps {
  stats: GameStats;
  onExit: () => void;
  onGameEnd: (kills: number) => void;
}

export function ShooterMode({ stats, onExit, onGameEnd }: ShooterModeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState({
    kills: 0,
    health: GAME_CONFIG.SHOOTER.INITIAL_HEALTH,
    isGameOver: false,
    score: 0
  });

  // Load Assets
  const playerImg = useRef(new Image());
  const enemyImg = useRef(new Image());
  const bgImg = useRef(new Image());

  useEffect(() => {
    playerImg.current.src = GAME_CONFIG.ASSETS.PLAYER_SHOOTER;
    enemyImg.current.src = GAME_CONFIG.ASSETS.ENEMY;
    bgImg.current.src = GAME_CONFIG.ASSETS.STREET_BG;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial player setup
    let player: Player = {
      id: 'player',
      x: 100,
      y: window.innerHeight / 2,
      width: 80,
      height: 80,
      speed: GAME_CONFIG.SHOOTER.PLAYER_SPEED,
      health: GAME_CONFIG.SHOOTER.INITIAL_HEALTH,
      maxHealth: GAME_CONFIG.SHOOTER.INITIAL_HEALTH,
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      player.y = Math.min(canvas.height - player.height, player.y);
      player.x = Math.min(canvas.width - player.width, player.x);
    };

    window.addEventListener('resize', resize);
    resize();

    let enemies: Enemy[] = [];
    let projectiles: Projectile[] = [];
    let lastSpawnTime = 0;
    let keys: Record<string, boolean> = {};
    let animationFrameId: number;
    let killsCounter = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
        keys[e.code] = true;
        if (e.code === 'Space') {
            fire();
        }
    };
    const handleKeyUp = (e: KeyboardEvent) => keys[e.code] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const fire = () => {
        if (gameState.isGameOver) return;
        projectiles.push({
            id: Math.random().toString(),
            x: player.x + player.width,
            y: player.y + player.height / 2 - 5,
            width: 20,
            height: 6,
            speed: GAME_CONFIG.SHOOTER.BULLET_SPEED,
            damage: 25
        });
    };

    const update = (time: number) => {
      // Background change based on mission progress
      if (killsCounter > 20) {
        bgImg.current.src = GAME_CONFIG.ASSETS.CITY_INDUSTRIAL;
      } else if (killsCounter > 10) {
        bgImg.current.src = GAME_CONFIG.ASSETS.CITY_NIGHT;
      }

      // Player movement
      if (keys['KeyW'] || keys['ArrowUp']) player.y = Math.max(0, player.y - player.speed);
      if (keys['KeyS'] || keys['ArrowDown']) player.y = Math.min(canvas.height - player.height, player.y + player.speed);
      if (keys['KeyA'] || keys['ArrowLeft']) player.x = Math.max(0, player.x - player.speed);
      if (keys['KeyD'] || keys['ArrowRight']) player.x = Math.min(canvas.width - player.width, player.x + player.speed);

      // Spawn enemies
      if (time - lastSpawnTime > GAME_CONFIG.SHOOTER.ENEMY_SPAWN_RATE) {
        enemies.push({
          id: Math.random().toString(),
          x: canvas.width,
          y: Math.random() * (canvas.height - 60),
          width: 60,
          height: 60,
          speed: 2 + Math.random() * 3,
          health: 50,
          type: Math.random() > 0.8 ? 'elite' : 'basic'
        });
        lastSpawnTime = time;
      }

      // Update projectiles
      projectiles = projectiles.filter(p => {
        p.x += p.speed;
        return p.x < canvas.width;
      });

      // Update enemies & collision
      enemies = enemies.filter(enemy => {
        enemy.x -= enemy.speed;

        // Collision with player
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            player.health -= 0.5;
            if (player.health <= 0) {
                setGameState(prev => ({ ...prev, isGameOver: true }));
                onGameEnd(killsCounter);
            }
            return false;
        }

        // Collision with bullets
        let hit = false;
        projectiles = projectiles.filter(bullet => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
               enemy.health -= bullet.damage;
               hit = true;
               return false;
            }
            return true;
        });

        if (enemy.health <= 0 || hit) {
            if (enemy.health <= 0) {
                killsCounter++;
                setGameState(prev => ({ ...prev, kills: killsCounter, health: player.health }));
                return false;
            }
        }
        
        return enemy.x + enemy.width > 0;
      });

      setGameState(prev => ({ ...prev, health: player.health }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background with parallax-ish scroll
      ctx.drawImage(bgImg.current, 0, 0, canvas.width, canvas.height);

      // Draw Player
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'cyan';
      ctx.drawImage(playerImg.current, player.x, player.y, player.width, player.height);
      ctx.restore();

      // Draw Enemies
      enemies.forEach(enemy => {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'red';
        ctx.drawImage(enemyImg.current, enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.restore();
      });

      // Draw Projectiles
      ctx.fillStyle = '#ff0';
      projectiles.forEach(p => {
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'yellow';
        ctx.fillRect(p.x, p.y, p.width, p.height);
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
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState.isGameOver]);

  const handleRestart = () => {
    setGameState({
      kills: 0,
      health: GAME_CONFIG.SHOOTER.INITIAL_HEALTH,
      isGameOver: false,
      score: 0
    });
  };

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <HUD 
        stats={stats}
        currentHealth={gameState.health}
        maxHealth={GAME_CONFIG.SHOOTER.INITIAL_HEALTH}
        currentKills={gameState.kills}
        isGameOver={gameState.isGameOver}
        onRestart={handleRestart}
        onMenu={onExit}
      />
    </div>
  );
}
