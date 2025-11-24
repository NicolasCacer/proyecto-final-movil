// --- IMPORTS ---
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ⭐ Circle SVG
import Svg, { Circle } from "react-native-svg";

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
  const [startSeconds, setStartSeconds] = useState<number>(0); // ⭐ tiempo inicial

  const [exercises, setExercises] = useState<Ejercicio[]>([]);
  const [completedLocal, setCompletedLocal] = useState<string[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realSessionId]);

  useEffect(() => {
    if (!sessionState) initializeStateIfMissing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  // ------------------------------------------------
  // TIMER SYNC
  // ------------------------------------------------
  useEffect(() => {
    if (!sessionState?.timer_ends_at) {
      setTimerLeft(0);
      return;
    }

    const end = new Date(sessionState.timer_ends_at).getTime();

    // calcular tiempo inicial
    const totalSec = Math.floor((end - Date.now()) / 1000);
    if (totalSec > 0) setStartSeconds(totalSec);

    const tick = () => {
      const now = Date.now();
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
    if (!minutes || isNaN(minutes)) return;

    const durationMs = minutes * 60 * 1000;
    const endTimestamp = Date.now() + durationMs;

    setStartSeconds(Math.floor(durationMs / 1000)); // ⭐ para el círculo

    await supabase
      .from("session_state")
      .update({
        current_exercise: ex.id,
        timer_ends_at: new Date(endTimestamp).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", realSessionId);
  };

  // ------------------------------------------------
  // END TURN
  // ------------------------------------------------
  const endTurn = async () => {
    if (!players.length || !sessionState) return;

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
    setStartSeconds(0);
  };

  // ------------------------------------------------
  // FILTER EXERCISES
  // ------------------------------------------------
  const filteredExercises =
    sessionState?.current_player === user?.id
      ? exercises.filter((ex) => !completedLocal.includes(ex.id))
      : exercises;

  // ------------------------------------------------
  // SVG CIRCLE PROGRESS
  // ------------------------------------------------
  const radius = 55;
  const circ = 2 * Math.PI * radius;

  const progress = startSeconds > 0 ? timerLeft / startSeconds : 0;

  const strokeOffset = circ * (1 - progress);

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
          <AppText
            style={[
              styles.exitText,
              {
                color: theme.text,
              },
            ]}
          >
            Volver
          </AppText>
        </TouchableOpacity>

        {/* TITLE */}
        <AppText style={[styles.title, { color: theme.text }]}>
          🔥 Multi Entrenamiento
        </AppText>

        {/* ⭐ TIMER CIRCLE */}
        <View style={styles.timerContainer}>
          <Svg height="140" width="140">
            <Circle
              cx="70"
              cy="70"
              r={radius}
              stroke={theme.tabsBack}
              strokeWidth="10"
              fill="none"
            />
            <Circle
              cx="70"
              cy="70"
              r={radius}
              stroke={theme.orange}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={strokeOffset}
              fill="none"
            />
          </Svg>
          <AppText style={[styles.timerText, { color: theme.text }]}>
            {timerLeft}
          </AppText>
        </View>

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
                  <AppText style={[styles.turnTag, { color: theme.orange }]}>
                    🎯 Turno actual
                  </AppText>
                )}

                <Image
                  source={{ uri: p.profiles.avatar_url }}
                  style={styles.avatar}
                />

                <AppText style={[styles.playerName, { color: theme.text }]}>
                  {p.profiles.name} {p.profiles.lastName}
                </AppText>

                {isTurn && p.user_id === user?.id && (
                  <AppText style={[styles.you, { color: theme.orange }]}>
                    (Tu turno)
                  </AppText>
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
            <AppText style={[styles.endTurnText, { color: theme.white }]}>
              Terminar turno
            </AppText>
          </TouchableOpacity>
        )}

        {/* EXERCISES */}
        <View style={{ marginTop: 15, flex: 1 }}>
          <AppText style={[styles.exTitle, { color: theme.text }]}>
            🏋️ Ejercicios del jugador
          </AppText>

          {filteredExercises.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {filteredExercises.map((ex) => {
                const isMyTurn = sessionState?.current_player === user?.id;
                const isSelected = sessionState?.current_exercise === ex.id;

                // 🔥 Si NO es mi turno → solo mostrar el seleccionado
                if (!isMyTurn && !isSelected) return null;

                return (
                  <TouchableOpacity
                    key={ex.id}
                    disabled={!isMyTurn}
                    onPress={() => selectExercise(ex)}
                    style={[
                      styles.exerciseCard,
                      {
                        backgroundColor: isSelected
                          ? theme.orange + "55"
                          : theme.tabsBack,
                        borderColor: isSelected ? theme.orange : "transparent",

                        shadowColor: isSelected ? theme.orange : "#000",
                        shadowOpacity: isSelected ? 0.45 : 0.1,
                        shadowRadius: isSelected ? 12 : 6,
                        shadowOffset: { width: 0, height: isSelected ? 6 : 3 },
                      },
                    ]}
                  >
                    <AppText style={[styles.exName, { color: theme.text }]}>
                      {ex.name}
                    </AppText>
                    <AppText
                      style={[
                        styles.exDetail,
                        { color: theme.orange, marginBottom: 8 },
                      ]}
                    >
                      {ex.description}
                    </AppText>

                    <View style={styles.exDetailRow}>
                      <AppText
                        style={[styles.exDetail, { color: theme.orange }]}
                      >
                        {ex.series} series
                      </AppText>
                      <AppText
                        style={[styles.exDetail, { color: theme.orange }]}
                      >
                        {ex.min_reps}-{ex.max_reps} reps
                      </AppText>
                      <AppText
                        style={[styles.exDetail, { color: theme.orange }]}
                      >
                        {ex.minutes} min
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <AppText style={{ color: theme.text }}>
              No quedan ejercicios por realizar.
            </AppText>
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

  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },

  // ⭐ NUEVO TIMER CIRCLE
  timerContainer: {
    width: 160,
    height: 160,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    position: "absolute",
    fontSize: 26,
    fontWeight: "700",
  },

  playersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  turnTag: { fontSize: 14 },
  playerName: { fontSize: 18, marginTop: 8, textAlign: "center" },
  you: { fontSize: 13 },

  endTurnBtn: {
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
  },
  endTurnText: { fontSize: 18, fontWeight: "bold" },

  exTitle: { fontSize: 22, marginBottom: 10, fontWeight: "700" },

  exerciseCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },

  exName: { fontSize: 18, fontWeight: "700", marginBottom: 6 },

  exDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  exDetail: { fontSize: 14, fontWeight: "600" },
});
