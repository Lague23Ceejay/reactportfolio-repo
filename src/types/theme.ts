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
  // SENIOR DEV TYPE OVERRIDES: Clear the 'does not exist on type ThemePack' error
  textPrimary: string;
  textSecondary: string;
}
