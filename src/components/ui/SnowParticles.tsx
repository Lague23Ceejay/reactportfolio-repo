// src/components/ui/SnowParticles.tsx
import { useEffect, useRef } from 'react';

export function SnowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track particle counts based on screen real estate
    const maxFlakes = width < 768 ? 40 : 90;
    const flakes: Array<{ x: number; y: number; r: number; d: number; speedY: number; speedX: number }> = [];

    // Initialize snow particles with randomized sizing and drift speeds
    for (let i = 0; i < maxFlakes; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 1, // Soft particle sizes (1px - 3.5px)
        d: Math.random() * maxFlakes, // Density seed for horizontal wavering
        speedY: Math.random() * 0.7 + 0.3, // Soft falling velocity
        speedX: Math.random() * 0.4 - 0.2, // Subtle horizontal drift
      });
    }

    // Dynamic viewport resize handling
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Core drawing and physics mutation loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'; // Soft matte white snowflakes
      ctx.beginPath();

      for (let i = 0; i < maxFlakes; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);

        // Update physics positions
        f.y += f.speedY;
        // Generate a soft sinusoidal swaying motion over time
        f.x += f.speedX + Math.sin(f.y / 30) * 0.2;

        // Reset particle to the top once it drifts past the bottom viewport border
        if (f.y > height) {
          flakes[i] = {
            ...f,
            x: Math.random() * width,
            y: -10,
            speedY: Math.random() * 0.7 + 0.3,
          };
        }

        // Wrap around horizontal boundaries if winds push flakes off-screen
        if (f.x > width) f.x = 0;
        else if (f.x < 0) f.x = width;
      }

      ctx.fill();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Clean up animation loops and event listeners on theme unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen"
    />
  );
}
