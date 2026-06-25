import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string; // SENIOR DEV FIX: Added semantic color assignment to map palette arrays
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 70; // Optimized distribution layer density

    // NEON-WAVE PALETTE MATRIX:
    // Captures the exact combination from your reference image:
    // Electric Cyan, Hot Synth-Orange, and your explicit Orchid Purple (#B069DB)
    const neonPalette = ["#22d3ee", "#ff6b35", "#B069DB", "#ff9f1c", "#b069db"];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4, // Fluid, low-latency drift speed
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2.5 + 1.5, // Varied, clear sizes visible to the naked eye
          alpha: Math.random() * 0.6 + 0.2, // Vibrant base opacity mappings
          color: neonPalette[Math.floor(Math.random() * neonPalette.length)]
        });
      }
    };

    const drawLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // SENIOR DEV BACKGROUND GRADIENT RE-CALIBRATION:
      // Swapped out legacy gray tones for a deep cyber-twilight radial mask.
      // This dark backing lets the neon colors pop with a realistic glowing depth!
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 10,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, '#04010a'); // Deep magenta-tinted black core
      gradient.addColorStop(1, '#010003'); // Fades out to a pure pitch-black space frame
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render glowing drifting neon particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.save(); // Isolate the neon bloom matrix settings
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // ACTIVE ACCENT PROFILING GLOW FX:
        // Converts the canvas coordinate point into a high-intensity neon emitter,
        // bleeding orchid purple, hot orange, and cyan light rings onto your webpage base.
        ctx.shadowBlur = 18;
        ctx.shadowColor = p.color;
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.restore(); // Terminate state overrides to maintain high-FPS rendering stability

        // Increment position maps
        p.x += p.vx;
        p.y += p.vy;

        // Boundary edge checking loops
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animationFrameId = requestAnimationFrame(drawLoop);
    };

    // Event hooks initialization
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createParticles();
    drawLoop();

    // Prevent single-page application memory leaks
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none block"
    />
  );
}
