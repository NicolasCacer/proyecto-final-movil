import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface FullScreenLoaderProps {
  visible: boolean;
  color?: string;
  size?: "small" | "large";
  background?: string;
}

export default function FullScreenLoader({
  visible,
  color = "#fff",
  size = "large",
  background = "rgba(0,0,0,0.9)",
}: FullScreenLoaderProps) {
  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: background }]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});
