import ai from "@/assets/lotties/ai.json";
import { AuthContext } from "@/context/AuthContext";
import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

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

interface Rutina {
  id: string;
  name: string;
  description?: string;
  ejercicios: Ejercicio[];
}

export default function RutinaView() {
  const themeContext = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [completados, setCompletados] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const { routinesAPI, exercisesAPI, activitiesAPI } = useContext(DataContext);

  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  const cargarRutinas = async () => {
    setLoading(true);
    try {
      const rutinasDB = await routinesAPI.getAll();
      const ejerciciosDB = await exercisesAPI.getAll();
      const actividadesDB = await activitiesAPI.getAll();

      if (!rutinasDB || !ejerciciosDB || !actividadesDB) {
        setRutinas([]);
        setCompletados({});
        setLoading(false);
        return;
      }

      // Map para completados solo del día de hoy
      const completadosMap: Record<string, boolean> = {};
      actividadesDB.forEach((act) => {
        if (act.created_at && esHoy(act.created_at)) {
          const key = `${act.routine_id}_${act.exercise_id}`;
          completadosMap[key] = true;
        }
      });
      setCompletados(completadosMap);

      const rutinasConEjercicios: Rutina[] = rutinasDB.map((rutina: any) => ({
        id: rutina.id,
        name: rutina.name,
        description: rutina.description,
        ejercicios: ejerciciosDB.filter(
          (ejercicio: any) => ejercicio.routine_id === rutina.id
        ),
      }));

      setRutinas(rutinasConEjercicios);
    } catch (error) {
      console.error("Error cargando rutinas:", error);
    } finally {
      setLoading(false);
    }
  };

  const esHoy = (fecha: string | Date) => {
    const f = new Date(fecha); // Convierte UTC a local automáticamente
    const hoy = new Date();
    return (
      f.getFullYear() === hoy.getFullYear() &&
      f.getMonth() === hoy.getMonth() &&
      f.getDate() === hoy.getDate()
    );
  };

  const handleCompleteExercise = async (
    routineId: string,
    exerciseId: string
  ) => {
    const key = `${routineId}_${exerciseId}`;
    const isCompleted = completados[key];

    if (isCompleted) {
      const actividadesDB = await activitiesAPI.getAll();
      const act = actividadesDB?.find(
        (a) =>
          a.exercise_id === exerciseId &&
          a.routine_id === routineId &&
          a.created_at &&
          esHoy(a.created_at)
      );
      if (act) await activitiesAPI.delete(act.id);
    } else {
      await activitiesAPI.create({
        routine_id: routineId,
        exercise_id: exerciseId,
      });
    }

    setCompletados((prev) => ({ ...prev, [key]: !isCompleted }));
  };

  useEffect(() => {
    cargarRutinas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRoutine = (routineId: string) => {
    setExpandedRoutine(expandedRoutine === routineId ? null : routineId);
  };

  const handleOpenMenu = () => {
    setMenuVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleCloseMenu = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const handleAIRecommendation = async () => {
    handleCloseMenu();
    setLoadingAI(true);
    const prompt = `
      Eres un coach fitness profesional. Genera una rutina de ejercicios en JSON sin unidades de medida. 
      El usuario tiene las siguientes características:
      - Peso actual: ${user?.actualweight} kg
      - Peso objetivo: ${user?.targetweight} kg
      - Altura: ${user?.height} cm
      - Nivel de actividad: ${user?.activitylevel}
      - Porcentaje de grasa corporal actual: ${
        user?.fatindex ?? "no proporcionado"
      }
      - Porcentaje de grasa objetivo: ${
        user?.targetfatindex ?? "no proporcionado"
      }
      Ten en cuenta también esta información adicional que el usuario proporcionó: ${
        user?.aicontext ?? "ninguna"
      }`;

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseJsonSchema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description:
                      "nombre corto y motivador para la rutina de ejercicios, menos de 5 palabras",
                  },
                  description: {
                    type: "string",
                    description:
                      "Descripción detallada de la rutina: objetivos, intensidad, músculos trabajados y recomendaciones generales",
                  },
                  ejercicios: {
                    type: "array",
                    minItems: 3,
                    maxItems: 5,
                    items: {
                      type: "object",
                      properties: {
                        nombre: {
                          type: "string",
                          description:
                            "nombre corto y explicativo del ejercicio",
                        },
                        series: { type: "string" },
                        minReps: { type: "string" },
                        maxReps: { type: "string" },
                        peso: {
                          type: "string",
                          description:
                            "peso de mancuernas, pesas, barra, etc. Si es peso corporal omitir este campo. debe ser numerico o sino nulo",
                        },
                        musculo: {
                          type: "string",
                          enum: [
                            "Pecho",
                            "Espalda",
                            "Piernas",
                            "Glúteos",
                            "Hombros",
                            "Brazos",
                            "Abdomen",
                            "Cardio",
                          ],
                        },
                        intensidad: {
                          type: "string",
                          enum: ["baja", "media", "alta"],
                        },
                        descripcionEj: {
                          type: "string",
                          description:
                            "explicación breve del ejercicio o movimientos. Adevertencias en caso de ser necesario",
                        },
                        kcal: {
                          type: "string",
                          description:
                            "kcal estimadas a quemar por esta rutina",
                        },
                        minutes: {
                          type: "string",
                          description:
                            "minutos estimados de duración de este ejericio con todos sus sets y repeticiones",
                        },
                      },
                      required: [
                        "nombre",
                        "series",
                        "minReps",
                        "maxReps",
                        "musculo",
                        "intensidad",
                        "kcal",
                        "minutes",
                      ],
                    },
                  },
                },
                required: ["name", "description", "ejercicios"],
              },
            },
          }),
        }
      );

      const data = await response.json();
      const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      const hoy = diasSemana[new Date().getDay()];

      const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) {
        Alert.alert("Error", "No se pudo generar la rutina con la IA");
        return;
      }

      const aiRutina = JSON.parse(jsonText);

      // Asignar el día actual
      aiRutina.day = hoy;

      // Agregar IDs a los ejercicios
      const ejerciciosConId = aiRutina.ejercicios.map(
        (ej: any, index: number) => ({
          ...ej,
          id: `ej${index + 1}`,
        })
      );

      const rutinaFinal = { ...aiRutina, ejercicios: ejerciciosConId };

      // Codificar y redirigir
      const encoded = encodeURIComponent(JSON.stringify(rutinaFinal));
      router.push(`/create-routine?prefill=${encoded}`);
    } catch (err) {
      console.error("Error generando rutina IA:", err);
      Alert.alert("Error", "Ocurrió un error al generar la rutina con la IA");
    } finally {
      setLoadingAI(false);
    }
  };

  const { theme } = themeContext;

  const handleCreateCustom = () => {
    handleCloseMenu();
    router.push("/create-routine");
  };
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.orange} />
        <AppText style={[styles.loadingText, { color: theme.text }]}>
          Cargando rutinas...
        </AppText>
      </View>
    );
  }
  if (loadingAI) {
    return (
      <View style={styles.aiLoaderContainer} pointerEvents="auto">
        <LottieView
          source={ai}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <AppText style={[styles.loadingText, { color: theme.text }]}>
          La IA está creando tu rutina...
        </AppText>
      </View>
    );
  }

  if (rutinas.length === 0) {
    return (
      <>
        <View style={styles.emptyContainer}>
          <Ionicons name="fitness-outline" size={64} color="#666" />
          <AppText style={[styles.emptyTitle, { color: theme.text }]}>
            No tienes rutinas
          </AppText>
          <AppText style={[styles.emptySubtitle, { color: "#999" }]}>
            Crea tu primera rutina personalizada
          </AppText>
        </View>

        {/* Botón flotante (FAB) */}
        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: theme.orange }]}
          onPress={handleOpenMenu}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Modal del menú */}
        <Modal
          visible={menuVisible}
          transparent
          animationType="none"
          onRequestClose={handleCloseMenu}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCloseMenu}
          >
            <View style={styles.menuContainer}>
              <Animated.View
                style={[
                  styles.menuContent,
                  { backgroundColor: theme.tabsBack },
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: scaleAnim,
                  },
                ]}
              >
                {/* Opción de IA */}
                <TouchableOpacity
                  style={[
                    styles.menuOption,
                    { borderBottomColor: "rgba(255,255,255,0.1)" },
                  ]}
                  onPress={handleAIRecommendation}
                >
                  <View
                    style={[
                      styles.menuIconCircle,
                      { backgroundColor: theme.background },
                    ]}
                  >
                    <Ionicons name="sparkles" size={24} color={theme.orange} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <AppText style={[styles.menuTitle, { color: theme.text }]}>
                      Recomendación IA
                    </AppText>
                    <AppText style={styles.menuSubtitle}>
                      Deja que la IA cree tu rutina
                    </AppText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>

                {/* Opción manual */}
                <TouchableOpacity
                  style={styles.menuOption}
                  onPress={handleCreateCustom}
                >
                  <View
                    style={[
                      styles.menuIconCircle,
                      { backgroundColor: theme.background },
                    ]}
                  >
                    <Ionicons name="create" size={24} color={theme.orange} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <AppText style={[styles.menuTitle, { color: theme.text }]}>
                      Crear Rutina Personalizada
                    </AppText>
                    <AppText style={styles.menuSubtitle}>
                      Define tus propios ejercicios
                    </AppText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <AppText style={[styles.title, { color: theme.text }]}>
          Mis Rutinas
        </AppText>
        <AppText style={[styles.subtitle, { color: "#999" }]}>
          {rutinas.length} {rutinas.length === 1 ? "rutina" : "rutinas"} creadas
        </AppText>

        {rutinas.map((rutina) => {
          const isExpanded = expandedRoutine === rutina.id;
          const totalEjercicios = rutina.ejercicios.length;

          return (
            <View key={rutina.id} style={styles.rutinaContainer}>
              {/* Header de la rutina */}
              <TouchableOpacity
                style={[
                  styles.rutinaHeader,
                  { backgroundColor: theme.tabsBack },
                ]}
                onPress={() => toggleRoutine(rutina.id)}
              >
                <View style={styles.rutinaHeaderLeft}>
                  <View
                    style={[
                      styles.rutinaIconCircle,
                      { backgroundColor: theme.background },
                    ]}
                  >
                    <Ionicons name="fitness" size={24} color={theme.orange} />
                  </View>
                  <View style={styles.rutinaInfo}>
                    <AppText
                      style={[styles.rutinaNombre, { color: theme.text }]}
                    >
                      {rutina.name}
                    </AppText>
                    <AppText
                      style={[
                        styles.rutinaDescripcion,
                        { color: "#999", marginRight: 5 },
                      ]}
                      numberOfLines={showFullDesc ? undefined : 1}
                      ellipsizeMode="tail"
                    >
                      {rutina.description}
                    </AppText>
                    <TouchableOpacity
                      onPress={() => setShowFullDesc(!showFullDesc)}
                    >
                      <AppText style={{ color: theme.orange, fontSize: 14 }}>
                        {showFullDesc ? "Ver menos" : "Ver más"}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.rutinaHeaderRight}>
                  <AppText style={[styles.progressText, { color: "#999" }]}>
                    {totalEjercicios} ejerc.
                  </AppText>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.text}
                  />
                </View>
              </TouchableOpacity>

              {/* Lista de ejercicios */}
              {isExpanded && (
                <View
                  style={[
                    styles.ejerciciosList,
                    { backgroundColor: theme.tabsBack },
                  ]}
                >
                  {rutina.ejercicios.map((ejercicio, index) => (
                    <View
                      key={ejercicio.id}
                      style={[
                        styles.ejercicioItem,
                        index !== rutina.ejercicios.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: "rgba(255,255,255,0.1)",
                        },
                      ]}
                    >
                      <View style={styles.ejercicioContent}>
                        <TouchableOpacity
                          style={styles.checkCircle}
                          onPress={() =>
                            handleCompleteExercise(rutina.id, ejercicio.id)
                          }
                        >
                          <Ionicons
                            name={
                              completados[`${rutina.id}_${ejercicio.id}`]
                                ? "checkmark-circle"
                                : "ellipse-outline"
                            }
                            size={20}
                            color={
                              completados[`${rutina.id}_${ejercicio.id}`]
                                ? theme.orange
                                : "#666"
                            }
                          />
                        </TouchableOpacity>

                        <View style={styles.ejercicioInfo}>
                          <AppText
                            style={[
                              styles.ejercicioNombre,
                              { color: theme.text },
                            ]}
                          >
                            {ejercicio.name}
                          </AppText>
                          <View style={styles.ejercicioDetalles}>
                            <AppText style={styles.ejercicioDetalle}>
                              {ejercicio.series} series
                            </AppText>
                            <AppText style={styles.ejercicioDetalle}>
                              {" "}
                              •{" "}
                            </AppText>
                            <AppText style={styles.ejercicioDetalle}>
                              {ejercicio.min_reps}-{ejercicio.max_reps} reps
                            </AppText>
                            {ejercicio.weight && (
                              <>
                                <AppText style={styles.ejercicioDetalle}>
                                  {" "}
                                  •{" "}
                                </AppText>
                                <AppText style={styles.ejercicioDetalle}>
                                  {ejercicio.weight}kg
                                </AppText>
                              </>
                            )}
                            <AppText style={styles.ejercicioDetalle}>
                              {" "}
                              •{" "}
                            </AppText>
                            <AppText
                              style={[
                                styles.ejercicioDetalle,
                                { textTransform: "capitalize" },
                              ]}
                            >
                              {ejercicio.intensity}
                            </AppText>
                          </View>
                          <View style={styles.musculoBadge}>
                            <AppText style={styles.musculoText}>
                              {ejercicio.muscle_group}
                            </AppText>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                  <View style={styles.startButtonsContainer}>
                    {/* Botón de Entrenar solo*/}
                    <TouchableOpacity
                      style={[
                        styles.entrenarButton,
                        { backgroundColor: theme.orange },
                      ]}
                      onPress={() => {
                        console.log("Iniciar entrenamiento:", rutina.name);
                        // Aquí irá la lógica futura
                      }}
                    >
                      <Ionicons name="play-circle" size={24} color="#fff" />
                      <AppText style={styles.entrenarButtonText}>
                        Empezar
                      </AppText>
                    </TouchableOpacity>

                    {/* Botón de Entrenar en Conjunto */}
                    <TouchableOpacity
                      style={[
                        styles.entrenarButton,
                        { backgroundColor: theme.red },
                      ]}
                      onPress={() => {
                        console.log("Iniciar entrenamiento:", rutina.name);
                        // Aquí irá la lógica futura
                      }}
                    >
                      <Ionicons name="play-circle" size={24} color="#fff" />
                      <AppText style={styles.entrenarButtonText}>
                        Multi Entrenar
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Botón flotante (FAB) */}
      <TouchableOpacity
        style={[styles.fabButton, { backgroundColor: theme.orange }]}
        onPress={handleOpenMenu}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal del menú */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseMenu}
        >
          <View style={styles.menuContainer}>
            <Animated.View
              style={[
                styles.menuContent,
                { backgroundColor: theme.tabsBack },
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: scaleAnim,
                },
              ]}
            >
              {/* Opción de IA */}
              <TouchableOpacity
                style={[
                  styles.menuOption,
                  { borderBottomColor: "rgba(255,255,255,0.1)" },
                ]}
                onPress={handleAIRecommendation}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons name="sparkles" size={24} color={theme.orange} />
                </View>
                <View style={styles.menuTextContainer}>
                  <AppText style={[styles.menuTitle, { color: theme.text }]}>
                    Recomendación IA
                  </AppText>
                  <AppText style={styles.menuSubtitle}>
                    Deja que la IA cree tu rutina
                  </AppText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>

              {/* Opción manual */}
              <TouchableOpacity
                style={styles.menuOption}
                onPress={handleCreateCustom}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons name="create" size={24} color={theme.orange} />
                </View>
                <View style={styles.menuTextContainer}>
                  <AppText style={[styles.menuTitle, { color: theme.text }]}>
                    Crear Rutina Personalizada
                  </AppText>
                  <AppText style={styles.menuSubtitle}>
                    Define tus propios ejercicios
                  </AppText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aiLoaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 150,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  rutinaContainer: {
    marginBottom: 15,
  },
  rutinaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  rutinaHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rutinaIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rutinaInfo: {
    flex: 1,
  },
  rutinaNombre: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  rutinaDescripcion: {
    fontSize: 14,
  },
  rutinaHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  ejerciciosList: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  ejercicioItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ejercicioContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkCircle: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  ejercicioInfo: {
    flex: 1,
  },
  ejercicioNombre: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  ejercicioDetalles: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ejercicioDetalle: {
    fontSize: 13,
    color: "#999",
  },
  musculoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 126, 51, 0.2)",
    marginTop: 4,
  },
  musculoText: {
    fontSize: 12,
    color: "#FF7E33",
    fontWeight: "500",
  },
  fabButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    padding: 20,
    paddingBottom: 200,
  },
  menuContent: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  menuIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#999",
  },
  entrenarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,

    borderRadius: 12,
    gap: 10,
    elevation: 4,
    shadowColor: "#FF7E33",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  entrenarButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  startButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
});
