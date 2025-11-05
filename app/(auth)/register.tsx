import ThemeToggleButton from "@/components/ThemeToggleButton";
import { ThemeContext } from "@/context/ThemeProvider";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);

  if (!themeContext) return null;

  const { theme } = themeContext;

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
          backgroundColor: theme.orange,
          marginBottom: 20,
        }}
        onPress={() => router.push("/login")}
      >
        <Text style={{ color: theme.text, fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>

      {/* Botón opcional para toggle manual */}
      <ThemeToggleButton></ThemeToggleButton>
    </View>
  );
}
