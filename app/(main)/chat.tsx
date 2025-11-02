import { ThemeContext } from "@/context/ThemeProvider";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Chat() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>Chat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa toda la pantalla
    justifyContent: "center", // centra verticalmente
    alignItems: "center", // centra horizontalmente
    padding: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
