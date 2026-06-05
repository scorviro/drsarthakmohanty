"use client";
import { Mail, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Navbar from "./Navbar";
import LocationMap from "./LocationMap";
import Footer from "./Footer";

export default function ContactPageContent() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#FAFAFA] selection:bg-brand-teal/30 selection:text-slate-900">
      <Navbar />
      
      {/* Contact Header */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-brand-teal uppercase tracking-widest text-xs font-bold mb-6">
            <span>{t("contact.heading")}</span>
          </div>
          <h1 className="display-font text-5xl md:text-6xl font-bold mb-6 text-slate-900">
            {t("contact.support_heading")} <span className="text-gradient-teal">{t("contact.support_heading_gradient")}</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t("contact.support_description")}
          </p>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            <a href={`tel:${t("common.phone_val").replace(/\s+/g, '')}`} className="glass-panel-strong p-8 rounded-3xl border border-slate-200 text-center hover:shadow-lg transition-all group">
              <div className="w-16 h-16 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Phone size={28} />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">{t("contact.card_call_us")}</h3>
              <p className="text-slate-600 mb-4 text-sm">{t("contact.card_call_us_desc")}</p>
              <span className="text-brand-teal font-medium flex items-center justify-center space-x-1">
                <span>{t("common.phone_val")}</span>
                <ArrowRight size={16} />
              </span>
            </a>

            <a href={`https://wa.me/${t("common.phone_val").replace(/[^\d]/g, '')}`} className="glass-panel-strong p-8 rounded-3xl border border-slate-200 text-center hover:shadow-lg transition-all group">
              <div className="w-16 h-16 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">{t("contact.card_whatsapp")}</h3>
              <p className="text-slate-600 mb-4 text-sm">{t("contact.card_whatsapp_desc")}</p>
              <span className="text-[#25D366] font-medium flex items-center justify-center space-x-1">
                <span>{t("contact.card_whatsapp_btn")}</span>
                <ArrowRight size={16} />
              </span>
            </a>

            <a href={`mailto:${t("common.email_val")}`} className="glass-panel-strong p-8 rounded-3xl border border-slate-200 text-center hover:shadow-lg transition-all group">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">{t("contact.card_email")}</h3>
              <p className="text-slate-600 mb-4 text-sm">{t("contact.card_email_desc")}</p>
              <span className="text-brand-teal font-medium flex items-center justify-center space-x-1">
                <span>{t("contact.card_email_btn")}</span>
                <ArrowRight size={16} />
              </span>
            </a>

          </div>
        </div>
      </section>

      {/* Reusing Location Map */}
      <LocationMap />
      
      <Footer />
    </main>
  );
}
