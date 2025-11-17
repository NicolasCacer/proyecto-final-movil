import CustomInput from "@/components/customInput";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecoverScreen() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!themeContext) return null;
  const { theme } = themeContext;

  // 🔥 Regex de email
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value.trim());
  };

  // 🔥 Validación en tiempo real
  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (value.length === 0) {
      setError(""); // no mostrar error si está vacío
      return;
    }

    if (!validateEmail(value)) {
      setError("Correo inválido");
    } else {
      setError("");
    }
  };

  const handleSend = () => {
    if (!validateEmail(email)) {
      setError("Correo inválido");

      Alert.alert(
        "Correo no válido",
        "Por favor ingresa un correo válido para continuar.",
        [{ text: "Entendido", style: "default" }]
      );

      return;
    }

    setError("");

    console.log("Enviar enlace a:", email);
    router.push("/update");
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
        ¡Recupérala!
      </AppText>

      {/* Explicación */}
      <AppText style={[styles.description, { color: theme.text }]}>
        Enviaremos un enlace a tu correo. Revisa tu bandeja y sigue las
        instrucciones para recuperar tu cuenta.
      </AppText>

      {/* Input de email */}
      <CustomInput
        placeholder="Correo"
        iconLeft="mail-outline"
        value={email}
        onChangeText={handleEmailChange}
        borderColor={error ? "red" : theme.text}
        color={theme.text}
      />

      {/* Error inline */}
      {error ? (
        <AppText
          style={{
            color: "red",
            alignSelf: "flex-start",
            marginLeft: 15,
            marginTop: -10,
            marginBottom: 10,
          }}
        >
          {error}
        </AppText>
      ) : null}

      {/* Botón de enviar */}
      <TouchableOpacity
        style={[
          styles.sendButton,
          { backgroundColor: theme.orange, opacity: email && !error ? 1 : 0.5 },
        ]}
        onPress={handleSend}
        disabled={!!error || email.length === 0}
      >
        <AppText style={styles.sendText}>Enviar enlace</AppText>
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
    borderRadius: 100,
    alignItems: "center",
    marginTop: 20,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
});
