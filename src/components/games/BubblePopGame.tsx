import { useEffect, useRef, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface GameState {
  score: number;
  lives: number;
  timeLeft: number;
  gameOver: boolean;
  accuracy: number;
  avgReactionTime: number;
}

export function BubblePopGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    timeLeft: 60,
    gameOver: false,
    accuracy: 0,
    avgReactionTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Bubble {
      x: number;
      y: number;
      r: number;
      good: boolean;
      speed: [number, number];
      spawnTime: number;
    }

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      life: number;
    }

    // Game variables
    let bubbles: Bubble[] = [];
    let particles: Particle[] = [];
    let score = 0;
    let lives = 3;
    let hitCount = 0;
    let clickCount = 0;
    let reactionTimes: number[] = [];
    let level = 1;
    let startTime = Date.now();
    let gameOverFlag = false;
    let animationId: number | null = null;

    const TOTAL_TIME = 60000; // 60 seconds in ms
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    // Colors matching Pygame version
    const BLUE = '#82beff';
    const RED = '#ff7878';

    // Create particles when bubble is popped
    const createParticles = (x: number, y: number, color: string, count = 15) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          size: Math.random() * 5 + 4,
          color,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 2,
          life: 25,
        });
      }
    };

    // Draw a bubble with simple face
    const drawBubble = (bubble: Bubble) => {
      // Draw bubble circle
      ctx.fillStyle = bubble.good ? BLUE : RED;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      ctx.fill();

      // Draw eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bubble.x - 12, bubble.y - 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bubble.x + 12, bubble.y - 8, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw pupils
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(bubble.x - 12, bubble.y - 8, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bubble.x + 12, bubble.y - 8, 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw smile for good bubbles
      if (bubble.good) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y + 5, 10, 0, Math.PI);
        ctx.stroke();
      }
    };

    // Handle mouse clicks
    const handleClick = (e: MouseEvent) => {
      if (gameOverFlag) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      clickCount++;

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        const dist = Math.sqrt((b.x - clickX) ** 2 + (b.y - clickY) ** 2);

        if (dist < b.r) {
          const reactionTime = (Date.now() - b.spawnTime) / 1000;
          reactionTimes.push(reactionTime);

          if (b.good) {
            score++;
            hitCount++;
            createParticles(b.x, b.y, BLUE, 15);
            // Play pop sound effect
            playPopSound();
          } else {
            lives--;
            createParticles(b.x, b.y, RED, 15);
            // Play boom sound effect
            playBoomSound();
          }

          bubbles.splice(i, 1);
          break;
        }
      }
    };

    // Simple sound effects using Web Audio API
    const playPopSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
      } catch (e) {
        // Audio not supported, silently fail
      }
    };

    const playBoomSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) {
        // Audio not supported, silently fail
      }
    };

    canvas.addEventListener('click', handleClick);

    // Game loop
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const remaining = TOTAL_TIME - elapsed;

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(0, '#fef3c7');
      gradient.addColorStop(0.5, '#fbdfe8');
      gradient.addColorStop(1, '#bfdbfe');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (remaining <= 0 || lives <= 0) {
        gameOverFlag = true;

        // Calculate stats
        const accuracy = clickCount > 0 ? ((hitCount / clickCount) * 100).toFixed(2) : '0';
        const avgRT =
          reactionTimes.length > 0
            ? (reactionTimes.reduce((a, b) => a + b) / reactionTimes.length).toFixed(3)
            : '0';

        // Update game state and stop animation
        setGameState({
          score,
          lives,
          timeLeft: Math.max(0, Math.floor(remaining / 1000)),
          gameOver: true,
          accuracy: parseFloat(accuracy),
          avgReactionTime: parseFloat(avgRT),
        });

        if (animationId !== null) {
          cancelAnimationFrame(animationId);
        }
        return;
      }

      // Spawn good bubbles
      if (Math.random() * 1000 < (40 - Math.min(level, 39))) {
        bubbles.push({
          x: Math.random() * (WIDTH - 120) + 60,
          y: HEIGHT + 80,
          r: 40,
          good: true,
          speed: [(Math.random() - 0.5) * 2, Math.random() * -3 - 2],
          spawnTime: Date.now(),
        });
      }

      // Spawn bad bubbles
      if (Math.random() * 1000 < (95 - Math.min(level, 94))) {
        bubbles.push({
          x: Math.random() * (WIDTH - 120) + 60,
          y: HEIGHT + 80,
          r: 40,
          good: false,
          speed: [(Math.random() - 0.5) * 2, Math.random() * -3 - 2],
          spawnTime: Date.now(),
        });
      }

      // Move and draw bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.x += b.speed[0];
        b.y += b.speed[1];

        if (b.y < -70) {
          bubbles.splice(i, 1);
        } else {
          drawBubble(b);
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravity
        p.size -= 0.3;
        p.life--;

        if (p.life <= 0 || p.size <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw UI
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 28px Arial';
      ctx.fillText(`Score: ${score}`, 20, 40);
      ctx.fillText(`Lives: ${lives}`, 20, 75);
      ctx.fillText(`Time: ${Math.floor(remaining / 1000)}`, 20, 110);

      // Update state for visual feedback
      setGameState({
        score,
        lives,
        timeLeft: Math.floor(remaining / 1000),
        gameOver: false,
        accuracy: 0,
        avgReactionTime: 0,
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener('click', handleClick);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full max-h-[95vh] overflow-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4">
          <h2 className="text-3xl font-bold text-gray-800">🫧 Bubble Pop</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={700}
          height={450}
          className="w-full border-4 border-gray-300 rounded-xl mb-4 cursor-pointer bg-gradient-to-b from-yellow-100 via-pink-100 to-blue-100"
        />

        {gameState.gameOver && (
          <div className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-2xl p-8 text-center animate-bounce">
            <h3 className="text-4xl font-bold text-gray-800 mb-2">🎉 Game Over!</h3>
            <p className="text-gray-600 mb-6">Great job!</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <p className="text-5xl font-bold text-blue-600">{gameState.score}</p>
                <p className="text-gray-600 mt-2 font-semibold">Final Score</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <p className="text-4xl font-bold text-green-600">
                  {gameState.accuracy.toFixed(1)}%
                </p>
                <p className="text-gray-600 mt-2 font-semibold">Accuracy</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg col-span-2">
                <p className="text-3xl font-bold text-purple-600">
                  {gameState.avgReactionTime.toFixed(2)}s
                </p>
                <p className="text-gray-600 mt-2 font-semibold">Avg Reaction Time</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition inline-flex items-center gap-2"
            >
              <RotateCcw className="w-6 h-6" />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
