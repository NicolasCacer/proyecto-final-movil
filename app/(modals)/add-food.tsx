import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
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

export default function AddFood() {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);

  // productsAPI from DataContext
  const { productsAPI } = useContext(DataContext);

  // We keep a simple single-step flow: list of alimentos + modal to add a producto
  const [alimentos, setAlimentos] = useState<any[]>([]);

  // Modal para agregar alimento
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoAlimento, setNuevoAlimento] = useState({
    nombre: "",
    marca: "",
    kcal: "",
    proteins: "",
    carbohydrates: "",
    fats: "",
  });

  const { theme } = themeContext;

  const handleAgregarAlimento = () => {
    if (!nuevoAlimento.nombre.trim()) {
      Alert.alert("Error", "Ingresa el nombre del alimento");
      return;
    }
    if (!nuevoAlimento.kcal) {
      Alert.alert("Error", "Ingresa las calorías (kcal)");
      return;
    }

    const alimento = {
      id: `alimento-${Date.now()}`,
      nombre: nuevoAlimento.nombre,
      marca: nuevoAlimento.marca || null,
      kcal: parseFloat(nuevoAlimento.kcal) || 0,
      proteins: parseFloat(nuevoAlimento.proteins) || 0,
      carbohydrates: parseFloat(nuevoAlimento.carbohydrates) || 0,
      fats: parseFloat(nuevoAlimento.fats) || 0,
    };

    setAlimentos([...alimentos, alimento]);

    setNuevoAlimento({
      nombre: "",
      marca: "",
      kcal: "",
      proteins: "",
      carbohydrates: "",
      fats: "",
    });

    setModalVisible(false);
  };

  const handleEliminarAlimento = (alimentoId: string) => {
    setAlimentos(alimentos.filter((a) => a.id !== alimentoId));
  };

  // Guarda todos los alimentos como products en la BD
  const handleGuardarTodos = async () => {
    if (alimentos.length === 0) {
      Alert.alert("Error", "Agrega al menos un alimento");
      return;
    }

    try {
      for (const alimento of alimentos) {
        const payload = {
          name: alimento.nombre,
          brand: alimento.marca ?? null,
          proteins: alimento.proteins,
          carbohydrates: alimento.carbohydrates,
          fats: alimento.fats,
          kcal: alimento.kcal,
        };

        const ok = await productsAPI.create(payload);
        if (!ok) {
          Alert.alert("Error", `No se pudo registrar: ${alimento.nombre}`);
          return;
        }
      }

      Alert.alert("¡Éxito!", "Alimentos registrados correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error guardando productos:", error);
      Alert.alert("Error", "Hubo un problema registrando los alimentos");
    }
  };

  const totalCalorias = alimentos.reduce((sum, a) => sum + (a.kcal || 0), 0);
  const totalProteina = alimentos.reduce(
    (sum, a) => sum + (a.proteins || 0),
    0
  );
  const totalCarbohidratos = alimentos.reduce(
    (sum, a) => sum + (a.carbohydrates || 0),
    0
  );
  const totalGrasas = alimentos.reduce((sum, a) => sum + (a.fats || 0), 0);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
          <Text style={[styles.backText, { color: theme.text }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.stepContainer}>
          <Text style={[styles.stepTitle, { color: theme.text }]}>
            Alimentos
          </Text>
          <Text style={[styles.stepSubtitle, { color: "#999" }]}>
            Agrega productos que quieras registrar en tu base de datos
          </Text>

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

          <View style={styles.alimentosContainer}>
            {alimentos.length === 0 ? (
              <View
                style={[styles.emptyState, { backgroundColor: theme.tabsBack }]}
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
                      {alimento.marca ? (
                        <Text style={styles.alimentoPorcion}>
                          {alimento.marca}
                        </Text>
                      ) : null}
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
                      {alimento.kcal} kcal
                    </Text>
                    <Text style={styles.alimentoMacro}> • </Text>
                    <Text style={styles.alimentoMacro}>
                      {alimento.proteins}g proteínas
                    </Text>
                    <Text style={styles.alimentoMacro}> • </Text>
                    <Text style={styles.alimentoMacro}>
                      {alimento.carbohydrates}g carbs
                    </Text>
                    <Text style={styles.alimentoMacro}> • </Text>
                    <Text style={styles.alimentoMacro}>
                      {alimento.fats}g grasas
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.orange }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Agregar Producto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.orange }]}
          onPress={handleGuardarTodos}
        >
          <Text style={styles.actionButtonText}>Guardar Productos</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para agregar producto */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          style={{ flex: 1, justifyContent: "flex-end" }}
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
                  Nuevo Producto
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalInputGroup}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Nombre *
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
                    Marca (opcional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: theme.tabsBack, color: theme.text },
                    ]}
                    placeholder="Ej: Postobón, Alpina"
                    placeholderTextColor="#666"
                    value={nuevoAlimento.marca}
                    onChangeText={(text) =>
                      setNuevoAlimento({ ...nuevoAlimento, marca: text })
                    }
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.modalInputGroup, styles.halfWidth]}>
                    <Text style={[styles.label, { color: theme.text }]}>
                      kcal *
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { backgroundColor: theme.tabsBack, color: theme.text },
                      ]}
                      placeholder="Ej: 120"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={nuevoAlimento.kcal}
                      onChangeText={(text) =>
                        setNuevoAlimento({ ...nuevoAlimento, kcal: text })
                      }
                    />
                  </View>

                  <View style={[styles.modalInputGroup, styles.halfWidth]}>
                    <Text style={[styles.label, { color: theme.text }]}>
                      Proteínas (g)
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { backgroundColor: theme.tabsBack, color: theme.text },
                      ]}
                      placeholder="Ej: 10"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={nuevoAlimento.proteins}
                      onChangeText={(text) =>
                        setNuevoAlimento({ ...nuevoAlimento, proteins: text })
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
                      placeholder="Ej: 5"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={nuevoAlimento.carbohydrates}
                      onChangeText={(text) =>
                        setNuevoAlimento({
                          ...nuevoAlimento,
                          carbohydrates: text,
                        })
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
                      placeholder="Ej: 3"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={nuevoAlimento.fats}
                      onChangeText={(text) =>
                        setNuevoAlimento({ ...nuevoAlimento, fats: text })
                      }
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: theme.orange },
                  ]}
                  onPress={handleAgregarAlimento}
                >
                  <Text style={styles.modalButtonText}>Agregar</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    paddingVertical: 0,
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
    paddingBottom: 140,
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
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
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
    marginBottom: 16,
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
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
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
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  modalButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
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
