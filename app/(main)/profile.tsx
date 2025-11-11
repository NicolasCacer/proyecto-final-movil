import { ThemeContext } from "@/context/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useState } from "react";
import {
  Image,
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
  const [activeTab, setActiveTab] = useState("datos");
  const [formData, setFormData] = useState({
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan.perez@example.com",
    contraseña: "••••••••",
  });

  // Datos de ejemplo para Objetivos
  const [objetivos, setObjetivos] = useState({
    objetivo: "Bajar de peso",
    frecuencia: "2-4 días a la semana",
    recomendaciones: {
      calorias: "2.200 kcal",
      proteina: "140-160g",
      entrenamientos: "4-5",
      descanso: "48h por grupo muscular",
    },
    historialPeso: [
      { fecha: "Martes 16 de diciembre", peso: "70 kg" },
      { fecha: "Lunes 14 de enero", peso: "68 kg" },
    ],
  });

  if (!themeContext) return null;
  const { theme, toggleTheme } = themeContext;

  const tabs = [
    { id: "datos", label: "Mis Datos" },
    { id: "objetivos", label: "Objetivos" },
    { id: "configuracion", label: "Configuración" },
  ];

  const isDarkMode = theme.background === "#181114";

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
                style={[
                  styles.editButton,
                  { backgroundColor: theme.tabsBack },
                ]}
              >
                <Ionicons name="pencil" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Profile Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://s1.elespanol.com/2022/06/03/actualidad/677442473_224809016_1706x1511.jpg",
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

        {activeTab === "objetivos" && (
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
                {objetivos.objetivo}
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
                {objetivos.frecuencia}
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
                  name="lock-closed"
                  size={20}
                  color={theme.text}
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
                  <Text style={styles.bulletValue}>
                    {objetivos.recomendaciones.calorias}
                  </Text>
                </Text>
                <Text style={[styles.bulletItem, { color: theme.text }]}>
                  • Proteína diaria:{" "}
                  <Text style={styles.bulletValue}>
                    {objetivos.recomendaciones.proteina}
                  </Text>
                </Text>
                <Text style={[styles.bulletItem, { color: theme.text }]}>
                  • Entrenamientos por semana:{" "}
                  <Text style={styles.bulletValue}>
                    {objetivos.recomendaciones.entrenamientos}
                  </Text>
                </Text>
                <Text style={[styles.bulletItem, { color: theme.text }]}>
                  • Descanso entre entrenamientos:{" "}
                  <Text style={styles.bulletValue}>
                    {objetivos.recomendaciones.descanso}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Historial de Peso */}
            <View style={styles.historialSection}>
              <Text style={[styles.historialTitle, { color: theme.text }]}>
                Historial de Peso
              </Text>

              {objetivos.historialPeso.map((registro, index) => (
                <View
                  key={index}
                  style={[
                    styles.historialItem,
                    { backgroundColor: theme.tabsBack },
                  ]}
                >
                  <Text style={[styles.historialFecha, { color: theme.text }]}>
                    {registro.fecha}
                  </Text>
                  <Text style={[styles.historialPeso, { color: theme.text }]}>
                    {registro.peso}
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

            {/* Idioma */}
            <TouchableOpacity
              style={[styles.configItem, { backgroundColor: theme.tabsBack }]}
            >
              <View style={styles.configLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons name="globe" size={24} color={theme.orange} />
                </View>
                <View style={styles.configTextContainer}>
                  <Text style={[styles.configTitle, { color: theme.text }]}>
                    Idioma
                  </Text>
                  <Text style={styles.configSubtitle}>Español</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            {/* Privacidad */}
            <TouchableOpacity
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
                    name="shield-checkmark"
                    size={24}
                    color={theme.orange}
                  />
                </View>
                <View style={styles.configTextContainer}>
                  <Text style={[styles.configTitle, { color: theme.text }]}>
                    Privacidad
                  </Text>
                  <Text style={styles.configSubtitle}>Gestiona tus datos</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            {/* Ayuda */}
            <TouchableOpacity
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
                    name="help-circle"
                    size={24}
                    color={theme.orange}
                  />
                </View>
                <View style={styles.configTextContainer}>
                  <Text style={[styles.configTitle, { color: theme.text }]}>
                    Ayuda y Soporte
                  </Text>
                  <Text style={styles.configSubtitle}>Centro de ayuda</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            {/* Cerrar Sesión */}
            <TouchableOpacity style={[styles.configItem, styles.logoutItem]}>
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
  historialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
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
});