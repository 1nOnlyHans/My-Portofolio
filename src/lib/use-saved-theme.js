import { useEffect } from "react";

// the navbar owns the theme on the home page; standalone pages just apply the saved choice
export default function useSavedTheme() {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  }, []);
}
