import { ThemeContext } from "@/context/ThemeProvider";
import { Training } from "@/types/training";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

interface WeekTrainingsProps {
  trainings: Training[];
}

export default function WeekTrainings({ trainings }: WeekTrainingsProps) {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        Entrenamientos esta semana
      </Text>

      {trainings.length > 0 ? (
        trainings.map((entrenamiento, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: theme.tabsBack }]}
          >
            <View style={styles.left}>
              <Text style={[styles.dia, { color: theme.text }]}>
                {entrenamiento.dia}
              </Text>
              <Text style={[styles.ejercicio, { color: theme.text }]}>
                {entrenamiento.ejercicio}
              </Text>
            </View>
            <View style={styles.estadoBadge}>
              <Text style={styles.estadoText}>{entrenamiento.estado}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={[styles.noTrainingsText, { color: "#999" }]}>
          No hay entrenamientos programados esta semana
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  left: {
    flex: 1,
  },
  dia: {
    fontSize: 14,
    marginBottom: 4,
  },
  ejercicio: {
    fontSize: 16,
    fontWeight: "500",
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  estadoText: {
    fontSize: 12,
    color: "#999",
  },
  noTrainingsText: {
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 20,
  },
});
