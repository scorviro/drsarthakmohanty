"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Activity, Target, Zap, CircleDot, ShieldPlus, Dna, BrainCircuit, HeartPulse, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface TiltCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  image?: string;
  onClick?: () => void;
}

const TiltCard = ({ title, desc, icon, image, onClick }: TiltCardProps) => {
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
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="relative h-full w-full rounded-2xl glass-panel-strong p-8 border border-slate-200 cursor-pointer overflow-hidden transition-all duration-300"
      whileHover={{ scale: 1.02 }}
    >
      {/* Background Image on Hover */}
      {image && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px]" />
        </motion.div>
      )}

      {/* Hover glow effect (only when no image) */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-brand-teal/20 to-brand-lavender/20 rounded-2xl opacity-0 pointer-events-none"
        animate={{ opacity: hovered && !image ? 1 : 0 }}
        style={{ transform: "translateZ(-1px)" }}
      />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div 
            style={{ transform: "translateZ(40px)" }} 
            className={`mb-6 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,191,165,0.2)] ${
              hovered && image 
                ? 'bg-slate-800/80 border border-brand-teal/60 text-brand-teal' 
                : 'bg-[#FAFAFA] border border-brand-teal/30 text-brand-teal'
            }`}
          >
            {icon}
          </div>
          
          <div style={{ transform: "translateZ(30px)" }}>
            <h3 className={`text-xl font-semibold mb-3 font-inter transition-colors duration-300 ${
              hovered && image ? 'text-white' : 'text-slate-900'
            }`}>
              {title}
            </h3>
            <p className={`text-sm leading-relaxed transition-colors duration-300 ${
              hovered && image ? 'text-slate-200' : 'text-slate-600'
            }`}>
              {desc}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TreatmentsGrid() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const treatments = [
    { title: "IMRT", desc: t("treatments.imrt_desc"), icon: <Activity />, image: "/therapypics/IMRT.jpeg" },
    { title: "IGRT", desc: t("treatments.igrt_desc"), icon: <Target />, image: "/therapypics/IGRT.jpeg" },
    { title: "VMAT", desc: t("treatments.vmat_desc"), icon: <Zap />, image: "/therapypics/VMAT.jpeg" },
    { title: "SBRT", desc: t("treatments.sbrt_desc"), icon: <CircleDot />, image: "/therapypics/SBRT.jpeg" },
    { title: "SRS", desc: t("treatments.srs_desc"), icon: <BrainCircuit />, image: "/therapypics/SRS.jpeg" },
    { title: "3D-CRT", desc: t("treatments.crt_desc"), icon: <Dna />, image: "/therapypics/3D-CRT.jpeg" },
    { title: t("treatments.brachy_title"), desc: t("treatments.brachy_desc"), icon: <ShieldPlus />, image: "/therapypics/Brachytherapy.jpeg" },
    { title: t("treatments.palliative_title"), desc: t("treatments.palliative_desc"), icon: <HeartPulse />, image: "/therapypics/Palliative Care.jpeg" },
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
              image={treatment.image}
              onClick={() => setSelectedImage(treatment.image)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-2 cursor-default"
            >
              <img 
                src={selectedImage} 
                alt="Treatment preview" 
                className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white flex items-center justify-center backdrop-blur-sm transition"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
