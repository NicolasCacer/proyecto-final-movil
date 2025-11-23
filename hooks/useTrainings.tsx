import { DataContext } from "@/context/DataContext";
import { Training } from "@/types/training";
import { formatDate, getWeekDayName } from "@/utils/calendarUtils";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";

export const useTrainings = () => {
  const { routinesAPI } = useContext(DataContext);
  const [entrenamientosProgramados, setEntrenamientosProgramados] = useState<
    string[]
  >([]);
  const [rutinasDelUsuario, setRutinasDelUsuario] = useState<any[]>([]);

  // Cargar rutinas del usuario desde Supabase
  const cargarRutinas = useCallback(async () => {
    const rutinas = await routinesAPI.getAll();
    if (rutinas) {
      setRutinasDelUsuario(rutinas);

      // Generar fechas programadas basadas en los días asignados
      const fechas = generarFechasProgramadas(rutinas);
      setEntrenamientosProgramados(fechas);
    }
  }, [routinesAPI]);

  // Recargar cuando la pantalla obtiene foco
  useFocusEffect(
    useCallback(() => {
      cargarRutinas();
    }, [cargarRutinas])
  );

  // Función para generar fechas de entrenamientos basadas en el día de la semana
  const generarFechasProgramadas = (rutinas: any[]): string[] => {
    const fechas: string[] = [];
    const hoy = new Date();

    const diasMap: { [key: string]: number } = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };

    for (let semana = 0; semana < 12; semana++) {
      rutinas.forEach((rutina) => {
        const diaNumero = diasMap[rutina.day]; // usa directamente day
        if (diaNumero !== undefined) {
          const fecha = new Date(hoy);
          const diaActual = fecha.getDay();
          const diferencia = diaNumero - diaActual + semana * 7;
          fecha.setDate(fecha.getDate() + diferencia);
          fechas.push(formatDate(fecha));
        }
      });
    }

    return fechas;
  };

  const getWeekTrainings = (selectedDate: Date): Training[] => {
    const trainings: Training[] = [];

    // Obtener el inicio de la semana (domingo)
    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());

    // Mapeo de números de día a nombres en español
    const diasMap: { [key: number]: string } = {
      0: "Domingo",
      1: "Lunes",
      2: "Martes",
      3: "Miércoles",
      4: "Jueves",
      5: "Viernes",
      6: "Sábado",
    };

    // Revisar cada día de la semana
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);

      const dateStr = formatDate(day);
      const diaNombre = diasMap[i];

      // Buscar rutinas asignadas a este día
      const rutinasDelDia = rutinasDelUsuario.filter((rutina) => {
        return diaNombre;
      });

      // Si hay rutinas para este día y la fecha está en las programadas
      if (
        rutinasDelDia.length > 0 &&
        entrenamientosProgramados.includes(dateStr)
      ) {
        rutinasDelDia.forEach((rutina) => {
          trainings.push({
            id: rutina.id,
            fecha: dateStr,
            dia: getWeekDayName(day.getDay()),
            ejercicio: rutina.name,
            estado: "Programado",
          });
        });
      }
    }

    return trainings;
  };

  return {
    entrenamientosProgramados,
    getWeekTrainings,
    refrescar: cargarRutinas, // Exportar función para refrescar manualmente
    diasEntrenamiento: rutinasDelUsuario.map((r) => r.day),
  };
};
