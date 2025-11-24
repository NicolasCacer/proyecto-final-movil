import success from "@/assets/lotties/loading.json";
import { ThemeContext } from "@/context/ThemeProvider";
import { Plan, PLANS, PlanType } from "@/types/subscription";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import React, { useContext } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface SuccessModalProps {
  visible: boolean;
  selectedPlan: PlanType;
  onClose: () => void;
}

export default function SuccessModal({
  visible,
  selectedPlan,
  onClose,
}: SuccessModalProps) {
  const themeContext = useContext(ThemeContext);
  const { theme } = themeContext;

  const plan = PLANS.find((p) => p.id === selectedPlan);

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
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Success Animation */}
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.successCircle,
                { backgroundColor: theme.orange + "20" },
              ]}
            >
              <View
                style={[styles.innerCircle, { backgroundColor: theme.orange }]}
              >
                <Ionicons name="checkmark" size={48} color="#fff" />
              </View>
            </View>
          </View>

          {/* Title */}
          <AppText style={[styles.title, { color: theme.text }]}>
            ¡Suscripción Exitosa!
          </AppText>

          {/* Subtitle */}
          <AppText style={[styles.subtitle, { color: "#999" }]}>
            Tu pago ha sido procesado correctamente
          </AppText>

          {/* Details Card */}
          <View style={[styles.detailsCard, { backgroundColor: theme.tabsBack }]}>
            <View style={styles.detailRow}>
              <Ionicons name="trophy" size={20} color={theme.orange} />
              <View style={styles.detailContent}>
                <AppText style={[styles.detailLabel, { color: "#999" }]}>
                  Plan
                </AppText>
                <AppText style={[styles.detailValue, { color: theme.text }]}>
                  {plan?.name}
                </AppText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={theme.orange} />
              <View style={styles.detailContent}>
                <AppText style={[styles.detailLabel, { color: "#999" }]}>
                  Válido por
                </AppText>
                <AppText style={[styles.detailValue, { color: theme.text }]}>
                  {plan?.duration}
                </AppText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />

            <View style={styles.detailRow}>
              <Ionicons name="card" size={20} color={theme.orange} />
              <View style={styles.detailContent}>
                <AppText style={[styles.detailLabel, { color: "#999" }]}>
                  Monto pagado
                </AppText>
                <AppText style={[styles.detailValue, { color: theme.orange }]}>
                  {formatPrice(plan?.price || 0)}
                </AppText>
              </View>
            </View>
          </View>

          {/* Benefits List */}
          <View style={styles.benefitsContainer}>
            <AppText style={[styles.benefitsTitle, { color: theme.text }]}>
              Ahora tienes acceso a:
            </AppText>
            <View style={styles.benefitsList}>
              {plan?.features.slice(0, 3).map((feature, index) => (
                <View key={index} style={styles.benefitRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={theme.orange}
                  />
                  <AppText style={[styles.benefitText, { color: theme.text }]}>
                    {feature}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.orange }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <AppText style={styles.buttonText}>¡Comenzar ahora!</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <AppText style={[styles.secondaryButtonText, { color: theme.text }]}>
              Ver detalles de la suscripción
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  detailsCard: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  benefitsContainer: {
    width: "100%",
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
  button: {
    width: "100%",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    padding: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
  },
});