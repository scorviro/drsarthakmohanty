"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Award, Briefcase, GraduationCap, Users } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const yVal = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate stats cards on scroll
    gsap.fromTo(
      ".stat-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      }
    );
  }, []);

  const stats = [
    { icon: <GraduationCap size={24} />, title: t("about.stat1_title"), subtitle: t("about.stat1_subtitle") },
    { icon: <Briefcase size={24} />, title: t("about.stat2_title"), subtitle: t("about.stat2_subtitle") },
    { icon: <Award size={24} />, title: t("about.stat3_title"), subtitle: t("about.stat3_subtitle") },
    { icon: <Users size={24} />, title: t("about.stat4_title"), subtitle: t("about.stat4_subtitle") },
  ];

  return (
    <section ref={sectionRef} id="about" className="relative pt-4 pb-32 bg-[#FAFAFA] overflow-hidden">
      {/* SVG Curved Stitched Transition (Top) */}
      <div className="absolute top-0 left-0 right-0 h-16 w-full pointer-events-none text-slate-50">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 48C480 48 960 0 1440 0V48H0Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image/Illustration Side */}
          <div className="relative" ref={containerRef}>
            <div className="absolute inset-0 bg-brand-teal/20 blur-[80px] rounded-full transform-gpu" />
            <div className="relative w-full h-[600px] glass-panel-strong rounded-3xl border border-slate-200 overflow-hidden shadow-2xl group">
              {/* Parallax doctor portrait image */}
              <motion.img
                src="/dr-sarthak.png"
                alt="Dr. Sarthak Kumar Mohanty"
                style={{ y: yVal }}
                className="absolute inset-0 w-full h-[115%] object-cover object-top filter contrast-[1.03] brightness-[1.01] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80 pointer-events-none" />
              
              {/* Floating element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-10 glass-panel px-6 py-4 rounded-2xl flex items-center space-x-4 border-l-2 border-brand-teal shadow-xl backdrop-blur-md bg-white/70"
              >
                <div className="text-3xl font-bold text-slate-900 display-font text-gradient-gold">15+</div>
                <div className="text-sm text-slate-600 leading-tight whitespace-pre-line">{t("about.years_dedication")}</div>
              </motion.div>
            </div>
          </div>

          {/* Content Side */}
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 text-brand-gold uppercase tracking-widest text-xs font-bold mb-6">
              <span>{t("about.meet_doctor")}</span>
            </div>
            
            <h2 className="display-font text-4xl md:text-5xl font-bold mb-8 leading-tight">
              {t("about.heading")} <span className="text-gradient-teal">{t("about.heading_gradient")}</span>
            </h2>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                {t("about.desc1")}
              </p>
              <p>
                {t("about.desc2")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              {stats.map((stat, idx) => (
                <div key={idx} className="stat-card glass-panel p-5 rounded-2xl hover:bg-slate-50/50 transition-colors border border-slate-200 flex flex-col justify-center">
                  <div className="text-brand-teal mb-3">{stat.icon}</div>
                  <h4 className="text-slate-900 font-semibold text-sm mb-1">{stat.title}</h4>
                  <p className="text-slate-600 text-xs">{stat.subtitle}</p>
                </div>
              ))}
            </div>

            <button className="mt-12 glass-panel text-brand-teal px-8 py-3 rounded-full font-medium hover:bg-brand-teal hover:text-slate-900 transition-all border border-brand-teal/50">
              {t("about.read_profile")}
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
