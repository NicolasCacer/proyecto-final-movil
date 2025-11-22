// RootLayout.tsx
import { ThemeContext, ThemeProvider } from "@/context/ThemeProvider";
import { Stack } from "expo-router";
import { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedStack() {
  const themeContext = useContext(ThemeContext);

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
