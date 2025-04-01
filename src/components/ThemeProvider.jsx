'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create context
const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

// Create Apple-style light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0071e3', // Apple blue
      light: '#2997ff',
      dark: '#0058b8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#34c759', // Apple green
      dark: '#28a946',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff3b30', // Apple red
      dark: '#d70015',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"SF Pro Display"',
      '"SF Pro Text"',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
  },
});

// Create Apple-style dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2997ff', // Apple blue (light)
      light: '#64b5f6',
      dark: '#0071e3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#34c759', // Apple green
      dark: '#28a946',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff453a', // Apple red (light)
    },
    background: {
      default: '#1f2937',
      paper: '#111827',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"SF Pro Display"',
      '"SF Pro Text"',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #374151',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
  },
});

export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  
  // Check system preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    
    // Add listener for theme changes
    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  const theme = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
} 