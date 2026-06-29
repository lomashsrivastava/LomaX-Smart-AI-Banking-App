import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  displayLarge: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  displayMedium: { fontSize: 28, fontWeight: '700', letterSpacing: -0.3 },
  h1: { fontSize: 24, fontWeight: '700', letterSpacing: -0.2 },
  h2: { fontSize: 20, fontWeight: '700' },
  h3: { fontSize: 18, fontWeight: '600' },
  h4: { fontSize: 16, fontWeight: '600' },
  bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  bodySmall: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.8 },
  caption: { fontSize: 11, fontWeight: '400' },
  mono: { fontSize: 14, fontFamily: 'monospace', letterSpacing: 0.5 },
  monoSmall: { fontSize: 12, fontFamily: 'monospace' },
};
