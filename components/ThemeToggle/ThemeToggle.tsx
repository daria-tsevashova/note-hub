"use client";

import { useEffect, useState } from "react";
import css from "./ThemeToggle.module.css";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "notehub-theme";

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;

    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const initialTheme: ThemeMode = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <li className={css.navigationItem}>
      <button
        type="button"
        className={css.toggleButton}
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        }
        title={
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        }
      >
        <span className={css.icon} aria-hidden="true">
          {mounted ? (theme === "dark" ? "☀" : "☾") : "☾"}
        </span>
      </button>
    </li>
  );
}
