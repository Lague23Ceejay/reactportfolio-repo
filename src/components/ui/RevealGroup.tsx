// src/components/ui/RevealGroup.tsx
import React, { Children, isValidElement, cloneElement } from 'react';
import { ScrollReveal } from './ScrollReveal';

interface RevealGroupProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  baseDelay?: number; // seconds
  step?: number; // seconds between children
  className?: string;
}

export function RevealGroup({
  children,
  direction = 'up',
  baseDelay = 0,
  step = 0.06,
  className
}: RevealGroupProps) {
  const items = Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, i) => {
        if (!isValidElement(child)) return child;
        return (
          <ScrollReveal
            key={(child as any).key ?? i}
            direction={direction}
            delay={baseDelay + i * step}
          >
            {cloneElement(child as any)}
          </ScrollReveal>
        );
      })}
    </div>
  );
}
