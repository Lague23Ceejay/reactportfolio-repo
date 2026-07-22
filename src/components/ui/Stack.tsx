// src/components/ui/Stack.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type StackProps = {
  cards: ReactNode[];
  randomRotation?: boolean;
  sendToBackOnClick?: boolean;
  sensitivity?: number;
  mobileClickOnly?: boolean;
  className?: string;
  style?: CSSProperties;
};

export default function Stack({
  cards,
  randomRotation = true,
  sendToBackOnClick = true,
  sensitivity = 120,
  mobileClickOnly = false,
  className = '',
  style = {}
}: StackProps) {
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));

  const rotations = useMemo(() => {
    return cards.map(() => {
      if (!randomRotation) return 0;
      return Math.round((Math.random() * 16 - 8) * 10) / 10;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length, randomRotation]);

  useEffect(() => {
    setOrder(prev => {
      const max = cards.length - 1;
      const filtered = prev.filter(i => i <= max);
      for (let i = 0; i <= max; i++) {
        if (!filtered.includes(i)) filtered.push(i);
      }
      return filtered;
    });
  }, [cards.length]);

  const draggingRef = useRef<{
    index: number | null;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    pointerId?: number;
  }>({ index: null, startX: 0, startY: 0, lastX: 0, lastY: 0 });

  const [transforms, setTransforms] = useState<Record<number, { x: number; y: number }>>({});
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<Record<number, { x: number; y: number }>>({});

  const flushPending = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setTransforms(prev => ({ ...prev, ...pendingRef.current }));
    pendingRef.current = {};
  }, []);

  const scheduleFlush = useCallback(() => {
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        flushPending();
      });
    }
  }, [flushPending]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent, cardIndex: number) => {
      if (mobileClickOnly && e.pointerType !== 'touch') return;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      draggingRef.current = {
        index: cardIndex,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        pointerId: e.pointerId
      };
    },
    [mobileClickOnly]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = draggingRef.current;
      if (d.index === null) return;
      if (d.pointerId != null && e.pointerId !== d.pointerId) return;

      const dx = (e.clientX - d.lastX) / (sensitivity / 100);
      const dy = (e.clientY - d.lastY) / (sensitivity / 100);
      d.lastX = e.clientX;
      d.lastY = e.clientY;

      const prev = transforms[d.index] ?? { x: 0, y: 0 };
      pendingRef.current[d.index] = { x: prev.x + dx, y: prev.y + dy };
      scheduleFlush();
    },
    [sensitivity, transforms, scheduleFlush]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent, cardIndex: number) => {
      (e.target as Element).releasePointerCapture?.(e.pointerId);

      const d = draggingRef.current;
      const moved =
        d.index !== null &&
        (Math.abs(d.lastX - d.startX) > 4 || Math.abs(d.lastY - d.startY) > 4);

      draggingRef.current = { index: null, startX: 0, startY: 0, lastX: 0, lastY: 0 };

      if (!moved) {
        if (sendToBackOnClick) {
          setOrder(prev => {
            const idx = prev.indexOf(cardIndex);
            if (idx === -1) return prev;
            const copy = prev.slice();
            copy.splice(idx, 1);
            copy.push(cardIndex);
            return copy;
          });
        }
        setTransforms(prev => {
          const copy = { ...prev };
          delete copy[cardIndex];
          return copy;
        });
        return;
      }

      setTransforms(prev => {
        const copy = { ...prev };
        copy[cardIndex] = { x: 0, y: 0 };
        return copy;
      });
    },
    [sendToBackOnClick]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent, idx: number) => onPointerDown(e, idx), [onPointerDown]);
  const handlePointerMove = useCallback((e: React.PointerEvent) => onPointerMove(e), [onPointerMove]);
  const handlePointerUp = useCallback((e: React.PointerEvent, idx: number) => onPointerUp(e, idx), [onPointerUp]);

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        overflow: 'visible',
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style
      }}
    >
      {order.map((cardIndex, stackPosition) => {
        const node = cards[cardIndex];
        const rotation = rotations[cardIndex] ?? 0;
        const zIndex = 100 + stackPosition;
        const transform = transforms[cardIndex];
        const translate = transform ? `translate(${transform.x}px, ${transform.y}px)` : '';
        const isDragging = draggingRef.current.index === cardIndex;

        const baseStyle: CSSProperties = {
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          userSelect: 'none',
          touchAction: 'none',
          transform: `${translate} rotate(${rotation}deg)`,
          transition: transform ? 'transform 120ms linear' : 'transform 220ms cubic-bezier(.2,.9,.2,1)',
          zIndex,
          pointerEvents: 'auto',
          overflow: 'visible',
          willChange: 'transform',
          cursor: isDragging ? 'grabbing' : 'grab'
        };

        return (
          <div
            key={cardIndex}
            style={baseStyle}
            onPointerDown={(e) => handlePointerDown(e, cardIndex)}
            onPointerMove={(e) => handlePointerMove(e)}
            onPointerUp={(e) => handlePointerUp(e, cardIndex)}
            onClick={() => {
              /* intentionally empty to allow parent handlers */
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                overflow: 'visible',
                display: 'block',
                position: 'relative',
                pointerEvents: 'auto'
              }}
            >
              <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>{node}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
