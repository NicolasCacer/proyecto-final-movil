import { AuthContext } from "@/context/AuthContext";
import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function LiveTraining() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const action = params.action;

  const { liveTrainingAPI } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const userId = user?.id ?? null;

  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [channel, setChannel] = useState<any>(null);

  const handleDeleteSession = async () => {
    try {
      // 1. Salir del canal si existe
      if (channel) {
        await liveTrainingAPI.leaveSession(channel);
      }

      // 3. Borrar la sesión completa
      if (sessionId) {
        await liveTrainingAPI.deleteSessionFull(sessionId, channel);
      }

      // 4. Limpiar canales de Supabase (importante)
      supabase.removeAllChannels();

      // 5. Regresar al entrenamiento
      router.push("/training");
    } catch (error) {
      console.log("Error eliminando la sesión:", error);
    }
  };

  useEffect(() => {
    if (action === "create") createRoom();

    return () => {
      if (channel) liveTrainingAPI.leaveSession(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSessionStart = (sessionId: string) => {
    router.push({
      pathname: "/(modals)/live-session",
      params: { sessionId },
    });
  };

  const createRoom = async () => {
    setWaiting(true);

    const result = await liveTrainingAPI.createSession();
    if (!result.success || !result.session) return;

    setSessionId(result.session.id);
    setRoomCode(result.session.room_code);

    await liveTrainingAPI.joinSessionRoom(result.session.id, userId ?? "");

    const channels = liveTrainingAPI.subscribeToMembers(
      result.session.id,
      ({ type, data }) => {
        if (type === "member" && data?.user_id) {
          setParticipants((prev) =>
            prev.includes(data.user_id) ? prev : [...prev, data.user_id]
          );
        }
        if (type === "status" && data?.status === "started") {
          handleSessionStart(result.session.id);
        }
      }
    );

    setChannel(channels);
  };

  const joinRoom = async () => {
    if (!inputCode) return;

    const result = await liveTrainingAPI.joinSession(inputCode);
    if (!result.success || !result.session) return;
    if (result.session.status === "started") return;
    await liveTrainingAPI.joinSessionRoom(result.session.id, userId ?? "");
    await liveTrainingAPI.updateSessionStatus(result.session.id, "started");
    handleSessionStart(result.session.id);
  };

  // --- FORMULARIO (diseño mejorado, lógica igual) ---
  const renderJoinForm = () => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        style={styles.joinContainer}
      >
        {/* BOTÓN VOLVER */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backContainer}
        >
          <Ionicons name="chevron-back" size={26} color={theme.text} />
          <AppText style={[styles.backText, { color: theme.text }]}>
            Volver
          </AppText>
        </TouchableOpacity>

        {/* FORM CARD */}
        <View style={styles.card}>
          <AppText style={[styles.label, { color: theme.text }]}>
            Ingrese código de la sala
          </AppText>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.text + "55",
                backgroundColor: theme.text + "0D",
                color: theme.text,
              },
            ]}
            value={inputCode}
            onChangeText={setInputCode}
            placeholder="Ej: ABC123"
            placeholderTextColor={theme.text + "55"}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.red }]}
            onPress={joinRoom}
          >
            <AppText style={styles.buttonText}>Unirse</AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );

  // --- WAITING ROOM ---
  const renderWaitingRoom = () => (
    <View style={styles.waitingContainer}>
      <AppText style={[styles.roomCodeText, { color: theme.text }]}>
        Sala: {roomCode}
      </AppText>

      {waiting && (
        <ActivityIndicator
          size="large"
          color={theme.text}
          style={{ margin: 10 }}
        />
      )}

      <AppText style={{ color: theme.text }}>
        Esperando a otros participantes...
      </AppText>

      {participants.length > 0 && (
        <View style={styles.participants}>
          <AppText style={{ color: theme.text }}>
            Participantes conectándose
          </AppText>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.orange, marginTop: 20 },
        ]}
        onPress={() => {
          supabase.removeAllChannels();
          handleDeleteSession();
          router.push("/training");
        }}
      >
        <AppText style={[styles.buttonText, { color: theme.text }]}>
          Salir
        </AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {action === "join" && !sessionId ? renderJoinForm() : renderWaitingRoom()}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // FORM
  joinContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    padding: 25,
    borderRadius: 20,
    backgroundColor: "#ffffff09",
    borderWidth: 1,
    borderColor: "#ffffff22",
  },

  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 18,
    marginVertical: 12,
    textAlign: "center",
    letterSpacing: 2,
  },

  button: {
    padding: 15,
    marginTop: 10,
    borderRadius: 50,
    minWidth: 150,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },

  waitingContainer: { alignItems: "center" },

  roomCodeText: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },

  participants: { marginTop: 20, marginBottom: 10 },
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 5,
  },

  backText: {
    fontSize: 18,
    marginLeft: 5,
  },
});
