"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function CancerTypes() {
  const { t } = useLanguage();

  const cancers = [
    { 
      name: t("cancer_types.head_neck"), 
      types: t("cancer_types.head_neck_types"), 
      image: "/therapypics/Headandneck.jpeg",
      link: "https://en.wikipedia.org/wiki/Head_and_neck_cancer"
    },
    { 
      name: t("cancer_types.breast"), 
      types: t("cancer_types.breast_types"), 
      image: "/therapypics/breast.jpeg",
      link: "https://en.wikipedia.org/wiki/Breast_cancer"
    },
    { 
      name: t("cancer_types.brain_spine"), 
      types: t("cancer_types.brain_spine_types"), 
      image: "/therapypics/brain.jpg",
      link: "https://en.wikipedia.org/wiki/Brain_tumor"
    },
    { 
      name: t("cancer_types.genitourinary"), 
      types: t("cancer_types.genitourinary_types"), 
      image: "/therapypics/prostate.jpeg",
      link: "https://en.wikipedia.org/wiki/Clinical_Genitourinary_Cancer"
    },
    { 
      name: t("cancer_types.thoracic"), 
      types: t("cancer_types.thoracic_types"), 
      image: "/therapypics/thoracic.jpeg",
      link: "https://en.wikipedia.org/wiki/Lung_cancer"
    },
    { 
      name: t("cancer_types.gynecological"), 
      types: t("cancer_types.gynecological_types"), 
      image: "/therapypics/gynaecologival.jpeg",
      link: "https://en.wikipedia.org/wiki/Cervical_cancer"
    },
  ];

  return (
    <section className="pt-4 pb-32 bg-[#FAFAFA] relative" id="cancer-types">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-brand-teal uppercase tracking-widest text-xs font-bold mb-4">
              <span>{t("cancer_types.heading")}</span>
            </div>
            <h2 className="display-font text-4xl md:text-5xl font-bold">
              {t("cancer_types.sub_heading")} <span className="text-gradient-teal">{t("cancer_types.sub_heading_gradient")}</span> {t("cancer_types.focus")}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cancers.map((cancer, idx) => (
            <a 
              key={idx}
              href={cancer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ ease: "easeOut", duration: 0.3 }}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer transform-gpu"
                style={{ willChange: "transform" }}
              >
                {/* Background Image with Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cancer.image})`, filter: "none" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-brand-navy/80 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />

                {/* Teal Glow Overlay on Hover */}
                <div className="absolute inset-0 bg-brand-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight size={18} className="text-brand-teal" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 display-font">{cancer.name}</h3>
                  <p className="text-slate-600 text-sm font-medium">{cancer.types}</p>
                </div>
              </motion.div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
