export type DimensionType = 'cosmic' | 'creamy' | 'arctic';

export interface ThemePack {
  id: DimensionType;
  name: string;
  tagline: string;
  bgClass: string;
  textClass: string;
  accentClass: string;
  cardClass: string;
  fontClass: string;
  cursor: {
    type: 'line' | 'target' | 'snowflake';
    color: string;
    glow: string;
    trail: boolean;
  };
  motionSpeed: number;
  ease: string;
  textPrimary: string;
  textSecondary: string;

  // Centralized theme variables (used by App.tsx inline styles)
  accent: string;
  accentBg: string;
  accentBorder: string;
}


