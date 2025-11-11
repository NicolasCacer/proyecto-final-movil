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

  const max = Math.max(...valores, 1); // evita división por 0

  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const BAR_WIDTH = 30; // ancho fijo para cada barra y su letra
  const GAP = 10; // espacio entre barras

  return (
    <View style={[styles.container, { backgroundColor: theme.tabsBack }]}>
      {/* ROW 1: Título de racha */}
      <AppText style={styles.titulo}>
        <AppText style={styles.bold}>
          {dias.filter((d) => data[d] > 0).length}
        </AppText>{" "}
        días activos
      </AppText>

      {/* ROW 2: Eje Y + Barras */}
      <View style={styles.chartRow}>
        {/* EJE Y */}
        <View style={styles.yAxis}>
          <AppText style={styles.yText}>{Math.round(max)}</AppText>
          <AppText style={styles.yText}>{Math.round(max / 2)}</AppText>
          <AppText style={styles.yText}>0</AppText>
        </View>

        {/* BARRAS */}
        <View style={styles.barsContainer}>
          {/* Líneas de referencia */}
          {[1, 0.75, 0.5, 0.25, 0].map((fraction, idx) => (
            <View
              key={idx}
              style={{
                position: "absolute",
                top: `${(1 - fraction) * 100}%`,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: theme.text + "1A", // línea suave
              }}
            />
          ))}

          {dias.map((d, i) => {
            const altura = (data[d] / max) * 100;
            return (
              <View
                key={i}
                style={[
                  styles.barItem,
                  { width: BAR_WIDTH, marginHorizontal: GAP / 2 },
                ]}
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

      {/* ROW 3: Kcal + Días */}
      <View style={styles.labelsRow}>
        <AppText style={styles.kcal}>KCal</AppText>
        <View style={styles.daysContainer}>
          {dias.map((d, i) => (
            <View
              key={i}
              style={{
                width: BAR_WIDTH,
                marginHorizontal: GAP / 2,
                alignItems: "center",
              }}
            >
              <AppText style={styles.xLabel}>{d}</AppText>
            </View>
          ))}
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
    width: 31,
    marginRight: 16,
  },
  yText: {
    fontSize: 12,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    flex: 1,
  },
  barItem: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  barBase: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 15,
  },
  labelsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  kcal: {
    fontSize: 14,
    width: 31,
    marginHorizontal: 8.5,
  },
  daysContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
  },
  xLabel: {
    fontWeight: "bold",
  },
});
