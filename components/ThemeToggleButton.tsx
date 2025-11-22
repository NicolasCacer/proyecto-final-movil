// components/ThemeToggleButton.tsx
import { ThemeContext } from "@/context/ThemeProvider";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ThemeToggleButton() {
  const themeContext = useContext(ThemeContext);

  const { theme, toggleTheme } = themeContext;

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: theme.text }]}
      onPress={toggleTheme}
    >
      <Text style={[styles.text, { color: theme.text }]}>Cambiar modo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
