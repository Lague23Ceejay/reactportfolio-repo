// src/components/ui/DimensionCursor.tsx
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

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isHoveredLink, setIsHoveredLink] = useState(false);
  const [isAdminOverlayOpen, setIsAdminOverlayOpen] = useState(false);

  // track whether we've received the first mousemove
  const firstMoveRef = useRef(false);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
  }, []);

  // Move cursor using GSAP; on first move use set() to avoid animating from undefined
  // Move cursor using GSAP; on first move use set() to avoid animating from undefined
const moveCursor = useCallback((event: MouseEvent) => {
  if (!cursorRef.current) return;

  const x = event.clientX;
  const y = event.clientY;

  // First move: snap to pointer and reveal
  if (!firstMoveRef.current) {
    // place immediately
    gsap.set(cursorRef.current, { x, y });
    // reveal the cursor smoothly
    gsap.to(cursorRef.current, { opacity: 1, duration: 0.18, ease: 'power2.out' });
    firstMoveRef.current = true;
    return;
  }

  // subsequent moves: smooth follow
  gsap.to(cursorRef.current, {
    x,
    y,
    duration: 0.05,
    ease: 'power3.out'
  });
}, []);

  const updateHoverState = useCallback((event: Event) => {
    const target = event.target;
    setIsHoveredLink(target instanceof Element ? isInteractiveElement(target) : false);
  }, []);

  // Admin overlay detection (unchanged)
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

  // Bind hover/focus to add/remove .is-target class on the inner element for immediate visual feedback
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const targetEl = el.querySelector('.dimension-cursor-target') as HTMLElement | null;
    if (!targetEl) return;

    const selectors = 'a, button, [role="button"], [role="link"], .interactive, .cursor-pointer, input, textarea, select, label';
    const nodes = Array.from(document.querySelectorAll(selectors)) as HTMLElement[];

    const onEnter = () => targetEl.classList.add('is-target');
    const onLeave = () => targetEl.classList.remove('is-target');

    nodes.forEach(n => {
      n.addEventListener('mouseenter', onEnter);
      n.addEventListener('mouseleave', onLeave);
      n.addEventListener('focus', onEnter);
      n.addEventListener('blur', onLeave);
    });

    return () => {
      nodes.forEach(n => {
        n.removeEventListener('mouseenter', onEnter);
        n.removeEventListener('mouseleave', onLeave);
        n.removeEventListener('focus', onEnter);
        n.removeEventListener('blur', onLeave);
      });
    };
  }, [/* run once on mount; rebind if you need dynamic content handling */]);

  // Mount/unmount listeners for pointer and hover
  useEffect(() => {
    if (isAdminOverlayOpen || isAuthenticated || isMobile) return;

    // hide native cursor
    document.body.style.cursor = 'none';

    // Ensure cursor element exists and has initial styles before any mousemove
    if (cursorRef.current) {
      const el = cursorRef.current;
      // initial placement: center of viewport to avoid layout jump
      const initX = Math.round(window.innerWidth / 2);
      const initY = Math.round(window.innerHeight / 2);
      gsap.set(el, {
        x: initX,
        y: initY,
        opacity: 0, // keep hidden until first move
        transformOrigin: '50% 50%'
      });

      // apply immediate visual properties from pack
      el.style.filter = `drop-shadow(${glow})`;
      // store color on a CSS variable for any CSS that reads it
      el.style.setProperty('--cursor-color', color);
      el.style.setProperty('--cursor-glow', glow || '0 0 10px rgba(0,0,0,0)');
    }

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', updateHoverState, { passive: true });
    window.addEventListener('mouseout', updateHoverState, { passive: true });
    window.addEventListener('pointerover', updateHoverState, { passive: true });
    window.addEventListener('pointerout', updateHoverState, { passive: true });

    // reveal cursor on first pointer interaction (mouse or touch)
    const revealOnFirst = () => {
      if (!cursorRef.current) return;
      const el = cursorRef.current;
      // animate opacity in
      gsap.to(el, { opacity: 1, duration: 0.18, ease: 'power2.out' });
      // remove this listener after first use
      window.removeEventListener('pointerdown', revealOnFirst);
      window.removeEventListener('touchstart', revealOnFirst);
    };
    window.addEventListener('pointerdown', revealOnFirst, { passive: true });
    window.addEventListener('touchstart', revealOnFirst, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', updateHoverState);
      window.removeEventListener('mouseout', updateHoverState);
      window.removeEventListener('pointerover', updateHoverState);
      window.removeEventListener('pointerout', updateHoverState);
      window.removeEventListener('pointerdown', revealOnFirst);
      window.removeEventListener('touchstart', revealOnFirst);
      document.body.style.cursor = '';
    };
  }, [isAdminOverlayOpen, isAuthenticated, isMobile, moveCursor, updateHoverState, color, glow]);

  // Spin animation for snowflake and cosmic line cursor (unchanged)
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

  // Update visual properties when activePack changes (color/glow)
  useEffect(() => {
    if (!cursorRef.current) return;
    const el = cursorRef.current;
    // animate filter and CSS variable updates
    gsap.to(el, {
      duration: 0.22,
      ease: 'power2.out',
      onStart: () => {
        el.style.filter = `drop-shadow(${glow})`;
        el.style.setProperty('--cursor-color', color);
        el.style.setProperty('--cursor-glow', glow || '0 0 10px rgba(0,0,0,0)');
      }
    });
  }, [color, glow]);

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

  // ❄️ Snowflake cursor for creamy theme (standardized DOM)
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
            pointerEvents: 'none'
          }}
        >
          <span aria-hidden="true" style={{ lineHeight: 1 }}>❄️</span>
        </div>
      </div>
    );
  }

  // Line cursor branch (for cosmic) — standardized DOM
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
          transformOrigin: 'center center',
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
            pointerEvents: 'none'
          }}
        />
      </div>
    );
  }

  return null;
};

export default DimensionCursor;
