import CustomInput from "@/components/customInput";
import FullScreenLoader from "@/components/fullScreenLoader";
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const themeContext = useContext(ThemeContext);
  const authContex = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  // NUEVO: Estado de errores
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    peso: "",
    estatura: "",
    grasa: "",
    metaPeso: "",
    metaGrasa: "",
    gustos: "",
  });

  // NUEVO: Funciones de validación por campo
  // Validaciones nuevas
  const validators: any = {
    nombre: (v: string) =>
      /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}$/.test(v.trim())
        ? ""
        : "Debe contener solo letras y mínimo 2 caracteres",

    apellido: (v: string) =>
      /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}$/.test(v.trim())
        ? ""
        : "Debe contener solo letras y mínimo 2 caracteres",

    correo: (v: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Correo inválido",

    contraseña: (v: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v)
        ? ""
        : "Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo",

    peso: (v: string) =>
      Number(v) >= 20 && Number(v) <= 400
        ? ""
        : "El peso debe estar entre 20 y 400 kg",

    estatura: (v: string) =>
      Number(v) >= 50 && Number(v) <= 250
        ? ""
        : "La estatura debe estar entre 50 y 250 cm",

    grasa: (v: string) =>
      v === "" || (Number(v) >= 0 && Number(v) <= 100)
        ? ""
        : "Debe ser un porcentaje entre 0 y 100",

    metaPeso: (v: string) =>
      Number(v) >= 20 && Number(v) <= 400
        ? ""
        : "Meta inválida: debe estar entre 20 y 400 kg",

    metaGrasa: (v: string) =>
      v === "" || (Number(v) >= 0 && Number(v) <= 100)
        ? ""
        : "Debe ser un porcentaje entre 0 y 100",

    gustos: (v: string) =>
      v.trim().split(/\s+/).filter(Boolean).length <= 200
        ? ""
        : "Máximo 200 palabras",
  };

  // NUEVO: Manejo del cambio con validación instantánea
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    const validationError = validators[field](value);
    setErrors({ ...errors, [field]: validationError });
  };

  if (!themeContext) {
    return (
      <View style={styles.loadingContainer}>
        <AppText>Cargando...</AppText>
      </View>
    );
  }

  const { theme } = themeContext;
  const steps = [0, 1, 2, 3];
  // Valida si el paso actual está completo y sin errores
  const isStepValid = () => {
    if (step === 0) {
      return (
        !errors.nombre &&
        !errors.apellido &&
        !errors.correo &&
        !errors.contraseña &&
        formData.nombre &&
        formData.apellido &&
        formData.correo &&
        formData.contraseña
      );
    }

    if (step === 1) {
      return (
        !errors.peso &&
        !errors.estatura &&
        formData.peso &&
        formData.estatura &&
        formData.actividad // obligatorio
      );
    }

    if (step === 2) {
      return (
        !errors.metaPeso &&
        !errors.metaGrasa &&
        formData.metaPeso &&
        formData.metaGrasa
      );
    }

    if (step === 3) {
      return !errors.gustos; // gustos es opcional, solo importa palabras
    }

    return true;
  };

  const nextStep = () => {
    if (!isStepValid()) {
      Alert.alert(
        "Ups… algo falta",
        "Hay algunos campos incompletos o inválidos. Revísalos antes de seguir.",
        [{ text: "OK", style: "default" }]
      );

      return;
    }
    if (step < 3) setStep(step + 1);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
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

                {/* Nombre */}
                <CustomInput
                  placeholder="Nombre"
                  iconLeft="person-outline"
                  value={formData.nombre}
                  onChangeText={(v) => handleChange("nombre", v)}
                  borderColor={errors.nombre ? "red" : theme.text}
                  color={theme.text}
                />
                {errors.nombre ? (
                  <AppText style={{ color: "red", width: "90%" }}>
                    {errors.nombre}
                  </AppText>
                ) : null}

                {/* Apellido */}
                <CustomInput
                  placeholder="Apellido"
                  iconLeft="person-outline"
                  value={formData.apellido}
                  onChangeText={(v) => handleChange("apellido", v)}
                  borderColor={errors.apellido ? "red" : theme.text}
                  color={theme.text}
                />
                {errors.apellido ? (
                  <AppText style={{ color: "red", width: "90%" }}>
                    {errors.apellido}
                  </AppText>
                ) : null}

                {/* Correo */}
                <CustomInput
                  placeholder="Correo"
                  iconLeft="mail-outline"
                  value={formData.correo}
                  onChangeText={(v) => handleChange("correo", v)}
                  borderColor={errors.correo ? "red" : theme.text}
                  color={theme.text}
                />
                {errors.correo ? (
                  <AppText style={{ color: "red", width: "90%" }}>
                    {errors.correo}
                  </AppText>
                ) : null}

                {/* Contraseña */}
                <CustomInput
                  placeholder="Contraseña"
                  iconLeft="lock-closed-outline"
                  iconRight="eye-outline"
                  secureTextEntry
                  value={formData.contraseña}
                  onChangeText={(v) => handleChange("contraseña", v)}
                  borderColor={errors.contraseña ? "red" : theme.text}
                  color={theme.text}
                />
                {errors.contraseña ? (
                  <AppText style={{ color: "red", width: "90%" }}>
                    {errors.contraseña}
                  </AppText>
                ) : null}
              </View>
            )}

            {step === 1 && (
              <View style={styles.stepContainer}>
                <AppText style={[styles.title, { color: theme.text }]}>
                  ¿Cómo vas?
                </AppText>

                {/* Peso */}
                <CustomInput
                  placeholder="Peso actual (kg)"
                  iconLeft="barbell-outline"
                  value={formData.peso}
                  onChangeText={(v) => handleChange("peso", v)}
                  keyboardType="numeric"
                  borderColor={errors.peso ? "red" : theme.text}
                  color={theme.text}
                />
                {errors.peso ? (
                  <AppText style={{ color: "red", width: "90%" }}>
                    {errors.peso}
                  </AppText>
                ) : null}

                {/* Estatura */}
                <CustomInput
                  placeholder="Estatura (cm)"
                  iconLeft="resize-outline"
                  value={formData.estatura}
                  onChangeText={(v) => handleChange("estatura", v)}
                  keyboardType="numeric"
                  borderColor={errors.estatura ? "red" : theme.text}
                  color={theme.text}
                />
                {errors.estatura ? (
                  <AppText style={{ color: "red", width: "90%" }}>
                    {errors.estatura}
                  </AppText>
                ) : null}

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

                  <Modal
                    transparent
                    visible={modalVisible}
                    animationType="slide"
                  >
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
                          {["Baja", "Intermedia", "Alta", "Nula"].map(
                            (nivel) => (
                              <Picker.Item
                                key={nivel}
                                label={nivel}
                                value={nivel}
                              />
                            )
                          )}
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

                {/* Grasa */}
                <CustomInput
                  placeholder="Índice de grasa corporal (opcional)"
                  iconLeft="speedometer-outline"
                  value={formData.grasa}
                  onChangeText={(v) => handleChange("grasa", v)}
                  keyboardType="numeric"
                  borderColor={errors.grasa ? "red" : theme.text}
                  color={theme.text}
                />
                {errors.grasa ? (
                  <AppText style={{ color: "red", width: "90%" }}>
                    {errors.grasa}
                  </AppText>
                ) : null}
              </View>
            )}

            {step === 2 && (
              <View style={styles.stepContainer}>
                <AppText style={[styles.title, { color: theme.text }]}>
                  Tus metas
                </AppText>

                {/* Meta Peso */}
                <CustomInput
                  placeholder="Peso ideal (kg)"
                  iconLeft="barbell-outline"
                  value={formData.metaPeso}
                  onChangeText={(v) => handleChange("metaPeso", v)}
                  keyboardType="numeric"
                  borderColor={errors.metaPeso ? "red" : theme.text}
                  color={theme.text}
                />
                {errors.metaPeso ? (
                  <AppText style={{ color: "red", width: "90%" }}>
                    {errors.metaPeso}
                  </AppText>
                ) : null}

                {/* Meta Grasa */}
                <CustomInput
                  placeholder="Índice de grasa corporal ideal"
                  iconLeft="speedometer-outline"
                  value={formData.metaGrasa}
                  onChangeText={(v) => handleChange("metaGrasa", v)}
                  keyboardType="numeric"
                  borderColor={errors.metaGrasa ? "red" : theme.text}
                  color={theme.text}
                />
                {errors.metaGrasa ? (
                  <AppText style={{ color: "red", width: "90%" }}>
                    {errors.metaGrasa}
                  </AppText>
                ) : null}
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
                    onChangeText={(v) => handleChange("gustos", v)}
                    placeholderTextColor="#888"
                    style={[styles.textarea, { color: theme.text }]}
                    multiline
                  />
                </View>

                {errors.gustos ? (
                  <AppText
                    style={{
                      color: "red",
                      width: "90%",
                      marginTop: -6,
                      marginBottom: 6,
                    }}
                  >
                    {errors.gustos}
                  </AppText>
                ) : null}

                <AppText style={[styles.wordCount, { color: theme.text }]}>
                  {formData.gustos?.trim().split(/\s+/).filter(Boolean)
                    .length ?? 0}
                  /200 palabras
                </AppText>
              </View>
            )}

            {/* Next / Register Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.orange }]}
              onPress={
                step === 3
                  ? async () => {
                      if (!isStepValid()) {
                        alert("Revisa los campos antes de registrarte.");
                        return;
                      }

                      setLoading(true);

                      const success = await authContex.register(
                        formData.contraseña,
                        {
                          email: formData.correo.trim().toLowerCase(),
                          name: formData.nombre.trim(),
                          lastname: formData.apellido.trim(),
                          actualweight: Number(formData.peso),
                          targetweight: Number(formData.metaPeso),
                          height: Number(formData.estatura),
                          activitylevel: formData.actividad,
                          fatindex: formData.grasa
                            ? Number(formData.grasa)
                            : null,
                          targetfatindex: formData.metaGrasa
                            ? Number(formData.metaGrasa)
                            : null,
                          aicontext: formData.gustos.trim().toLowerCase(),
                        }
                      );

                      setLoading(false);

                      if (success) {
                        Alert.alert(
                          "¡Bienvenido a GymCol! 🔥",
                          `${formData.nombre}, tu cuenta fue creada con éxito. ¡Vamos a comenzar! 💪`
                        );
                        Keyboard.dismiss();
                        router.push("/home");
                      }
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
      </KeyboardAvoidingView>
      <FullScreenLoader visible={loading} />
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
