import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import { SpotlightCard } from './SpotlightCard';
import gsap from 'gsap';

// FIX: Swapped SiCss3 over to the correct SiCss3 export member token
import { 
  SiReact, 
  SiTypescript, 
  SiTailwindcss, 
  SiJavascript, 
  SiNodedotjs, 
  SiHtml5, 
  SiCss,
  SiGit
} from 'react-icons/si';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

// FIX: Implemented transform-3d, will-change-transform, and backface-hidden shorthands
export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, children, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 transform-3d will-change-transform backface-hidden ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  >
    <SpotlightCard className="p-6 flex flex-col items-center justify-center gap-4 text-center select-none w-full h-full bg-zinc-950/95 border border-zinc-800/60 shadow-2xl">
      {children}
    </SpotlightCard>
  </div>
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

// Automated lookup map translates your admin input keywords directly to accurate brand vector components
export const renderIconSVG = (code: string) => {
  const clean = (code || '').toLowerCase().trim();
  
  if (clean === 'react') return <SiReact className="text-3xl text-[#61DAFB]" />;
  if (clean === 'ts' || clean === 'typescript') return <SiTypescript className="text-3xl text-[#3178C6] rounded-md" />;
  if (clean === 'tailwind' || clean === 'tailwindcss') return <SiTailwindcss className="text-3xl text-[#06B6D4]" />;
  if (clean === 'js' || clean === 'javascript') return <SiJavascript className="text-3xl text-[#F7DF1E] rounded-sm" />;
  if (clean === 'node' || clean === 'nodejs') return <SiNodedotjs className="text-3xl text-[#339933]" />;
  if (clean === 'html' || clean === 'html5') return <SiHtml5 className="text-3xl text-[#E34F26]" />;
  if (clean === 'css' || clean === 'css3') return <SiCss className="text-3xl text-[#1572B6]" />;
  if (clean === 'git') return <SiGit className="text-3xl text-[#F05032]" />;

  return (
    <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded font-mono font-bold flex items-center justify-center text-[10px] select-none uppercase">
      {clean.substring(0, 4)}
    </div>
  );
};

export const CardSwap: React.FC<CardSwapProps> = ({
  width = 220,
  height = 260,
  cardDistance = 15,
  verticalDistance = 15,
  delay = 3500,
  pauseOnHover = true,
  onCardClick,
  skewAmount = -4,
  easing = 'elastic',
  children
}) => {
  const config = useMemo(() => 
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 1.2,
          durMove: 0.8,
          durReturn: 1.2,
          promoteOverlap: 0.8,
          returnDelay: 0.1
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.6,
          durMove: 0.5,
          durReturn: 0.6,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        }, [easing]);

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);
  const order = useRef<number[]>([]);

  useEffect(() => {
    order.current = Array.from({ length: childArr.length }, (_, i) => i);
  }, [childArr.length]);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refs.length === 0) return;
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=400',
        opacity: 0,
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.1}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          opacity: 1,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      if (node) {
        const pause = () => {
          tlRef.current?.pause();
          clearInterval(intervalRef.current);
        };
        const resume = () => {
          tlRef.current?.play();
          intervalRef.current = window.setInterval(swap, delay);
        };
        node.addEventListener('mouseenter', pause);
        node.addEventListener('mouseleave', resume);
        return () => {
          node.removeEventListener('mouseenter', pause);
          node.removeEventListener('mouseleave', resume);
          clearInterval(intervalRef.current);
        };
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, config, refs]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div ref={container} className="relative overflow-visible" style={{ width, height }}>
      {rendered}
    </div>
  );
};
