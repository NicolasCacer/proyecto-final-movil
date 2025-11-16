import EmailIcon from "@/components/emailIcon";
import LockIcon from "@/components/lockIcon";
import LogoIcon from "@/components/logoIcon";
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await authContext.login(email, password);
    if (success) {
      router.push("/home");
    } else {
      Alert.alert("Error", "Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppText style={[styles.title, { color: theme.text }]}>
        ¡Bienvenido!
      </AppText>
      <LogoIcon width={120} height={120} color="#ff7E33" />
      <AppText style={[styles.logoText, { color: theme.orange }]}>
        GymCol
      </AppText>

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
        <AppText style={{ color: theme.text }}>
          ¿Olvidaste tu contraseña?
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: theme.orange }]}
        onPress={() => handleLogin()}
      >
        <AppText style={[styles.loginText]}>Iniciar Sesión</AppText>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={[styles.line, { backgroundColor: theme.text }]} />
        <AppText style={{ color: theme.text, marginHorizontal: 10 }}>ó</AppText>
        <View style={[styles.line, { backgroundColor: theme.text }]} />
      </View>

      <TouchableOpacity
        style={[styles.registerButton, { backgroundColor: theme.text }]}
        onPress={() => router.push("/register")}
      >
        <AppText style={[styles.registerText, { color: theme.background }]}>
          Registrarme
        </AppText>
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
    fontFamily: "Onest",
    fontSize: 18,
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
