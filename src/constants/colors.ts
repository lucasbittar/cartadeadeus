export const colors = {
  background: '#0D0D0F',
  foreground: '#F0ECE8',
  burgundy: {
    DEFAULT: '#8B1538',
    50: '#F9E8EC',
    100: '#F2D1D9',
    200: '#E5A3B3',
    300: '#D8758D',
    400: '#CB4767',
    500: '#8B1538',
    600: '#6F112D',
    700: '#530D22',
    800: '#380816',
    900: '#1C040B',
  },
  cream: '#1A1A1E',
} as const;

export const threeColors = {
  burgundy: 0x8b1538,
  burgundyGlow: 0xcb4767,
  background: 0xffffff,
  // Bright mint-white globe theme
  globe: 0xe8f0ed,           // Soft mint-white for main globe
  globeInner: 0xf5faf8,      // Lighter inner glow
  globeAtmosphere: 0x8b1538, // Burgundy atmosphere glow
  globeGrid: 0xd0e0da,       // Subtle mint grid lines
  globeHighlight: 0xffffff,  // Pure white highlights
} as const;
