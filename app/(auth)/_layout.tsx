// RootLayout.tsx
import { ThemeContext, ThemeProvider } from "@/context/ThemeProvider";
import { Stack } from "expo-router";
import { useContext } from "react";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStack />
    </ThemeProvider>
  );
}

function ThemedStack() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        contentStyle: { backgroundColor: theme.background },
        headerShown: false,
      }}
    />
  );
}
