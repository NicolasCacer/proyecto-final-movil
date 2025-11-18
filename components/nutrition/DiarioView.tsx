import { ThemeContext } from "@/context/ThemeProvider";
import { RegistroComida } from "@/types/nutrition";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface DiarioViewProps {
  registros: RegistroComida[];
  totalCalorias: number;
  totalProteina: number;
  metaCalorias: number;
  metaProteina: number;
}

export default function DiarioView({
  registros,
  totalCalorias,
  totalProteina,
  metaCalorias,
  metaProteina,
}: DiarioViewProps) {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  // Calcular totales de macros
  const totalCarbohidratos = registros.reduce(
    (acc, comida) =>
      acc +
      comida.alimentos.reduce(
        (sum, alimento) => sum + (alimento.carbohidratos || 0),
        0
      ),
    0
  );

  const totalGrasas = registros.reduce(
    (acc, comida) =>
      acc +
      comida.alimentos.reduce((sum, alimento) => sum + (alimento.grasas || 0), 0),
    0
  );

  // Metas de macros
  const metaCarbohidratos = 275; // gramos
  const metaGrasas = 73; // gramos

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Resumen diario con icono de rayo */}
      <View style={[styles.resumenCard, { backgroundColor: theme.tabsBack }]}>
        <View style={styles.resumenHeader}>
          <Ionicons name="flash" size={20} color={theme.orange} />
          <Text style={[styles.resumenTitle, { color: theme.text }]}>
            Resumen diario
          </Text>
        </View>

        {/* Barra de progreso de calorías */}
        <View style={styles.caloriesSection}>
          <View style={styles.caloriesHeader}>
            <Text style={[styles.caloriesValue, { color: theme.text }]}>
              {totalCalorias}
            </Text>
            <Text style={styles.caloriesLabel}>/ {metaCalorias} kcal</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min(
                    (totalCalorias / metaCalorias) * 100,
                    100
                  )}%`,
                  backgroundColor: theme.orange,
                },
              ]}
            />
          </View>
        </View>

        {/* Macros grid */}
        <View style={styles.macrosGrid}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroLabel, { color: "#999" }]}>
              Proteínas
            </Text>
            <View style={styles.macroValueContainer}>
              <Text style={[styles.macroValue, { color: theme.text }]}>
                {totalProteina}g
              </Text>
              <Text style={styles.macroMeta}>/ {metaProteina}g</Text>
            </View>
          </View>

          <View style={styles.macroItem}>
            <Text style={[styles.macroLabel, { color: "#999" }]}>Grasa</Text>
            <View style={styles.macroValueContainer}>
              <Text style={[styles.macroValue, { color: theme.text }]}>
                {totalGrasas}g
              </Text>
              <Text style={styles.macroMeta}>/ {metaGrasas}g</Text>
            </View>
          </View>

          <View style={styles.macroItem}>
            <Text style={[styles.macroLabel, { color: "#999" }]}>
              Carbohidratos
            </Text>
            <View style={styles.macroValueContainer}>
              <Text style={[styles.macroValue, { color: theme.text }]}>
                {totalCarbohidratos}g
              </Text>
              <Text style={styles.macroMeta}>/ {metaCarbohidratos}g</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Comidas del día */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Comidas de Hoy
      </Text>

      {registros.map((registro) => {
        const totalCaloriasComida = registro.alimentos.reduce(
          (sum, alimento) => sum + alimento.calorias,
          0
        );
        const totalProteinaComida = registro.alimentos.reduce(
          (sum, alimento) => sum + alimento.proteina,
          0
        );
        const totalCarbohidratosComida = registro.alimentos.reduce(
          (sum, alimento) => sum + (alimento.carbohidratos || 0),
          0
        );
        const totalGrasasComida = registro.alimentos.reduce(
          (sum, alimento) => sum + (alimento.grasas || 0),
          0
        );

        return (
          <View
            key={registro.id}
            style={[styles.comidaCard, { backgroundColor: theme.tabsBack }]}
          >
            {/* Header de la comida */}
            <View style={styles.comidaHeader}>
              <View style={styles.comidaHeaderLeft}>
                <View
                  style={[
                    styles.comidaIconCircle,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons
                    name={
                      registro.comida === "Desayuno"
                        ? "sunny"
                        : registro.comida === "Almuerzo"
                        ? "restaurant"
                        : registro.comida === "Merienda"
                        ? "cafe"
                        : "moon"
                    }
                    size={20}
                    color={theme.orange}
                  />
                </View>
                <View>
                  <Text style={[styles.comidaNombre, { color: theme.text }]}>
                    {registro.comida}
                  </Text>
                  <Text style={styles.comidaHora}>{registro.hora}</Text>
                </View>
              </View>
            </View>

            {/* Resumen de macros de la comida */}
            <View style={styles.comidaMacros}>
              <View style={styles.comidaMacroItem}>
                <Text style={styles.comidaMacroValue}>
                  {totalCaloriasComida}
                </Text>
                <Text style={styles.comidaMacroLabel}>kcal</Text>
              </View>
              <View style={styles.comidaMacroItem}>
                <Text style={styles.comidaMacroValue}>
                  {totalProteinaComida}g
                </Text>
                <Text style={styles.comidaMacroLabel}>proteínas</Text>
              </View>
              <View style={styles.comidaMacroItem}>
                <Text style={styles.comidaMacroValue}>
                  {totalGrasasComida}g
                </Text>
                <Text style={styles.comidaMacroLabel}>grasas</Text>
              </View>
              <View style={styles.comidaMacroItem}>
                <Text style={styles.comidaMacroValue}>
                  {totalCarbohidratosComida}g
                </Text>
                <Text style={styles.comidaMacroLabel}>carbohidratos</Text>
              </View>
            </View>

            {/* Lista de alimentos */}
            <View style={styles.alimentosList}>
              {registro.alimentos.map((alimento, index) => (
                <View
                  key={index}
                  style={[
                    styles.alimentoItem,
                    index !== registro.alimentos.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(255,255,255,0.05)",
                    },
                  ]}
                >
                  <View style={styles.alimentoHeader}>
                    <Text
                      style={[styles.alimentoNombre, { color: theme.text }]}
                    >
                      {alimento.nombre}
                    </Text>
                    <Text style={[styles.alimentoCalorias, { color: theme.orange }]}>
                      {alimento.calorias} kcal
                    </Text>
                  </View>
                  <View style={styles.alimentoMacros}>
                    <Text style={styles.alimentoMacro}>
                      {alimento.proteina}g proteínas
                    </Text>
                    {alimento.carbohidratos !== undefined && (
                      <>
                        <Text style={styles.alimentoMacro}> • </Text>
                        <Text style={styles.alimentoMacro}>
                          {alimento.carbohidratos}g carbohidratos
                        </Text>
                      </>
                    )}
                    {alimento.grasas !== undefined && (
                      <>
                        <Text style={styles.alimentoMacro}> • </Text>
                        <Text style={styles.alimentoMacro}>
                          {alimento.grasas}g grasas
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  resumenCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  resumenHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  resumenTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  caloriesSection: {
    marginBottom: 20,
  },
  caloriesHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  caloriesLabel: {
    fontSize: 16,
    color: "#999",
    marginLeft: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  macrosGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  macroItem: {
    flex: 1,
  },
  macroLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  macroValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  macroMeta: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  comidaCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  comidaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  comidaHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  comidaIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  comidaNombre: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  comidaHora: {
    fontSize: 13,
    color: "#999",
  },
  comidaMacros: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  comidaMacroItem: {
    alignItems: "center",
  },
  comidaMacroValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  comidaMacroLabel: {
    fontSize: 11,
    color: "#999",
  },
  alimentosList: {
    gap: 0,
  },
  alimentoItem: {
    paddingVertical: 12,
  },
  alimentoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  alimentoNombre: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  alimentoCalorias: {
    fontSize: 15,
    fontWeight: "600",
  },
  alimentoMacros: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  alimentoMacro: {
    fontSize: 12,
    color: "#999",
  },
});