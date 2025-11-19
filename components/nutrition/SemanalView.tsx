import { ThemeContext } from "@/context/ThemeProvider";
import { ResumenSemana } from "@/types/nutrition";
import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface SemanalViewProps {
  resumenSemanal: ResumenSemana;
  metaCalorias: number;
}

export default function SemanalView({
  resumenSemanal,
  metaCalorias,
}: SemanalViewProps) {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Card de la semana */}
      <View style={[styles.semanaCard, { backgroundColor: theme.tabsBack }]}>
        {/* Header de la semana */}
        <View style={styles.semanaHeader}>
          <Text style={[styles.semanaTitle, { color: theme.text }]}>
            Semana {resumenSemanal.semana}
          </Text>
        </View>

        {/* Tabla de días */}
        <View style={styles.tabla}>
          {resumenSemanal.dias.map((dia, index) => {
            const superaMeta = dia.calorias > metaCalorias;

            return (
              <View
                key={index}
                style={[
                  styles.filaTabla,
                  index !== resumenSemanal.dias.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(255,255,255,0.05)",
                  },
                ]}
              >
                <View style={styles.diaInfo}>
                  <Text style={[styles.diaNombre, { color: theme.text }]}>
                    {dia.nombre}
                  </Text>
                  <Text style={styles.numComidas}>
                    {Math.floor(Math.random() * 3) + 3} comidas
                  </Text>
                </View>

                <Text
                  style={[
                    styles.caloriasValue,
                    {
                      color: superaMeta ? theme.red : theme.text,
                    },
                  ]}
                >
                  {dia.calorias}kcal
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Resumen de la semana */}
      <View
        style={[
          styles.resumenSemanalCard,
          { backgroundColor: theme.tabsBack },
        ]}
      >
        <Text style={[styles.resumenTitle, { color: theme.text }]}>
          Resumen de la Semana
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.orange }]}>
              {resumenSemanal.dias.reduce((acc, dia) => acc + dia.calorias, 0)}
            </Text>
            <Text style={styles.statLabel}>Calorías totales</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.orange }]}>
              {Math.round(
                resumenSemanal.dias.reduce((acc, dia) => acc + dia.calorias, 0) /
                  resumenSemanal.dias.length
              )}
            </Text>
            <Text style={styles.statLabel}>Promedio diario</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.orange }]}>
              {resumenSemanal.dias.filter((d) => d.cumplido).length}/7
            </Text>
            <Text style={styles.statLabel}>Días cumplidos</Text>
          </View>
        </View>
      </View>
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
  semanaCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  semanaHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  semanaTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  tabla: {
    padding: 0,
  },
  filaTabla: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  diaInfo: {
    flex: 1,
  },
  diaNombre: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  numComidas: {
    fontSize: 13,
    color: "#999",
  },
  caloriasValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  resumenSemanalCard: {
    padding: 20,
    borderRadius: 16,
  },
  resumenTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});