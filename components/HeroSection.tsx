"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, BadgeCheck, Clock, Hospital } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Image from "next/image";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    // Ultra-smooth, slow breathing floating animations for badges
    gsap.to(".floating-badge-1", { y: -20, duration: 4.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".floating-badge-2", { y: 20, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.5 });
    gsap.to(".floating-badge-3", { y: -15, x: 15, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[calc(100vh-96px)] flex items-center pt-0 overflow-hidden"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[#FAFAFA] z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-lavender/5 z-0" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-teal/10 rounded-full blur-[120px] pointer-events-none transform-gpu" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-lavender/10 rounded-full blur-[100px] pointer-events-none transform-gpu" />
      
      

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div style={{ y, opacity, willChange: "transform, opacity" }} className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >


            <h1 className="display-font text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
              {t("hero.trusted")} <br />
              <span className="text-gradient-teal">{t("hero.oncologist")}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="#book" 
                onClick={(e) => {
                  e.preventDefault();
                  if ((window as any).lenis) {
                    (window as any).lenis.scrollTo("#book");
                  } else {
                    const el = document.getElementById("book");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                  window.history.pushState(null, "", "#book");
                }}
                className="w-full sm:w-auto relative group overflow-hidden bg-brand-teal text-slate-900 px-8 py-4 rounded-full font-medium glow-teal transition-all flex items-center justify-center space-x-2"
              >
                <span className="relative z-10">{t("common.book_appointment")}</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal to-[#008f7b] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <a href="https://wa.me/91XXXXXXXXXX" className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-full font-medium glass-panel hover:bg-slate-50/50 transition-all text-slate-900 border border-slate-200">
                <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                <span className="text-slate-900 font-semibold">{t("common.whatsapp_us")}</span>
              </a>
            </div>
            
            {/* Quick Stats / Trust */}
            <div className="mt-12 flex items-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <BadgeCheck size={16} className="text-brand-gold" />
                <span>{t("hero.ahrcc")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hospital size={16} className="text-brand-teal" />
                <span>{t("hero.hcg")}</span>
              </div>
            </div>
          </motion.div>
          </motion.div>

          {/* Right Content - Illustration / Interactive area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[600px] w-full flex items-center justify-center"
          >
            {/* Doctor Portrait Image Frame */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-[400px] h-[500px] relative rounded-[60px] border border-slate-200/80 overflow-hidden shadow-2xl bg-slate-50 flex items-center justify-center group-hover:border-brand-teal/30 transition-colors duration-500">
                <Image 
                  src="/dr-sarthak.jpg" 
                  alt="Dr. Sarthak Kumar Mohanty - Radiation Oncologist" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  width={400}
                  height={500}
                  priority={true}
                />
                {/* Elegant overlay to blend slightly with the premium background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA]/10 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Floating Badges */}
            <div className="floating-badge-1 absolute top-1/4 -left-4 md:-left-12 glass-panel-strong px-5 py-3 rounded-2xl flex items-center space-x-3 z-20 shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-600">{t("hero.experience")}</p>
                <p className="font-bold text-slate-900">{t("hero.years")}</p>
              </div>
            </div>

            <div className="floating-badge-2 absolute bottom-1/4 -right-4 md:-right-8 glass-panel-strong px-5 py-3 rounded-2xl flex items-center space-x-3 z-20 shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                <BadgeCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-600">{t("hero.successfully_treated")}</p>
                <p className="font-bold text-slate-900">{t("hero.patients")}</p>
              </div>
            </div>

            <div className="floating-badge-3 absolute top-12 right-12 w-20 h-20 rounded-full border border-brand-teal/30 flex items-center justify-center z-0">
               <div className="w-16 h-16 rounded-full border border-brand-teal/10 animate-[spin_10s_linear_infinite]" />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
