import { ThemeContext } from "@/context/ThemeProvider";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;

  const { theme, toggleTheme } = themeContext;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <TouchableOpacity
        style={{
          padding: 14,
          borderRadius: 10,
          backgroundColor: theme.red,
          marginBottom: 20,
        }}
        onPress={() => router.push("/home")}
      >
        <Text style={{ color: theme.text, fontWeight: "bold" }}>
          Iniciar Sesión
        </Text>
      </TouchableOpacity>

      {/* Botón opcional para toggle manual */}
      <TouchableOpacity style={{ padding: 10 }} onPress={toggleTheme}>
        <Text style={{ color: theme.text }}>Cambiar modo</Text>
      </TouchableOpacity>
    </View>
  );
}
