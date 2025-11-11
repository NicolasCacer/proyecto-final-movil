// utils/theme.ts
export interface Theme {
  background: string;
  text: string;
  orange: string;
  red: string;
  tabBar: string;
  tabsBack: string;
  black: string;
  white: string;
}

export const lightTheme: Theme = {
  background: "#FFFFFF",
  text: "#000000",
  orange: "#FF7E33",
  red: "#FF160A",
  tabBar: "rgba(0,0,0,0.30)",
  tabsBack: "#b8b8b8ff",
  black: "#000000",
  white: "#FFFFFF",
};

export const darkTheme: Theme = {
  background: "#181114",
  text: "#FFFFFF",
  orange: "#FF7E33",
  red: "#FF160A",
  tabBar: "rgba(255,255,255,0.35)",
  tabsBack: "#2c2528",
  black: "#000000",
  white: "#FFFFFF",
};
