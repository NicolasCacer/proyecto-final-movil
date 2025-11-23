import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import {
  generateCalendarDays,
  getMonthName,
  isSelected,
  isToday,
} from "@/utils/calendarUtils";
import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
interface TrainingCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  trainings: string[]; // Array de fechas con entrenamientos
}

export default function TrainingCalendar({
  currentDate,
  selectedDate,
  onDateSelect,
  onPreviousMonth,
  onNextMonth,
  trainings,
}: TrainingCalendarProps) {
  const themeContext = useContext(ThemeContext);

  const { theme } = themeContext;

  const weekDays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

  const hasTraining = (day: number): boolean => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    return trainings.includes(capitalizedDay);
  };

  const handleDayPress = (day: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    onDateSelect(newDate);
  };

  return (
    <View style={styles.container}>
      {/* Header del Calendario */}
      <View style={styles.calendarHeader}>
        <AppText style={[styles.monthText, { color: theme.text }]}>
          {getMonthName(currentDate)}
        </AppText>
        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={onPreviousMonth}>
            <AppText style={{ color: theme.orange, fontSize: 20 }}>‹</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={onNextMonth}>
            <AppText style={{ color: theme.orange, fontSize: 20 }}>›</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Días de la semana */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayItem}>
            <AppText
              style={[
                styles.weekDayText,
                {
                  color: index === 0 || index === 6 ? theme.orange : theme.text,
                },
              ]}
            >
              {day}
            </AppText>
          </View>
        ))}
      </View>

      {/* Días del mes */}
      <View style={styles.monthDaysContainer}>
        {generateCalendarDays(currentDate).map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              if (!day) return <View key={dayIndex} style={styles.dayCell} />;

              const isDaySelected = isSelected(day, selectedDate, currentDate);
              const isDayToday = isToday(day, currentDate);
              const hasTrain = hasTraining(day);

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={styles.dayCell}
                  onPress={() => handleDayPress(day)}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      // Día seleccionado
                      isDaySelected && { backgroundColor: theme.orange },
                      // Día de entrenamiento pero no seleccionado ni hoy
                      !isDaySelected &&
                        !isDayToday &&
                        hasTrain && {
                          backgroundColor: "rgba(255,126,51,0.2)", // mismo color del puntito pero más visible
                        },
                      // Día de hoy (border)
                      !isDaySelected &&
                        isDayToday && {
                          borderWidth: 2,
                          borderColor: theme.orange,
                        },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.dayText,
                        {
                          color: isDaySelected
                            ? "#fff"
                            : hasTrain && !isDaySelected
                            ? theme.orange
                            : theme.text,
                        },
                      ]}
                    >
                      {day}
                    </AppText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
  },
  monthNavigation: {
    flexDirection: "row",
    gap: 15,
  },
  navButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDaysContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  weekDayItem: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
  },
  monthDaysContainer: {
    marginBottom: 10,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
