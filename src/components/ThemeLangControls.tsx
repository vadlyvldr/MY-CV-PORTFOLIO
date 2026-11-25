"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Locale, ThemeMode } from "@/types/cv";

const LOCALE_KEY = "vadlycv_locale";
const THEME_KEY = "vadlycv_theme_v2";
const PREFS_EVENT = "vadlycv-prefs-updated";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PREFS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PREFS_EVENT, callback);
  };
}

function getLocaleSnapshot(): Locale {
  try {
    const val = localStorage.getItem(LOCALE_KEY);
    return val === "id" ? "id" : "en";
  } catch {
    return "en";
  }
}

function getThemeSnapshot(): ThemeMode {
  try {
    const val = localStorage.getItem(THEME_KEY);
    return val === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function usePreferences() {
  const locale = useSyncExternalStore(subscribe, getLocaleSnapshot, (): Locale => "en");
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, (): ThemeMode => "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setLocale = (next: Locale) => {
    try {
      localStorage.setItem(LOCALE_KEY, next);
      window.dispatchEvent(new Event(PREFS_EVENT));
    } catch {
      // Ignore storage failures
    }
  };

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
      window.dispatchEvent(new Event(PREFS_EVENT));
    } catch {
      // Ignore
    }
  };

  return { locale, setLocale, theme, toggleTheme };
}

interface ThemeLangControlsProps {
  locale: Locale;
  onChangeLocale: (next: Locale) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function ThemeLangControls({
  locale,
  onChangeLocale,
  theme,
  onToggleTheme,
}: ThemeLangControlsProps) {
  return (
    <div className="inline-flex items-center gap-2 shrink-0">
      <div
        role="group"
        aria-label="Language switch"
        className="inline-flex items-center h-9 p-0.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)]"
      >
        <button
          type="button"
          onClick={() => onChangeLocale("en")}
          className={`h-8 px-2.5 rounded-md text-xs font-semibold tracking-wide transition cursor-pointer ${
            locale === "en"
              ? "bg-[var(--accent)] text-[var(--accent-ink)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => onChangeLocale("id")}
          className={`h-8 px-2.5 rounded-md text-xs font-semibold tracking-wide transition cursor-pointer ${
            locale === "id"
              ? "bg-[var(--accent)] text-[var(--accent-ink)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          ID
        </button>
      </div>

      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition cursor-pointer"
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </div>
  );
}
