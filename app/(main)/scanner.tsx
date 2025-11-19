import DiarioView from "@/components/nutrition/DiarioView";
import SemanalView from "@/components/nutrition/SemanalView";
import { ThemeContext } from "@/context/ThemeProvider";
import { useNutrition } from "@/hooks/useNutrition";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Scanner() {
  const themeContext = useContext(ThemeContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("diario");
  const [menuVisible, setMenuVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  const { registrosDiarios, resumenSemanal, calcularTotales } = useNutrition();

  if (!themeContext) return null;
  const { theme } = themeContext;

  const tabs = [
    { id: "diario", label: "Diario" },
    { id: "semanal", label: "Semanal" },
  ];

  const { totalCalorias, totalProteina } = calcularTotales(registrosDiarios);
  const metaCalorias = 2200;
  const metaProteina = 150;

  const handleOpenMenu = () => {
    setMenuVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleCloseMenu = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const handleUseCamera = () => {
    handleCloseMenu();
    router.push("/(modals)/scan-barcode");
  };

  const handleManualEntry = () => {
    handleCloseMenu();
    router.push("/(modals)/add-food");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: theme.text }]}>Nutrición</Text>
        <Text style={[styles.subtitle, { color: "#999" }]}>
          Registro de alimentos
        </Text>

        {/* Segmented Control */}
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
      {activeTab === "diario" ? (
        <DiarioView
          registros={registrosDiarios}
          totalCalorias={totalCalorias}
          totalProteina={totalProteina}
          metaCalorias={metaCalorias}
          metaProteina={metaProteina}
        />
      ) : (
        <SemanalView
          resumenSemanal={resumenSemanal}
          metaCalorias={metaCalorias}
        />
      )}

      {/* Botón flotante para escanear */}
      <TouchableOpacity
        style={[styles.scanButton, { backgroundColor: theme.orange }]}
        onPress={handleOpenMenu}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal del menú */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseMenu}
        >
          <View style={styles.menuContainer}>
            <Animated.View
              style={[
                styles.menuContent,
                { backgroundColor: theme.tabsBack },
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: scaleAnim,
                },
              ]}
            >
              {/* Opción de cámara */}
              <TouchableOpacity
                style={[
                  styles.menuOption,
                  { borderBottomColor: "rgba(255,255,255,0.1)" },
                ]}
                onPress={handleUseCamera}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons name="camera" size={24} color={theme.orange} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuTitle, { color: theme.text }]}>
                    Usar Cámara
                  </Text>
                  <Text style={styles.menuSubtitle}>
                    Escanea el código de barras
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>

              {/* Opción manual */}
              <TouchableOpacity
                style={styles.menuOption}
                onPress={handleManualEntry}
              >
                <View
                  style={[
                    styles.menuIconCircle,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons name="create" size={24} color={theme.orange} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuTitle, { color: theme.text }]}>
                    Ingreso Manual
                  </Text>
                  <Text style={styles.menuSubtitle}>
                    Escribe los datos manualmente
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
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
  scanButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    padding: 20,
    paddingBottom: 140,
  },
  menuContent: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  menuIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#999",
  },
});
