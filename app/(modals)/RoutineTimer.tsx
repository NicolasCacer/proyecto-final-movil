import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const REST_SECONDS = 20;

const obtenerDuracionPorSerie = (ej: any) =>
  Math.round((ej.minutes * 60) / ej.series);

export default function RoutineTimer() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { rutina } = useLocalSearchParams();
  const parsed = JSON.parse(rutina as string);
  const ejercicios = parsed.ejercicios;

  const [indexEjercicio, setIndexEjercicio] = useState(0);
  const [serieActual, setSerieActual] = useState(1);
  const [modo, setModo] = useState<"work" | "rest">("work");
  const [corriendo, setCorriendo] = useState(true);

  const ejercicioRef = useRef(ejercicios[0]);
  const duracionSerieRef = useRef(obtenerDuracionPorSerie(ejercicios[0]));

  const [repsRestantes, setRepsRestantes] = useState(ejercicios[0].max_reps);
  const [segundosRest, setSegundosRest] = useState(REST_SECONDS);
  const intervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const animFrame = useRef<number | null>(null);
  const [progreso, setProgreso] = useState(1);

  const totalSegundos =
    modo === "work" ? duracionSerieRef.current : REST_SECONDS;

  // ----------------- Reinicio de ejercicio -----------------
  useEffect(() => {
    ejercicioRef.current = ejercicios[indexEjercicio];
    duracionSerieRef.current = obtenerDuracionPorSerie(ejercicioRef.current);
    setSerieActual(1);
    setModo("work");
    setRepsRestantes(ejercicioRef.current.max_reps);
    setSegundosRest(REST_SECONDS);
    iniciarAnimacion(duracionSerieRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexEjercicio]);

  // ----------------- Timer principal -----------------
  useEffect(() => {
    if (!corriendo) {
      if (intervalo.current) clearInterval(intervalo.current);
      return;
    }

    if (modo === "work") {
      const durReps = duracionSerieRef.current / ejercicioRef.current.max_reps;
      intervalo.current = setInterval(() => {
        setRepsRestantes((prev: any) => {
          if (prev <= 1) {
            manejarFin();
            return ejercicioRef.current.max_reps;
          }
          return prev - 1;
        });
      }, durReps * 1000);
    } else {
      intervalo.current = setInterval(() => {
        setSegundosRest((prev) => {
          if (prev <= 1) {
            manejarFin();
            return REST_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalo.current) clearInterval(intervalo.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corriendo, modo, indexEjercicio, serieActual]);

  // ----------------- Animación suave -----------------
  const iniciarAnimacion = (dur: number) => {
    startTimeRef.current = performance.now();
    elapsedRef.current = 0;
    setProgreso(1);
    if (animFrame.current) cancelAnimationFrame(animFrame.current);
    animFrame.current = requestAnimationFrame(animar);
  };

  const animar = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    elapsedRef.current = elapsed;
    setProgreso(Math.max(0, 1 - elapsed / totalSegundos));
    if (elapsed < totalSegundos)
      animFrame.current = requestAnimationFrame(animar);
  };

  useEffect(() => {
    // Limpiar intervalos y animaciones al cambiar de ejercicio o modo
    if (intervalo.current) clearInterval(intervalo.current);
    if (animFrame.current) cancelAnimationFrame(animFrame.current);

    const ejercicio = ejercicios[indexEjercicio];
    ejercicioRef.current = ejercicio;
    duracionSerieRef.current = obtenerDuracionPorSerie(ejercicio);

    // Reiniciar estados según el modo
    if (modo === "work") {
      setRepsRestantes(ejercicio.max_reps);
      iniciarAnimacion(duracionSerieRef.current);
      const durReps = duracionSerieRef.current / ejercicio.max_reps;
      intervalo.current = setInterval(() => {
        setRepsRestantes((prev: any) => {
          if (prev <= 1) {
            manejarFin();
            return ejercicio.max_reps;
          }
          return prev - 1;
        });
      }, durReps * 1000);
    } else {
      setSegundosRest(REST_SECONDS);
      iniciarAnimacion(REST_SECONDS);
      intervalo.current = setInterval(() => {
        setSegundosRest((prev) => {
          if (prev <= 1) {
            manejarFin();
            return REST_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalo.current) clearInterval(intervalo.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexEjercicio, modo, corriendo]);

  // ----------------- Manejo fin de serie/descanso -----------------
  const manejarFin = () => {
    if (intervalo.current) clearInterval(intervalo.current);
    if (animFrame.current) cancelAnimationFrame(animFrame.current);

    if (modo === "work") {
      setModo("rest");
      setSegundosRest(REST_SECONDS);
      iniciarAnimacion(REST_SECONDS);
      return;
    }

    if (serieActual < ejercicioRef.current.series) {
      setSerieActual((prev) => prev + 1);
      setModo("work");
      setRepsRestantes(ejercicioRef.current.max_reps);
      iniciarAnimacion(duracionSerieRef.current);
      return;
    }

    if (indexEjercicio < ejercicios.length - 1) {
      setIndexEjercicio((prev) => prev + 1);
      return;
    }

    router.back();
  };

  const circ = 2 * Math.PI * 90;
  const numeroCentral = modo === "work" ? repsRestantes : segundosRest;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
          <AppText style={[styles.backText, { color: theme.text }]}>
            Volver
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Título y descripción */}
      <AppText style={styles.title}>{parsed.name}</AppText>
      <AppText style={styles.exerciseName}>{ejercicioRef.current.name}</AppText>
      <View style={styles.descriptionBox}>
        <ScrollView>
          <AppText style={styles.descriptionText}>
            {ejercicioRef.current.description}
          </AppText>
        </ScrollView>
      </View>

      {/* Información de serie */}
      <View style={styles.seriesInfo}>
        <AppText style={{ fontSize: 20 }}>
          Serie {serieActual} de {ejercicioRef.current.series}
        </AppText>
        <AppText style={{ fontSize: 20 }}>
          Repeticiones: {ejercicioRef.current.max_reps}
        </AppText>
      </View>

      {/* Timer circular */}
      <View
        style={{
          marginVertical: 20,
          width: 200,
          height: 200,
          alignSelf: "center",
        }}
      >
        <Svg width={200} height={200}>
          <Circle
            cx="100"
            cy="100"
            r="90"
            stroke="#ddd"
            strokeWidth="15"
            fill="none"
          />
          <Circle
            cx="100"
            cy="100"
            r="90"
            stroke={modo === "rest" ? "#16a34a" : "#f97316"}
            strokeWidth="15"
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={circ - progreso * circ}
            strokeLinecap="round"
          />
        </Svg>

        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 200,
            height: 200,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AppText style={styles.timer}>{numeroCentral}</AppText>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCorriendo(!corriendo)}
        >
          <Ionicons
            name={corriendo ? "pause" : "play"}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={manejarFin}>
          <Ionicons name="play-skip-forward" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    paddingBottom: 15,
    borderBottomColor: "#ffffff21",
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  backText: { fontSize: 18 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  descriptionBox: {
    marginHorizontal: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    maxHeight: 160,
  },
  descriptionText: { fontSize: 18, lineHeight: 20 },
  seriesInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  timerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  timer: {
    fontSize: 58,
    fontWeight: "bold",
    textAlign: "center", // <-- esto asegura que el número quede centrado
    marginVertical: 0,
  }, // <-- eliminar margen vertical },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: 40,
  },
  button: { padding: 20, borderRadius: 50, backgroundColor: "#f97316" },
});
