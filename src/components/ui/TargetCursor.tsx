// src/components/ui/TargetCursor.tsx
import React, { useEffect, useRef, useState } from 'react';
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
  spinDuration = 1.8,
  hideDefaultCursor = true,
  cursorColor = '#00ff88',
  cursorColorOnTarget = '#ff00aa'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    isHovered: false
  });
  const hoveredTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (hideDefaultCursor) document.body.style.cursor = 'none';

    const enterTarget = (match: HTMLElement) => {
      if (hoveredTargetRef.current === match) return;
      hoveredTargetRef.current = match;

      const rect = match.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        isHovered: true
      });

      if (spinTweenRef.current) {
        spinTweenRef.current.pause();
        gsap.to(spinnerRef.current, {
          rotation: 0,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const leaveTarget = () => {
      hoveredTargetRef.current = null;
      setDimensions({ width: 0, height: 0, x: 0, y: 0, isHovered: false });
      if (spinTweenRef.current) spinTweenRef.current.play();
    };

    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const currentTarget = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      const match = currentTarget?.closest(targetSelector) as HTMLElement | null;

      if (match) {
        enterTarget(match);
      } else if (hoveredTargetRef.current) {
        leaveTarget();
      }

      // If not hovering a target, move the container to the mouse
      if (!hoveredTargetRef.current && containerRef.current) {
        gsap.to(containerRef.current, {
          x: mouseX,
          y: mouseY,
          duration: 0.06,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    };

    if (spinTweenRef.current) spinTweenRef.current.kill();
    if (spinnerRef.current) {
      spinTweenRef.current = gsap.to(spinnerRef.current, {
        rotation: '+=360',
        duration: spinDuration,
        repeat: -1,
        ease: 'none'
      });
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (spinTweenRef.current) spinTweenRef.current.kill();
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideDefaultCursor) document.body.style.cursor = '';
    };
  }, [spinDuration, hideDefaultCursor, targetSelector]);

  useEffect(() => {
    const corners = spinnerRef.current?.querySelectorAll<HTMLElement>('.target-corner');
    if (!corners || corners.length !== 4) return;

    // corner offset from center; add a small padding so corners sit outside element bounds
    const pad = 10;
    const offsetX = dimensions.isHovered ? dimensions.width / 2 + pad : 12;
    const offsetY = dimensions.isHovered ? dimensions.height / 2 + pad : 12;
    const duration = dimensions.isHovered ? 0.28 : 0.18;
    const ease = dimensions.isHovered ? 'back.out(1.3)' : 'power2.out';

    const coords = [
      { x: -offsetX, y: -offsetY }, // top-left
      { x: offsetX, y: -offsetY },  // top-right
      { x: -offsetX, y: offsetY },  // bottom-left
      { x: offsetX, y: offsetY }    // bottom-right
    ];

    corners.forEach((corner, i) => {
      const { x, y } = coords[i];
      gsap.to(corner, { x, y, duration, ease, overwrite: 'auto' });
    });

    // Move the whole container to the hovered element center
    if (containerRef.current) {
      const targetX = dimensions.isHovered ? dimensions.x : undefined;
      const targetY = dimensions.isHovered ? dimensions.y : undefined;

      if (dimensions.isHovered) {
        gsap.to(containerRef.current, {
          x: targetX,
          y: targetY,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        // when leaving, keep container following mouse (no abrupt jump)
        // nothing extra needed here because mousemove handler will take over
      }
    }
  }, [dimensions]);

  return (
    <>
      {/* container is fixed and moved to mouse/target center; children are positioned relative to container origin */}
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
        {/* spinnerRef holds the four corners; set transformOrigin to center so offsets are symmetric */}
        <div
          ref={spinnerRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            pointerEvents: 'none',
            transformOrigin: '50% 50%',
            willChange: 'transform'
          }}
        >
          {/* Each corner is centered at the container origin initially (translate -50% -50%) */}
          <div
            className="target-corner"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 12,
              height: 12,
              borderLeft: `3px solid ${cursorColor}`,
              borderTop: `3px solid ${cursorColor}`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
          <div
            className="target-corner"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 12,
              height: 12,
              borderRight: `3px solid ${cursorColor}`,
              borderTop: `3px solid ${cursorColor}`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
          <div
            className="target-corner"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 12,
              height: 12,
              borderLeft: `3px solid ${cursorColor}`,
              borderBottom: `3px solid ${cursorColor}`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
          <div
            className="target-corner"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 12,
              height: 12,
              borderRight: `3px solid ${cursorColor}`,
              borderBottom: `3px solid ${cursorColor}`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* core dot is now a child of the same container so it shares the same origin and transforms */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: dimensions.isHovered ? cursorColorOnTarget : cursorColor,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            boxShadow: `0 0 10px ${dimensions.isHovered ? cursorColorOnTarget : cursorColor}`,
            zIndex: 100000
          }}
        />
      </div>
    </>
  );
};

export default TargetCursor;
