import { AuthContext } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LiveSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const realSessionId = Array.isArray(sessionId) ? sessionId[0] : sessionId;

  const { user } = useContext(AuthContext);

  const [players, setPlayers] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [sessionState, setSessionState] = useState<any>(null);
  const [timerLeft, setTimerLeft] = useState<number>(0);

  // ------------------------------------------------------------
  // 1. Cargar miembros
  // ------------------------------------------------------------
  const fetchMembers = async () => {
    const { data } = await supabase
      .from("session_members")
      .select(`user_id, profiles:profiles(*)`)
      .eq("session_id", realSessionId);

    if (data) setPlayers(data);
  };

  // ------------------------------------------------------------
  // 2. Cargar progreso
  // ------------------------------------------------------------
  const fetchProgress = async () => {
    const { data } = await supabase
      .from("session_progress")
      .select("*")
      .eq("session_id", realSessionId);

    if (data) setProgress(data);
  };

  // ------------------------------------------------------------
  // 3. Cargar estado
  // ------------------------------------------------------------
  const fetchSessionState = async () => {
    const { data } = await supabase
      .from("session_state")
      .select("*")
      .eq("session_id", realSessionId)
      .single();

    if (data) setSessionState(data);
  };

  // ------------------------------------------------------------
  // 4. Inicializar estado cuando hay 2 jugadores
  // ------------------------------------------------------------
  const initializeStateIfMissing = async () => {
    if (!realSessionId) return;
    if (sessionState) return;
    if (players.length < 2) return;

    await supabase.from("session_state").upsert({
      session_id: realSessionId,
      current_player: players[0].user_id,
      turn_index: 0,
      timer_ends_at: new Date(Date.now() + 15000).toISOString(),
      status: "playing",
    });

    await fetchSessionState();
  };

  // ------------------------------------------------------------
  // 5. Suscripciones realtime
  // ------------------------------------------------------------
  useEffect(() => {
    if (!realSessionId) return;

    fetchMembers();
    fetchProgress();
    fetchSessionState();

    // Sesión estado realtime
    const stateChannel = supabase
      .channel(`session-state-${realSessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_state" },
        (payload) => {
          if (payload.new) {
            setSessionState(payload.new);
          }
        }
      )
      .subscribe();

    // Progreso realtime
    const progressChannel = supabase
      .channel(`session-progress-${realSessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_progress" },
        fetchProgress
      )
      .subscribe();

    // Miembros realtime
    const membersChannel = supabase
      .channel(`session-members-${realSessionId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_members" },
        fetchMembers
      )
      .subscribe();

    return () => {
      supabase.removeChannel(stateChannel);
      supabase.removeChannel(progressChannel);
      supabase.removeChannel(membersChannel);
    };
  }, [realSessionId]);

  // ------------------------------------------------------------
  // 6. inicializar estado cuando cambian players
  // ------------------------------------------------------------
  useEffect(() => {
    if (!sessionState) initializeStateIfMissing();
  }, [players]);

  // ------------------------------------------------------------
  // 7. Timer
  // ------------------------------------------------------------
  useEffect(() => {
    if (!sessionState?.timer_ends_at) return;

    let called = false;

    const interval = setInterval(() => {
      const diff =
        (new Date(sessionState.timer_ends_at).getTime() - Date.now()) / 1000;

      setTimerLeft(Math.max(0, Math.floor(diff)));

      if (diff <= 0 && user?.id === sessionState.current_player && !called) {
        called = true;
        endTurn();
      }
    }, 300);

    return () => clearInterval(interval);
  }, [sessionState, user?.id]);

  // ------------------------------------------------------------
  // 8. +1 rep
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // 9. Cambiar turno
  // ------------------------------------------------------------
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
        timer_ends_at: new Date(Date.now() + 15000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("session_id", realSessionId)
      .eq("current_player", sessionState.current_player);
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
    padding: 20,
    paddingTop: 50,
  },
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
});
