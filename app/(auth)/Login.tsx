import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  return (
    <View>
      <TouchableOpacity onPress={() => router.push("/home")}>
        <Text style={styles.loginButton}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "#FF7E33",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
});
