"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useLanguage();

  const faqs = [
    {
      q: t("faq.q1"),
      a: t("faq.a1")
    },
    {
      q: t("faq.q2"),
      a: t("faq.a2")
    },
    {
      q: t("faq.q3"),
      a: t("faq.a3")
    },
    {
      q: t("faq.q4"),
      a: t("faq.a4")
    },
    {
      q: t("faq.q5"),
      a: t("faq.a5")
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section className="py-32 bg-white relative" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-brand-teal uppercase tracking-widest text-xs font-bold mb-4">
            <span>{t("faq.heading")}</span>
          </div>
          <h2 className="display-font text-4xl md:text-5xl font-bold mb-6">
            {t("faq.sub_heading")} <span className="text-gradient-teal">{t("faq.sub_heading_gradient")}</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`glass-panel border rounded-2xl overflow-hidden transition-colors duration-300 ${openIndex === idx ? 'border-brand-teal/50 bg-slate-50/50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <button 
                onClick={() => toggle(idx)}
                className="w-full px-6 py-6 flex items-center justify-between text-left"
              >
                <span className={`font-semibold text-lg transition-colors ${openIndex === idx ? 'text-brand-teal' : 'text-slate-900'}`}>
                  {faq.q}
                </span>
                <ChevronDown 
                  className={`text-brand-teal transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === idx ? 'rotate-180' : ''}`} 
                  size={20} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
