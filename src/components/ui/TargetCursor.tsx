// src/components/ui/TargetCursor.tsx
import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = '#ffffff',
  cursorColorOnTarget = '#B497CF'
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return (hasTouchScreen && isSmallScreen) || mobileRegex.test(userAgent.toLowerCase());
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner');

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    // Continuous spin
    spinTl.current = gsap.timeline({ repeat: -1 }).to(cursor, {
      rotation: '+=360',
      duration: spinDuration,
      ease: 'none'
    });

    const moveHandler = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power3.out'
      });
    };
    window.addEventListener('mousemove', moveHandler);

    const enterHandler = (e: MouseEvent) => {
      const target = (e.target as Element).closest(targetSelector);
      if (!target || !cornersRef.current) return;

      spinTl.current?.pause();
      gsap.set(cursor, { rotation: 0 });

      const corners = Array.from(cornersRef.current);
      gsap.to(corners, {
        borderColor: cursorColorOnTarget,
        duration: 0.15,
        ease: 'power2.out'
      });
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          backgroundColor: cursorColorOnTarget,
          duration: 0.15,
          ease: 'power2.out'
        });
      }
    };
    window.addEventListener('mouseover', enterHandler as EventListener);

    const leaveHandler = () => {
      if (!cornersRef.current) return;
      const corners = Array.from(cornersRef.current);
      gsap.to(corners, {
        borderColor: cursorColor,
        duration: 0.15,
        ease: 'power2.out'
      });
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          backgroundColor: cursorColor,
          duration: 0.15,
          ease: 'power2.out'
        });
      }
      spinTl.current?.restart();
    };
    window.addEventListener('mouseout', leaveHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler as EventListener);
      window.removeEventListener('mouseout', leaveHandler);
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector, spinDuration, hideDefaultCursor, cursorColor, cursorColorOnTarget, isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999]"
      style={{ willChange: 'transform' }}
    >
      {/* Dot */}
      <div
        ref={dotRef}
        className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform', backgroundColor: cursorColor }}
      />
      {/* Corners */}
      <div className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] -translate-x-[150%] -translate-y-[150%] border-r-0 border-b-0" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] translate-x-1/2 -translate-y-[150%] border-l-0 border-b-0" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] translate-x-1/2 translate-y-1/2 border-l-0 border-t-0" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] -translate-x-[150%] translate-y-1/2 border-r-0 border-t-0" style={{ borderColor: cursorColor }} />
    </div>
  );
};

export default TargetCursor;
