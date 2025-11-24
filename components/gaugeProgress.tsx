import { ThemeContext } from "@/context/ThemeProvider";
import AppText from "@/utils/AppText";
import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Circle, G, Path, Svg, Text as SvgText } from "react-native-svg";

interface GaugeProps {
  data: { [key: string]: number };
  meta: number;
}

export default function GaugeProgress({ data, meta }: GaugeProps) {
  const themeContext = useContext(ThemeContext);

  const totalKcal = Object.values(data).reduce((a, b) => a + b, 0);
  const progress = Math.min(totalKcal / meta, 1);

  const [width, setWidth] = useState(150);

  // responsive size based on card width
  const size = width * 0.8;
  const strokeWidth = size * 0.12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const semicircle = circumference / 1.5;

  const { theme } = themeContext;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* LEFT CARD — GAUGE */}
        <View
          style={[styles.card, { backgroundColor: theme.tabsBack }]}
          onLayout={(e) => {
            setWidth(e.nativeEvent.layout.width);
          }}
        >
          <View
            style={{
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Svg width={20} height={20} viewBox="0 0 32 32" fill="none">
              <G fill="none">
                <Path
                  d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"
                  fill="#ff6723"
                  stroke="#ff6723"
                  strokeWidth={1}
                />
                <Path
                  d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"
                  fill="#ffb02e"
                  stroke="#ffb02e"
                  strokeWidth={1}
                />
              </G>
            </Svg>
            <AppText style={[styles.header, { color: theme.text }]}>
              Progreso semanal
            </AppText>
          </View>

          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Svg width={size} height={size}>
              <G rotation={150} origin={`${size / 2}, ${size / 2}`}>
                {/* Semicircle background */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={theme.text + "33"}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${semicircle}, ${circumference}`}
                  strokeLinecap="round"
                />

                {/* Semicircle progress */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={theme.orange}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${semicircle}, ${circumference}`}
                  strokeDashoffset={semicircle * (1 - progress)}
                  strokeLinecap="round"
                />
              </G>

              {/* CENTRAL TEXT */}
              <SvgText
                x={size / 2}
                y={size / 2}
                fill={theme.text}
                fontSize={size * 0.18}
                fontWeight="700"
                textAnchor="middle"
              >
                {totalKcal}
              </SvgText>

              <SvgText
                x={size / 2}
                y={size / 2 + 30}
                fill={theme.text + "AA"}
                fontSize={size * 0.13}
                textAnchor="middle"
              >
                Kcal
              </SvgText>
            </Svg>
          </View>
        </View>

        {/* RIGHT CARD — LINEAR BAR */}
        <View style={[styles.card, { backgroundColor: theme.tabsBack }]}>
          <View style={{ padding: 16 }}>
            <AppText style={[styles.titleRight, { color: theme.text }]}>
              📈 Tu avance
            </AppText>

            <AppText style={[styles.subText, { color: theme.text + "AA" }]}>
              ¡ya estas más cerca{"\n"}de tu meta de {meta} Kcal!
            </AppText>

            <AppText style={[styles.percent, { color: theme.text }]}>
              {Math.round(progress * 100)}%
            </AppText>

            <View
              style={[
                styles.barBackground,
                { backgroundColor: theme.text + "22" },
              ]}
            >
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: theme.orange,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 5,
  },

  header: {
    fontWeight: "bold",
  },

  titleRight: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  subText: {
    fontSize: 15,
    marginBottom: 14,
  },
  percent: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },

  barBackground: {
    width: "100%",
    height: 14,
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 10,
  },
});
