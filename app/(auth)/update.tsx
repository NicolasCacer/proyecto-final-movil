import CustomInput from "@/components/customInput";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpdatePassword() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!themeContext) return null;
  const { theme } = themeContext;

  const handleSave = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Por favor completa ambos campos");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    console.log("Nueva contraseña:", newPassword);
    // Aquí podrías llamar a tu API de actualización de contraseña
    router.push("/login");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/login")}
      >
        <Ionicons name="chevron-back" size={24} color={theme.text} />
        <AppText style={[styles.backText, { color: theme.text }]}>
          Volver
        </AppText>
      </TouchableOpacity>

      {/* Título */}
      <AppText style={[styles.title, { color: theme.text }]}>
        Actualiza tu contraseña
      </AppText>

      {/* Explicación */}
      <AppText style={[styles.description, { color: theme.text }]}>
        Ingresa tu nueva contraseña y confírmala para actualizarla.
      </AppText>

      {/* Nueva contraseña */}
      <CustomInput
        placeholder="Nueva contraseña"
        iconLeft="lock-closed-outline"
        iconRight="eye-outline"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        borderColor={theme.text}
        color={theme.text}
      />

      {/* Confirmar contraseña */}
      <CustomInput
        placeholder="Confirmar contraseña"
        iconLeft="lock-closed-outline"
        iconRight="eye-outline"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        borderColor={theme.text}
        color={theme.text}
      />

      {/* Botón de guardar */}
      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: theme.orange }]}
        onPress={handleSave}
      >
        <AppText style={styles.sendText}>Guardar Cambios</AppText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  backText: { fontSize: 20 },
  title: {
    fontSize: 48,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 16,
  },
  sendButton: {
    width: "90%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
