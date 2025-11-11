import CustomInput from "@/components/customInput";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecoverScreen() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);
  const [email, setEmail] = useState("");

  if (!themeContext) return null;
  const { theme } = themeContext;

  const handleSend = () => {
    console.log("Enviar enlace a:", email);
    router.push("/update"); // Ajusta según la ruta deseada
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

      {/* Input de email usando CustomInput */}
      <CustomInput
        placeholder="Correo"
        iconLeft="mail-outline"
        value={email}
        onChangeText={setEmail}
        borderColor={theme.text}
        color={theme.text}
      />

      {/* Botón de enviar */}
      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: theme.orange }]}
        onPress={handleSend}
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
