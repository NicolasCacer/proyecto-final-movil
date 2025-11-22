import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ThemeContext, ThemeProvider } from "@/context/ThemeProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useContext } from "react";

export default function RootLayout() {
  // Cargar la fuente Onest
  const [fontsLoaded] = useFonts({
    Onest: require("../utils/Onest-VariableFont_wght.ttf"),
  });

  // Esperar hasta que la fuente esté lista
  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <ThemedStack />
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  );
}

// === Componente que accede al tema ===
function ThemedStack() {
  const themeContext = useContext(ThemeContext);

  const { theme } = themeContext;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}
