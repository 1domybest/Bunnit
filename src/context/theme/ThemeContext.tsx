// ThemeContext.tsx
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as SCThemeProvider } from 'styled-components/native';
import { LightColors, DarkColors, ThemeColors } from './colors';

type ThemeContextType = { isDark: boolean; colors: ThemeColors };
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = isDark ? DarkColors : LightColors;

    return (
        <ThemeContext.Provider value={{ isDark, colors }}>
            <SCThemeProvider theme={colors}>{children}</SCThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};