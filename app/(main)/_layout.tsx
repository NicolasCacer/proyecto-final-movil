import { ThemeContext } from "@/context/ThemeProvider";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
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
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: { 
          backgroundColor: '#2a2a2a',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        title: "",
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="chat" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="robot-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="scanner" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="home" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="training" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}