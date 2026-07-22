// src/components/ui/Tabs.tsx
import React, { useEffect, useRef } from 'react';

type TabsProps = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  className?: string;
  pillClass?: string;
};

export default function Tabs({
  tabs,
  active,
  onChange,
  className = '',
  pillClass = ''
}: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    tabs.forEach(t => {
      if (!refs.current[t]) refs.current[t] = null;
    });
  }, [tabs]);

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const key = e.key;
    if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'Home' || key === 'End') {
      e.preventDefault();
      let nextIdx = idx;
      if (key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
      if (key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
      if (key === 'Home') nextIdx = 0;
      if (key === 'End') nextIdx = tabs.length - 1;
      const next = tabs[nextIdx];
      refs.current[next]?.focus();
      onChange(next);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Gallery categories"
      className={`flex gap-3 overflow-x-auto no-scrollbar py-2 ${className}`}
    >
      {tabs.map((t, i) => {
        const isActive = t === active;
        return (
          // cursor-target wrapper: used by the global cursor controller
          <div key={t} className="cursor-target inline-block">
            <button
              ref={el => (refs.current[t] = el)}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(t)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isActive ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'} ${pillClass}`}
            >
              {t}
            </button>
          </div>
        );
      })}
    </div>
  );
}
