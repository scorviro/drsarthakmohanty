"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

export type Language = "en" | "hi" | "gu";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  const [customTranslations, setCustomTranslations] = useState<any>(null);

  useEffect(() => {
    // Read from localStorage on mount
    const saved = localStorage.getItem("preferred_language") as Language;
    if (saved && (saved === "en" || saved === "hi" || saved === "gu")) {
      setLanguageState(saved);
    }
    setMounted(true);

    // Fetch custom translations dynamically
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.translations) {
          setCustomTranslations(data.translations);
        }
      })
      .catch((err) => console.error("Failed to load custom translations:", err));
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_language", lang);
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split(".");
    
    // 1. Try to read from custom translations
    let current: any = customTranslations?.[language];
    let found = false;
    if (current) {
      found = true;
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          found = false;
          break;
        }
      }
    }

    // 2. Fall back to static translations
    if (!found || typeof current !== "string") {
      current = translations[language] || translations["en"];
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          // Fallback to English
          let fallback: any = translations["en"];
          for (const fk of keys) {
            if (fallback && typeof fallback === "object" && fk in fallback) {
              fallback = fallback[fk];
            } else {
              return key; // return key if not found
            }
          }
          current = fallback;
          break;
        }
      }
    }

    let text = typeof current === "string" ? current : key;

    // Apply replacements if provided (e.g. {year}, {name})
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), String(v));
      });
    }

    return text;
  };

  // Prevent flash of untranslated content by keeping default "en" during hydration
  // but once mounted, state updates.
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
