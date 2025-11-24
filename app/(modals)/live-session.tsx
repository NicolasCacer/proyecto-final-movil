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
  const [timerLeft, setTimerLeft] = useState<number>(5);
  const [exercises, setExercises] = useState<Ejercicio[]>([]);

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

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("session_members")
      .select(`user_id, profiles:profiles(*)`)
      .eq("session_id", realSessionId);

    if (data) setPlayers(data);
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
    fetchSessionState();

    supabase
      .channel(`session-state-${realSessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_state" },
        (payload) => payload.new && setSessionState(payload.new)
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

  useEffect(() => {
    if (!sessionState?.current_player) return;

    setTimerLeft(5);

    const interval = setInterval(() => {
      setTimerLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionState?.current_player]);

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

    setTimerLeft(5);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* BACK BUTTON */}
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

        {/* END TURN BUTTON */}
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

        {/* EXERCISES LIST */}
        <View style={{ marginTop: 25, flex: 1 }}>
          <Text style={[styles.exTitle, { color: theme.text }]}>
            🏋️ Ejercicios del jugador
          </Text>

          {exercises.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {exercises.map((ex) => (
                <View
                  key={ex.id}
                  style={[
                    styles.exerciseCard,
                    {
                      backgroundColor: theme.tabsBack,
                      borderColor: theme.orange,
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
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={{ color: theme.text }}>No hay ejercicios.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 20 },

  exitBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  exitText: {
    fontSize: 18,
    marginLeft: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

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
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  turnTag: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 40,
    backgroundColor: "#444",
  },

  playerName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },

  you: {
    marginTop: 4,
    fontSize: 13,
  },

  endTurnBtn: {
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },
  endTurnText: {
    fontSize: 18,
    fontWeight: "600",
  },

  exTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },

  exerciseCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },

  exName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  exDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exDetail: {
    fontSize: 14,
    fontWeight: "600",
  },
});
