import { ThemeContext } from "@/context/ThemeProvider";
import { PaymentFormData, Plan, PLANS, PlanType } from "@/types/subscription";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

interface PaymentModalProps {
  visible: boolean;
  selectedPlan: PlanType;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({
  visible,
  selectedPlan,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const themeContext = useContext(ThemeContext);
  const { theme } = themeContext;

  const plan = PLANS.find((p) => p.id === selectedPlan);

  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});

  // Formatear número de tarjeta (cada 4 dígitos)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // 16 dígitos + 3 espacios
  };

  // Formatear fecha de expiración (MM/AA)
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};

    // Card Number
    const cardDigits = formData.cardNumber.replace(/\s/g, "");
    if (cardDigits.length !== 16) {
      newErrors.cardNumber = "Número de tarjeta inválido";
    }

    // Card Holder
    if (formData.cardHolder.trim().length < 3) {
      newErrors.cardHolder = "Nombre inválido";
    }

    // Expiry Date
    const expiryParts = formData.expiryDate.split("/");
    if (expiryParts.length !== 2) {
      newErrors.expiryDate = "Fecha inválida";
    } else {
      const month = parseInt(expiryParts[0]);
      const year = parseInt(expiryParts[1]);
      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Mes inválido";
      }
      const currentYear = new Date().getFullYear() % 100;
      if (year < currentYear) {
        newErrors.expiryDate = "Tarjeta vencida";
      }
    }

    // CVV
    if (formData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Detectar tipo de tarjeta
  const getCardType = (number: string): string => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "visa";
    if (cleaned.startsWith("5")) return "mastercard";
    if (cleaned.startsWith("3")) return "amex";
    return "generic";
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor corrige los campos inválidos");
      return;
    }

    // Simular procesamiento
    Alert.alert(
      "Procesando pago...",
      "Tu suscripción está siendo procesada",
      [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              onSuccess();
            }, 500);
          },
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color={theme.text} />
            </TouchableOpacity>
            <AppText style={[styles.headerTitle, { color: theme.text }]}>
              Método de pago
            </AppText>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Plan Summary */}
            <View style={[styles.summaryCard, { backgroundColor: theme.tabsBack }]}>
              <View style={styles.summaryRow}>
                <AppText style={[styles.summaryLabel, { color: "#999" }]}>
                  Plan seleccionado
                </AppText>
                <AppText style={[styles.summaryValue, { color: theme.text }]}>
                  {plan?.name}
                </AppText>
              </View>
              <View style={styles.summaryRow}>
                <AppText style={[styles.summaryLabel, { color: "#999" }]}>
                  Duración
                </AppText>
                <AppText style={[styles.summaryValue, { color: theme.text }]}>
                  {plan?.duration}
                </AppText>
              </View>
              <View style={[styles.divider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />
              <View style={styles.summaryRow}>
                <AppText style={[styles.totalLabel, { color: theme.text }]}>
                  Total a pagar
                </AppText>
                <AppText style={[styles.totalValue, { color: theme.orange }]}>
                  {formatPrice(plan?.price || 0)}
                </AppText>
              </View>
            </View>

            {/* Card Preview */}
            <View style={styles.cardPreviewContainer}>
              <View style={[styles.cardPreview, { backgroundColor: theme.orange }]}>
                <View style={styles.cardChip}>
                  <Svg width={40} height={30} viewBox="0 0 40 30">
                    <Path
                      d="M5 0h30a5 5 0 015 5v20a5 5 0 01-5 5H5a5 5 0 01-5-5V5a5 5 0 015-5z"
                      fill="rgba(255,255,255,0.2)"
                    />
                  </Svg>
                </View>

                <AppText style={styles.cardNumber}>
                  {formData.cardNumber || "•••• •••• •••• ••••"}
                </AppText>

                <View style={styles.cardBottom}>
                  <View>
                    <AppText style={styles.cardLabel}>TITULAR</AppText>
                    <AppText style={styles.cardHolder}>
                      {formData.cardHolder.toUpperCase() || "NOMBRE COMPLETO"}
                    </AppText>
                  </View>
                  <View>
                    <AppText style={styles.cardLabel}>VENCE</AppText>
                    <AppText style={styles.cardExpiry}>
                      {formData.expiryDate || "MM/AA"}
                    </AppText>
                  </View>
                </View>

                {/* Card Type Icon */}
                {getCardType(formData.cardNumber) !== "generic" && (
                  <View style={styles.cardTypeIcon}>
                    <CardIcon type={getCardType(formData.cardNumber)} />
                  </View>
                )}
              </View>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Card Number */}
              <View style={styles.inputGroup}>
                <AppText style={[styles.label, { color: theme.text }]}>
                  Número de tarjeta
                </AppText>
                <View
                  style={[
                    styles.input,
                    {
                      borderColor: errors.cardNumber ? theme.red : theme.text + "33",
                      backgroundColor: theme.tabsBack,
                    },
                  ]}
                >
                  <Ionicons name="card" size={20} color={theme.text} />
                  <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={formData.cardNumber}
                    onChangeText={(text) =>
                      setFormData({
                        ...formData,
                        cardNumber: formatCardNumber(text),
                      })
                    }
                    maxLength={19}
                  />
                </View>
                {errors.cardNumber && (
                  <AppText style={styles.errorText}>{errors.cardNumber}</AppText>
                )}
              </View>

              {/* Card Holder */}
              <View style={styles.inputGroup}>
                <AppText style={[styles.label, { color: theme.text }]}>
                  Nombre del titular
                </AppText>
                <View
                  style={[
                    styles.input,
                    {
                      borderColor: errors.cardHolder ? theme.red : theme.text + "33",
                      backgroundColor: theme.tabsBack,
                    },
                  ]}
                >
                  <Ionicons name="person" size={20} color={theme.text} />
                  <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="Como aparece en la tarjeta"
                    placeholderTextColor="#666"
                    value={formData.cardHolder}
                    onChangeText={(text) =>
                      setFormData({ ...formData, cardHolder: text })
                    }
                    autoCapitalize="characters"
                  />
                </View>
                {errors.cardHolder && (
                  <AppText style={styles.errorText}>{errors.cardHolder}</AppText>
                )}
              </View>

              {/* Expiry & CVV */}
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <AppText style={[styles.label, { color: theme.text }]}>
                    Vencimiento
                  </AppText>
                  <View
                    style={[
                      styles.input,
                      {
                        borderColor: errors.expiryDate ? theme.red : theme.text + "33",
                        backgroundColor: theme.tabsBack,
                      },
                    ]}
                  >
                    <Ionicons name="calendar" size={20} color={theme.text} />
                    <TextInput
                      style={[styles.textInput, { color: theme.text }]}
                      placeholder="MM/AA"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      value={formData.expiryDate}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          expiryDate: formatExpiryDate(text),
                        })
                      }
                      maxLength={5}
                    />
                  </View>
                  {errors.expiryDate && (
                    <AppText style={styles.errorText}>{errors.expiryDate}</AppText>
                  )}
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <AppText style={[styles.label, { color: theme.text }]}>CVV</AppText>
                  <View
                    style={[
                      styles.input,
                      {
                        borderColor: errors.cvv ? theme.red : theme.text + "33",
                        backgroundColor: theme.tabsBack,
                      },
                    ]}
                  >
                    <Ionicons name="lock-closed" size={20} color={theme.text} />
                    <TextInput
                      style={[styles.textInput, { color: theme.text }]}
                      placeholder="123"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                      secureTextEntry
                      value={formData.cvv}
                      onChangeText={(text) =>
                        setFormData({ ...formData, cvv: text.substring(0, 4) })
                      }
                      maxLength={4}
                    />
                  </View>
                  {errors.cvv && (
                    <AppText style={styles.errorText}>{errors.cvv}</AppText>
                  )}
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <AppText style={[styles.label, { color: theme.text }]}>
                  Correo electrónico
                </AppText>
                <View
                  style={[
                    styles.input,
                    {
                      borderColor: errors.email ? theme.red : theme.text + "33",
                      backgroundColor: theme.tabsBack,
                    },
                  ]}
                >
                  <Ionicons name="mail" size={20} color={theme.text} />
                  <TextInput
                    style={[styles.textInput, { color: theme.text }]}
                    placeholder="tu@email.com"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                  />
                </View>
                {errors.email && (
                  <AppText style={styles.errorText}>{errors.email}</AppText>
                )}
              </View>

              
              
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { backgroundColor: theme.background }]}>
            <TouchableOpacity
              style={[styles.payButton, { backgroundColor: theme.orange }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <AppText style={styles.payButtonText}>
                Pagar {formatPrice(plan?.price || 0)}
              </AppText>
              <Ionicons name="lock-closed" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Card Icons Component
function CardIcon({ type }: { type: string }) {
  if (type === "visa") {
    return (
      <View style={{ backgroundColor: "#fff", padding: 4, borderRadius: 4 }}>
        <AppText style={{ color: "#1A1F71", fontWeight: "bold", fontSize: 12 }}>
          VISA
        </AppText>
      </View>
    );
  }
  if (type === "mastercard") {
    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "#EB001B",
          }}
        />
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "#F79E1B",
            marginLeft: -8,
          }}
        />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cardPreviewContainer: {
    marginBottom: 30,
  },
  cardPreview: {
    borderRadius: 16,
    padding: 24,
    height: 200,
    justifyContent: "space-between",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardChip: {
    alignSelf: "flex-start",
  },
  cardNumber: {
    fontSize: 24,
    color: "#fff",
    letterSpacing: 2,
    fontWeight: "500",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  cardHolder: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  cardExpiry: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  cardTypeIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
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
  errorText: {
    color: "#FF160A",
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 126, 51, 0.1)",
  },
  securityText: {
    flex: 1,
    fontSize: 12,
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
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});