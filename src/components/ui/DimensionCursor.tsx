// src/components/ui/DimensionCursor.tsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { usePortfolioStore } from '../../store/portfolioStore';
import { gsap } from 'gsap';

import TargetCursor from './TargetCursor';

const isInteractiveElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest('a, button, input, textarea, select, label, [role="button"], [role="link"], .interactive, .cursor-pointer, .cursor-target') ||
    target.classList.contains('cursor-pointer') ||
    target.classList.contains('cursor-target')
  );
};

export const DimensionCursor: React.FC = () => {
  const { currentDimension, hoveredDimension } = useThemeStore();
  const { isAuthenticated } = usePortfolioStore();
  const activePack = dimensionPacks[hoveredDimension || currentDimension];

  const { type, color, glow } = activePack.cursor;
  const spinAnimation = type === 'snowflake' ? 'dimension-cursor-spin 6s linear infinite' : type === 'line' ? 'dimension-cursor-spin 1.8s linear infinite' : 'none';

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isHoveredLink, setIsHoveredLink] = useState(false);
  const [isAdminOverlayOpen, setIsAdminOverlayOpen] = useState(false);
  const firstMoveRef = useRef(false);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
  }, []);

  const moveCursor = useCallback((event: MouseEvent) => {
    if (!cursorRef.current || type === 'target') return;

    const x = event.clientX;
    const y = event.clientY;

    if (!firstMoveRef.current) {
      gsap.set(cursorRef.current, { x, y });
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.18, ease: 'power2.out' });
      firstMoveRef.current = true;
      return;
    }

    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.05,
      ease: 'power3.out'
    });
  }, [type]);

  const updateHoverState = useCallback((event: Event) => {
    const target = event.target;
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    setIsHoveredLink(element ? isInteractiveElement(element) : false);
  }, []);

  // Admin overlay detection
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

  // Mount/unmount listeners for pointer and hover
  useEffect(() => {
    if (isAdminOverlayOpen || isAuthenticated || isMobile) return;

    document.body.style.cursor = 'none';

    if (cursorRef.current && type !== 'target') {
      const el = cursorRef.current;
      const initX = Math.round(window.innerWidth / 2);
      const initY = Math.round(window.innerHeight / 2);
      gsap.set(el, {
        x: initX,
        y: initY,
        opacity: 1,
        transformOrigin: '50% 50%'
      });

      el.style.filter = `drop-shadow(${glow})`;
      el.style.setProperty('--cursor-color', color);
      el.style.setProperty('--cursor-glow', glow || '0 0 10px rgba(0,0,0,0)');
    }

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', updateHoverState, { passive: true });
    window.addEventListener('mouseout', updateHoverState, { passive: true });
    window.addEventListener('pointerover', updateHoverState, { passive: true });
    window.addEventListener('pointerout', updateHoverState, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', updateHoverState);
      window.removeEventListener('mouseout', updateHoverState);
      window.removeEventListener('pointerover', updateHoverState);
      window.removeEventListener('pointerout', updateHoverState);
      document.body.style.cursor = '';
    };
  }, [isAdminOverlayOpen, isAuthenticated, isMobile, type, moveCursor, updateHoverState, color, glow]);

  useEffect(() => {
    if (!cursorRef.current || type === 'target') {
      return () => {
        // The wrapper does not own a rotation loop for the target cursor.
      };
    }

    return () => {
      // The wrapper keeps its cleanup explicit without competing with the target cursor animation layer.
    };
  }, [type]);

  // Asset color updates
  useEffect(() => {
    if (!cursorRef.current || type === 'target') return;
    const el = cursorRef.current;
    gsap.to(el, {
      duration: 0.22,
      ease: 'power2.out',
      onStart: () => {
        el.style.filter = `drop-shadow(${glow})`;
        el.style.setProperty('--cursor-color', color);
        el.style.setProperty('--cursor-glow', glow || '0 0 10px rgba(0,0,0,0)');
      }
    });
  }, [color, glow, type]);

  if (isAdminOverlayOpen || isAuthenticated || isMobile) {
    return null;
  }

  if (type === 'target') {
    return (
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        cursorColor={color}
      />
    );
  }

  if (type === "snowflake") {
    return (
      <div
        ref={cursorRef}
        className="dimension-cursor"
        aria-hidden="true"
        style={{ position: 'fixed', left: 0, top: 0, zIndex: 99999, pointerEvents: 'none', willChange: 'transform,opacity' }}
      >
        <div
          className={`dimension-cursor-target ${isHoveredLink ? 'is-target' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isHoveredLink ? 20 : 16,
            color,
            transition: 'font-size 0.18s, color 0.18s',
            pointerEvents: 'none',
            animation: spinAnimation,
            transformOrigin: 'center center'
          }}
        >
          <span aria-hidden="true" style={{ lineHeight: 1 }}>❄️</span>
        </div>
      </div>
    );
  }

  if (type === "line") {
    return (
      <div
        ref={cursorRef}
        className="dimension-cursor hidden md:block"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 99999,
          pointerEvents: 'none',
          willChange: 'transform,opacity'
        }}
      >
        <div
          className={`dimension-cursor-target ${isHoveredLink ? 'is-target' : ''}`}
          style={{
            width: isHoveredLink ? 44 : 28,
            height: 6,
            borderRadius: 9999,
            backgroundColor: color,
            border: 'none',
            boxShadow: glow,
            transition: 'width 0.15s ease, background-color 0.2s ease, box-shadow 0.2s ease',
            pointerEvents: 'none',
            animation: spinAnimation,
            transformOrigin: 'center center'
          }}
        />
      </div>
    );
  }

  return null;
};
