import { ThemeContext } from "@/context/ThemeProvider";
import {
    generateCalendarDays,
    getMonthName,
    isSelected,
    isToday
} from "@/utils/calendarUtils";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  if (!themeContext) return null;
  const { theme } = themeContext;

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const hasTraining = (day: number): boolean => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return trainings.includes(dateStr);
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
        <Text style={[styles.monthText, { color: theme.text }]}>
          {getMonthName(currentDate)}
        </Text>
        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={onPreviousMonth}>
            <Text style={{ color: theme.orange, fontSize: 20 }}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={onNextMonth}>
            <Text style={{ color: theme.orange, fontSize: 20 }}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Días de la semana */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayItem}>
            <Text
              style={[
                styles.weekDayText,
                {
                  color:
                    index === 0 || index === 6 ? theme.orange : theme.text,
                },
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Días del mes */}
      <View style={styles.monthDaysContainer}>
        {generateCalendarDays(currentDate).map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              const hasTrain = day && hasTraining(day);
              const isDaySelected = day && isSelected(day, selectedDate, currentDate);
              const isDayToday = day && isToday(day, currentDate);

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={styles.dayCell}
                  onPress={() => day && handleDayPress(day)}
                  disabled={!day}
                >
                  {day ? (
                    <View
                      style={[
                        styles.dayCircle,
                        isDaySelected && {
                          backgroundColor: theme.orange,
                        },
                        hasTrain &&
                          !isDaySelected && {
                            backgroundColor: "rgba(255, 126, 51, 0.2)",
                          },
                        isDayToday &&
                          !isDaySelected && {
                            borderWidth: 2,
                            borderColor: theme.orange,
                          },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          {
                            color: isDaySelected
                              ? "#fff"
                              : hasTrain
                              ? theme.orange
                              : theme.text,
                          },
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  ) : null}
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