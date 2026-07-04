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
      duration: 0.05,
      ease: 'power3.out'
    });
  }, []);

  const updateHoverState = useCallback((event: Event) => {
    const target = event.target;
    setIsHoveredLink(target instanceof Element ? isInteractiveElement(target) : false);
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
    window.addEventListener('mouseover', updateHoverState);
    window.addEventListener('mouseout', updateHoverState);
    window.addEventListener('pointerover', updateHoverState);
    window.addEventListener('pointerout', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', updateHoverState);
      window.removeEventListener('mouseout', updateHoverState);
      window.removeEventListener('pointerover', updateHoverState);
      window.removeEventListener('pointerout', updateHoverState);
      document.body.style.cursor = '';
    };
  }, [isAdminOverlayOpen, isAuthenticated, isMobile, moveCursor, updateHoverState]);

  // Spin animation for snowflake and cosmic line cursor
  useEffect(() => {
    if (!cursorRef.current) return;

    if (type === "snowflake") {
      const tween = gsap.to(cursorRef.current, {
        rotation: "+=360",
        duration: 6,
        repeat: -1,
        ease: "linear"
      });
      return () => {
        tween.kill();
      };
    }

    if (type === "line") {
      const tween = gsap.to(cursorRef.current, {
        rotation: "+=360",
        duration: 1.8,
        repeat: -1,
        ease: "none"
      });
      return () => {
        tween.kill();
      };
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
        className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          transformOrigin: 'center center',
          filter: `drop-shadow(${glow})`
        }}
      >
        <div
          style={{
            width: isHoveredLink ? 44 : 28,
            height: 2,
            backgroundColor: color,
            borderRadius: '9999px',
            boxShadow: glow,
            transition: 'width 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease'
          }}
        />
      </div>
    );
  }

  return null;
};
