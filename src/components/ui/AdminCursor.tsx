//...ui/AdminCursor.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

const isInteractiveElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest('a, button, input, textarea, select, label, [role="button"], [role="link"]') ||
      target.classList.contains('cursor-pointer')
  );
};

export const AdminCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const moveCursor = useCallback((event: MouseEvent) => {
    if (!cursorRef.current) return;

    gsap.to(cursorRef.current, {
      x: event.clientX,
      y: event.clientY,
      duration: 0,
      ease: 'power3.out'
    });
  }, []);

  const updateHover = useCallback((event: MouseEvent | PointerEvent) => {
    setIsHovering(isInteractiveElement(event.target));
  }, []);

  useEffect(() => {
    document.body.style.cursor = 'none';
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('pointerover', updateHover);
    window.addEventListener('pointerout', updateHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('pointerover', updateHover);
      window.removeEventListener('pointerout', updateHover);
      document.body.style.cursor = '';
    };
  }, [moveCursor, updateHover]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400/80 bg-emerald-400/20 shadow-[0_0_40px_rgba(16,185,129,0.18)] transition-all duration-200"
      style={{
        width: isHovering ? 30 : 18,
        height: isHovering ? 30 : 18,
        backdropFilter: 'blur(2px)'
      }}
    />
  );
};
