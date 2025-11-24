import { AuthContext } from "@/context/AuthContext";
import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LiveTraining() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const action = params.action; // "create" o "join"

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

  // --- Render ---
  const renderJoinForm = () => (
    <View style={styles.joinContainer}>
      <AppText style={[styles.label, { color: theme.text }]}>
        Ingrese código de la sala:
      </AppText>
      <TextInput
        style={[styles.input, { borderColor: theme.text, color: theme.text }]}
        value={inputCode}
        onChangeText={setInputCode}
        placeholder="Código"
        placeholderTextColor={theme.text + "99"}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.red }]}
        onPress={joinRoom}
      >
        <AppText style={styles.buttonText}>Unirse</AppText>
      </TouchableOpacity>
    </View>
  );

  const renderWaitingRoom = () => (
    <View style={styles.waitingContainer}>
      <AppText style={[styles.roomCodeText, { color: theme.text }]}>
        Sala: {roomCode}
      </AppText>
      {waiting && (
        <ActivityIndicator
          size="large"
          color={theme.red}
          style={{ margin: 10 }}
        />
      )}
      <AppText style={{ color: theme.text }}>
        Esperando a otros participantes...
      </AppText>

      {participants.length > 0 && (
        <View style={styles.participants}>
          <AppText style={{ color: theme.text }}>
            Participantes conectados:
          </AppText>
          {participants.map((p) => (
            <AppText key={p} style={{ color: theme.text }}>
              {p}
            </AppText>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.text, marginTop: 20 }]}
        onPress={() => liveTrainingAPI.leaveSession(channel)}
      >
        <AppText style={[styles.buttonText, { color: theme.background }]}>
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
  joinContainer: { width: "100%" },
  label: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginVertical: 10 },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  waitingContainer: { alignItems: "center" },
  roomCodeText: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  participants: { marginTop: 20 },
});
