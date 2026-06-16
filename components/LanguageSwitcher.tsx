"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage, Language } from "@/lib/LanguageContext";

const languages = [
  { code: "en" as Language, name: "English", native: "English", flag: "🇬🇧" },
  { code: "gu" as Language, name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "hi" as Language, name: "Hindi", native: "हिंदी", flag: "🇮🇳" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = languages.find((l) => l.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: typeof languages[0]) => {
    setIsOpen(false);
    
    // Smooth animated transition
    document.body.style.transition = "opacity 0.2s ease-in-out";
    document.body.style.opacity = "0";
    
    setTimeout(() => {
      setLanguage(lang.code);
      document.body.style.opacity = "1";
    }, 200);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm text-white hover:text-teal-100 transition-colors bg-white/10 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-md"
      >
        <Globe size={16} className="text-white" />
        <span className="font-medium">{activeLang.code.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 glass-panel-strong border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2 space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                    activeLang.code === lang.code
                      ? "bg-brand-teal/20 text-brand-teal font-medium"
                      : "text-slate-600 hover:bg-slate-50/50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span>{lang.flag}</span>
                    <span>{lang.native}</span>
                  </div>
                  {activeLang.code === lang.code && <Check size={14} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
