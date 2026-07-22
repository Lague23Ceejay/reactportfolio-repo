// src/components/ui/ScrollReveal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number; // seconds
  duration?: number; // seconds
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
  motionProps?: Partial<MotionProps>;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  rootMargin = '-100px',
  once = true,
  className,
  style,
  motionProps = {}
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once && entry.target) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [prefersReducedMotion, threshold, rootMargin, once]);

  const offset = 30;
  const initialTransform =
    direction === 'left'
      ? { opacity: 0, x: -offset }
      : direction === 'right'
      ? { opacity: 0, x: offset }
      : direction === 'down'
      ? { opacity: 0, y: offset }
      : direction === 'up'
      ? { opacity: 0, y: -offset }
      : { opacity: 0 };

  const animateTo = prefersReducedMotion ? { opacity: 1, x: 0, y: 0 } : { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      ref={ref}
      initial={initialTransform}
      animate={inView ? animateTo : initialTransform}
      transition={{
        duration,
        delay,
        ease: [0.21, 1.02, 0.43, 1.01],
        ...motionProps.transition
      }}
      className={className}
      style={style}
      {...motionProps}
      aria-hidden={!inView && !prefersReducedMotion ? true : undefined}
    >
      {children}
    </motion.div>
  );
}
