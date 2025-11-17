import CustomInput from "@/components/customInput";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useContext, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpdatePassword() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [matchError, setMatchError] = useState("");

  // 🔐 Validación en tiempo real
  const validatePassword = (password: string) => {
    setNewPassword(password);

    if (password.length < 8) {
      setPasswordError("Debe tener al menos 8 caracteres.");
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Debe contener una mayúscula.");
    } else if (!/[a-z]/.test(password)) {
      setPasswordError("Debe contener una minúscula.");
    } else if (!/[0-9]/.test(password)) {
      setPasswordError("Debe contener un número.");
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError("Debe contener un símbolo.");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirm = (value: string) => {
    setConfirmPassword(value);
    setMatchError(value !== newPassword ? "Las contraseñas no coinciden." : "");
  };

  const isButtonDisabled = useMemo(() => {
    return !newPassword || !confirmPassword || !!passwordError || !!matchError;
  }, [newPassword, confirmPassword, passwordError, matchError]);

  const handleSave = () => {
    if (isButtonDisabled) {
      Alert.alert(
        "Datos incompletos",
        "Revisa que la contraseña sea segura y que ambas coincidan.",
        [{ text: "Entendido" }]
      );
      return;
    }

    Alert.alert(
      "¡Contraseña actualizada!",
      "Tu contraseña ha sido cambiada correctamente.",
      [
        {
          text: "Iniciar sesión",
          onPress: () => router.push("/login"),
        },
      ]
    );
  };

  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
            onChangeText={validatePassword}
            borderColor={passwordError ? "red" : theme.text}
            color={theme.text}
          />

          {passwordError ? (
            <AppText style={{ color: "red", width: "90%", marginBottom: 8 }}>
              {passwordError}
            </AppText>
          ) : null}

          {/* Confirmar contraseña */}
          <CustomInput
            placeholder="Confirmar contraseña"
            iconLeft="lock-closed-outline"
            iconRight="eye-outline"
            secureTextEntry
            value={confirmPassword}
            onChangeText={validateConfirm}
            borderColor={matchError ? "red" : theme.text}
            color={theme.text}
          />

          {matchError ? (
            <AppText style={{ color: "red", width: "90%", marginBottom: 8 }}>
              {matchError}
            </AppText>
          ) : null}

          {/* Botón */}
          <TouchableOpacity
            disabled={isButtonDisabled}
            style={[
              styles.sendButton,
              {
                backgroundColor: theme.orange,
                opacity: isButtonDisabled ? 0.5 : 1,
              },
            ]}
            onPress={handleSave}
          >
            <AppText style={styles.sendText}>Guardar Cambios</AppText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 50,
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
