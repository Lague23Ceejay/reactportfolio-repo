import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
  className?: string;
}

const defaultColors: string[] = ['#ffffff', '#ffffff', '#ffffff'];

const hexToRgb = (hex: string): [number, number, number] => {
  const cleaned = hex.replace(/^#/, '');
  let targetHex = cleaned;
  if (cleaned.length === 3) {
    targetHex = cleaned.split('').map(c => c + c).join('');
  }
  const int = parseInt(targetHex, 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
};

// ... locate the vertex shader string block inside Particles.tsx:
const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.280) * mix(0.10, 1.50, random.x);
    mPos.y += sin(t * random.y + 6.280) * mix(0.10, 1.50, random.w);
    mPos.z += sin(t * random.w + 6.280) * mix(0.10, 1.50, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    // SENIOR DEV CRITICAL FIX:
    // Removed the broken distance division rule that caused stars to disappear in the center.
    // Instead, we use a clean baseline multiplier that ensures stars are visible to the naked eye.
    gl_PointSize = uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5));
    
    gl_Position = projectionMatrix * mvPos;
  }
`;


const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    // Discard outer pixels to make points perfectly crisp circles
    if (d > 0.5) {
      discard;
    }
    
    // SENIOR DEV FIX: Render pure white stars with soft edge anti-aliasing
    // This allows the rich pitch black background to pop with a true galaxy feel
    if (uAlphaParticles < 0.5) {
      gl_FragColor = vec4(vColor, 1.0);
    } else {
      float edgeAlpha = smoothstep(0.5, 0.3, d);
      gl_FragColor = vec4(vColor, edgeAlpha * 0.90);
    }
  }
`;

export const Particles: React.FC<ParticlesProps> = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = true,
  particleHoverFactor = 1,
  alphaParticles = true,
  particleBaseSize = 25,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetCameraPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: pixelRatio, depth: false, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0.0, 0.0, cameraDistance);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize, false);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      // SENIOR DEV FIX: Confining bounds strictly to window inner dimensions 
      // instead of reading the infinitely stretching relative container height!
      const x = (e.clientX / window.innerWidth) * 2.0 - 1.0;
      const y = -((e.clientY / window.innerHeight) * 2.0 - 1.0);
      mouseRef.current = { x, y };
      
      // Forces smooth opposite direction tracking
      targetCameraPos.current = {
        x: x * particleHoverFactor,
        y: y * particleHoverFactor
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      // Confine touch maps to raw window viewport frames as well
      const x = (e.touches[0].clientX / window.innerWidth) * 2.0 - 1.0;
      const y = -((e.touches[0].clientY / window.innerHeight) * 2.0 - 1.0);
      
      targetCameraPos.current = {
        x: x * particleHoverFactor,
        y: y * particleHoverFactor
      };
    };

    if (moveParticlesOnHover) {
      // Listen directly on the global window frame to catch moves past section blocks safely
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2.0 - 1.0;
        y = Math.random() * 2.0 - 1.0;
        z = Math.random() * 2.0 - 1.0;
        len = x * x + y * y + z * z;
      } while (len > 1.0 || len === 0.0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0.0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1.0 : 0.0 }
      },
      transparent: true,
      depthTest: false
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId: number;
    let lastTime = performance.now();
    let elapsed = 0.0;

        // ... locate this exact section inside the update loop of Particles.tsx:
    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      // SENIOR DEV POSITIONING FIX:
      // We interpolate x and y smoothly for the responsive opposite direction parallax,
      // but we explicitly enforce camera.position.z to hold steady at cameraDistance.
      // This prevents the camera from physically walking into the stars and blinding the scene!
      if (moveParticlesOnHover) {
        camera.position.x += (targetCameraPos.current.x - camera.position.x) * 0.05;
        camera.position.y += (targetCameraPos.current.y - camera.position.y) * 0.05;
        camera.position.z = cameraDistance; // Forces safe depth distance
      } else {
        camera.position.x += (0.0 - camera.position.x) * 0.05;
        camera.position.y += (0.0 - camera.position.y) * 0.05;
        camera.position.z = cameraDistance; // Forces safe depth distance
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0001) * 0.05;
        particles.rotation.y = Math.cos(elapsed * 0.0002) * 0.08;
        particles.rotation.z += 0.005 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
      }
      cancelAnimationFrame(animationFrameId);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio
  ]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block'
      }} 
    />
  );
};

export default Particles;
