import EmailIcon from "@/components/emailIcon";
import LockIcon from "@/components/lockIcon";
import LogoIcon from "@/components/logoIcon";
import { ThemeContext } from "@/context/ThemeProvider";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>¡Bienvenido!</Text>
      <LogoIcon width={120} height={120} color="#ff7E33" />
      <Text style={[styles.logoText, { color: theme.orange }]}>GymCol</Text>

      {/* Campo Email */}
      <View
        style={[styles.inputContainer, { backgroundColor: theme.background }]}
      >
        <EmailIcon fill={theme.text} />
        <TextInput
          placeholder="Correo"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          style={[styles.textInput, { color: theme.text }]}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Campo Contraseña */}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.background, marginTop: 20 },
        ]}
      >
        <LockIcon fill={theme.text} />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.textInput, { color: theme.text }]}
        />
      </View>

      <TouchableOpacity
        onPress={() => router.push("/recover")}
        style={styles.forgotButton}
      >
        <Text style={{ color: theme.text }}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: theme.orange }]}
        onPress={() => router.push("/home")}
      >
        <Text style={[styles.loginText]}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={[styles.line, { backgroundColor: theme.text }]} />
        <Text style={{ color: theme.text, marginHorizontal: 10 }}>ó</Text>
        <View style={[styles.line, { backgroundColor: theme.text }]} />
      </View>

      <TouchableOpacity
        style={[styles.registerButton, { backgroundColor: theme.text }]}
        onPress={() => router.push("/register")}
      >
        <Text style={[styles.registerText, { color: theme.background }]}>
          Registrarme
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// === Estilos centralizados ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: "600",
    marginBottom: 30,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 40,
    width: "100%",
  },
  textInput: {
    flex: 1,
    padding: 12,
  },
  forgotButton: {
    marginTop: 10,
  },
  loginButton: {
    padding: 14,
    borderRadius: 100,
    marginTop: 30,
    width: "95%",
    alignItems: "center",
  },
  loginText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#fff",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  registerButton: {
    padding: 14,
    borderRadius: 100,
    width: "95%",
    alignItems: "center",
  },
  registerText: {
    fontWeight: "bold",
    fontSize: 24,
  },
});
