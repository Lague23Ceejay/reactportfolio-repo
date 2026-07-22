// src/components/ui/CustomCursorController.tsx
import { useEffect, useRef } from 'react';

type HoverState = {
  target: Element | null;
  key?: string | null;
};

export default function CustomCursorController(): null {
  const cursor = useRef<HTMLElement | null>(null);
  const pos = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const hover = useRef<HoverState>({ target: null, key: null });
  const raf = useRef<number | null>(null);
  const scrollTimeout = useRef<number | null>(null);

  useEffect(() => {
    cursor.current = document.querySelector('.custom-cursor') as HTMLElement | null;
    if (!cursor.current) return;

    // render loop to position cursor smoothly
    const render = () => {
      const el = cursor.current;
      if (el) {
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(render);
    };
    raf.current = requestAnimationFrame(render);

    // Helpers
    function setHoverTarget(target: Element | null) {
      const prev = hover.current.target;
      if (prev === target) return;
      hover.current.target = target;

      const cur = cursor.current;
      if (target) {
        cur?.classList.add('custom-cursor--large');
        const color = target.getAttribute('data-cursor-color');
        if (color && cur) cur.style.background = color;
      } else {
        cur?.classList.remove('custom-cursor--large');
        if (cur) cur.style.background = '';
      }
    }

    function updateHoverFromElement(el: Element | null) {
      const target = el && el.closest ? (el.closest('.cursor-target') as Element | null) : null;
      setHoverTarget(target);
    }

    // Event handlers
    const onPointerMove = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      updateHoverFromElement(el);
    };

    const onPointerOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest ? ( (e.target as Element).closest('.cursor-target') as Element | null ) : null;
      if (target) setHoverTarget(target);
    };

    const onPointerOut = () => {
      // re-evaluate element under stored pointer coords
      const el = document.elementFromPoint(pos.current.x, pos.current.y);
      updateHoverFromElement(el);
    };

    const onScroll = () => {
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        const el = document.elementFromPoint(pos.current.x, pos.current.y);
        updateHoverFromElement(el);
        scrollTimeout.current = null;
      }, 40);
    };

    const onTouchStart = () => cursor.current?.classList.add('custom-cursor--hidden');
    const onTouchEnd = () => cursor.current?.classList.remove('custom-cursor--hidden');

    // Attach listeners
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    };
  }, []);

  return null;
}
