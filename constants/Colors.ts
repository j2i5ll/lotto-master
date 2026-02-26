const tintColorLight = "#4A90D9";
const tintColorDark = "#6BB0F5";

export const LottoBallColors = {
  yellow: { bg: '#FFC107', text: '#1A1A1A' },
  blue: { bg: '#2196F3', text: '#FFFFFF' },
  red: { bg: '#F44336', text: '#FFFFFF' },
  gray: { bg: '#9E9E9E', text: '#FFFFFF' },
  green: { bg: '#4CAF50', text: '#FFFFFF' },
} as const;

export type LottoBallColorKey = keyof typeof LottoBallColors;

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    border: "#E6E8EB",
    card: "#F8F9FA",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    border: "#2E3234",
    card: "#1E2022",
  },
};
