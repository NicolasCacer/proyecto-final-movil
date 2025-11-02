import { ThemeContext } from "@/context/ThemeProvider";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Training() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>Training</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
