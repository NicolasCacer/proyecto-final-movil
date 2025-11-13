import { ThemeContext } from "@/context/ThemeProvider";
import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Necesitarás instalar: npx expo install @expo/vector-icons
import { Ionicons } from '@expo/vector-icons';

export default function Scanner() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Dieta</Text>
        <Text style={styles.subtitle}>Tu plan alimenticio personalizado.</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabActive, { backgroundColor: theme.red }]}>
          <Text style={styles.tabTextActive}>Diario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabInactive}>
          <Text style={styles.tabTextInactive}>Semanal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumen diario */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryIcon}>⚡</Text>
            <Text style={styles.summaryTitle}>Resumen diario</Text>
          </View>
          
          <Text style={styles.summaryLabel}>Calorías</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '45%', backgroundColor: theme.orange }]} />
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Proteínas</Text>
              <View style={styles.macroBar}>
                <View style={[styles.macroFill, { width: '60%', backgroundColor: '#3498db' }]} />
              </View>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Grasa</Text>
              <View style={styles.macroBar}>
                <View style={[styles.macroFill, { width: '40%', backgroundColor: '#e74c3c' }]} />
              </View>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carbohidratos</Text>
              <View style={styles.macroBar}>
                <View style={[styles.macroFill, { width: '50%', backgroundColor: '#2ecc71' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* DESAYUNO */}
        <View style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <View style={styles.mealTitleRow}>
              <View style={styles.checkbox}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <View>
                <Text style={styles.mealTitle}>DESAYUNO</Text>
                <Text style={styles.mealTime}>8:00 am</Text>
              </View>
            </View>
            <View style={[styles.caloriesBadge, { backgroundColor: theme.red }]}>
              <Text style={styles.caloriesText}>690 kcal</Text>
            </View>
          </View>

          <View style={styles.foodList}>
            <Text style={styles.foodItem}>• 2 huevos</Text>
            <Text style={styles.foodItem}>• Tocino</Text>
          </View>

          <View style={styles.macroValues}>
            <Text style={styles.macroValue}>P: 19g</Text>
            <Text style={styles.macroValue}>C: 14g</Text>
            <Text style={styles.macroValue}>G: 20g</Text>
          </View>

          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.orange }]}>
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Agregar comida</Text>
          </TouchableOpacity>
        </View>

        {/* Espaciado para el bottom tab */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  summaryIcon: {
    fontSize: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  macrosContainer: {
    gap: 12,
  },
  macroItem: {
    gap: 6,
  },
  macroLabel: {
    fontSize: 13,
    color: '#999999',
  },
  macroBar: {
    height: 6,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroFill: {
    height: '100%',
    borderRadius: 3,
  },
  mealCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mealTime: {
    fontSize: 13,
    color: '#999999',
    marginTop: 2,
  },
  caloriesBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  foodList: {
    marginBottom: 16,
    gap: 4,
  },
  foodItem: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  macroValues: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  macroValue: {
    fontSize: 13,
    color: '#999999',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  addButtonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});