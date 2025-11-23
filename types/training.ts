export interface Training {
  id: string;
  fecha: string;
  dia: string;
  ejercicio: string;
  estado: "Programado" | "Completado" | "Pendiente";
  completado?: boolean;
}

export interface CalendarDay {
  day: number | null;
  hasTraining: boolean;
  isToday: boolean;
  isSelected: boolean;
}
