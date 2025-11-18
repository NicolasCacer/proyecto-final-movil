import { ThemeContext } from "@/context/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Ejercicio {
  id: string;
  nombre: string;
  series: number;
  repeticiones: string;
  peso?: string;
  completado: boolean;
}

interface DiaRutina {
  id: string;
  dia: string;
  musculo: string;
  ejercicios: Ejercicio[];
  completado: boolean;
}

export default function RutinaView() {
  const themeContext = useContext(ThemeContext);
  const router = useRouter();
  
  if (!themeContext) return null;
  const { theme } = themeContext;

  const [rutinaSemanal] = useState<DiaRutina[]>([
    {
      id: "1",
      dia: "Lunes",
      musculo: "Pecho y Tríceps",
      completado: false,
      ejercicios: [
        {
          id: "1-1",
          nombre: "Press de banca",
          series: 4,
          repeticiones: "8-10",
          peso: "60kg",
          completado: false,
        },
        {
          id: "1-2",
          nombre: "Press inclinado con mancuernas",
          series: 3,
          repeticiones: "10-12",
          peso: "25kg",
          completado: false,
        },
        {
          id: "1-3",
          nombre: "Aperturas con mancuernas",
          series: 3,
          repeticiones: "12-15",
          peso: "15kg",
          completado: false,
        },
        {
          id: "1-4",
          nombre: "Extensiones de tríceps",
          series: 3,
          repeticiones: "10-12",
          completado: false,
        },
      ],
    },
    {
      id: "2",
      dia: "Miércoles",
      musculo: "Pierna y Abdomen",
      completado: false,
      ejercicios: [
        {
          id: "2-1",
          nombre: "Sentadillas",
          series: 4,
          repeticiones: "8-10",
          peso: "80kg",
          completado: false,
        },
        {
          id: "2-2",
          nombre: "Prensa de pierna",
          series: 4,
          repeticiones: "10-12",
          peso: "120kg",
          completado: false,
        },
        {
          id: "2-3",
          nombre: "Peso muerto rumano",
          series: 3,
          repeticiones: "10-12",
          peso: "60kg",
          completado: false,
        },
        {
          id: "2-4",
          nombre: "Plancha abdominal",
          series: 3,
          repeticiones: "30-60s",
          completado: false,
        },
      ],
    },
    {
      id: "3",
      dia: "Viernes",
      musculo: "Espalda y Bíceps",
      completado: false,
      ejercicios: [
        {
          id: "3-1",
          nombre: "Dominadas",
          series: 4,
          repeticiones: "8-10",
          completado: false,
        },
        {
          id: "3-2",
          nombre: "Remo con barra",
          series: 4,
          repeticiones: "8-10",
          peso: "50kg",
          completado: false,
        },
        {
          id: "3-3",
          nombre: "Jalón al pecho",
          series: 3,
          repeticiones: "10-12",
          peso: "45kg",
          completado: false,
        },
        {
          id: "3-4",
          nombre: "Curl con barra",
          series: 3,
          repeticiones: "10-12",
          peso: "25kg",
          completado: false,
        },
      ],
    },
  ]);

  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  const toggleDay = (dayId: string) => {
    setExpandedDay(expandedDay === dayId ? null : dayId);
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

  const handleAIRecommendation = () => {
    handleCloseMenu();
    console.log("Obtener recomendación de IA");
    // Aquí irá la lógica para la recomendación de IA
  };

  const handleCreateCustom = () => {
    handleCloseMenu();
    router.push("/create-routine");
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Mi Rutina Semanal
        </Text>
        <Text style={[styles.subtitle, { color: "#999" }]}>
          Plan de entrenamiento personalizado
        </Text>

        {rutinaSemanal.map((dia) => {
          const isExpanded = expandedDay === dia.id;
          const completedExercises = dia.ejercicios.filter(
            (e) => e.completado
          ).length;
          const totalExercises = dia.ejercicios.length;

          return (
            <View key={dia.id} style={styles.diaContainer}>
              {/* Header del día */}
              <TouchableOpacity
                style={[styles.diaHeader, { backgroundColor: theme.tabsBack }]}
                onPress={() => toggleDay(dia.id)}
              >
                <View style={styles.diaHeaderLeft}>
                  <View
                    style={[
                      styles.diaIconCircle,
                      { backgroundColor: theme.background },
                    ]}
                  >
                    <Ionicons name="fitness" size={24} color={theme.orange} />
                  </View>
                  <View style={styles.diaInfo}>
                    <Text style={[styles.diaNombre, { color: theme.text }]}>
                      {dia.dia}
                    </Text>
                    <Text style={[styles.diaMusculo, { color: "#999" }]}>
                      {dia.musculo}
                    </Text>
                  </View>
                </View>

                <View style={styles.diaHeaderRight}>
                  <Text style={[styles.progressText, { color: "#999" }]}>
                    {completedExercises}/{totalExercises}
                  </Text>
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
                  {dia.ejercicios.map((ejercicio, index) => (
                    <View
                      key={ejercicio.id}
                      style={[
                        styles.ejercicioItem,
                        index !== dia.ejercicios.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: "rgba(255,255,255,0.1)",
                        },
                      ]}
                    >
                      <TouchableOpacity style={styles.ejercicioContent}>
                        <View
                          style={[
                            styles.checkCircle,
                            ejercicio.completado && {
                              backgroundColor: theme.orange,
                            },
                          ]}
                        >
                          {ejercicio.completado && (
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          )}
                        </View>

                        <View style={styles.ejercicioInfo}>
                          <Text
                            style={[
                              styles.ejercicioNombre,
                              { color: theme.text },
                              ejercicio.completado && {
                                textDecorationLine: "line-through",
                                opacity: 0.6,
                              },
                            ]}
                          >
                            {ejercicio.nombre}
                          </Text>
                          <View style={styles.ejercicioDetalles}>
                            <Text style={styles.ejercicioDetalle}>
                              {ejercicio.series} series
                            </Text>
                            <Text style={styles.ejercicioDetalle}> • </Text>
                            <Text style={styles.ejercicioDetalle}>
                              {ejercicio.repeticiones} reps
                            </Text>
                            {ejercicio.peso && (
                              <>
                                <Text style={styles.ejercicioDetalle}> • </Text>
                                <Text style={styles.ejercicioDetalle}>
                                  {ejercicio.peso}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Botón de completar día */}
                  <TouchableOpacity
                    style={[
                      styles.completeDayButton,
                      { backgroundColor: theme.orange },
                    ]}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.completeDayText}>
                      Marcar día como completado
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* Estadísticas de la semana */}
        <View
          style={[styles.statsContainer, { backgroundColor: theme.tabsBack }]}
        >
          <Text style={[styles.statsTitle, { color: theme.text }]}>
            Progreso Semanal
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.orange }]}>
                3
              </Text>
              <Text style={styles.statLabel}>Días activos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.orange }]}>
                12
              </Text>
              <Text style={styles.statLabel}>Ejercicios</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.orange }]}>
                0/3
              </Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
          </View>
        </View>
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
                  <Text style={[styles.menuTitle, { color: theme.text }]}>
                    Recomendación IA
                  </Text>
                  <Text style={styles.menuSubtitle}>
                    Deja que la IA cree tu rutina
                  </Text>
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
                  <Text style={[styles.menuTitle, { color: theme.text }]}>
                    Crear Rutina Personalizada
                  </Text>
                  <Text style={styles.menuSubtitle}>
                    Define tus propios ejercicios
                  </Text>
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
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
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
  diaContainer: {
    marginBottom: 15,
  },
  diaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  diaHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  diaIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  diaInfo: {
    flex: 1,
  },
  diaNombre: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  diaMusculo: {
    fontSize: 14,
  },
  diaHeaderRight: {
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
    alignItems: "center",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#666",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
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
  },
  ejercicioDetalle: {
    fontSize: 13,
    color: "#999",
  },
  completeDayButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    margin: 12,
    borderRadius: 10,
    gap: 8,
  },
  completeDayText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  statsContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#999",
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
    shadowColor: "#FF7E33",
    shadowOpacity: 0.4,
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
});