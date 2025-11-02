import { ThemeContext } from "@/context/ThemeProvider";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa toda la pantalla
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
