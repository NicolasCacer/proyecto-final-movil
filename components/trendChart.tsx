import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

interface TrendChartProps {
  data: { [key: string]: number };
}

export default function TrendChart({ data }: TrendChartProps) {
  const dias = Object.keys(data);
  const valores = Object.values(data);

  const max = Math.max(...valores, 1);

  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const BAR_WIDTH = 30;
  const GAP = 10;

  // Ahora el slot se calcula con ESPACIO incluido
  const SLOT_WIDTH = BAR_WIDTH + GAP;

  const contentWidth = dias.length * SLOT_WIDTH;

  return (
    <View style={[styles.container, { backgroundColor: theme.tabsBack }]}>
      {/* ROW 1 */}
      <AppText style={styles.titulo}>
        <AppText style={styles.bold}>
          {dias.filter((d) => data[d] > 0).length}
        </AppText>{" "}
        días activos
      </AppText>

      {/* ROW 2 */}
      <View style={styles.chartRow}>
        {/* Y Axis */}
        <View style={styles.yAxis}>
          <AppText style={styles.yText}>{Math.round(max)}</AppText>
          <AppText style={styles.yText}>{Math.round(max / 2)}</AppText>
          <AppText style={styles.yText}>0</AppText>
        </View>

        {/* Barras */}
        <View style={{ width: contentWidth }}>
          <View style={styles.barsContainer}>
            {/* Líneas guía */}
            {[1, 0.75, 0.5, 0.25, 0].map((fraction, idx) => (
              <View
                key={idx}
                style={{
                  position: "absolute",
                  top: `${(1 - fraction) * 100}%`,
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: theme.text + "1A",
                }}
              />
            ))}

            {/* BARRAS */}
            {dias.map((d, i) => {
              const altura = (data[d] / max) * 100;

              return (
                <View
                  key={i}
                  style={{
                    width: SLOT_WIDTH,
                    alignItems: "center",
                  }}
                >
                  <View style={styles.barBase}>
                    <LinearGradient
                      colors={[theme.orange, theme.white]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={[styles.bar, { height: `${altura}%` }]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* ROW 3: labels */}
      <View style={styles.labelsRow}>
        <AppText style={styles.kcal}>KCal</AppText>

        <View style={{ width: contentWidth }}>
          <View style={styles.daysContainer}>
            {dias.map((d, i) => (
              <View
                key={i}
                style={{
                  width: SLOT_WIDTH,
                  alignItems: "center",
                }}
              >
                <AppText style={styles.xLabel}>{d}</AppText>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    padding: 15,
    width: "100%",
  },
  titulo: {
    fontSize: 20,
    marginBottom: 20,
    marginLeft: 5,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 24,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  yAxis: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    width: 33,
    marginRight: 16,
  },
  yText: {
    fontSize: 12,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    position: "relative",
  },
  barBase: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
  },
  bar: {
    width: 30,
    borderRadius: 15,
  },
  labelsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  kcal: {
    fontSize: 14,
    width: 33,
    marginRight: 10,
  },
  daysContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  xLabel: {
    fontWeight: "bold",
  },
});
