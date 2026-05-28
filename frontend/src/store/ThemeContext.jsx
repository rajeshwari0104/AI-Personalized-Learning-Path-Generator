import { createContext, useContext, useState, useEffect } from 'react';

export const themes = {
  purple: {
    name: '💜 Purple Dream',
    primary: '#6c63ff',
    secondary: '#764ba2',
    gradient: 'linear-gradient(135deg, #6c63ff 0%, #764ba2 100%)',
    heroGradient: 'linear-gradient(135deg, #6c63ff 0%, #764ba2 100%)',
    loginGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    registerGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)',
    accent: '#ede9fe',
    accentText: '#6c63ff',
    bg: '#f8f7ff',
  },
  ocean: {
    name: '🌊 Ocean Blue',
    primary: '#0ea5e9',
    secondary: '#0284c7',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    heroGradient: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    loginGradient: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    registerGradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0369a1 100%)',
    accent: '#e0f2fe',
    accentText: '#0284c7',
    bg: '#f0f9ff',
  },
  sunset: {
    name: '🌅 Sunset',
    primary: '#f97316',
    secondary: '#ef4444',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    heroGradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    loginGradient: 'linear-gradient(135deg, #fda085 0%, #f5576c 100%)',
    registerGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #f5576c 100%)',
    accent: '#fff7ed',
    accentText: '#f97316',
    bg: '#fff8f5',
  },
  forest: {
    name: '🌿 Forest',
    primary: '#10b981',
    secondary: '#059669',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    heroGradient: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
    loginGradient: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
    registerGradient: 'linear-gradient(135deg, #a7f3d0 0%, #10b981 50%, #065f46 100%)',
    accent: '#d1fae5',
    accentText: '#059669',
    bg: '#f0fdf4',
  },
  dark: {
    name: '🌙 Dark Mode',
    primary: '#a78bfa',
    secondary: '#7c3aed',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    heroGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    loginGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    registerGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    accent: '#2e1065',
    accentText: '#a78bfa',
    bg: '#0f0e17',
    dark: true,
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => localStorage.getItem('learnpath_theme') || 'purple');
  const theme = themes[themeName];

  const setTheme = (name) => {
    setThemeName(name);
    localStorage.setItem('learnpath_theme', name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
