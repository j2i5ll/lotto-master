import { useColorScheme } from "react-native";
import { Colors } from "@constants/Colors";

export function useColors() {
  const colorScheme = useColorScheme() ?? "light";
  return Colors[colorScheme];
}
