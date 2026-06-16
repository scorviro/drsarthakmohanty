"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Send, MapPin, Phone, Mail, Instagram, Linkedin, Twitter, Facebook, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    botField: ""
  });
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.botField) {
      // Honeypot field triggered
      return;
    }
    setSubmitState("loading");
    setStatusMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          botField: form.botField
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitState("success");
        setStatusMsg(data.message || "Thank you! Your message has been sent successfully.");
        setStatusType("success");
        setForm({ name: "", email: "", message: "", botField: "" });
      } else {
        setSubmitState("error");
        setStatusMsg(data.error || "Something went wrong. Please try again.");
        setStatusType("error");
      }
    } catch (err) {
      setSubmitState("error");
      setStatusMsg("A connection error occurred. Please check your internet connection.");
      setStatusType("error");
    }
  };

  const contactInfo = [
    { icon: <MapPin size={24} />, title: t("contact.loc_title"), detail: t("location.address_val").replace("\n", ", ") },
    { icon: <Phone size={24} />, title: t("contact.phone_title"), detail: t("common.phone_val") },
    { icon: <Mail size={24} />, title: t("contact.email_title"), detail: t("common.email_val") },
  ];

  const socialLinks = [
    { icon: <Linkedin size={20} />, href: "https://in.linkedin.com/in/dr-sarthak-kumar-mohanty-0ab19119", label: "LinkedIn" },
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/sarthak1982?igsh=MWttNzQxbGppZzhwbA==", label: "Instagram" },
  ];

  return (
    <section ref={sectionRef} id="contact" className="pt-4 pb-32 bg-[#FAFAFA] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none transform-gpu translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none transform-gpu -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 text-brand-teal uppercase tracking-widest text-xs font-bold mb-4"
          >
            <span>{t("contact.heading")}</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="display-font text-4xl md:text-5xl font-bold mb-6"
          >
            {t("contact.sub_heading")} <span className="text-gradient-teal">{t("contact.sub_heading_gradient")}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-lg"
          >
            {t("contact.description")}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-start max-w-6xl mx-auto">
          
          {/* Contact Details Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-2 space-y-10"
          >
            <div className="space-y-8">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex items-start space-x-6 group">
                  <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,191,165,0.1)]">
                    {info.icon}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-slate-900 font-bold mb-1">{info.title}</h4>
                    <p className="text-slate-600 leading-relaxed max-w-xs">{info.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-200">
              <h4 className="text-slate-900 font-bold mb-4">{t("contact.connect_with_us")}</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, idx) => (
                  <a 
                    key={idx} 
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-brand-teal hover:border-brand-teal transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="glass-panel-strong p-8 md:p-12 rounded-[32px] border border-slate-200 shadow-2xl relative overflow-hidden">
              {/* Internal glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-[60px] pointer-events-none transform-gpu" />
              
              <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
                {/* Honeypot field for bot detection */}
                <input 
                  type="text" 
                  name="botField" 
                  value={form.botField} 
                  onChange={handleChange} 
                  className="hidden" 
                  tabIndex={-1} 
                  autoComplete="off" 
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 ml-1">{t("contact.label_name")}</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 ml-1">{t("contact.label_email")}</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900 ml-1">{t("contact.label_message")}</label>
                  <textarea 
                    rows={4}
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t("contact.placeholder_message")}
                    className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all text-slate-900 placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* Status messages */}
                {statusMsg && (
                  <div className={`p-4 rounded-2xl text-sm font-semibold border ${
                    statusType === "success" 
                      ? "bg-emerald-50 border-emerald-250 text-emerald-700" 
                      : "bg-rose-50 border-rose-250 text-rose-700"
                  }`}>
                    {statusMsg}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={submitState === "loading"}
                  className="w-full group relative overflow-hidden bg-brand-teal text-slate-900 px-8 py-4 rounded-2xl font-semibold hover:shadow-[0_0_20px_rgba(0,191,165,0.4)] transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    {submitState === "loading" ? (
                      <>
                        <span>Sending...</span>
                        <Loader2 size={18} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>{t("contact.btn_send")}</span>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-teal to-[#008f7b] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </form>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
