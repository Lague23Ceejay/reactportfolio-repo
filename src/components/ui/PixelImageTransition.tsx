// src/components/ui/PixelImageTransition.tsx

import React, { useRef, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

interface GlitchTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  intervalDuration?: number; 
  className?: string;
  style?: CSSProperties;
}

export const PixelImageTransition: React.FC<GlitchTransitionProps> = ({
  firstContent,
  secondContent,
  intervalDuration = 3000, // Cycles perfectly every 3.0 seconds
  className = '',
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [activeSource, setActiveSource] = useState(1);
  const imagesRef = useRef<{ [key: number]: HTMLImageElement | null }>({ 1: null, 2: null });
  const glitchTimeRef = useRef(0);
  const isGlitchingRef = useRef(false);

  // 1. Preload image textures cleanly from your Vercel CDN strings
  useEffect(() => {
    const extractImageSrc = (node: React.ReactNode): string => {
      if (React.isValidElement(node) && node.props.src) {
        return node.props.src;
      }
      return '';
    };

    const loadImg = (key: number, node: React.ReactNode) => {
      const src = extractImageSrc(node);
      if (!src) return;
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Blocks canvas security bugs
      img.src = src;
      img.onload = () => { imagesRef.current[key] = img; };
    };

    loadImg(1, firstContent);
    if (secondContent) loadImg(2, secondContent);
  }, [firstContent, secondContent]);

  // 2. Automate the 3-second cycle trigger loop
  useEffect(() => {
  if (!secondContent) {
    setActiveSource(1);
    return;
  }

  const timer = setInterval(() => {
    isGlitchingRef.current = true;
    glitchTimeRef.current = 0;
    // 🚀 SWAP STATE IN SYNC WITH THE INTERVAL TIMER
    setActiveSource(prev => (prev === 1 ? 2 : 1));
  }, intervalDuration);

  return () => clearInterval(timer);
}, [secondContent, intervalDuration]);

  // 3. Hardware-Accelerated Glitch Physics Loop with Chromatic Aberration
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let animId: number;

    // Aspect-ratio clipping cover function
    const drawCenterImage = (image: HTMLImageElement, offsetX = 0, offsetY = 0) => {
      const cw = canvas.width;
      const h = canvas.height;
      const iw = image.width;
      const ih = image.height;
      const r = Math.max(cw / iw, h / ih);
      const cx = (iw - cw / r) / 2;
      const cy = (ih - h / r) / 2;
      ctx.drawImage(image, cx, cy, iw - 2 * cx, ih - 2 * cy, offsetX, offsetY, cw, h);
    };

    const renderLoop = () => {
      const img1 = imagesRef.current[1];
      const img2 = imagesRef.current[2];

      // Standard stable rendering if no glitch timeline is active
      if (!isGlitchingRef.current || !img1) {
        const activeImg = activeSource === 1 ? img1 : img2;
        if (activeImg) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawCenterImage(activeImg);
        }
        animId = requestAnimationFrame(renderLoop);
        return;
      }

      // Track slice timing steps
      glitchTimeRef.current += 1;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Select source assets depending on mid-timeline break markers
      const isPastHalfway = glitchTimeRef.current > 12; // Swap image data halfway through the frames (~200ms)
      const displayImg = isPastHalfway ? (img2 || img1) : img1;
      
      /* ==========================================================================
         🌈 THE CHROMATIC DISTORTION ENGINE (TRUE HARDWARE RGB SPLIT)
         ========================================================================== */
      // Generate randomized displacement distances for the color channels
      const splitOffset = (Math.random() - 0.5) * 16; 
      
      ctx.save();
      // Draw the primary image base shape layer first
      drawCenterImage(displayImg, 0, 0);

      if (Math.abs(splitOffset) > 2) {
        // Red Channel Distortion Layer
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'screen';
        drawCenterImage(displayImg, splitOffset, (Math.random() - 0.5) * 4);

        // Cyan (Green + Blue) Channel Distortion Layer
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'screen';
        drawCenterImage(displayImg, -splitOffset, (Math.random() - 0.5) * -4);
        
        // Reset composite operations back to standard drawing rules
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.restore();

      /* ==========================================================================
         💥 THE BLOCK / STRIP SLICE GLITCH
         ========================================================================== */
      if (Math.random() > 0.1) {
        const sliceCount = Math.floor(Math.random() * 5) + 3; // Slice 3 to 8 random stripes
        for (let i = 0; i < sliceCount; i++) {
          const sliceY = Math.random() * canvas.height;
          const sliceH = Math.random() * 40 + 8; // Random stripe heights
          const displaceX = (Math.random() - 0.5) * 45; // Intensive sideways shaking shift
          
          // Duplicate, displace, and blend the slice strips back onto the matrix layout
          ctx.drawImage(canvas, 0, sliceY, canvas.width, sliceH, displaceX, sliceY, canvas.width, sliceH);
        }
      }

      // 📺 CRT SCREEN SCANLINES MESH OVERLAY
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      // Terminate the glitch timeline burst and swap your source index pointers
      if (glitchTimeRef.current >= 24) { 
        isGlitchingRef.current = false;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animId);
  }, [activeSource]);

  return (
    <div ref={containerRef} className={`w-full h-full relative ${className}`} style={style}>
      <canvas 
        ref={canvasRef} 
        width={350} 
        height={350} 
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};
