import { ThemeContext } from "@/context/ThemeProvider";
import { Plan, PLANS, PlanType } from "@/types/subscription";
import AppText from "@/utils/AppText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PlanType) => void;
}

export default function SubscriptionModal({
  visible,
  onClose,
  onSelectPlan,
}: SubscriptionModalProps) {
  const themeContext = useContext(ThemeContext);
  const { theme } = themeContext;

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("semester");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleContinue = () => {
    onSelectPlan(selectedPlan);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
          <AppText style={[styles.headerTitle, { color: theme.text }]}>
            GymCol Premium
          </AppText>
          <View style={{ width: 28 }} />
        </View>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={[theme.orange, theme.red]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <Ionicons name="trophy" size={48} color="#fff" />
              <AppText style={styles.heroTitle}>
                Desbloquea tu mejor versión
              </AppText>
              <AppText style={styles.heroSubtitle}>
                Acceso completo a todas las funciones premium
              </AppText>
            </LinearGradient>
          </View>

          {/* Plans */}
          <View style={styles.plansContainer}>
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
                formatPrice={formatPrice}
              />
            ))}
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustSection}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark" size={24} color={theme.orange} />
              <AppText style={[styles.trustText, { color: theme.text }]}>
                Pago 100% seguro
              </AppText>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="refresh" size={24} color={theme.orange} />
              <AppText style={[styles.trustText, { color: theme.text }]}>
                Cancela cuando quieras
              </AppText>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="checkmark-circle" size={24} color={theme.orange} />
              <AppText style={[styles.trustText, { color: theme.text }]}>
                Sin compromisos
              </AppText>
            </View>
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: theme.orange }]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <AppText style={styles.continueButtonText}>
              Continuar con{" "}
              {PLANS.find((p) => p.id === selectedPlan)?.name || ""}
            </AppText>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Plan Card Component
interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
  formatPrice: (price: number) => string;
}

function PlanCard({ plan, selected, onSelect, formatPrice }: PlanCardProps) {
  const themeContext = useContext(ThemeContext);
  const { theme } = themeContext;

  return (
    <TouchableOpacity
      style={[
        styles.planCard,
        {
          backgroundColor: theme.tabsBack,
          borderColor: selected ? theme.orange : "transparent",
          borderWidth: selected ? 2 : 0,
        },
        plan.popular && styles.popularCard,
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      {/* Badge */}
      {plan.badge && (
        <View style={[styles.badge, { backgroundColor: theme.orange }]}>
          <AppText style={styles.badgeText}>{plan.badge}</AppText>
        </View>
      )}

      {/* Header */}
      <View style={styles.planHeader}>
        <View style={styles.planTitleRow}>
          <AppText style={[styles.planName, { color: theme.text }]}>
            {plan.name}
          </AppText>
          {selected && (
            <View style={[styles.checkCircle, { backgroundColor: theme.orange }]}>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.priceRow}>
          {plan.originalPrice && (
            <AppText style={styles.originalPrice}>
              {formatPrice(plan.originalPrice)}
            </AppText>
          )}
          <AppText style={[styles.price, { color: theme.text }]}>
            {formatPrice(plan.price)}
          </AppText>
        </View>

        {plan.discount && (
          <View style={styles.discountBadge}>
            <AppText style={[styles.discountText, { color: theme.orange }]}>
              {plan.discount}
            </AppText>
          </View>
        )}

        <AppText style={styles.duration}>{plan.duration}</AppText>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Features */}
      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={theme.orange}
              style={styles.featureIcon}
            />
            <AppText style={[styles.featureText, { color: theme.text }]}>
              {feature}
            </AppText>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
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
  },
  closeButton: {
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
    paddingBottom: 120,
  },
  heroSection: {
    marginBottom: 30,
  },
  heroGradient: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    position: "relative",
  },
  popularCard: {
    transform: [{ scale: 1.02 }],
  },
  badge: {
    position: "absolute",
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  planHeader: {
    marginBottom: 16,
  },
  planTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
  },
  discountBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255, 126, 51, 0.15)",
    marginBottom: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  duration: {
    fontSize: 14,
    color: "#999",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 16,
  },
  featuresContainer: {
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  trustSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 30,
  },
  trustItem: {
    alignItems: "center",
    gap: 8,
  },
  trustText: {
    fontSize: 12,
    textAlign: "center",
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
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});