import { AuthContext } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// -------------------------------------------------------
//  INTERFACE EJERCICIO
// -------------------------------------------------------
interface Ejercicio {
  id: string;
  name: string;
  series: number;
  min_reps: number;
  max_reps: number;
  weight?: number;
  muscle_group: string;
  kcal: number;
  minutes: number;
  intensity: string;
  description?: string;
}

export default function LiveSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const realSessionId = Array.isArray(sessionId) ? sessionId[0] : sessionId;

  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [players, setPlayers] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [sessionState, setSessionState] = useState<any>(null);
  const [timerLeft, setTimerLeft] = useState<number>(0);
  const [exercises, setExercises] = useState<Ejercicio[]>([]);

  // ------------------------------------------------------------
  // Fetch exercises del usuario en turno
  // ------------------------------------------------------------
  const fetchExercisesForUser = async (userId: string) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("user_id", userId);

    if (error) return;

    setExercises(data as Ejercicio[]);
  };

  useEffect(() => {
    if (!sessionState?.current_player) return;
    fetchExercisesForUser(sessionState.current_player);
  }, [sessionState?.current_player]);

  // ------------------------------------------------------------
  // RESTO DE LA LÓGICA
  // ------------------------------------------------------------
  const fetchMembers = async () => {
    const { data } = await supabase
      .from("session_members")
      .select(`user_id, profiles:profiles(*)`)
      .eq("session_id", realSessionId);

    if (data) setPlayers(data);
  };

  const fetchProgress = async () => {
    const { data } = await supabase
      .from("session_progress")
      .select("*")
      .eq("session_id", realSessionId);

    if (data) setProgress(data);
  };

  const fetchSessionState = async () => {
    const { data } = await supabase
      .from("session_state")
      .select("*")
      .eq("session_id", realSessionId)
      .single();

    if (data) setSessionState(data);
  };

  const initializeStateIfMissing = async () => {
    if (!realSessionId) return;
    if (sessionState) return;
    if (players.length < 2) return;

    await supabase.from("session_state").upsert({
      session_id: realSessionId,
      current_player: players[0].user_id,
      turn_index: 0,
      status: "playing",
    });

    await fetchSessionState();
  };

  useEffect(() => {
    if (!realSessionId) return;

    fetchMembers();
    fetchProgress();
    fetchSessionState();

    // live listeners
    supabase
      .channel(`session-state-${realSessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_state" },
        (payload) => payload.new && setSessionState(payload.new)
      )
      .subscribe();

    supabase
      .channel(`session-progress-${realSessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_progress" },
        fetchProgress
      )
      .subscribe();

    supabase
      .channel(`session-members-${realSessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_members" },
        fetchMembers
      )
      .subscribe();
  }, [realSessionId]);

  useEffect(() => {
    if (!sessionState) initializeStateIfMissing();
  }, [players]);

  // Timer 5 segundos
  useEffect(() => {
    if (!sessionState?.current_player) return;

    setTimerLeft(5);

    const interval = setInterval(() => {
      setTimerLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (user?.id === sessionState.current_player) endTurn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionState?.current_player]);

  const getReps = (id: string) =>
    progress.find((p) => p.user_id === id)?.reps ?? 0;

  const addRepetition = async () => {
    if (!user?.id || !realSessionId) return;

    await supabase.from("session_progress").upsert(
      {
        session_id: realSessionId,
        user_id: user.id,
        reps: getReps(user.id) + 1,
        completed: false,
      },
      { onConflict: "session_id,user_id" }
    );
  };

  const endTurn = async () => {
    if (!players.length || !sessionState || !realSessionId) return;

    const currentIndex = players.findIndex(
      (p) => p.user_id === sessionState.current_player
    );

    const nextPlayer = players[(currentIndex + 1) % players.length];

    await supabase
      .from("session_state")
      .update({
        current_player: nextPlayer.user_id,
        turn_index: sessionState.turn_index + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", realSessionId)
      .eq("current_player", sessionState.current_player);
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        {/* Botón salir */}
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => {
            supabase.removeAllChannels();
            router.push("/training");
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
          <Text style={styles.exitText}> Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🔥 Live Training</Text>

        <Text style={styles.turnText}>
          Turno de:{" "}
          {players.find((p) => p.user_id === sessionState?.current_player)
            ?.profiles?.name ?? "Esperando..."}
        </Text>

        <Text style={styles.timer}>⏱ {timerLeft}s</Text>

        <View style={styles.row}>
          {players.map((p) => (
            <View key={p.user_id} style={styles.playerBox}>
              <Image
                source={{ uri: p.profiles.avatar_url }}
                style={styles.avatar}
              />
              <Text style={styles.playerName}>
                {p.profiles.name} {p.profiles.lastName}
              </Text>
              <Text style={styles.reps}>{getReps(p.user_id)} reps</Text>
            </View>
          ))}
        </View>

        {/* Botones del jugador */}
        {sessionState?.current_player === user?.id && (
          <>
            <TouchableOpacity style={styles.btn} onPress={addRepetition}>
              <Text style={styles.btnText}>+1 Repetición</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSecondary} onPress={endTurn}>
              <Text style={styles.btnText}>Terminar turno</Text>
            </TouchableOpacity>
          </>
        )}

        {/* EJERCICIOS DEL JUGADOR */}
        <View style={{ marginTop: 20, flex: 1 }}>
          <Text style={{ color: "white", fontSize: 20, marginBottom: 10 }}>
            🏋️ Ejercicios del jugador
          </Text>

          {exercises.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {exercises.map((ex) => (
                <View key={ex.id} style={styles.exerciseCompact}>
                  <View style={styles.exRow}>
                    <Text style={styles.exName}>{ex.name}</Text>
                    <Text style={styles.exMuscle}>{ex.muscle_group}</Text>
                  </View>

                  <View style={styles.exDetailsRow}>
                    <Text style={styles.exDetail}>{ex.series} series</Text>
                    <Text style={styles.exDetail}>
                      {ex.min_reps}-{ex.max_reps} reps
                    </Text>
                    {ex.weight ? (
                      <Text style={styles.exDetail}>{ex.weight}kg</Text>
                    ) : null}
                    <Text style={styles.exDetail}>{ex.minutes} min</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={{ color: "white" }}>
              No hay ejercicios para este usuario.
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0E0E0E" },
  container: { flex: 1, padding: 20 },

  exitBtn: {
    marginBottom: 10,
    padding: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  exitText: { color: "#fff", fontSize: 18 },

  title: {
    fontSize: 26,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },

  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },

  playerBox: {
    width: "48%",
    backgroundColor: "#1B1B1B",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
  },

  playerName: { color: "white", fontSize: 18, marginTop: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#333" },
  reps: { color: "#4CAF50", marginTop: 10, fontSize: 18, fontWeight: "bold" },

  turnText: { color: "white", textAlign: "center", fontSize: 18 },
  timer: { color: "#FF5E5E", textAlign: "center", fontSize: 22, marginTop: 10 },

  btn: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  btnSecondary: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: { textAlign: "center", color: "white", fontSize: 16 },

  // -------------------------------------------------
  // EJERCICIO COMPACTO
  // -------------------------------------------------
  exerciseCompact: {
    backgroundColor: "#1B1B1B",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },

  exRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  exName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  exMuscle: {
    fontSize: 12,
    color: "#888",
    textTransform: "capitalize",
  },

  exDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  exDetail: {
    color: "#ccc",
    fontSize: 13,
  },
});
