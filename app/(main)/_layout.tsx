import { ThemeContext } from "@/context/ThemeProvider";
import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

export default function RootLayout() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const { theme } = themeContext;

  // Función para renderizar el ícono con su recuadro activo
  const renderTabIcon = (
    SVGComponent: React.FC<any>,
    focused: boolean,
    size = 40 // tamaño uniforme para todos los íconos
  ) => {
    return (
      <View
        style={{
          width: size + 20, // espacio para el fondo
          height: size + 10,
          borderRadius: 15,
          backgroundColor: focused ? theme.tabBar : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SVGComponent width={size} height={size} />
      </View>
    );
  };

  // SVGs para cada tab
  const ChatIcon = () => (
    <Svg width={35} height={35} viewBox="0 0 24 24">
      <G fill="none" strokeLinejoin="round">
        <Path
          stroke={theme.text}
          strokeWidth={2}
          d="M14.17 20.89c4.184-.277 7.516-3.657 7.79-7.9c.053-.83.053-1.69 0-2.52c-.274-4.242-3.606-7.62-7.79-7.899a33 33 0 0 0-4.34 0c-4.184.278-7.516 3.657-7.79 7.9a20 20 0 0 0 0 2.52c.1 1.545.783 2.976 1.588 4.184c.467.845.159 1.9-.328 2.823c-.35.665-.526.997-.385 1.237c.14.24.455.248 1.084.263c1.245.03 2.084-.322 2.75-.813c.377-.279.566-.418.696-.434s.387.09.899.3c.46.19.995.307 1.485.34c1.425.094 2.914.094 4.342 0Z"
        />
        <Path
          stroke={theme.text}
          strokeWidth={1.5}
          strokeLinecap="round"
          d="m7.5 15 1.842-5.526a.694.694 0 0 1 1.316 0L12.5 15m3-6v6m-7-2h3"
        />
      </G>
    </Svg>
  );

  const ScannerIcon = () => (
    <Svg width={35} height={35} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={theme.text}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M8 7v10m4-10v10m5-10v10"
      />
    </Svg>
  );

  const HomeIcon = () => (
    <Svg width={45} height={45} viewBox="0 0 16 16">
      <Path
        fill={theme.text}
        stroke={theme.text}
        strokeWidth={0.1}
        fillRule="evenodd"
        d="m8.36 1.37l6.36 5.8l-.71.71L13 6.964v6.526l-.5.5h-3l-.5-.5v-3.5H7v3.5l-.5.5h-3l-.5-.5V6.972L2 7.88l-.71-.71l6.35-5.8zM4 6.063v6.927h2v-3.5l.5-.5h3l.5.5v3.5h2V6.057L8 2.43z"
        clipRule="evenodd"
      />
    </Svg>
  );

  const TrainingIcon = () => (
    <Svg width={48} height={48} viewBox="0 0 48 48">
      <G
        fill="none"
        stroke={theme.text}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      >
        <Path d="M9.102 13.727c.032-1.321.78-2.503 2.092-2.656c.378-.043.812-.071 1.306-.071s.928.028 1.306.072c1.313.152 2.06 1.334 2.092 2.655c.047 1.944.102 5.29.102 10.273s-.055 8.329-.102 10.273c-.032 1.321-.78 2.503-2.092 2.656c-.378.043-.812.071-1.306.071s-.928-.028-1.306-.071c-1.313-.153-2.06-1.335-2.092-2.656C9.055 32.329 9 28.983 9 24s.055-8.329.102-10.273m29.796 0c-.032-1.321-.78-2.503-2.092-2.656c-.378-.043-.812-.071-1.306-.071s-.928.028-1.306.072c-1.313.152-2.06 1.334-2.092 2.655C32.055 15.671 32 19.017 32 24s.055 8.329.102 10.273c.032 1.321.78 2.503 2.092 2.656c.378.043.812.071 1.306.071s.928-.028 1.306-.071c1.313-.153 2.06-1.335 2.092-2.656c.047-1.944.102-5.29.102-10.273s-.055-8.329-.102-10.273"></Path>
        <Path d="M15.993 26.982a1293 1293 0 0 0 16.014-.013m-.001-5.939c-2.414-.017-5.4-.03-9.007-.03c-2.668 0-4.998.007-7.007.018M3.055 18.803c.036-1.49.984-2.748 2.474-2.796a15 15 0 0 1 .942 0c1.49.048 2.438 1.305 2.474 2.796C8.975 20.026 9 21.739 9 24s-.026 3.974-.055 5.197c-.036 1.49-.984 2.748-2.474 2.796a15 15 0 0 1-.942 0c-1.49-.048-2.438-1.305-2.474-2.796C3.025 27.974 3 26.261 3 24s.026-3.974.055-5.197m41.89 0c-.036-1.49-.984-2.748-2.474-2.796a15 15 0 0 0-.942 0c-1.49.048-2.438 1.305-2.474 2.796C39.025 20.026 39 21.739 39 24s.026 3.974.055 5.197c.036 1.49.984 2.748 2.474 2.796a15 15 0 0 0 .942 0c1.49-.048 2.438-1.305 2.474-2.796c.03-1.223.055-2.936.055-5.197s-.026-3.974-.055-5.197"></Path>
      </G>
    </Svg>
  );

  const ProfileIcon = () => (
    <Svg width={35} height={35} viewBox="0 0 36 36">
      <Path
        fill={theme.text}
        stroke={theme.text}
        strokeWidth={1}
        d="M18 17a7 7 0 1 0-7-7a7 7 0 0 0 7 7m0-12a5 5 0 1 1-5 5a5 5 0 0 1 5-5"
      />
      <Path
        fill={theme.text}
        stroke={theme.text}
        strokeWidth={1}
        d="M30.47 24.37a17.16 17.16 0 0 0-24.93 0A2 2 0 0 0 5 25.74V31a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2v-5.26a2 2 0 0 0-.53-1.37M29 31H7v-5.27a15.17 15.17 0 0 1 22 0Z"
      />
    </Svg>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          left: 0,
          right: 0,
          height: 70,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          paddingHorizontal: 25,
          paddingVertical: 50,
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              width: "auto",
              bottom: 16,
              marginHorizontal: 18,
              paddingVertical: 5,
              backgroundColor: theme.tabsBack,
              opacity: 1,
              borderRadius: 18,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(ChatIcon, focused),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(ScannerIcon, focused),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(HomeIcon, focused),
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(TrainingIcon, focused),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(ProfileIcon, focused),
        }}
      />
    </Tabs>
  );
}
