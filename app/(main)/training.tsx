import RutinaView from "@/components/training/RutinaView";
import TrainingCalendar from "@/components/training/TrainingCalendar";
import WeekTrainings from "@/components/training/WeekTrainings";
import { ThemeContext } from "@/context/ThemeProvider";
import { useTrainings } from "@/hooks/useTrainings";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Training() {
  const themeContext = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("rutina");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { entrenamientosProgramados, getWeekTrainings } = useTrainings();

  if (!themeContext) return null;
  const { theme } = themeContext;

  const tabs = [
    { id: "rutina", label: "Rutina" },
    { id: "calendario", label: "Calendario" },
  ];

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleCreateRoutine = () => {
    console.log("Crear nueva rutina");
    // Aquí irá la navegación al formulario de crear rutina
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              Entrenamiento
            </Text>
            <Text style={[styles.subtitle, { color: "#999" }]}>
              Tu plan de ejercicio personalizado
            </Text>
          </View>

          {/* Botón crear rutina - solo visible en pestaña Rutina */}
          {activeTab === "rutina" && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: theme.orange }]}
              onPress={handleCreateRoutine}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Segmented Control */}
        <LinearGradient
          colors={[theme.orange, theme.red]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.segmentedControlContainer}
        >
          <View style={styles.segmentedControl}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.segment,
                  activeTab === tab.id && [
                    styles.activeSegment,
                    { backgroundColor: theme.background },
                  ],
                  index === 0 && styles.firstSegment,
                  index === tabs.length - 1 && styles.lastSegment,
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === tab.id
                      ? { color: theme.text }
                      : { color: "rgba(255,255,255,0.7)" },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      {activeTab === "rutina" ? (
        <RutinaView />
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.calendarioContent}>
            <TrainingCalendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
              trainings={entrenamientosProgramados}
            />

            <WeekTrainings trainings={getWeekTrainings(selectedDate)} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  segmentedControlContainer: {
    borderRadius: 12,
    padding: 3,
  },
  segmentedControl: {
    flexDirection: "row",
    borderRadius: 10,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeSegment: {
    borderRadius: 8,
  },
  firstSegment: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastSegment: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  calendarioContent: {
    padding: 20,
  },
});