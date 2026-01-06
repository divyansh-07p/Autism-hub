import { useEffect, useRef, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface Stone {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
  startX: number;
  startY: number;
  radius: number;
  placed: boolean;
  isDragging: boolean;
}

interface Bowl {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
  radius: number;
}

export function ZenSortingGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    // Colors
    const PASTELS = {
      blue: '#aac8dc',
      green: '#b4d7be',
      pink: '#ddb4c8',
    };

    const BG_COLOR = '#efefef';
    const RED_FEEDBACK = '#c85050';
    const GREEN_FEEDBACK = '#8cc8a0';

    // Stones data
    const stones: Stone[] = [
      {
        id: 'stone1',
        x: 200,
        y: 450,
        color: PASTELS.blue,
        name: 'blue',
        startX: 200,
        startY: 450,
        radius: 22,
        placed: false,
        isDragging: false,
      },
      {
        id: 'stone2',
        x: 300,
        y: 450,
        color: PASTELS.green,
        name: 'green',
        startX: 300,
        startY: 450,
        radius: 22,
        placed: false,
        isDragging: false,
      },
      {
        id: 'stone3',
        x: 400,
        y: 450,
        color: PASTELS.pink,
        name: 'pink',
        startX: 400,
        startY: 450,
        radius: 22,
        placed: false,
        isDragging: false,
      },
    ];

    const bowls: Bowl[] = [
      {
        id: 'bowl1',
        x: 250,
        y: 200,
        color: PASTELS.blue,
        name: 'blue',
        radius: 45,
      },
      {
        id: 'bowl2',
        x: 450,
        y: 200,
        color: PASTELS.green,
        name: 'green',
        radius: 45,
      },
      {
        id: 'bowl3',
        x: 650,
        y: 200,
        color: PASTELS.pink,
        name: 'pink',
        radius: 45,
      },
    ];

    let draggedStone: Stone | null = null;
    let wrongBowl: Bowl | null = null;
    let wrongTime = 0;
    const SHOW_WRONG_DURATION = 1200; // ms

    const drawStone = (stone: Stone) => {
      ctx.fillStyle = stone.color;
      ctx.beginPath();
      ctx.arc(stone.x, stone.y, stone.radius, 0, Math.PI * 2);
      ctx.fill();

      // Shadow/outline
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const drawBowl = (bowl: Bowl, highlight?: string) => {
      ctx.fillStyle = bowl.color;
      ctx.beginPath();
      ctx.arc(bowl.x, bowl.y, bowl.radius, 0, Math.PI * 2);
      ctx.fill();

      // Outline
      ctx.strokeStyle = highlight || '#969696';
      ctx.lineWidth = highlight ? 4 : 2;
      ctx.beginPath();
      ctx.arc(bowl.x, bowl.y, bowl.radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    const stoneContainsPoint = (stone: Stone, x: number, y: number) => {
      const dx = stone.x - x;
      const dy = stone.y - y;
      return dx * dx + dy * dy <= stone.radius * stone.radius;
    };

    const bowlContainsStone = (bowl: Bowl, stone: Stone) => {
      const dx = stone.x - bowl.x;
      const dy = stone.y - bowl.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < bowl.radius;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (const stone of stones) {
        if (!stone.placed && stoneContainsPoint(stone, x, y)) {
          draggedStone = stone;
          stone.isDragging = true;
          break;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (draggedStone && draggedStone.isDragging) {
        const rect = canvas.getBoundingClientRect();
        draggedStone.x = e.clientX - rect.left;
        draggedStone.y = e.clientY - rect.top;
      }
    };

    const handleMouseUp = () => {
      if (!draggedStone) return;

      let placed = false;
      for (const bowl of bowls) {
        if (bowlContainsStone(bowl, draggedStone)) {
          if (bowl.name === draggedStone.name) {
            // Correct placement
            draggedStone.x = bowl.x;
            draggedStone.y = bowl.y;
            draggedStone.placed = true;
          } else {
            // Wrong bowl
            wrongBowl = bowl;
            wrongTime = Date.now();
            draggedStone.x = draggedStone.startX;
            draggedStone.y = draggedStone.startY;
          }
          placed = true;
          break;
        }
      }

      if (!placed) {
        // Reset to starting position
        draggedStone.x = draggedStone.startX;
        draggedStone.y = draggedStone.startY;
      }

      draggedStone.isDragging = false;
      draggedStone = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    let animationId: number | null = null;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Draw bowls
      for (const bowl of bowls) {
        let highlight: string | undefined;
        if (
          wrongBowl === bowl &&
          Date.now() - wrongTime < SHOW_WRONG_DURATION
        ) {
          highlight = RED_FEEDBACK;
        }
        drawBowl(bowl, highlight);
      }

      // Draw stones
      for (const stone of stones) {
        drawStone(stone);
      }

      // Check completion
      const allCorrect = stones.every((s) => s.placed);

      if (allCorrect) {
        // Green success bar
        ctx.fillStyle = GREEN_FEEDBACK;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(0, HEIGHT - 70, WIDTH, 70);
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#284632';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          '✨ All stones correctly placed! Take a calm breath 🌿',
          WIDTH / 2,
          HEIGHT - 35
        );
        ctx.textAlign = 'left';

        setGameComplete(true);
      } else {
        // Instructions
        ctx.fillStyle = '#464646';
        ctx.font = 'bold 22px Arial';
        ctx.fillText('Zen Sorting Garden', 20, 30);

        ctx.font = '16px Arial';
        ctx.fillStyle = '#464646';
        ctx.fillText('Drag each stone into a bowl of the same color.', 20, 60);
        ctx.fillText(
          'Red outline = wrong bowl. Green message = all correct!',
          20,
          85
        );
        ctx.fillText('No rush. No penalties.', 20, 110);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const handleRestart = () => {
    setGameComplete(false);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full max-h-[95vh] overflow-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-4">
          <h2 className="text-3xl font-bold text-gray-800">🌿 Zen Sorting</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={550}
          className="w-full border-4 border-gray-300 rounded-xl mb-4 cursor-move bg-gradient-to-b from-gray-50 to-gray-100"
        />

        {gameComplete && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-8 text-center animate-bounce">
            <h3 className="text-4xl font-bold text-gray-800 mb-2">
              🎉 Congratulations!
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              You've successfully sorted all the stones!
            </p>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <p className="text-3xl font-bold text-green-600">
                  All Stones Placed
                </p>
                <p className="text-gray-600 mt-2">Take a moment to breathe 🌿</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition inline-flex items-center gap-2"
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
