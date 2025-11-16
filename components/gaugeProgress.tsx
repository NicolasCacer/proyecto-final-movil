import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Circle, G, Svg, Text as SvgText } from "react-native-svg";

interface GaugeProps {
  data: { [key: string]: number };
  meta: number;
}

export default function GaugeProgress({ data, meta }: GaugeProps) {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  const totalKcal = Object.values(data).reduce((a, b) => a + b, 0);
  const progress = Math.min(totalKcal / meta, 1);

  const size = 120;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const rotation = -90;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Gauge Circular */}
        <View style={[styles.card, { backgroundColor: theme.tabsBack }]}>
          <Svg width={size} height={size}>
            <G rotation={rotation} origin={`${size / 2}, ${size / 2}`}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={theme.text + "33"}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={theme.orange}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference}`}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
                fill="none"
              />
            </G>
            <SvgText
              x={size / 2}
              y={size / 2}
              fill={theme.text}
              fontSize={20}
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {totalKcal}
            </SvgText>
          </Svg>
          <AppText style={[styles.metaText, { color: theme.text }]}>
            Meta: {meta} KCal
          </AppText>
        </View>

        {/* Barra Horizontal */}
        <View style={[styles.card, { backgroundColor: theme.tabsBack }]}>
          <AppText style={[styles.barTitle, { color: theme.text }]}>
            Acumulado
          </AppText>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                { width: `${progress * 100}%`, backgroundColor: theme.orange },
              ]}
            />
          </View>
          <AppText style={[styles.barPercent, { color: theme.text }]}>
            {Math.round(progress * 100)}%
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    gap: 20,
    width: "100%",
  },
  card: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  metaText: {
    marginTop: 10,
    fontSize: 14,
  },
  barTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  barBackground: {
    width: "100%",
    height: 20,
    backgroundColor: "#99933333",
    borderRadius: 10,
  },
  barFill: {
    height: "100%",
    borderRadius: 10,
  },
  barPercent: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
});
