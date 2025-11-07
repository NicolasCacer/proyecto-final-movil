import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Svg from "react-native-svg";

interface CustomInputProps {
  placeholder: string;
  value: string | number;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  iconLeft?: string;
  iconRight?: string;
  onRightPress?: () => void;
  color?: string;
  borderColor?: string;
  placeholderTextColor?: string;
  width?: string | number;
  style?: object;
}

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  iconLeft,
  iconRight,
  onRightPress,
  color = "#fff",
  borderColor = "#888",
  placeholderTextColor = "#888",
  width = "90%",
  style,
}: CustomInputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={[styles.container, { borderColor }, { width }, style]}>
      {/* SVG de borde */}
      <Svg
        width="100%"
        height="50"
        style={styles.svg}
        viewBox="0 0 300 50"
        preserveAspectRatio="none"
      ></Svg>

      <View style={styles.innerContainer}>
        {/* Icono izquierdo */}
        {iconLeft && (
          <Ionicons
            name={iconLeft as any}
            size={20}
            color={borderColor}
            style={styles.iconLeft}
          />
        )}

        {/* Input */}
        <TextInput
          style={[
            styles.input,
            { color },
            iconLeft && { paddingLeft: 8 },
            iconRight && { paddingRight: 8 },
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value !== undefined && value !== null ? String(value) : ""}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
        />

        {/* Icono derecho */}
        {iconRight && (
          <TouchableOpacity
            onPress={
              onRightPress ||
              (secureTextEntry ? () => setIsSecure(!isSecure) : undefined)
            }
            style={styles.iconRightTouchable}
            activeOpacity={0.7}
          >
            <Ionicons name={iconRight as any} size={20} color={borderColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    height: 50, // ajustado a la altura del SVG
    borderWidth: 1,
    borderRadius: 10,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRightTouchable: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
