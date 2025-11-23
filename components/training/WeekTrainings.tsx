import { DataContext } from "@/context/DataContext";
import { ThemeContext } from "@/context/ThemeProvider";
import { Training } from "@/types/training";
import AppText from "@/utils/AppText";
import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
interface WeekTrainingsProps {
  selectedDate: Date;
  onDelete?: () => void; // Callback para refrescar la lista después de eliminar
}

export default function WeekTrainings({
  selectedDate,
  onDelete,
}: WeekTrainingsProps) {
  const themeContext = useContext(ThemeContext);
  const { routinesAPI, exercisesAPI, activitiesAPI } = useContext(DataContext);
  const { theme } = themeContext;

  const [trainings, setTrainings] = useState<Training[]>([]);

  // Obtener el día de la semana de la fecha seleccionada
  const selectedDayName = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
  });
  const diaCapitalizado =
    selectedDayName.charAt(0).toUpperCase() + selectedDayName.slice(1);

  const fetchTrainings = async () => {
    try {
      const rutinas = await routinesAPI.getAll();
      const ejerciciosDB = await exercisesAPI.getAll();
      const actividadesDB = await activitiesAPI.getAll();

      if (!rutinas || !ejerciciosDB || !actividadesDB) {
        setTrainings([]);
        return;
      }

      // Filtrar rutinas del día seleccionado
      const rutinasDelDia = rutinas.filter(
        (r) => r.day.toLowerCase() === selectedDayName.toLowerCase()
      );

      const trainingsData: Training[] = [];

      rutinasDelDia.forEach((rutina) => {
        // Obtener ejercicios de la rutina
        const ejerciciosRutina = ejerciciosDB.filter(
          (e) => e.routine_id === rutina.id
        );

        // Determinar si todos los ejercicios de la rutina están completados
        const completado = ejerciciosRutina.every((ejercicio) =>
          actividadesDB.some(
            (a) =>
              a.routine_id === rutina.id &&
              a.exercise_id === ejercicio.id &&
              new Date(a.created_at).toDateString() ===
                selectedDate.toDateString()
          )
        );

        trainingsData.push({
          id: rutina.id, // id de la rutina
          fecha: selectedDate.toISOString().split("T")[0],
          dia: diaCapitalizado,
          ejercicio: rutina.name, // nombre de la rutina
          estado: completado ? "Completado" : "Programado",
          completado: completado,
        });
      });

      setTrainings(trainingsData);
    } catch (error) {
      console.error("Error cargando entrenamientos:", error);
      setTrainings([]);
    }
  };

  useEffect(() => {
    fetchTrainings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Dentro de WeekTrainings
  const handleDelete = async (routineId: string, routineName: string) => {
    Alert.alert(
      "Eliminar Rutina",
      `¿Estás seguro de que quieres eliminar la rutina "${routineName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const success = await routinesAPI.delete(routineId);
            if (success) {
              Alert.alert("Éxito", "Rutina eliminada correctamente");
              fetchTrainings(); // actualiza los entrenamientos del día
              if (onDelete) onDelete(); // llama al callback del calendario
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
      <AppText style={[styles.title, { color: theme.text }]}>
        Entrenamientos del día
      </AppText>

      {trainings.length > 0 ? (
        trainings.map((entrenamiento, index) => (
          <View
            key={`${entrenamiento.id}-${index}`}
            style={[styles.card, { backgroundColor: theme.tabsBack }]}
          >
            <View style={styles.left}>
              <AppText style={[styles.dia, { color: theme.text }]}>
                {diaCapitalizado}
              </AppText>
              <AppText style={[styles.ejercicio, { color: theme.text }]}>
                {entrenamiento.ejercicio}
              </AppText>
            </View>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                { backgroundColor: theme.background },
              ]}
              onPress={() =>
                handleDelete(entrenamiento.id, entrenamiento.ejercicio)
              }
            >
              <AppText style={[styles.deleteText, { color: theme.red }]}>
                Eliminar
              </AppText>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <AppText style={[styles.noTrainingsText, { color: "#999" }]}>
          No hay entrenamientos programados para este día
        </AppText>
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
