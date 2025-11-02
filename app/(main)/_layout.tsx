import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="scanner" />
      <Tabs.Screen name="training" />
    </Tabs>
  );
}
