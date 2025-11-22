// context/ThemeProvider.tsx
import { darkTheme, lightTheme, Theme } from "@/utils/theme";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Appearance } from "react-native";

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(
    colorScheme === "dark" ? darkTheme : lightTheme
  );

  // Suscribirse a cambios del sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    });
    return () => subscription.remove();
  }, []);

  // Función opcional para toggle manual
  const toggleTheme = () => {
    setTheme((prev) => (prev === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
