"use client";
import { useRef, useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useInView } from "framer-motion";

export default function LocationMap() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "200px" });
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    if (isInView) {
      setLoadMap(true);
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-24 bg-[#FAFAFA] relative" id="location">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-0 rounded-[40px] overflow-hidden border border-slate-200 shadow-2xl glass-panel-strong">
          
          {/* Map Side */}
          <div className="relative h-[400px] lg:h-auto bg-slate-100 flex items-center justify-center">
            {loadMap ? (
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.5305106571556!2d70.7681328!3d22.2957813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959ca9a3e20e8b1%3A0xc00db088fc2a5789!2sHCG%20Hospital%20Rajkot!5e0!3m2!1sen!2sin!4v1716117235222!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(100%)" }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
                <span className="text-slate-400 text-sm font-medium">Loading Map...</span>
              </div>
            )}
          </div>

          {/* Contact Details Side */}
          <div className="p-10 md:p-16 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 to-transparent pointer-events-none" />
            
            <h3 className="display-font text-3xl font-bold text-slate-900 mb-8">
              {t("location.heading")} <span className="text-brand-teal">{t("location.heading_gradient")}</span>
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold mb-1">{t("location.address_label")}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {t("location.address_val")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold mb-1">{t("location.contact_label")}</h4>
                  <p className="text-slate-600 text-sm mb-1">{t("common.phone_val")}</p>
                  <p className="text-slate-600 text-sm">{t("location.emergency_val")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold mb-1">{t("location.timings_label")}</h4>
                  <p className="text-slate-600 text-sm">{t("location.timings_val")}</p>
                  <p className="text-slate-600 text-sm">{t("location.sunday_closed")}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-brand-teal text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-[#00a892] transition-colors w-full sm:w-auto text-center">
                {t("location.get_directions")}
              </button>
              <button className="glass-panel text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-medium hover:bg-slate-50/50 transition-colors w-full sm:w-auto text-center">
                {t("location.call_hospital")}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
