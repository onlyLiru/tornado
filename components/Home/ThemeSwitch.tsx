"use client";

import { Button, Grid, Space, Image, List, Avatar } from "antd-mobile";
import MoonDark from "@/public/moon-dark@2x.png";
import MoonLight from "@/public/moon-light@2x.png";

import { useRecoilState } from "recoil";
import { themeState } from "@/recoil/theme";

export default function ThemeSwitch() {
  const [theme, setTheme] = useRecoilState(themeState);

  const handleSwitch = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Avatar
      src={theme === "light" ? MoonLight.src : MoonDark.src}
      fit="contain"
      style={{ "--size": "3rem" }}
      onClick={handleSwitch}
      fallback={null}
    />
  );
}
