import { Training } from "@/types/training";
import { formatDate, getWeekDayName } from "@/utils/calendarUtils";
import { useState } from "react";

export const useTrainings = () => {
  // Entrenamientos programados (puedes cargarlos de una API)
  const [entrenamientosProgramados] = useState<string[]>([
    "2024-06-03",
    "2024-06-05",
    "2024-06-10",
    "2024-06-12",
    "2024-06-14",
    "2024-06-17",
    "2024-06-19",
    "2024-06-21",
    "2024-06-24",
    "2024-06-26",
    "2024-06-28",
  ]);

  const getWeekTrainings = (selectedDate: Date): Training[] => {
    const trainings: Training[] = [];

    // Obtener el inicio de la semana (domingo)
    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());

    // Revisar cada día de la semana
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);

      const dateStr = formatDate(day);

      if (entrenamientosProgramados.includes(dateStr)) {
        // Tipos de entrenamiento según el día
        const ejercicios = [
          "Pecho y tríceps",
          "Pierna y abs",
          "Espalda y bíceps",
          "Hombros y core",
          "Full body",
        ];

        trainings.push({
          id: dateStr,
          fecha: dateStr,
          dia: getWeekDayName(day.getDay()),
          ejercicio: ejercicios[i % ejercicios.length],
          estado: "Programado",
        });
      }
    }

    return trainings;
  };

  return {
    entrenamientosProgramados,
    getWeekTrainings,
  };
};