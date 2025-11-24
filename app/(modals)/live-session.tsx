// --- IMPORTS ---
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeProvider";
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
  const { theme } = useContext(ThemeContext);

  const [players, setPlayers] = useState<any[]>([]);
  const [sessionState, setSessionState] = useState<any>(null);
  const [timerLeft, setTimerLeft] = useState<number>(0);

  const [exercises, setExercises] = useState<Ejercicio[]>([]);
  const [completedLocal, setCompletedLocal] = useState<string[]>([]); // 👈 HISTORIAL LOCAL

  // ------------------------------------------------
  // FETCH EXERCISES OF CURRENT PLAYER
  // ------------------------------------------------
  const fetchExercisesForUser = async (userId: string) => {
    if (!userId) return;

    const { data } = await supabase
      .from("exercises")
      .select("*")
      .eq("user_id", userId);

    if (data) setExercises(data as Ejercicio[]);
  };

  useEffect(() => {
    if (!sessionState?.current_player) return;
    fetchExercisesForUser(sessionState.current_player);
  }, [sessionState?.current_player]);

  // ------------------------------------------------
  // MEMBERS
  // ------------------------------------------------
  const fetchMembers = async () => {
    const { data } = await supabase
      .from("session_members")
      .select(`user_id, profiles:profiles(*)`)
      .eq("session_id", realSessionId);

    if (data) setPlayers(data);
  };

  // ------------------------------------------------
  // SESSION STATE
  // ------------------------------------------------
  const fetchSessionState = async () => {
    const { data } = await supabase
      .from("session_state")
      .select("*")
      .eq("session_id", realSessionId)
      .single();

    if (data) setSessionState(data);
  };

  const initializeStateIfMissing = async () => {
    if (!realSessionId || sessionState || players.length < 2) return;

    await supabase.from("session_state").upsert({
      session_id: realSessionId,
      current_player: players[0].user_id,
      turn_index: 0,
      status: "playing",
      current_exercise: null,
      timer_ends_at: null,
    });

    await fetchSessionState();
  };

  // ------------------------------------------------
  // SUBSCRIPTIONS
  // ------------------------------------------------
  useEffect(() => {
    if (!realSessionId) return;

    fetchMembers();
    fetchSessionState();

    supabase
      .channel(`state-${realSessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_state" },
        (payload) => payload.new && setSessionState(payload.new)
      )
      .subscribe();

    supabase
      .channel(`members-${realSessionId}`)
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

  // ------------------------------------------------
  // TIMER SYNC
  // ------------------------------------------------
  useEffect(() => {
    if (!sessionState?.timer_ends_at) {
      setTimerLeft(0);
      return;
    }

    const tick = () => {
      const now = Date.now();
      const end = new Date(sessionState.timer_ends_at).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimerLeft(diff);
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [sessionState?.timer_ends_at]);

  // ------------------------------------------------
  // SELECT EXERCISE
  // ------------------------------------------------
  const selectExercise = async (ex: Ejercicio) => {
    if (sessionState.current_player !== user?.id) return;

    const minutes = Number(ex.minutes);
    if (!minutes || isNaN(minutes) || minutes < 0) return;

    const endTimestamp = Date.now() + minutes * 60 * 1000;
    const endTime = new Date(endTimestamp).toISOString();

    await supabase
      .from("session_state")
      .update({
        current_exercise: ex.id,
        timer_ends_at: endTime,
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", realSessionId);
  };

  // ------------------------------------------------
  // END TURN → marcar ejercicio como completado local
  // ------------------------------------------------
  const endTurn = async () => {
    if (!players.length || !sessionState || !realSessionId) return;

    // Solo marcar si el ejercicio existe
    if (sessionState.current_exercise) {
      setCompletedLocal((prev) => [...prev, sessionState.current_exercise]);
    }

    const index = players.findIndex(
      (p) => p.user_id === sessionState.current_player
    );
    const next = players[(index + 1) % players.length];

    await supabase
      .from("session_state")
      .update({
        current_player: next.user_id,
        current_exercise: null,
        timer_ends_at: null,
        turn_index: sessionState.turn_index + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", realSessionId);

    setTimerLeft(0);
  };

  // ------------------------------------------------
  // FILTER: si es mi turno → ocultar los completados
  // ------------------------------------------------
  const filteredExercises =
    sessionState?.current_player === user?.id
      ? exercises.filter((ex) => !completedLocal.includes(ex.id))
      : exercises;

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* EXIT */}
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => {
            supabase.removeAllChannels();
            router.push("/training");
          }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
          <Text style={[styles.exitText, { color: theme.text }]}>Volver</Text>
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={[styles.title, { color: theme.text }]}>
          🔥 Live Training
        </Text>

        {/* TIMER */}
        <Text style={[styles.timer, { color: theme.orange }]}>
          ⏱ {timerLeft}s
        </Text>

        {/* PLAYERS */}
        <View style={styles.playersRow}>
          {players.map((p) => {
            const isTurn = p.user_id === sessionState?.current_player;

            return (
              <View
                key={p.user_id}
                style={[
                  styles.playerCard,
                  {
                    backgroundColor: theme.tabsBack,
                    borderColor: isTurn ? theme.orange : "transparent",
                  },
                ]}
              >
                {isTurn && (
                  <Text style={[styles.turnTag, { color: theme.orange }]}>
                    🎯 Turno actual
                  </Text>
                )}

                <Image
                  source={{ uri: p.profiles.avatar_url }}
                  style={styles.avatar}
                />

                <Text style={[styles.playerName, { color: theme.text }]}>
                  {p.profiles.name} {p.profiles.lastName}
                </Text>

                {isTurn && p.user_id === user?.id && (
                  <Text style={[styles.you, { color: theme.orange }]}>
                    (Tu turno)
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* END TURN */}
        {sessionState?.current_player === user?.id && (
          <TouchableOpacity
            style={[styles.endTurnBtn, { backgroundColor: theme.orange }]}
            onPress={endTurn}
          >
            <Text style={[styles.endTurnText, { color: theme.white }]}>
              Terminar turno
            </Text>
          </TouchableOpacity>
        )}

        {/* EXERCISES */}
        <View style={{ marginTop: 25, flex: 1 }}>
          <Text style={[styles.exTitle, { color: theme.text }]}>
            🏋️ Ejercicios del jugador
          </Text>

          {filteredExercises.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {filteredExercises.map((ex) => {
                const isMyTurn = sessionState?.current_player === user?.id;

                return (
                  <TouchableOpacity
                    key={ex.id}
                    disabled={!isMyTurn}
                    onPress={() => selectExercise(ex)}
                    style={[
                      styles.exerciseCard,
                      {
                        backgroundColor: theme.tabsBack,
                        borderColor:
                          sessionState?.current_exercise === ex.id
                            ? theme.orange
                            : theme.orange + "55",
                        opacity: isMyTurn ? 1 : 0.5,
                      },
                    ]}
                  >
                    <Text style={[styles.exName, { color: theme.text }]}>
                      {ex.name}
                    </Text>

                    <View style={styles.exDetailRow}>
                      <Text style={[styles.exDetail, { color: theme.orange }]}>
                        {ex.series} series
                      </Text>
                      <Text style={[styles.exDetail, { color: theme.orange }]}>
                        {ex.min_reps}-{ex.max_reps} reps
                      </Text>
                      <Text style={[styles.exDetail, { color: theme.orange }]}>
                        {ex.minutes} min
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={{ color: theme.text }}>
              No quedan ejercicios por realizar.
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 20 },

  exitBtn: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  exitText: { fontSize: 18, marginLeft: 4 },

  title: { fontSize: 28, fontWeight: "700", textAlign: "center" },

  timer: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 12,
  },

  playersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  playerCard: {
    width: "48%",
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 40,
    backgroundColor: "#444",
  },

  turnTag: { fontSize: 14, marginBottom: 8 },
  playerName: { fontSize: 18, marginTop: 8, textAlign: "center" },
  you: { marginTop: 4, fontSize: 13 },

  endTurnBtn: {
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },
  endTurnText: { fontSize: 18, fontWeight: "600" },

  exTitle: { fontSize: 22, marginBottom: 10, fontWeight: "700" },

  exerciseCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },

  exName: { fontSize: 18, fontWeight: "700", marginBottom: 6 },

  exDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  exDetail: { fontSize: 14, fontWeight: "600" },
});
