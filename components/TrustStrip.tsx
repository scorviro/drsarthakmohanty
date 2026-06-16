"use client";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function TrustStrip() {
  const { t } = useLanguage();
  const credentials = [
    t("trust_strip.hcg"),
    t("trust_strip.ahrcc"),
    t("trust_strip.md"),
    t("trust_strip.exp"),
    t("trust_strip.aeroi"),
    t("trust_strip.treated")
  ];

  // Duplicate for seamless infinite scroll
  const scrollItems = [...credentials, ...credentials, ...credentials];

  return (
    <div className="w-full bg-slate-50 border-y border-slate-200 py-4 overflow-hidden relative flex items-center">
      {/* Left/Right fading gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

      <motion.div 
        initial={{ x: 0 }}
        animate={{ x: "-33.33%" }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {scrollItems.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-8 px-8">
            <span className="text-slate-600 font-medium tracking-wide text-sm uppercase">{item}</span>
            {idx !== scrollItems.length - 1 && (
              <span className="text-brand-teal/50">•</span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
