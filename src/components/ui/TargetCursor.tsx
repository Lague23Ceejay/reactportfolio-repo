import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

export interface TargetCursorProps {
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  cursorColor?: string;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  spinDuration = 2,
  hideDefaultCursor = true,
  cursorColor = '#00ff88'
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const spinTlRef = useRef<gsap.core.Timeline | null>(null);
  const firstMoveRef = useRef(false);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;

    if (!firstMoveRef.current) {
      gsap.set(cursorRef.current, { x, y, xPercent: -50, yPercent: -50, rotation: 0 });
      firstMoveRef.current = true;
      return;
    }

    // Smooth follow
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.05,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    // Initial position: center of viewport
    gsap.set(cursorRef.current, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      xPercent: -50,
      yPercent: -50,
      rotation: 0
    });

    if (spinTlRef.current) spinTlRef.current.kill();
    spinTlRef.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, {
      rotation: '+=360',
      duration: spinDuration,
      ease: 'none'
    });

    window.addEventListener('mousemove', (e) => moveCursor(e.clientX, e.clientY), { passive: true });

    return () => {
      if (spinTlRef.current) {
        spinTlRef.current.kill();
        spinTlRef.current = null;
      }
      if (hideDefaultCursor) {
        document.body.style.cursor = '';
      }
    };
  }, [isMobile, hideDefaultCursor, moveCursor, spinDuration]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="dimension-cursor"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        willChange: 'transform'
      }}
      aria-hidden="true"
    >
      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: cursorColor,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Top-left corner */}
      <div
        style={{
          position: 'absolute',
          width: 12,
          height: 12,
          borderLeft: `3px solid ${cursorColor}`,
          borderTop: `3px solid ${cursorColor}`,
          left: '50%',
          top: '50%',
          transform: 'translate(calc(-100% - 6px), calc(-100% - 6px))',
          pointerEvents: 'none'
        }}
      />

      {/* Top-right corner */}
      <div
        style={{
          position: 'absolute',
          width: 12,
          height: 12,
          borderRight: `3px solid ${cursorColor}`,
          borderTop: `3px solid ${cursorColor}`,
          left: '50%',
          top: '50%',
          transform: 'translate(6px, calc(-100% - 6px))',
          pointerEvents: 'none'
        }}
      />

      {/* Bottom-left corner */}
      <div
        style={{
          position: 'absolute',
          width: 12,
          height: 12,
          borderLeft: `3px solid ${cursorColor}`,
          borderBottom: `3px solid ${cursorColor}`,
          left: '50%',
          top: '50%',
          transform: 'translate(calc(-100% - 6px), 6px)',
          pointerEvents: 'none'
        }}
      />

      {/* Bottom-right corner */}
      <div
        style={{
          position: 'absolute',
          width: 12,
          height: 12,
          borderRight: `3px solid ${cursorColor}`,
          borderBottom: `3px solid ${cursorColor}`,
          left: '50%',
          top: '50%',
          transform: 'translate(6px, 6px)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default TargetCursor;
