// src/components/ui/CardSwapDeck.tsx

import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import type { ReactElement, ReactNode, RefObject } from 'react';
import { SpotlightCard } from './SpotlightCard';
import { useThemeStore } from '../../store/themeStore'; // 🚀 LIGHTWEIGHT INJECTION: Simple theme hook check
import gsap from 'gsap';

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

/* ==========================================================================
   🔄 FULLY REVERTED & RESTORED: BASE CARD LAYOUT PRIMITIVE
   ========================================================================== */
export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, children, ...rest }, ref) => {
  const { currentDimension } = useThemeStore();

  // Simple adaptive container class toggle that leaves layout properties untouched
  const cardThemeBg = currentDimension === 'creamy'
    ? 'bg-white border-stone-200 text-stone-900'
    : 'bg-zinc-950/95 border-zinc-800/60 text-zinc-100';

  return (
    <div
      ref={ref}
      {...rest}
      // 🔄 RESTORED: Your exact original positioning framework classes are completely preserved here
      className={`absolute top-1/2 left-1/2 transform-3d will-change-transform backface-hidden ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
    >
      {/* 🚀 THE GENTLE FIX: Only toggling colors via template string without disturbing any size metrics */}
      <SpotlightCard className={`p-6 flex flex-col items-center justify-between text-center select-none w-full h-full border shadow-2xl ${cardThemeBg}`}>
        <div className="flex flex-col items-center justify-center w-full flex-1 gap-2">
          {children}
        </div>
      </SpotlightCard>
    </div>
  );
});
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

/* ==========================================================================
   🔄 FULLY RESTORED: ORIGINAL HARDWARE OFFSET PARAMETERS
   ========================================================================== */
const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    // 🔄 RESTORED: Re-appended your exact original centering percentage shifts
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

export const renderIconSVG = (code: string) => {
  const clean = (code || '').toLowerCase().trim();
  const iconClass = "text-4xl block mx-auto transition-transform duration-300 hover:scale-105";
  
  if (clean === 'react') return <div className="w-full flex items-center justify-center mt-2"><SiReact className={`${iconClass} text-[#61DAFB]`} /></div>;
  if (clean === 'ts' || clean === 'typescript') return <div className="w-full flex items-center justify-center mt-2"><SiTypescript className={`${iconClass} text-[#3178C6] rounded-md`} /></div>;
  if (clean === 'tailwind' || clean === 'tailwindcss') return <div className="w-full flex items-center justify-center mt-2"><SiTailwindcss className={`${iconClass} text-[#06B6D4]`} /></div>;
  if (clean === 'js' || clean === 'javascript') return <div className="w-full flex items-center justify-center mt-2"><SiJavascript className={`${iconClass} text-[#F7DF1E] rounded-sm`} /></div>;
  if (clean === 'node' || clean === 'nodejs') return <div className="w-full flex items-center justify-center mt-2"><SiNodedotjs className={`${iconClass} text-[#339933]`} /></div>;
  if (clean === 'html' || clean === 'html5') return <div className="w-full flex items-center justify-center mt-2"><SiHtml5 className={`${iconClass} text-[#E34F26]`} /></div>;
  if (clean === 'css' || clean === 'css3') return <div className="w-full flex items-center justify-center mt-2"><SiCss className={`${iconClass} text-[#1572B6]`} /></div>;
  if (clean === 'git') return <div className="w-full flex items-center justify-center mt-2"><SiGit className={`${iconClass} text-[#F05032]`} /></div>;

  return (
    <div className="w-full flex items-center justify-center mt-2">
      <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded font-mono font-bold flex items-center justify-center text-[11px] select-none uppercase">
        {clean.substring(0, 4)}
      </div>
    </div>
  );
};
/* ==========================================================================
   🔄 FULLY RESTORED: ORIGINAL MOVEMENT ENGINE & CRUISE CONTROL CONFIGS
   ========================================================================== */
export const CardSwap: React.FC<CardSwapProps> = ({
  width = 242,
  height = 286,
  cardDistance = 15,
  verticalDistance = 15,
  // 🔄 RESTORED: Reverted fallback interval delay back to your original 3.5 seconds
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
          // 🔄 RESTORED: Reverted your precise native GSAP spring velocity curves
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

      // 🔄 RESTORED: Reverted your exact original horizontal drop animation
      tl.to(elFront, {
        x: '+=400',
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
