import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Ejercicio {
  id: string;
  nombre: string;
  series: string;
  minReps: string;
  maxReps: string;
  peso: string;
  musculo: string;
  intensidad: string;
  descripcionEj: string;
  kcal: string;
  minutes: string;
}

export default function CreateRoutine() {
  const themeContext = useContext(ThemeContext);
  const router = useRouter();
  const { routinesAPI, exercisesAPI } = useContext(DataContext);

  const [nombreRutina, setNombreRutina] = useState("");
  const [descripcion, setDescripcion] = useState("");
  // Obtener el día de hoy en español
  const hoy = new Date();
  const diaHoy = hoy.toLocaleDateString("es-ES", { weekday: "long" });

  // Capitalizar la primera letra
  const diaHoyCapitalizado = diaHoy.charAt(0).toUpperCase() + diaHoy.slice(1);

  // Estado inicial con el día de hoy
  const [diaAsignado, setDiaAsignado] = useState(diaHoyCapitalizado);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado para nuevo ejercicio
  const [nuevoEjercicio, setNuevoEjercicio] = useState({
    nombre: "",
    series: "",
    minReps: "",
    maxReps: "",
    peso: "",
    musculo: "",
    intensidad: "media",
    descripcionEj: "",
    kcal: "",
    minutes: "",
  });

  const { theme } = themeContext;

  const gruposMusculares = [
    "Pecho",
    "Espalda",
    "Piernas",
    "Hombros",
    "Brazos",
    "Abdomen",
    "Cardio",
  ];

  const intensidades = ["baja", "media", "alta"];

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const handleAddEjercicio = () => {
    if (
      !nuevoEjercicio.nombre ||
      !nuevoEjercicio.series ||
      !nuevoEjercicio.minReps ||
      !nuevoEjercicio.maxReps
    ) {
      Alert.alert(
        "Error",
        "Por favor completa los campos obligatorios: nombre, series y repeticiones"
      );
      return;
    }

    if (!nuevoEjercicio.musculo) {
      Alert.alert("Error", "Por favor selecciona un grupo muscular");
      return;
    }

    const ejercicio: Ejercicio = {
      id: Date.now().toString(),
      nombre: nuevoEjercicio.nombre,
      series: nuevoEjercicio.series,
      minReps: nuevoEjercicio.minReps,
      maxReps: nuevoEjercicio.maxReps,
      peso: nuevoEjercicio.peso,
      musculo: nuevoEjercicio.musculo,
      intensidad: nuevoEjercicio.intensidad,
      descripcionEj: nuevoEjercicio.descripcionEj,
      kcal: nuevoEjercicio.kcal,
      minutes: nuevoEjercicio.minutes,
    };

    setEjercicios([...ejercicios, ejercicio]);
    setNuevoEjercicio({
      nombre: "",
      series: "",
      minReps: "",
      maxReps: "",
      peso: "",
      musculo: "",
      intensidad: "media",
      descripcionEj: "",
      kcal: "",
      minutes: "",
    });
    setModalVisible(false);
  };

  const handleRemoveEjercicio = (id: string) => {
    setEjercicios(ejercicios.filter((e) => e.id !== id));
  };

  const handleSaveRoutine = async () => {
    if (!nombreRutina) {
      Alert.alert("Error", "Por favor ingresa un nombre para la rutina");
      return;
    }

    if (ejercicios.length === 0) {
      Alert.alert("Error", "Agrega al menos un ejercicio");
      return;
    }

    if (!diaAsignado) {
      Alert.alert(
        "Error",
        "Por favor selecciona un día de la semana para esta rutina"
      );
      return;
    }

    setLoading(true);

    try {
      const routinePayload = {
        name: nombreRutina.trim(),
        day: diaAsignado,
        description: descripcion.trim() || null,
      };

      const routineSuccess = await routinesAPI.create(routinePayload);
      if (!routineSuccess) {
        Alert.alert("Error", "No se pudo crear la rutina");
        setLoading(false);
        return;
      }

      const routines = await routinesAPI.getAll();
      const lastRoutine = routines?.[routines.length - 1];

      if (!lastRoutine) {
        Alert.alert("Error", "No se pudo obtener el ID de la rutina");
        setLoading(false);
        return;
      }

      for (const ejercicio of ejercicios) {
        const exercisePayload = {
          name: ejercicio.nombre,
          series: parseInt(ejercicio.series),
          min_reps: parseInt(ejercicio.minReps),
          max_reps: parseInt(ejercicio.maxReps),
          weight: ejercicio.peso ? parseFloat(ejercicio.peso) : null,
          muscle_group: ejercicio.musculo,
          kcal: ejercicio.kcal ? parseInt(ejercicio.kcal) : null,
          minutes: ejercicio.minutes ? parseInt(ejercicio.minutes) : null,
          intensity: ejercicio.intensidad,
          description: ejercicio.descripcionEj || null,
          routine_id: lastRoutine.id,
        };

        const exerciseSuccess = await exercisesAPI.create(exercisePayload);
        if (!exerciseSuccess) {
          Alert.alert(
            "Error",
            `No se pudo crear el ejercicio: ${ejercicio.nombre}`
          );
          setLoading(false);
          return;
        }
      }

      setLoading(false);

      Alert.alert(
        "¡Éxito!",
        `Rutina "${nombreRutina}" creada para el ${diaAsignado} con ${ejercicios.length} ejercicio(s)`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error guardando rutina:", error);
      Alert.alert("Error", "Ocurrió un error al guardar la rutina");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
          <Text style={[styles.backText, { color: theme.text }]}>Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.orange },
            loading && { opacity: 0.5 },
          ]}
          onPress={handleSaveRoutine}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Guardando..." : "Guardar"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.title, { color: theme.text }]}>Nueva Rutina</Text>

        {/* Nombre */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>
            Nombre de la rutina *
          </Text>
          <View style={[styles.input, { borderColor: "#444" }]}>
            <Ionicons name="fitness" size={20} color={theme.text} />
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholder="Ej: Rutina de Fuerza"
              placeholderTextColor="#666"
              value={nombreRutina}
              onChangeText={setNombreRutina}
            />
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>
            Descripción (opcional)
          </Text>
          <View
            style={[
              styles.textareaContainer,
              { borderColor: "#444", backgroundColor: theme.tabsBack },
            ]}
          >
            <TextInput
              style={[styles.textarea, { color: theme.text }]}
              placeholder="Describe tu rutina..."
              placeholderTextColor="#666"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Día */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>
            Día asignado *
          </Text>
          <View
            style={[
              styles.pickerContainer,
              {
                borderColor: diaAsignado ? "#444" : theme.orange,
                backgroundColor: theme.tabsBack,
              },
            ]}
          >
            <Picker
              selectedValue={diaAsignado}
              onValueChange={(value) => setDiaAsignado(value)}
              style={{ color: theme.text }}
              dropdownIconColor={theme.text}
            >
              <Picker.Item label="Selecciona un día" value="" />
              {diasSemana.map((dia) => (
                <Picker.Item key={dia} label={dia} value={dia} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Ejercicios */}
        <View style={styles.section}>
          <View style={styles.ejerciciosHeader}>
            <Text style={[styles.label, { color: theme.text }]}>
              Ejercicios ({ejercicios.length})
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.orange }]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {ejercicios.length === 0 ? (
            <View
              style={[
                styles.emptyContainer,
                { backgroundColor: theme.tabsBack },
              ]}
            >
              <Ionicons name="barbell-outline" size={48} color="#666" />
              <Text style={styles.emptyText}>No hay ejercicios agregados</Text>
              <Text style={styles.emptySubtext}>
                Toca Agregar para comenzar
              </Text>
            </View>
          ) : (
            ejercicios.map((ejercicio) => (
              <View
                key={ejercicio.id}
                style={[
                  styles.ejercicioCard,
                  { backgroundColor: theme.tabsBack },
                ]}
              >
                <View style={styles.ejercicioContent}>
                  <View style={styles.ejercicioLeft}>
                    <Text
                      style={[styles.ejercicioNombre, { color: theme.text }]}
                    >
                      {ejercicio.nombre}
                    </Text>

                    <View style={styles.ejercicioDetails}>
                      <Text style={styles.ejercicioDetail}>
                        {ejercicio.series} series
                      </Text>
                      <Text style={styles.ejercicioDetail}> • </Text>
                      <Text style={styles.ejercicioDetail}>
                        {ejercicio.minReps}-{ejercicio.maxReps} reps
                      </Text>

                      {ejercicio.peso && (
                        <>
                          <Text style={styles.ejercicioDetail}> • </Text>
                          <Text style={styles.ejercicioDetail}>
                            {ejercicio.peso}kg
                          </Text>
                        </>
                      )}
                    </View>

                    <View style={styles.ejercicioDetails}>
                      <Text
                        style={[
                          styles.ejercicioDetail,
                          { textTransform: "capitalize" },
                        ]}
                      >
                        Intensidad: {ejercicio.intensidad}
                      </Text>
                    </View>

                    {ejercicio.musculo && (
                      <View style={styles.musculoBadge}>
                        <Text style={styles.musculoText}>
                          {ejercicio.musculo}
                        </Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => handleRemoveEjercicio(ejercicio.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={theme.red}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* MODAL DE EJERCICIOS */}
      {/* MODAL DE EJERCICIOS */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.background },
              ]}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Agregar Ejercicio
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScroll}
                keyboardShouldPersistTaps="handled"
              >
                {/* Nombre */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalLabel, { color: theme.text }]}>
                    Nombre del ejercicio *
                  </Text>
                  <View style={[styles.input, { borderColor: "#444" }]}>
                    <Ionicons name="barbell" size={20} color={theme.text} />
                    <TextInput
                      style={[styles.textInput, { color: theme.text }]}
                      placeholder="Ej: Press de banca"
                      placeholderTextColor="#666"
                      value={nuevoEjercicio.nombre}
                      onChangeText={(text) =>
                        setNuevoEjercicio({ ...nuevoEjercicio, nombre: text })
                      }
                    />
                  </View>
                </View>

                {/* Series */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalLabel, { color: theme.text }]}>
                    Series *
                  </Text>
                  <View style={[styles.input, { borderColor: "#444" }]}>
                    <TextInput
                      style={[styles.textInput, { color: theme.text }]}
                      placeholder="Ej: 4"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={nuevoEjercicio.series}
                      onChangeText={(text) =>
                        setNuevoEjercicio({ ...nuevoEjercicio, series: text })
                      }
                    />
                  </View>
                </View>

                {/* Reps */}
                <View style={styles.modalRow}>
                  <View
                    style={[styles.modalSection, { flex: 1, marginRight: 8 }]}
                  >
                    <Text style={[styles.modalLabel, { color: theme.text }]}>
                      Reps Mínimas *
                    </Text>
                    <View style={[styles.input, { borderColor: "#444" }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.text }]}
                        placeholder="Ej: 8"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={nuevoEjercicio.minReps}
                        onChangeText={(text) =>
                          setNuevoEjercicio({
                            ...nuevoEjercicio,
                            minReps: text,
                          })
                        }
                      />
                    </View>
                  </View>

                  <View
                    style={[styles.modalSection, { flex: 1, marginLeft: 8 }]}
                  >
                    <Text style={[styles.modalLabel, { color: theme.text }]}>
                      Reps Máximas *
                    </Text>
                    <View style={[styles.input, { borderColor: "#444" }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.text }]}
                        placeholder="Ej: 12"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={nuevoEjercicio.maxReps}
                        onChangeText={(text) =>
                          setNuevoEjercicio({
                            ...nuevoEjercicio,
                            maxReps: text,
                          })
                        }
                      />
                    </View>
                  </View>
                </View>

                {/* Peso */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalLabel, { color: theme.text }]}>
                    Peso (kg) - Opcional
                  </Text>
                  <View style={[styles.input, { borderColor: "#444" }]}>
                    <Ionicons name="speedometer" size={20} color={theme.text} />
                    <TextInput
                      style={[styles.textInput, { color: theme.text }]}
                      placeholder="Ej: 60"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={nuevoEjercicio.peso}
                      onChangeText={(text) =>
                        setNuevoEjercicio({ ...nuevoEjercicio, peso: text })
                      }
                    />
                  </View>
                </View>

                {/* Kcal */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalLabel, { color: theme.text }]}>
                    Kcal *
                  </Text>
                  <View style={[styles.input, { borderColor: "#444" }]}>
                    <TextInput
                      style={[styles.textInput, { color: theme.text }]}
                      placeholder="Ej: 150"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={nuevoEjercicio.kcal}
                      onChangeText={(text) =>
                        setNuevoEjercicio({ ...nuevoEjercicio, kcal: text })
                      }
                    />
                  </View>
                </View>

                {/* Minutes */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalLabel, { color: theme.text }]}>
                    Minutos en total *
                  </Text>
                  <View style={[styles.input, { borderColor: "#444" }]}>
                    <TextInput
                      style={[styles.textInput, { color: theme.text }]}
                      placeholder="Ej: 10"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={nuevoEjercicio.minutes}
                      onChangeText={(text) =>
                        setNuevoEjercicio({ ...nuevoEjercicio, minutes: text })
                      }
                    />
                  </View>
                </View>

                {/* Grupo muscular */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalLabel, { color: theme.text }]}>
                    Grupo muscular *
                  </Text>
                  <View
                    style={[
                      styles.pickerContainer,
                      { borderColor: "#444", backgroundColor: theme.tabsBack },
                    ]}
                  >
                    <Picker
                      selectedValue={nuevoEjercicio.musculo}
                      onValueChange={(value) =>
                        setNuevoEjercicio({ ...nuevoEjercicio, musculo: value })
                      }
                      style={{ color: theme.text }}
                      dropdownIconColor={theme.text}
                    >
                      <Picker.Item label="Selecciona un grupo" value="" />
                      {gruposMusculares.map((grupo) => (
                        <Picker.Item key={grupo} label={grupo} value={grupo} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Intensidad */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalLabel, { color: theme.text }]}>
                    Intensidad *
                  </Text>
                  <View
                    style={[
                      styles.pickerContainer,
                      { borderColor: "#444", backgroundColor: theme.tabsBack },
                    ]}
                  >
                    <Picker
                      selectedValue={nuevoEjercicio.intensidad}
                      onValueChange={(value) =>
                        setNuevoEjercicio({
                          ...nuevoEjercicio,
                          intensidad: value,
                        })
                      }
                      style={{ color: theme.text }}
                      dropdownIconColor={theme.text}
                    >
                      {intensidades.map((nivel) => (
                        <Picker.Item
                          key={nivel}
                          label={nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                          value={nivel}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Descripción */}
                <View style={styles.modalSection}>
                  <Text style={[styles.modalLabel, { color: theme.text }]}>
                    Descripción (opcional)
                  </Text>
                  <View
                    style={[
                      styles.textareaContainer,
                      { borderColor: "#444", backgroundColor: theme.tabsBack },
                    ]}
                  >
                    <TextInput
                      style={[styles.textarea, { color: theme.text }]}
                      placeholder="Describe el ejercicio..."
                      placeholderTextColor="#666"
                      value={nuevoEjercicio.descripcionEj}
                      onChangeText={(text) =>
                        setNuevoEjercicio({
                          ...nuevoEjercicio,
                          descripcionEj: text,
                        })
                      }
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                {/* Botón agregar */}
                <TouchableOpacity
                  style={[
                    styles.modalAddButton,
                    { backgroundColor: theme.orange },
                  ]}
                  onPress={handleAddEjercicio}
                >
                  <Text style={styles.modalAddButtonText}>
                    Agregar Ejercicio
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// Aquí termina el archivo

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 17,
    marginLeft: 4,
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  textareaContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
  },
  textarea: {
    fontSize: 16,
    textAlignVertical: "top",
  },
  ejerciciosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  ejercicioCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ejercicioContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ejercicioLeft: {
    flex: 1,
  },
  ejercicioNombre: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  ejercicioDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ejercicioDetail: {
    fontSize: 13,
    color: "#999",
  },
  musculoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 126, 51, 0.2)",
    marginTop: 6,
  },
  musculoText: {
    fontSize: 12,
    color: "#FF7E33",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalScroll: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: "row",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalAddButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  modalAddButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
