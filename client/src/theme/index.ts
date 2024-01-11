import {
  MantineColorsTuple,
  createTheme,
  DefaultMantineColor,
} from "@mantine/core";

type ExtendedCustomColors =
  | "primary"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}

const primary: MantineColorsTuple = [
  "#e5f4ff",
  "#cde2ff",
  "#9bc2ff",
  "#64a0ff",
  "#3984fe",
  "#1d72fe",
  "#0969ff",
  "#0058e4",
  "#004ecc",
  "#0043b5"
];

export const theme = createTheme({
  primaryColor: "primary",
  colors: {
    primary,
  }
})