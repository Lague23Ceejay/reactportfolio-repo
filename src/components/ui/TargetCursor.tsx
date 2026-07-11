// src/components/ui/TargetCursor.tsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface TargetCursorProps {
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  cursorColor?: string;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  spinDuration = 1.8,
  hideDefaultCursor = true,
  cursorColor = '#00ff88'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const coreTriggerRef = useRef<HTMLDivElement>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);

  const [hoveredTarget, setHoveredTarget] = useState<HTMLElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, isHovered: false });
  const hoveredTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const enterTarget = (match: HTMLElement) => {
      if (hoveredTargetRef.current === match) return;

      hoveredTargetRef.current = match;
      setHoveredTarget(match);

      const rect = match.getBoundingClientRect();
      setDimensions({
        width: rect.width + 20,
        height: rect.height + 16,
        isHovered: true
      });

      if (spinTweenRef.current) {
        spinTweenRef.current.pause();
        gsap.to(spinnerRef.current, {
          rotation: 0,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const leaveTarget = () => {
      if (!hoveredTargetRef.current) return;

      hoveredTargetRef.current = null;
      setHoveredTarget(null);
      setDimensions({ width: 0, height: 0, isHovered: false });

      if (spinTweenRef.current) {
        spinTweenRef.current.play();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !coreTriggerRef.current) return;

      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const currentTarget = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      const match = currentTarget?.closest('.target-cursor') as HTMLElement | null;

      if (match) {
        enterTarget(match);
      } else if (hoveredTargetRef.current) {
        leaveTarget();
      }

      const currentHoveredTarget = hoveredTargetRef.current;

      if (currentHoveredTarget) {
        const rect = currentHoveredTarget.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        gsap.to(containerRef.current, {
          x: targetX,
          y: targetY,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // Keep the core dot exactly centered on the target while hovered
        if (coreTriggerRef.current) {
          gsap.to(coreTriggerRef.current, {
            x: targetX,
            y: targetY,
            duration: 0.08,
            overwrite: 'auto',
            immediateRender: false
          });
        }
      } else {
        gsap.to(containerRef.current, {
          x: mouseX,
          y: mouseY,
          duration: 0.04,
          ease: 'power3.out',
          overwrite: 'auto'
        });

        if (coreTriggerRef.current) {
          gsap.to(coreTriggerRef.current, {
            x: mouseX,
            y: mouseY,
            duration: 0.06,
            overwrite: 'auto',
            immediateRender: false
          });
        }
      }
    };

    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
    }

    if (spinnerRef.current) {
      spinTweenRef.current = gsap.to(spinnerRef.current, {
        rotation: '+=360',
        duration: spinDuration,
        repeat: -1,
        ease: 'none'
      });
    }

    // ensure core dot starts centered to avoid appearing at top-left
    if (coreTriggerRef.current) {
      gsap.set(coreTriggerRef.current, {
        x: Math.round(window.innerWidth / 2),
        y: Math.round(window.innerHeight / 2),
        overwrite: true
      });
      // hint for smoother transform updates
      coreTriggerRef.current.style.willChange = 'transform';
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (spinTweenRef.current) {
        spinTweenRef.current.kill();
      }
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideDefaultCursor) {
        document.body.style.cursor = '';
      }
    };
  }, [spinDuration, hideDefaultCursor]);

  useEffect(() => {
    const corners = spinnerRef.current?.querySelectorAll<HTMLElement>('.target-corner');
    if (!corners || corners.length !== 4) return;

    const offsetX = dimensions.isHovered ? dimensions.width / 2 : 12;
    const offsetY = dimensions.isHovered ? dimensions.height / 2 : 12;
    const duration = dimensions.isHovered ? 0.3 : 0.2;
    const ease = dimensions.isHovered ? 'back.out(1.3)' : 'power2.out';

    const cornerCoordinates = [
      { x: -offsetX, y: -offsetY },
      { x: offsetX, y: -offsetY },
      { x: -offsetX, y: offsetY },
      { x: offsetX, y: offsetY }
    ];

    corners.forEach((corner, index) => {
      const { x, y } = cornerCoordinates[index];
      gsap.to(corner, {
        x,
        y,
        duration,
        ease,
        overwrite: 'auto'
      });
    });
  }, [dimensions]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          zIndex: 99999,
          pointerEvents: 'none',
          willChange: 'transform'
        }}
        aria-hidden="true"
      >
        <div
          ref={spinnerRef}
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            pointerEvents: 'none',
            transformOrigin: '0px 0px'
          }}
        >
        <div
          className="target-corner"
          style={{
            position: 'absolute',
            width: 12,
            height: 12,
            borderLeft: `3px solid ${cursorColor}`,
            borderTop: `3px solid ${cursorColor}`,
            transform: 'translate(-100%, -100%)',
            pointerEvents: 'none'
          }}
        />

        <div
          className="target-corner"
          style={{
            position: 'absolute',
            width: 12,
            height: 12,
            borderRight: `3px solid ${cursorColor}`,
            borderTop: `3px solid ${cursorColor}`,
            transform: 'translate(0%, -100%)',
            pointerEvents: 'none'
          }}
        />

        <div
          className="target-corner"
          style={{
            position: 'absolute',
            width: 12,
            height: 12,
            borderLeft: `3px solid ${cursorColor}`,
            borderBottom: `3px solid ${cursorColor}`,
            transform: 'translate(-100%, 0%)',
            pointerEvents: 'none'
          }}
        />

        <div
          className="target-corner"
          style={{
            position: 'absolute',
            width: 12,
            height: 12,
            borderRight: `3px solid ${cursorColor}`,
            borderBottom: `3px solid ${cursorColor}`,
            transform: 'translate(0%, 0%)',
            pointerEvents: 'none'
          }}
        />
        </div>
      </div>

      <div
        ref={coreTriggerRef}
        style={{
          position: 'fixed',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: cursorColor,
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          boxShadow: `0 0 10px ${cursorColor}`,
          zIndex: 100000
        }}
      />
    </>
  );
};

export default TargetCursor;
