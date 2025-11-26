'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  glow: string;
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colorPreset: ColorPreset;
  setColorPreset: (preset: ColorPreset) => void;
  presets: ColorPreset[];
  primaryRgb: { r: number; g: number; b: number };
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'portfolio-theme';
const COLOR_STORAGE_KEY = 'portfolio-color-preset';

export const colorPresets: ColorPreset[] = [
  {
    id: 'violet',
    name: 'Violet',
    primary: '263 70% 65%',
    secondary: '200 70% 55%',
    glow: '263 70% 65%',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    primary: '180 70% 50%',
    secondary: '220 70% 60%',
    glow: '180 70% 50%',
  },
  {
    id: 'rose',
    name: 'Rose',
    primary: '340 75% 60%',
    secondary: '280 70% 60%',
    glow: '340 75% 60%',
  },
  {
    id: 'amber',
    name: 'Amber',
    primary: '38 92% 50%',
    secondary: '20 90% 55%',
    glow: '38 92% 50%',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primary: '160 84% 39%',
    secondary: '180 70% 45%',
    glow: '160 84% 39%',
  },
  {
    id: 'blue',
    name: 'Blue',
    primary: '217 91% 60%',
    secondary: '250 80% 65%',
    glow: '217 91% 60%',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    primary: '0 72% 51%',
    secondary: '340 80% 55%',
    glow: '0 72% 51%',
  },
  {
    id: 'gold',
    name: 'Gold',
    primary: '45 93% 47%',
    secondary: '30 90% 50%',
    glow: '45 93% 47%',
  },
];

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function parseHSL(hslString: string): { h: number; s: number; l: number } {
  const parts = hslString.split(' ').map(v => parseFloat(v));
  return { h: parts[0] || 0, s: parts[1] || 0, l: parts[2] || 0 };
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

function applyColorPreset(preset: ColorPreset) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--primary', preset.primary);
  root.style.setProperty('--secondary', preset.secondary);
  root.style.setProperty('--accent', preset.primary);
  root.style.setProperty('--glow', preset.glow);
  root.style.setProperty('--ring', preset.primary);

  root.style.setProperty('--primary-soft', `${preset.primary.split(' ').slice(0, 2).join(' ')} ${parseFloat(preset.primary.split(' ')[2]) * 0.15}%`);
  root.style.setProperty('--accent-soft', `${preset.primary.split(' ').slice(0, 2).join(' ')} ${parseFloat(preset.primary.split(' ')[2]) * 0.2}%`);
  root.style.setProperty('--glow-soft', `${preset.glow.split(' ').slice(0, 2).join(' ')} ${parseFloat(preset.glow.split(' ')[2]) * 0.3}%`);

  root.setAttribute('data-color-preset', preset.id);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [colorPreset, setColorPresetState] = useState<ColorPreset>(colorPresets[0]);

  const primaryRgb = useMemo(() => {
    const { h, s, l } = parseHSL(colorPreset.primary);
    return hslToRgb(h, s, l);
  }, [colorPreset]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      applyTheme(storedTheme);
      setThemeState(storedTheme);
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      const initial: Theme = prefersDark ? 'dark' : 'light';
      applyTheme(initial);
      setThemeState(initial);
    }

    const storedPresetId = window.localStorage.getItem(COLOR_STORAGE_KEY);
    if (storedPresetId) {
      const preset = colorPresets.find(p => p.id === storedPresetId);
      if (preset) {
        applyColorPreset(preset);
        setColorPresetState(preset);
      }
    } else {
      applyColorPreset(colorPresets[0]);
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    if (typeof window !== 'undefined') {
      applyTheme(next);
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        applyTheme(next);
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  const setColorPreset = useCallback((preset: ColorPreset) => {
    setColorPresetState(preset);
    if (typeof window !== 'undefined') {
      applyColorPreset(preset);
      window.localStorage.setItem(COLOR_STORAGE_KEY, preset.id);
    }
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      colorPreset,
      setColorPreset,
      presets: colorPresets,
      primaryRgb,
    }),
    [theme, setTheme, toggleTheme, colorPreset, setColorPreset, primaryRgb]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}