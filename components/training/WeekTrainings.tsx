import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import { Training } from "@/types/training";
import React, { useContext } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WeekTrainingsProps {
  trainings: Training[];
  selectedDate: Date;
  onDelete?: () => void; // Callback para refrescar la lista después de eliminar
}

export default function WeekTrainings({
  trainings,
  selectedDate,
  onDelete,
}: WeekTrainingsProps) {
  const themeContext = useContext(ThemeContext);
  const { routinesAPI } = useContext(DataContext);

  const { theme } = themeContext;

  // Mapeo de días en inglés a español
  const diasMap: { [key: string]: string } = {
    Domingo: "Domingo",
    Lunes: "Lunes",
    Martes: "Martes",
    Miércoles: "Miércoles",
    Jueves: "Jueves",
    Viernes: "Viernes",
    Sábado: "Sábado",
  };

  // Obtener el día de la semana de la fecha seleccionada
  const selectedDayName = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
  });
  const diaCapitalizado =
    selectedDayName.charAt(0).toUpperCase() + selectedDayName.slice(1);

  const handleDelete = async (routineId: string, routineName: string) => {
    Alert.alert(
      "Eliminar Rutina",
      `¿Estás seguro de que quieres eliminar la rutina "${routineName}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const success = await routinesAPI.delete(routineId);
            if (success) {
              Alert.alert("Éxito", "Rutina eliminada correctamente");
              // Llamar al callback para refrescar
              if (onDelete) onDelete();
            } else {
              Alert.alert("Error", "No se pudo eliminar la rutina");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>
        Entrenamientos del día
      </Text>

      {trainings.length > 0 ? (
        trainings.map((entrenamiento, index) => (
          <View
            key={index}
            style={[styles.card, { backgroundColor: theme.tabsBack }]}
          >
            <View style={styles.left}>
              <Text style={[styles.dia, { color: theme.text }]}>
                {diaCapitalizado}
              </Text>
              <Text style={[styles.ejercicio, { color: theme.text }]}>
                {entrenamiento.ejercicio}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                { backgroundColor: theme.background },
              ]}
              onPress={() => {
                // Extraer el ID de la rutina del id compuesto
                const routineId = entrenamiento.id;
                handleDelete(routineId, entrenamiento.ejercicio);
              }}
            >
              <Text style={[styles.deleteText, { color: theme.red }]}>
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={[styles.noTrainingsText, { color: "#999" }]}>
          No hay entrenamientos programados para este día
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
    textAlign: "center",
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
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
  },
  noTrainingsText: {
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 20,
  },
});
