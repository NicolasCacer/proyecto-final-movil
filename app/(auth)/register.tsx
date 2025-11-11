import CustomInput from "@/components/customInput";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const themeContext = useContext(ThemeContext);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    peso: "",
    estatura: "",
    actividad: "",
    grasa: "",
    metaPeso: "",
    metaGrasa: "",
    gustos: "",
  });

  if (!themeContext) {
    return (
      <View style={styles.loadingContainer}>
        <AppText>Cargando...</AppText>
      </View>
    );
  }

  const { theme } = themeContext;
  const steps = [0, 1, 2, 3];
  const nextStep = () => step < 3 && setStep(step + 1);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/login")}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
          <AppText style={[styles.backText, { color: theme.text }]}>
            Volver
          </AppText>
        </TouchableOpacity>

        {/* Progress steps */}
        <View style={styles.progressContainer}>
          {steps.map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.progressBar,
                {
                  backgroundColor: i <= step ? theme.orange : theme.text,
                  opacity: i <= step ? 1 : 0.2,
                },
              ]}
              onPress={() => setStep(i)}
            />
          ))}
        </View>

        {/* Form content */}
        <View style={styles.formContainer}>
          {step === 0 && (
            <View style={styles.stepContainer}>
              <AppText style={[styles.title, { color: theme.text }]}>
                ¿Empezamos?
              </AppText>
              <CustomInput
                placeholder="Nombre"
                iconLeft="person-outline"
                value={formData.nombre}
                onChangeText={(v) => setFormData({ ...formData, nombre: v })}
                borderColor={theme.text}
                color={theme.text}
              />
              <CustomInput
                placeholder="Apellido"
                iconLeft="person-outline"
                value={formData.apellido}
                onChangeText={(v) => setFormData({ ...formData, apellido: v })}
                borderColor={theme.text}
                color={theme.text}
              />
              <CustomInput
                placeholder="Correo"
                iconLeft="mail-outline"
                value={formData.correo}
                onChangeText={(v) => setFormData({ ...formData, correo: v })}
                borderColor={theme.text}
                color={theme.text}
              />
              <CustomInput
                placeholder="Contraseña"
                iconLeft="lock-closed-outline"
                iconRight="eye-outline"
                secureTextEntry
                value={formData.contraseña}
                onChangeText={(v) =>
                  setFormData({ ...formData, contraseña: v })
                }
                borderColor={theme.text}
                color={theme.text}
              />
            </View>
          )}

          {step === 1 && (
            <View style={styles.stepContainer}>
              <AppText style={[styles.title, { color: theme.text }]}>
                ¿Cómo vas?
              </AppText>
              <CustomInput
                placeholder="Peso actual (kg)"
                iconLeft="barbell-outline"
                value={formData.peso}
                onChangeText={(v) => setFormData({ ...formData, peso: v })}
                keyboardType="numeric"
                borderColor={theme.text}
                color={theme.text}
              />
              <CustomInput
                placeholder="Estatura (cm)"
                iconLeft="resize-outline"
                value={formData.estatura}
                onChangeText={(v) => setFormData({ ...formData, estatura: v })}
                keyboardType="numeric"
                borderColor={theme.text}
                color={theme.text}
              />

              {/* Activity Picker */}
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={[
                    styles.pickerButton,
                    { borderColor: theme.text, height: 50 },
                  ]}
                  onPress={() => setModalVisible(true)}
                >
                  <Ionicons
                    name="flash-outline"
                    size={22}
                    color={theme.text}
                    style={{ marginRight: 8 }}
                  />
                  <AppText
                    style={{
                      color: formData.actividad ? theme.text : "#888",
                      flex: 1,
                    }}
                  >
                    {formData.actividad || "Selecciona nivel de actividad"}
                  </AppText>
                  <Ionicons
                    name="chevron-down-outline"
                    size={22}
                    color={theme.text}
                  />
                </TouchableOpacity>

                <Modal transparent visible={modalVisible} animationType="slide">
                  <View style={styles.modalOverlay}>
                    <View
                      style={[
                        styles.modalContent,
                        { backgroundColor: theme.background },
                      ]}
                    >
                      <Picker
                        selectedValue={formData.actividad}
                        onValueChange={(itemValue) => {
                          setFormData({ ...formData, actividad: itemValue });
                          setModalVisible(false);
                        }}
                        style={{ color: theme.text }}
                      >
                        {["Baja", "Intermedia", "Alta", "Nula"].map((nivel) => (
                          <Picker.Item
                            key={nivel}
                            label={nivel}
                            value={nivel}
                          />
                        ))}
                      </Picker>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={[
                          styles.modalCancelButton,
                          { backgroundColor: theme.text },
                        ]}
                      >
                        <AppText style={{ color: theme.background }}>
                          Cancelar
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>

              <CustomInput
                placeholder="Índice de grasa corporal (opcional)"
                iconLeft="speedometer-outline"
                value={formData.grasa}
                onChangeText={(v) => setFormData({ ...formData, grasa: v })}
                keyboardType="numeric"
                borderColor={theme.text}
                color={theme.text}
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <AppText style={[styles.title, { color: theme.text }]}>
                Tus metas
              </AppText>
              <CustomInput
                placeholder="Peso ideal (kg)"
                iconLeft="barbell-outline"
                value={formData.metaPeso}
                onChangeText={(v) => setFormData({ ...formData, metaPeso: v })}
                keyboardType="numeric"
                borderColor={theme.text}
                color={theme.text}
              />
              <CustomInput
                placeholder="Índice de grasa corporal ideal"
                iconLeft="speedometer-outline"
                value={formData.metaGrasa}
                onChangeText={(v) => setFormData({ ...formData, metaGrasa: v })}
                keyboardType="numeric"
                borderColor={theme.text}
                color={theme.text}
              />
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <AppText style={[styles.title, { color: theme.text }]}>
                Dile a tu entrenador IA
              </AppText>

              <View
                style={[styles.multilineInput, { borderColor: theme.text }]}
              >
                <TextInput
                  placeholder="(ej: Me gusta entrenar el pecho los jueves a las 6 pm)"
                  value={formData.gustos}
                  onChangeText={(v) => setFormData({ ...formData, gustos: v })}
                  placeholderTextColor="#888"
                  style={[styles.textarea, { color: theme.text }]}
                  multiline
                />
              </View>

              <AppText style={[styles.wordCount, { color: theme.text }]}>
                {formData.gustos?.trim().split(/\s+/).filter(Boolean).length ??
                  0}
                /200 palabras
              </AppText>
            </View>
          )}

          {/* Next / Register Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.orange }]}
            onPress={
              step === 3
                ? () => {
                    console.log(formData);
                    router.push("/(main)/home");
                  }
                : nextStep
            }
          >
            <AppText style={styles.buttonText}>
              {step === 3 ? "Registrarme" : "Siguiente"}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  safeArea: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: "center", paddingVertical: 24 },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    marginLeft: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  backText: { fontSize: 20 },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginBottom: 20,
  },
  progressBar: { flex: 1, height: 10, marginHorizontal: 4, borderRadius: 4 },
  formContainer: { width: "100%", alignItems: "center", paddingHorizontal: 10 },
  stepContainer: { width: "100%", alignItems: "center" },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  wordCount: {
    alignSelf: "flex-end",
    width: "90%",
    marginTop: 6,
    paddingRight: 18,
    textAlign: "right",
  },
  button: {
    width: "90%",
    alignSelf: "center",
    padding: 14,
    borderRadius: 100,
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
  pickerContainer: { width: "90%", marginVertical: 8 },
  pickerButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: { marginHorizontal: 20, borderRadius: 10 },
  modalCancelButton: {
    padding: 12,
    alignItems: "center",
    opacity: 1.0,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  multilineInput: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 8,
    height: 170,
  },
  textarea: {
    flex: 1,
    textAlignVertical: "top",
    fontSize: 16,
    padding: 10,
    fontFamily: "Onest",
  },
});
