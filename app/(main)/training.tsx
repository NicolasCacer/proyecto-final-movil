import TrainingCalendar from "@/components/training/TrainingCalendar";
import RutinaView from "@/components/training/RutinaView";
import WeekTrainings from "@/components/training/WeekTrainings";
import { ThemeContext } from "@/context/ThemeProvider";
import { useTrainings } from "@/hooks/useTrainings";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Training() {
  const themeContext = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("rutina");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar recarga

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

  const handleDelete = () => {
    // Forzar recarga incrementando la key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: theme.text }]}>Entrenamiento</Text>
        <Text style={[styles.subtitle, { color: "#999" }]}>
          Tu plan de ejercicio personalizado
        </Text>

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
        <RutinaView key={refreshKey} />
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

            <WeekTrainings 
              trainings={getWeekTrainings(selectedDate)} 
              selectedDate={selectedDate}
              onDelete={handleDelete}
            />
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
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