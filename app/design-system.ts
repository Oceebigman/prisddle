// PRISDDLE PREMIUM GAME UI DESIGN SYSTEM

export const colors = {
  // Primary gradient backgrounds
  primary: {
    start: '#7C3AED', // Deep purple
    end: '#EC4899',   // Hot pink
  },
  secondary: {
    start: '#0EA5E9', // Sky blue
    end: '#06B6D4',   // Cyan
  },
  accent: '#FFD700',  // Gold
  
  // UI colors
  dark: '#0F172A',    // Darkest background
  surface: '#1E293B', // Card surface
  border: '#334155',  // Subtle borders
  
  // Game states
  success: '#10B981',  // Emerald green
  error: '#EF4444',    // Red
  warning: '#F59E0B',  // Amber
  
  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#CBD5E1',
    tertiary: '#94A3B8',
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
  md: '0 4px 16px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.6)',
  glow: '0 0 20px rgba(124, 58, 237, 0.4)',
  'glow-pink': '0 0 20px rgba(236, 72, 153, 0.4)',
};

export const borderRadius = {
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  full: '9999px',
};

export const typography = {
  // Headings
  h1: {
    size: 'clamp(1.75rem, 5vw, 3rem)',
    weight: '800',
    lineHeight: '1.2',
  },
  h2: {
    size: 'clamp(1.5rem, 4vw, 2.25rem)',
    weight: '700',
    lineHeight: '1.3',
  },
  h3: {
    size: 'clamp(1.25rem, 3vw, 1.875rem)',
    weight: '700',
    lineHeight: '1.4',
  },
  // Body
  body: {
    size: 'clamp(0.875rem, 2vw, 1rem)',
    weight: '500',
    lineHeight: '1.6',
  },
  small: {
    size: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    weight: '500',
    lineHeight: '1.5',
  },
};
