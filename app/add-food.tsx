import { ThemeContext } from "@/context/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddFood() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);
  
  const [step, setStep] = useState(1); // 1: Tipo de comida, 2: Agregar alimentos
  const [tipoComida, setTipoComida] = useState("");
  const [hora, setHora] = useState("");
  const [alimentos, setAlimentos] = useState<any[]>([]);
  
  // Modal para agregar alimento
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [nuevoAlimento, setNuevoAlimento] = useState({
    nombre: "",
    calorias: "",
    proteina: "",
    carbohidratos: "",
    grasas: "",
    porcion: "",
  });

  if (!themeContext) return null;
  const { theme } = themeContext;

  const tiposComida = ["Desayuno", "Almuerzo", "Merienda", "Cena", "Snack"];

  const handleNextStep = () => {
    if (step === 1) {
      if (!tipoComida) {
        Alert.alert("Error", "Selecciona el tipo de comida");
        return;
      }
      if (!hora) {
        Alert.alert("Error", "Ingresa la hora");
        return;
      }
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleAgregarAlimento = () => {
    if (!nuevoAlimento.nombre.trim()) {
      Alert.alert("Error", "Ingresa el nombre del alimento");
      return;
    }
    if (!nuevoAlimento.calorias) {
      Alert.alert("Error", "Ingresa las calorías");
      return;
    }

    const alimento = {
      id: `alimento-${Date.now()}`,
      nombre: nuevoAlimento.nombre,
      calorias: parseInt(nuevoAlimento.calorias),
      proteina: parseInt(nuevoAlimento.proteina) || 0,
      carbohidratos: parseInt(nuevoAlimento.carbohidratos) || 0,
      grasas: parseInt(nuevoAlimento.grasas) || 0,
      porcion: nuevoAlimento.porcion,
    };

    setAlimentos([...alimentos, alimento]);

    // Limpiar formulario
    setNuevoAlimento({
      nombre: "",
      calorias: "",
      proteina: "",
      carbohidratos: "",
      grasas: "",
      porcion: "",
    });
    setModalVisible(false);
  };

  const handleEliminarAlimento = (alimentoId: string) => {
    setAlimentos(alimentos.filter((a) => a.id !== alimentoId));
  };

  const handleGuardarComida = () => {
    if (alimentos.length === 0) {
      Alert.alert("Error", "Agrega al menos un alimento");
      return;
    }

    const comida = {
      id: `comida-${Date.now()}`,
      tipo: tipoComida,
      hora,
      alimentos,
      fechaCreacion: new Date().toISOString(),
    };

    console.log("Comida registrada:", comida);
    Alert.alert("¡Éxito!", "Comida registrada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const totalCalorias = alimentos.reduce((sum, a) => sum + a.calorias, 0);
  const totalProteina = alimentos.reduce((sum, a) => sum + a.proteina, 0);
  const totalCarbohidratos = alimentos.reduce((sum, a) => sum + a.carbohidratos, 0);
  const totalGrasas = alimentos.reduce((sum, a) => sum + a.grasas, 0);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handlePreviousStep}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
          <Text style={[styles.backText, { color: theme.text }]}>
            {step === 1 ? "Cancelar" : "Atrás"}
          </Text>
        </TouchableOpacity>

        {/* Indicadores de paso */}
        <View style={styles.stepIndicators}>
          {[1, 2].map((s) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    s <= step ? theme.orange : "rgba(255,255,255,0.2)",
                },
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Paso 1: Tipo de comida y hora */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>
              Tipo de Comida
            </Text>
            <Text style={[styles.stepSubtitle, { color: "#999" }]}>
              Selecciona el tipo y la hora
            </Text>

            {/* Selector de tipo de comida */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Tipo de comida *
              </Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.pickerInput,
                  { backgroundColor: theme.tabsBack },
                ]}
                onPress={() => setPickerVisible(true)}
              >
                <Text
                  style={{
                    color: tipoComida ? theme.text : "#666",
                  }}
                >
                  {tipoComida || "Seleccionar"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Hora */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Hora *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.tabsBack, color: theme.text },
                ]}
                placeholder="Ej: 08:30 AM"
                placeholderTextColor="#666"
                value={hora}
                onChangeText={setHora}
              />
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.tabsBack }]}>
              <Ionicons name="information-circle" size={20} color={theme.orange} />
              <Text style={[styles.infoText, { color: "#999" }]}>
                Registra cada comida para llevar un control completo de tu nutrición
              </Text>
            </View>
          </View>
        )}

        {/* Paso 2: Agregar alimentos */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: theme.text }]}>
              Alimentos
            </Text>
            <Text style={[styles.stepSubtitle, { color: "#999" }]}>
              Agrega los alimentos de tu {tipoComida.toLowerCase()}
            </Text>

            {/* Resumen de macros */}
            {alimentos.length > 0 && (
              <View
                style={[styles.resumenCard, { backgroundColor: theme.tabsBack }]}
              >
                <Text style={[styles.resumenTitle, { color: theme.text }]}>
                  Resumen
                </Text>
                <View style={styles.macrosGrid}>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroValue, { color: theme.orange }]}>
                      {totalCalorias}
                    </Text>
                    <Text style={styles.macroLabel}>kcal</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroValue, { color: theme.text }]}>
                      {totalProteina}g
                    </Text>
                    <Text style={styles.macroLabel}>proteínas</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroValue, { color: theme.text }]}>
                      {totalCarbohidratos}g
                    </Text>
                    <Text style={styles.macroLabel}>carbohidratos</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={[styles.macroValue, { color: theme.text }]}>
                      {totalGrasas}g
                    </Text>
                    <Text style={styles.macroLabel}>grasas</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Lista de alimentos */}
            <View style={styles.alimentosContainer}>
              {alimentos.length === 0 ? (
                <View
                  style={[
                    styles.emptyState,
                    { backgroundColor: theme.tabsBack },
                  ]}
                >
                  <Ionicons name="fast-food-outline" size={48} color="#666" />
                  <Text style={[styles.emptyText, { color: "#999" }]}>
                    No hay alimentos agregados
                  </Text>
                  <Text style={[styles.emptySubtext, { color: "#666" }]}>
                    Presiona el botón + para agregar
                  </Text>
                </View>
              ) : (
                alimentos.map((alimento) => (
                  <View
                    key={alimento.id}
                    style={[
                      styles.alimentoCard,
                      { backgroundColor: theme.tabsBack },
                    ]}
                  >
                    <View style={styles.alimentoHeader}>
                      <View style={styles.alimentoInfo}>
                        <Text
                          style={[styles.alimentoNombre, { color: theme.text }]}
                        >
                          {alimento.nombre}
                        </Text>
                        {alimento.porcion && (
                          <Text style={styles.alimentoPorcion}>
                            {alimento.porcion}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => handleEliminarAlimento(alimento.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color={theme.red}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.alimentoMacros}>
                      <Text style={styles.alimentoMacro}>
                        {alimento.calorias} kcal
                      </Text>
                      <Text style={styles.alimentoMacro}> • </Text>
                      <Text style={styles.alimentoMacro}>
                        {alimento.proteina}g proteínas
                      </Text>
                      <Text style={styles.alimentoMacro}> • </Text>
                      <Text style={styles.alimentoMacro}>
                        {alimento.carbohidratos}g carbs
                      </Text>
                      <Text style={styles.alimentoMacro}> • </Text>
                      <Text style={styles.alimentoMacro}>
                        {alimento.grasas}g grasas
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Botón para agregar alimento */}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.orange }]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Agregar Alimento</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Botón de acción */}
      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.orange }]}
          onPress={step === 2 ? handleGuardarComida : handleNextStep}
        >
          <Text style={styles.actionButtonText}>
            {step === 2 ? "Guardar Comida" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal para agregar alimento */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Nuevo Alimento
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalInputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Nombre del alimento *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: theme.tabsBack, color: theme.text },
                  ]}
                  placeholder="Ej: Pechuga de pollo"
                  placeholderTextColor="#666"
                  value={nuevoAlimento.nombre}
                  onChangeText={(text) =>
                    setNuevoAlimento({ ...nuevoAlimento, nombre: text })
                  }
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Porción (opcional)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: theme.tabsBack, color: theme.text },
                  ]}
                  placeholder="Ej: 150g, 1 taza"
                  placeholderTextColor="#666"
                  value={nuevoAlimento.porcion}
                  onChangeText={(text) =>
                    setNuevoAlimento({ ...nuevoAlimento, porcion: text })
                  }
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.modalInputGroup, styles.halfWidth]}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Calorías *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: theme.tabsBack, color: theme.text },
                    ]}
                    placeholder="250"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    value={nuevoAlimento.calorias}
                    onChangeText={(text) =>
                      setNuevoAlimento({ ...nuevoAlimento, calorias: text })
                    }
                  />
                </View>

                <View style={[styles.modalInputGroup, styles.halfWidth]}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Proteína (g)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: theme.tabsBack, color: theme.text },
                    ]}
                    placeholder="30"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    value={nuevoAlimento.proteina}
                    onChangeText={(text) =>
                      setNuevoAlimento({ ...nuevoAlimento, proteina: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.modalInputGroup, styles.halfWidth]}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Carbohidratos (g)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: theme.tabsBack, color: theme.text },
                    ]}
                    placeholder="15"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    value={nuevoAlimento.carbohidratos}
                    onChangeText={(text) =>
                      setNuevoAlimento({ ...nuevoAlimento, carbohidratos: text })
                    }
                  />
                </View>

                <View style={[styles.modalInputGroup, styles.halfWidth]}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Grasas (g)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: theme.tabsBack, color: theme.text },
                    ]}
                    placeholder="5"
                    placeholderTextColor="#666"
                    keyboardType="number-pad"
                    value={nuevoAlimento.grasas}
                    onChangeText={(text) =>
                      setNuevoAlimento({ ...nuevoAlimento, grasas: text })
                    }
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.orange }]}
                onPress={handleAgregarAlimento}
              >
                <Text style={styles.modalButtonText}>Agregar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para selector de tipo de comida */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.pickerModalOverlay}>
          <View
            style={[
              styles.pickerModalContent,
              { backgroundColor: theme.background },
            ]}
          >
            <Picker
              selectedValue={tipoComida}
              onValueChange={(itemValue) => {
                setTipoComida(itemValue);
                setPickerVisible(false);
              }}
              style={{ color: theme.text }}
            >
              <Picker.Item label="Selecciona un tipo" value="" />
              {tiposComida.map((tipo) => (
                <Picker.Item key={tipo} label={tipo} value={tipo} />
              ))}
            </Picker>
            <TouchableOpacity
              style={[
                styles.pickerCancelButton,
                { backgroundColor: theme.tabsBack },
              ]}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={[styles.pickerCancelText, { color: theme.text }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  stepIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  pickerInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
  resumenCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  resumenTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  macrosGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  macroItem: {
    alignItems: "center",
  },
  macroValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 11,
    color: "#999",
  },
  alimentosContainer: {
    marginBottom: 24,
  },
  emptyState: {
    padding: 48,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  alimentoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  alimentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  alimentoInfo: {
    flex: 1,
  },
  alimentoNombre: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  alimentoPorcion: {
    fontSize: 12,
    color: "#999",
  },
  alimentoMacros: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  alimentoMacro: {
    fontSize: 12,
    color: "#999",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
    maxHeight: "80%",
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
  modalInputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  modalButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pickerModalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  pickerModalContent: {
    borderRadius: 16,
    overflow: "hidden",
  },
  pickerCancelButton: {
    padding: 16,
    alignItems: "center",
  },
  pickerCancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
});