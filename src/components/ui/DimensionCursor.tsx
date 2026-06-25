import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { gsap } from 'gsap';

// UTILITY A: Scans the DOM upward to catch boundary containers
const getContainingBlock = (element: HTMLElement | null): HTMLElement | null => {
  let node = element?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

// UTILITY B: Computes precise layout offsets for absolute rendering
const getContainingBlockOffset = (block: HTMLElement | null): { x: number; y: number } => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};
export const DimensionCursor: React.FC = () => {
  const { currentDimension, hoveredDimension } = useThemeStore();
  const activePack = dimensionPacks[hoveredDimension || currentDimension];
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);

  const [isHoveredLink, setIsHoveredLink] = useState(false);
  const targetSelector = 'a, button, [role="button"], .theme-dot, .cursor-target';

  // Fallback engine block to immediately terminate on small screens and mobile devices
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
  }, []);

  // Frame calculation handler coordinates hardware positioning changes
  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current);
    gsap.to(cursorRef.current, { x: x - offsetX, y: y - offsetY, duration: 0.1, ease: 'power3.out' });
  }, []);
  useEffect(() => {
    if (isMobile || !cursorRef.current) return;
    document.body.style.cursor = 'none';

    const cursor = cursorRef.current;
    containingBlockRef.current = getContainingBlock(cursor);
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner');

    const handleMouseMove = (e: MouseEvent) => {
      moveCursor(e.clientX, e.clientY);
    };

    const handleHoverStart = () => setIsHoveredLink(true);
    const handleHoverEnd = () => setIsHoveredLink(false);

    window.addEventListener('mousemove', handleMouseMove);

    // Anchor the element block to the dead-center of the initial canvas
    const initialOffset = getContainingBlockOffset(containingBlockRef.current);
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y
    });

    // Spin up standard rotation loops for target systems
    if (activePack.id === 'cosmic') {
      spinTl.current = gsap.timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: 3, ease: 'none' });
    }

    const targets = document.querySelectorAll(targetSelector);
    targets.forEach(t => {
      t.addEventListener('mouseenter', handleHoverStart);
      t.addEventListener('mouseleave', handleHoverEnd);
    });

    const handleMouseDown = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursor, { scale: 0.9, duration: 0.2 });
    };

    const handleMouseUp = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      spinTl.current?.kill();
      targets.forEach(t => {
        t.removeEventListener('mouseenter', handleHoverStart);
        t.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, [activePack, isMobile, moveCursor]);
  
      if (isMobile) return null;

  const { type, color, glow } = activePack.cursor;

  {/* 
    SENIOR DEV FIX: Checked strictly against the valid system token "target" 
    to remove compiler type overlaps and build successfully.
  */}
  if (type === 'target') {
    return (
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen w-10 h-10 select-none will-change-transform"
      >
        {/* Radar Corner Brackets */}
        {[
          'top-0 left-0 border-t-2 border-l-2',
          'top-0 right-0 border-t-2 border-r-2',
          'bottom-0 left-0 border-b-2 border-l-2',
          'bottom-0 right-0 border-b-2 border-r-2'
        ].map((cls, idx) => (
          <div
            key={idx}
            className="target-cursor-corner absolute w-3 h-3 transition-colors duration-150"
            style={{ borderColor: isHoveredLink ? '#B497CF' : color }}
          />
        ))}
        {/* Center Target Pip Tracker */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={dotRef}
            className="w-1.5 h-1.5 rounded-full transition-colors duration-150"
            style={{ backgroundColor: isHoveredLink ? '#B497CF' : color }}
          />
        </div>
      </div>
    );
  }

  // BRANCH B: Render standard vector morph shapes (Dot and Line Modes)
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 will-change-transform mix-blend-difference hidden md:block"
      style={{
        backgroundColor: type === 'dot' ? color : 'transparent',
        borderColor: color,
        borderWidth: type === 'dot' ? '0px' : '2px',
        boxShadow: glow,
        width: type === 'dot' ? (isHoveredLink ? 28 : 16) : (isHoveredLink ? 4 : 2),
        height: type === 'dot' ? (isHoveredLink ? 28 : 16) : (isHoveredLink ? 40 : 28),
        borderRadius: type === 'dot' ? '50%' : '4px',
        transition: 'width 0.2s, height 0.2s, background-color 0.2s, border-radius 0.2s, box-shadow 0.2s'
      }}
    />
  );
};
