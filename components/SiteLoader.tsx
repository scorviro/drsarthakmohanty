"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SiteLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleLoad = () => {
      setIsLoading(false);
      document.body.style.overflow = "auto";
    };

    if (document.readyState === "complete") {
      // Short grace period for animations to initialize if already loaded
      const timer = setTimeout(handleLoad, 800);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", handleLoad, { once: true });
      // Hard cap at 2s in case resources stall
      const cap = setTimeout(handleLoad, 2000);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(cap);
        document.body.style.overflow = "auto";
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f8fbff] overflow-hidden"
        >
          {/* Subtle floating particles/glow in background */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDelay: "1s" }} />

          {/* Glowing gradient mesh behind the doctor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white rounded-full blur-[60px]" />

          {/* Video Container with soft glowing shadow */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center z-10"
          >
            {/* Soft glowing shadow under the doctor */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-brand-teal/20 blur-xl rounded-[100%]" />
            
            <video
              src="/doctor-dancing.webm"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-contain relative z-10"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.08))" }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 flex flex-col items-center z-10"
          >
            <div className="display-font text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center space-x-2">
              <span>Dr. Sarthak Mohanty</span>
            </div>
            <p className="text-xs md:text-sm text-brand-teal font-medium uppercase tracking-widest mt-3 animate-pulse flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-ping" />
              <span>Preparing premium care...</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
