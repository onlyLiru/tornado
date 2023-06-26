import { atom } from "recoil";

type ThemeType = "light" | "dark";

export const themeState = atom<ThemeType>({
  key: "themeState",
  default: "light",
});
