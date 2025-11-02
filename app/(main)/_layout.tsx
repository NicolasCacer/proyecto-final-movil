import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="scanner" />
      <Stack.Screen name="training" />
    </Stack>
  );
}
