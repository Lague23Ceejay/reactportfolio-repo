import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { gsap } from 'gsap';

// Import TargetCursor
import TargetCursor from './TargetCursor';

const isInteractiveElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest('a, button, input, textarea, select, label, [role="button"], [role="link"]') ||
    target.classList.contains('cursor-pointer')
  );
};

export const DimensionCursor: React.FC = () => {
  const { currentDimension, hoveredDimension } = useThemeStore();
  const { isAuthenticated } = usePortfolioStore();
  const activePack = dimensionPacks[hoveredDimension || currentDimension];

  // Declare cursor config early
  const { type, color, glow } = activePack.cursor;

  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHoveredLink, setIsHoveredLink] = useState(false);
  const [isAdminOverlayOpen, setIsAdminOverlayOpen] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
  }, []);

  const moveCursor = useCallback((event: MouseEvent) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x: event.clientX,
      y: event.clientY,
      duration: 0.14,
      ease: 'power3.out'
    });
  }, []);

  const updateHoverState = useCallback((event: MouseEvent | PointerEvent) => {
    setIsHoveredLink(isInteractiveElement(event.target));
  }, []);

  useEffect(() => {
    const checkAdminState = () => {
      const hasAdminHash = window.location.hash === '#admin';
      const adminModalMounted = document.getElementById('adminConsoleOverlayMasterContainer') !== null;
      setIsAdminOverlayOpen(hasAdminHash || adminModalMounted);
    };

    checkAdminState();
    const cursorObserver = new MutationObserver(checkAdminState);
    cursorObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('hashchange', checkAdminState);

    return () => {
      cursorObserver.disconnect();
      window.removeEventListener('hashchange', checkAdminState);
    };
  }, []);

  useEffect(() => {
    if (isAdminOverlayOpen || isAuthenticated || isMobile) return;
    document.body.style.cursor = 'none';

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('pointerover', updateHoverState);
    window.addEventListener('pointerout', updateHoverState);
    window.addEventListener('mousemove', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('pointerover', updateHoverState);
      window.removeEventListener('pointerout', updateHoverState);
      window.removeEventListener('mousemove', updateHoverState);
      document.body.style.cursor = '';
    };
  }, [isAdminOverlayOpen, isAuthenticated, isMobile, moveCursor, updateHoverState]);

  // Spin animation for snowflake
  useEffect(() => {
    if (type === "snowflake" && cursorRef.current) {
      gsap.to(cursorRef.current, {
        rotation: "+=360",
        duration: 6,
        repeat: -1,
        ease: "linear"
      });
    }
  }, [type]);

  if (isAdminOverlayOpen || isAuthenticated || isMobile) {
    return null;
  }

  // 🔥 Mount TargetCursor when theme requires "target"
  if (type === 'target') {
    return (
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
        cursorColor={color}
        cursorColorOnTarget="#B497CF"
      />
    );
  }

  // ❄️ Snowflake cursor for creamy theme
  if (type === "snowflake") {
    return (
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
      >
        <span
          style={{
            fontSize: isHoveredLink ? "2rem" : "1.5rem",
            color,
            transition: "font-size 0.2s, color 0.2s"
          }}
        >
          ❄️
        </span>
      </div>
    );
  }

  // Line cursor branch (for cosmic)
  if (type === "line") {
    return (
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
        style={{
          borderColor: color,
          borderWidth: 2,
          boxShadow: glow,
          width: isHoveredLink ? 4 : 2,
          height: isHoveredLink ? 40 : 28,
          borderRadius: "4px",
          transition: "width 0.2s, height 0.2s, border-color 0.2s, box-shadow 0.2s"
        }}
      />
    );
  }

  return null;
};
