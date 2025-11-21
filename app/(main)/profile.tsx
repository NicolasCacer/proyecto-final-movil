import { AuthContext } from "@/context/AuthContext";
import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const themeContext = useContext(ThemeContext);
  const authContext = useContext(AuthContext);
  const { activitiesAPI } = useContext(DataContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("datos");
  
  const [formData, setFormData] = useState({
    nombre: authContext.user?.name || "",
    apellido: authContext.user?.lastname || "",
    correo: authContext.user?.email || "",
    contraseña: "••••••••",
  });

  // Estado para historial de peso
  const [historialPeso, setHistorialPeso] = useState<
    { fecha: string; peso: number; id: string }[]
  >([]);
  const [modalPesoVisible, setModalPesoVisible] = useState(false);
  const [nuevoPeso, setNuevoPeso] = useState("");

  // Cargar historial de peso desde activities
  const cargarHistorialPeso = useCallback(async () => {
    // Por ahora, usamos el peso actual del usuario
    if (authContext.user) {
      const inicial = {
        id: "inicial",
        fecha: new Date().toISOString(),
        peso: authContext.user.actualweight,
      };
      
      setHistorialPeso([inicial]);
    }
  }, [authContext.user]);

  useFocusEffect(
    useCallback(() => {
      cargarHistorialPeso();
    }, [cargarHistorialPeso])
  );

  if (!themeContext) return null;
  const { theme, toggleTheme } = themeContext;

  const tabs = [
    { id: "datos", label: "Mis Datos" },
    { id: "objetivos", label: "Objetivos" },
    { id: "configuracion", label: "Configuración" },
  ];

  const isDarkMode = theme.background === "#181114";

  // Función para formatear el nivel de actividad
  const formatActivityLevel = (level: string) => {
    const levels: { [key: string]: string } = {
      "Baja": "2-3 días a la semana",
      "Intermedia": "3-4 días a la semana",
      "Alta": "5-6 días a la semana",
      "Nula": "0-1 días a la semana",
    };
    return levels[level] || level;
  };

  // Función para calcular diferencia de peso
  const calcularDiferenciaPeso = () => {
    if (!authContext.user) return "";
    const diferencia = authContext.user.targetweight - authContext.user.actualweight;
    if (diferencia > 0) {
      return `Ganar ${Math.abs(diferencia).toFixed(1)} kg`;
    } else if (diferencia < 0) {
      return `Bajar ${Math.abs(diferencia).toFixed(1)} kg`;
    } else {
      return "Mantener peso";
    }
  };

  // Función para agregar nuevo peso
  const handleAgregarPeso = async () => {
    const peso = parseFloat(nuevoPeso);
    
    if (isNaN(peso) || peso < 20 || peso > 400) {
      Alert.alert("Error", "Por favor ingresa un peso válido entre 20 y 400 kg");
      return;
    }

    // Actualizar el peso actual del usuario
    if (authContext.user) {
      const success = await authContext.updateUser({
        actualweight: peso,
      });

      if (success) {
        // Agregar al historial
        const nuevoRegistro = {
          id: Date.now().toString(),
          fecha: new Date().toISOString(),
          peso: peso,
        };

        setHistorialPeso([nuevoRegistro, ...historialPeso]);
        setNuevoPeso("");
        setModalPesoVisible(false);
        Alert.alert("¡Éxito!", "Peso actualizado correctamente");
        
        // Refrescar usuario
        await authContext.refreshUser();
      } else {
        Alert.alert("Error", "No se pudo actualizar el peso");
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header con Segmented Control */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[theme.orange, theme.red]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.segmentedControlContainer}
        >
          <View style={styles.segmentedControl}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.segment,
                  activeTab === tab.id && [
                    styles.activeSegment,
                    { backgroundColor: theme.background },
                  ],
                  index === 0 && styles.firstSegment,
                  index === tabs.length - 1 && styles.lastSegment,
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === tab.id
                      ? { color: theme.text }
                      : { color: "rgba(255,255,255,0.7)" },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {activeTab === "datos" && (
          <View style={styles.datosContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Datos personales
              </Text>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: theme.tabsBack }]}
              >
                <Ionicons name="pencil" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Profile Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid&w=740&q=80",
                }}
                style={[styles.profileImage, { borderColor: theme.orange }]}
              />
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Nombre y Apellido en fila */}
              <View style={styles.row}>
                <View style={[styles.inputWrapper, styles.halfWidth]}>
                  <View
                    style={[styles.inputContainer, { borderColor: "#444" }]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.text}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      value={formData.nombre}
                      onChangeText={(text) =>
                        setFormData({ ...formData, nombre: text })
                      }
                      placeholderTextColor="#666"
                    />
                  </View>
                  <Text style={styles.label}>Nombre</Text>
                </View>

                <View style={[styles.inputWrapper, styles.halfWidth]}>
                  <View
                    style={[styles.inputContainer, { borderColor: "#444" }]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.text}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      value={formData.apellido}
                      onChangeText={(text) =>
                        setFormData({ ...formData, apellido: text })
                      }
                      placeholderTextColor="#666"
                    />
                  </View>
                  <Text style={styles.label}>Apellido</Text>
                </View>
              </View>

              {/* Correo */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, { borderColor: "#444" }]}>
                  <Ionicons name="mail-outline" size={20} color={theme.text} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={formData.correo}
                    onChangeText={(text) =>
                      setFormData({ ...formData, correo: text })
                    }
                    keyboardType="email-address"
                    placeholderTextColor="#666"
                  />
                </View>
                <Text style={styles.label}>Correo</Text>
              </View>

              {/* Contraseña */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, { borderColor: "#444" }]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={theme.text}
                  />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={formData.contraseña}
                    onChangeText={(text) =>
                      setFormData({ ...formData, contraseña: text })
                    }
                    secureTextEntry
                    placeholderTextColor="#666"
                  />
                </View>
                <Text style={styles.label}>Contraseña</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "objetivos" && authContext.user && (
          <View style={styles.objetivosContent}>
            {/* Objetivo Principal */}
            <TouchableOpacity
              style={[styles.objetivoCard, { borderColor: "#444" }]}
            >
              <Ionicons
                name="scale-outline"
                size={20}
                color={theme.text}
                style={styles.objetivoIcon}
              />
              <Text style={[styles.objetivoText, { color: theme.text }]}>
                {calcularDiferenciaPeso()}
              </Text>
            </TouchableOpacity>

            {/* Frecuencia */}
            <TouchableOpacity
              style={[styles.objetivoCard, { borderColor: "#444" }]}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.text}
                style={styles.objetivoIcon}
              />
              <Text style={[styles.objetivoText, { color: theme.text }]}>
                {formatActivityLevel(authContext.user.activitylevel)}
              </Text>
            </TouchableOpacity>

            {/* Recomendaciones */}
            <View
              style={[
                styles.recomendacionesCard,
                { borderColor: "#444", backgroundColor: theme.tabsBack },
              ]}
            >
              <View style={styles.recomendacionesHeader}>
                <Ionicons
                  name="bulb"
                  size={20}
                  color={theme.orange}
                  style={styles.objetivoIcon}
                />
                <Text
                  style={[styles.recomendacionesTitle, { color: theme.text }]}
                >
                  Recomendaciones basadas en tu objetivo
                </Text>
              </View>

              <View style={styles.recomendacionesList}>
                <Text style={[styles.bulletItem, { color: theme.text }]}>
                  • Calorías diarias recomendadas:{" "}
                  <Text style={styles.bulletValue}>2.200 kcal</Text>
                </Text>
                <Text style={[styles.bulletItem, { color: theme.text }]}>
                  • Proteína diaria:{" "}
                  <Text style={styles.bulletValue}>140-160g</Text>
                </Text>
                <Text style={[styles.bulletItem, { color: theme.text }]}>
                  • Entrenamientos por semana:{" "}
                  <Text style={styles.bulletValue}>4-5</Text>
                </Text>
                <Text style={[styles.bulletItem, { color: theme.text }]}>
                  • Descanso entre entrenamientos:{" "}
                  <Text style={styles.bulletValue}>48h por grupo muscular</Text>
                </Text>
              </View>
            </View>

            {/* Historial de Peso */}
            <View style={styles.historialSection}>
              <View style={styles.historialHeader}>
                <Text style={[styles.historialTitle, { color: theme.text }]}>
                  Historial de Peso
                </Text>
                <TouchableOpacity
                  style={[styles.addPesoButton, { backgroundColor: theme.orange }]}
                  onPress={() => setModalPesoVisible(true)}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.addPesoButtonText}>Actualizar</Text>
                </TouchableOpacity>
              </View>

              {historialPeso.map((registro, index) => (
                <View
                  key={registro.id}
                  style={[
                    styles.historialItem,
                    { backgroundColor: theme.tabsBack },
                  ]}
                >
                  <View>
                    <Text style={[styles.historialFecha, { color: theme.text }]}>
                      {new Date(registro.fecha).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    {index === 0 && (
                      <Text style={[styles.historialLabel, { color: "#999" }]}>
                        Peso actual
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.historialPeso, { color: theme.text }]}>
                    {registro.peso} kg
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "configuracion" && (
          <View style={styles.configContent}>
            {/* Modo Oscuro */}
            <View
              style={[styles.configItem, { backgroundColor: theme.tabsBack }]}
            >
              <View style={styles.configLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons
                    name={isDarkMode ? "moon" : "sunny"}
                    size={24}
                    color={theme.orange}
                  />
                </View>
                <View style={styles.configTextContainer}>
                  <Text style={[styles.configTitle, { color: theme.text }]}>
                    Modo Oscuro
                  </Text>
                  <Text style={styles.configSubtitle}>
                    {isDarkMode ? "Activado" : "Desactivado"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: theme.orange }}
                thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>

            {/* Notificaciones */}
            <View
              style={[styles.configItem, { backgroundColor: theme.tabsBack }]}
            >
              <View style={styles.configLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={theme.orange}
                  />
                </View>
                <View style={styles.configTextContainer}>
                  <Text style={[styles.configTitle, { color: theme.text }]}>
                    Notificaciones
                  </Text>
                  <Text style={styles.configSubtitle}>
                    Recibe alertas y recordatorios
                  </Text>
                </View>
              </View>
              <Switch
                value={true}
                trackColor={{ false: "#767577", true: theme.orange }}
                thumbColor="#fff"
                ios_backgroundColor="#3e3e3e"
              />
            </View>

            {/* Cerrar Sesión */}
            <TouchableOpacity
              style={[styles.configItem, styles.logoutItem]}
              onPress={async () => {
                await authContext.logout();
                router.push("/(auth)/login");
              }}
            >
              <View style={styles.configLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: "rgba(255, 22, 10, 0.1)" },
                  ]}
                >
                  <Ionicons name="log-out" size={24} color={theme.red} />
                </View>
                <View style={styles.configTextContainer}>
                  <Text style={[styles.configTitle, { color: theme.red }]}>
                    Cerrar Sesión
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal para agregar peso */}
      <Modal
        visible={modalPesoVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalPesoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Actualizar Peso
              </Text>
              <TouchableOpacity onPress={() => setModalPesoVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.modalLabel, { color: theme.text }]}>
                Peso actual (kg)
              </Text>
              <View style={[styles.modalInput, { borderColor: "#444" }]}>
                <Ionicons name="scale" size={20} color={theme.text} />
                <TextInput
                  style={[styles.modalTextInput, { color: theme.text }]}
                  placeholder="Ej: 75.5"
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                  value={nuevoPeso}
                  onChangeText={setNuevoPeso}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.orange },
                ]}
                onPress={handleAgregarPeso}
              >
                <Text style={styles.modalButtonText}>Guardar Peso</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  segmentedControlContainer: {
    borderRadius: 12,
    padding: 3,
  },
  segmentedControl: {
    flexDirection: "row",
    borderRadius: 10,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeSegment: {
    borderRadius: 8,
  },
  firstSegment: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastSegment: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  datosContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  formContainer: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  inputWrapper: {
    marginBottom: 8,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  label: {
    color: "#999",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  objetivosContent: {
    padding: 20,
    gap: 15,
  },
  objetivoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  objetivoIcon: {
    marginRight: 12,
  },
  objetivoText: {
    fontSize: 16,
    flex: 1,
  },
  recomendacionesCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  recomendacionesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  recomendacionesTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  recomendacionesList: {
    gap: 10,
  },
  bulletItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  bulletValue: {
    fontWeight: "600",
  },
  historialSection: {
    marginTop: 20,
  },
  historialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  historialTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addPesoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addPesoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  historialItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  historialFecha: {
    fontSize: 15,
    marginBottom: 4,
  },
  historialLabel: {
    fontSize: 12,
  },
  historialPeso: {
    fontSize: 16,
    fontWeight: "600",
  },
  configContent: {
    padding: 20,
    gap: 15,
  },
  configItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
  },
  configLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  configTextContainer: {
    flex: 1,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  configSubtitle: {
    fontSize: 13,
    color: "#888",
  },
  logoutItem: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255, 22, 10, 0.3)",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalBody: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  modalInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    marginBottom: 20,
  },
  modalTextInput: {
    flex: 1,
    fontSize: 16,
  },
  modalButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});