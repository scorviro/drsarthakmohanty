"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Activity, Target, Zap, CircleDot, ShieldPlus, Dna, BrainCircuit, HeartPulse } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface TiltCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const TiltCard = ({ title, desc, icon }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="relative h-full w-full rounded-2xl glass-panel-strong p-8 border border-slate-200 cursor-pointer transition-all duration-300"
      whileHover={{ scale: 1.02 }}
    >
      {/* Hover glow effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-brand-teal/20 to-brand-lavender/20 rounded-2xl opacity-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        style={{ transform: "translateZ(-1px)" }}
      />
      
      <div style={{ transform: "translateZ(40px)" }} className="mb-6 w-14 h-14 bg-[#FAFAFA] border border-brand-teal/30 rounded-xl flex items-center justify-center text-brand-teal shadow-[0_0_15px_rgba(0,191,165,0.2)]">
        {icon}
      </div>
      
      <div style={{ transform: "translateZ(30px)" }}>
        <h3 className="text-xl font-semibold text-slate-900 mb-3 font-inter">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

export default function TreatmentsGrid() {
  const { t } = useLanguage();
  const treatments = [
    { title: "IMRT", desc: t("treatments.imrt_desc"), icon: <Activity /> },
    { title: "IGRT", desc: t("treatments.igrt_desc"), icon: <Target /> },
    { title: "VMAT", desc: t("treatments.vmat_desc"), icon: <Zap /> },
    { title: "SBRT", desc: t("treatments.sbrt_desc"), icon: <CircleDot /> },
    { title: "SRS", desc: t("treatments.srs_desc"), icon: <BrainCircuit /> },
    { title: "3D-CRT", desc: t("treatments.crt_desc"), icon: <Dna /> },
    { title: t("treatments.brachy_title"), desc: t("treatments.brachy_desc"), icon: <ShieldPlus /> },
    { title: t("treatments.palliative_title"), desc: t("treatments.palliative_desc"), icon: <HeartPulse /> },
  ];

  return (
    <section id="treatments" className="pt-4 pb-32 bg-white relative perspective-1000">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 text-brand-teal uppercase tracking-widest text-xs font-bold mb-4">
            <span>{t("treatments.heading")}</span>
          </div>
          <h2 className="display-font text-4xl md:text-5xl font-bold mb-6">
            {t("treatments.sub_heading")} <span className="text-gradient-teal">{t("treatments.sub_heading_gradient")}</span>
          </h2>
          <p className="text-slate-600 text-lg">
            {t("treatments.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
          {treatments.map((treatment, idx) => (
            <TiltCard 
              key={idx}
              title={treatment.title}
              desc={treatment.desc}
              icon={treatment.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
