import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/settings';
import themeData from '../data/themes.json';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: {
      start: string;
      end: string;
    };
    card: string;
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
  wallpaper: string;
}

export function useTheme() {
  const { themeId, setThemeId } = useSettingsStore();
  const [themes] = useState<Theme[]>(themeData.themes);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const theme = themes.find(t => t.id === themeId) || themes[0];
    setCurrentTheme(theme);
    
    // Apply theme to document
    document.documentElement.style.setProperty('--color-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary);
    document.documentElement.style.setProperty('--color-bg-start', theme.colors.background.start);
    document.documentElement.style.setProperty('--color-bg-end', theme.colors.background.end);
    document.documentElement.style.setProperty('--color-card', theme.colors.card);
    document.documentElement.style.setProperty('--color-text-1', theme.colors.text.primary);
    document.documentElement.style.setProperty('--color-text-2', theme.colors.text.secondary);
    document.documentElement.style.setProperty('--color-text-3', theme.colors.text.tertiary);
    
    // Apply background gradient
    document.body.style.background = `linear-gradient(to bottom right, ${theme.colors.background.start}, ${theme.colors.background.end})`;
  }, [themeId, themes]);

  const setTheme = (id: string) => {
    setThemeId(id);
  };

  return { themes, currentTheme, setTheme };
}