"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Testimonials({ initialReviews = [] }: { initialReviews?: any[] }) {
  const { t } = useLanguage();
  const [dynamicReviews, setDynamicReviews] = useState<any[]>(initialReviews);
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultTestimonials = [
    {
      text: t("testimonials.t1_text"),
      author: t("testimonials.t1_author"),
      role: t("testimonials.t1_role"),
      location: t("testimonials.t1_location"),
      rating: 5
    },
    {
      text: t("testimonials.t2_text"),
      author: t("testimonials.t2_author"),
      role: t("testimonials.t2_role"),
      location: t("testimonials.t2_location"),
      rating: 5
    },
    {
      text: t("testimonials.t3_text"),
      author: t("testimonials.t3_author"),
      role: t("testimonials.t3_role"),
      location: t("testimonials.t3_location"),
      rating: 5
    }
  ];

  useEffect(() => {
    if (initialReviews.length === 0) {
      fetchFeaturedReviews();
    }
  }, [initialReviews]);

  const fetchFeaturedReviews = async () => {
    try {
      const res = await fetch("/api/reviews?limit=10");
      if (res.ok) {
        const data = await res.json();
        const pinned = (data.reviews || []).filter((r: any) => r.isPinned && r.status === "approved");
        setDynamicReviews(pinned);
      }
    } catch (err) {
      console.error("Error loading slider testimonials", err);
    }
  };

  // Combine dynamic and default reviews
  const testimonials: any[] = [];
  if (dynamicReviews.length > 0) {
    const mapped = dynamicReviews.map((r: any) => ({
      text: r.reviewText,
      author: r.name,
      role: r.treatmentType || t("testimonials.verified_patient"),
      location: t("testimonials.hcg_centre"),
      rating: r.rating,
      isDynamic: true
    }));
    if (mapped.length < 3) {
      testimonials.push(...mapped, ...defaultTestimonials.slice(0, 3 - mapped.length));
    } else {
      testimonials.push(...mapped);
    }
  } else {
    testimonials.push(...defaultTestimonials);
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  return (
    <section className="pt-4 pb-32 bg-white relative overflow-hidden" id="stories">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none transform-gpu" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 text-brand-gold uppercase tracking-widest text-xs font-bold mb-4">
            <span>{t("testimonials.heading")}</span>
          </div>
          <h2 className="display-font text-4xl md:text-5xl font-bold">
            {t("testimonials.sub_heading")} <span className="text-gradient-gold">{t("testimonials.sub_heading_gradient")}</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative glass-panel-strong rounded-3xl p-8 md:p-16 border border-slate-200 shadow-2xl bg-white/40">
            <Quote className="absolute top-8 left-8 text-slate-900/5 pointer-events-none select-none" size={120} />
            
            <div className="relative z-10 min-h-[220px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-center w-full px-4"
                >
                  {/* Pinned / Rating Header */}
                  <div className="flex justify-center items-center space-x-1 mb-6">
                    {Array.from({ length: testimonials[currentIndex].rating || 5 }).map((_, i) => (
                      <Star key={i} size={16} className="text-brand-gold fill-brand-gold" />
                    ))}
                  </div>

                  <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-playfair italic mb-8">
                    "{testimonials[currentIndex].text}"
                  </p>
                  
                  <div className="flex flex-col items-center">
                    <h4 className="text-slate-900 font-bold text-lg flex items-center space-x-1.5">
                      <span>{testimonials[currentIndex].author}</span>
                      {testimonials[currentIndex].isDynamic && (
                        <CheckCircle size={14} className="text-emerald-500 fill-white" />
                      )}
                    </h4>
                    <p className="text-brand-gold text-sm font-medium mt-1">
                      {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:-mx-6 pointer-events-none">
              <button 
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-slate-900 pointer-events-auto hover:bg-brand-gold hover:text-brand-navy hover:border-brand-gold transition-all bg-white/80"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={next}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-slate-900 pointer-events-auto hover:bg-brand-gold hover:text-brand-navy hover:border-brand-gold transition-all bg-white/80"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
          </div>
          
          {/* Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "bg-brand-gold w-8" : "bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
