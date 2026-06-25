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
    type: 'line' | 'dot' | 'target'; // Supported variants
    color: string;
    glow: string;
    trail: boolean;
  };
  motionSpeed: number;
  ease: string;
}
