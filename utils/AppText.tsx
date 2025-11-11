import { ThemeContext } from "@/context/ThemeProvider";
import React, { useContext } from "react";
import { StyleSheet, Text, TextProps } from "react-native";

export default function AppText({ style, children, ...props }: TextProps) {
  const themeContext = useContext(ThemeContext);
  const color = themeContext?.theme.text || "#000"; // color según el tema actual

  return (
    <Text style={[styles.text, { color }, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Onest", // tu fuente global
    fontSize: 16, // tamaño base
  },
});
