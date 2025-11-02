// utils/theme.ts
export interface Theme {
  background: string;
  text: string;
  orange: string;
  red: string;
}

export const lightTheme: Theme = {
  background: "#FFFFFF",
  text: "#000000",
  orange: "#FF7E33",
  red: "#FF160A",
};

export const darkTheme: Theme = {
  background: "#181114",
  text: "#FFFFFF",
  orange: "#FF7E33",
  red: "#FF160A",
};
