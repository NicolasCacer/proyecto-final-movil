import { ThemeContext } from "@/context/ThemeProvider";
import { Tabs } from "expo-router";
import { useContext } from "react";

export default function RootLayout() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        tabBarActiveTintColor: theme.orange,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: { backgroundColor: theme.background },
        tabBarShowLabel: false,
        title: "",
        headerShown: false,
      }}
    >
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="scanner" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="training" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
