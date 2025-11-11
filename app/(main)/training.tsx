import { ThemeContext } from "@/context/ThemeProvider";
import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Training() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const routines = [
    {
      id: 1,
      title: 'Rutina Pecho y trícep',
      duration: '45 min',
      difficulty: 'medio',
      exercises: '5 ejercicios'
    },
    {
      id: 2,
      title: 'Rutina Espalda y bícep',
      duration: '45 min',
      difficulty: 'medio',
      exercises: '5 ejercicios'
    },
    {
      id: 3,
      title: 'Pierna y abdomen',
      duration: '45 min',
      difficulty: 'medio',
      exercises: '5 ejercicios'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Entrenamiento</Text>
        <Text style={styles.subtitle}>Tu plan de ejercicio personalizado</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabActive, { backgroundColor: theme.red }]}>
          <Text style={styles.tabTextActive}>Rutina</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabInactive}>
          <Text style={styles.tabTextInactive}>Calendario</Text>
        </TouchableOpacity>
      </View>

      {/* Routines List */}
      <ScrollView style={styles.routinesList} showsVerticalScrollIndicator={false}>
        {routines.map((routine) => (
          <TouchableOpacity key={routine.id} style={styles.routineCard}>
            <View style={styles.routineContent}>
              <Text style={styles.routineTitle}>{routine.title}</Text>
              
              <View style={styles.routineInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>⏱</Text>
                  <Text style={styles.infoText}>{routine.duration}</Text>
                </View>
                
                <View style={[styles.badge, styles.badgeMedio]}>
                  <Text style={styles.badgeText}>{routine.difficulty}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoText}>{routine.exercises}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.arrow}>
              <Text style={styles.arrowIcon}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.buttonAdd, { backgroundColor: theme.red }]}>
          <Text style={styles.buttonAddIcon}>+</Text>
          <Text style={styles.buttonAddText}>Agregar Rutina</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.buttonRecommend, { backgroundColor: theme.orange }]}>
          <Text style={styles.buttonRecommendIcon}>🔍</Text>
          <Text style={styles.buttonRecommendText}>Recomendación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    padding: 4,
  },
  tabActive: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabInactive: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextInactive: {
    color: '#999999',
    fontWeight: '600',
    fontSize: 14,
  },
  routinesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  routineCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routineContent: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  routineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoIcon: {
    fontSize: 14,
    color: '#999999',
  },
  infoText: {
    fontSize: 13,
    color: '#999999',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeMedio: {
    backgroundColor: '#2ecc71',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  arrow: {
    marginLeft: 12,
  },
  arrowIcon: {
    fontSize: 32,
    color: '#666666',
    fontWeight: '300',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  buttonAdd: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  buttonAddIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buttonAddText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonRecommend: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  buttonRecommendIcon: {
    fontSize: 16,
  },
  buttonRecommendText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});