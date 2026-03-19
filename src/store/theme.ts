import { create } from 'zustand';
import { lightColors, darkColors } from '../theme/colors';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof lightColors;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useTheme = create<ThemeState>((set) => ({
  mode: 'light',
  colors: lightColors,
  toggle: () =>
    set((s) => {
      const next = s.mode === 'light' ? 'dark' : 'light';
      return { mode: next, colors: next === 'dark' ? darkColors : lightColors };
    }),
  setMode: (mode) =>
    set({ mode, colors: mode === 'dark' ? darkColors : lightColors }),
}));
