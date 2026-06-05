"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Phone, CheckCircle2, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Morning (9:00 AM - 12:00 PM)");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, date, timeSlot }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message);
        setStep(3);
      } else {
        setError(data.error || "Failed to submit booking request.");
      }
    } catch (err) {
      setError("Network error. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setDate("");
    setTimeSlot("Morning (9:00 AM - 12:00 PM)");
    setError("");
    setStep(1);
  };

  return (
    <section className="py-32 bg-[#FAFAFA] relative" id="book">
      {/* Curved SVG Top */}
      <div className="absolute top-0 left-0 right-0 h-16 w-full pointer-events-none text-white">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full rotate-180">
          <path d="M0 48C480 48 960 0 1440 0V48H0Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Side */}
          <div className="max-w-xl">
            <h2 className="display-font text-4xl md:text-5xl font-bold mb-6">
              {t("booking.heading")} <span className="text-gradient-teal">{t("booking.heading_gradient")}</span>
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              {t("booking.description")}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-slate-50/50 border border-slate-200 flex items-center justify-center text-brand-teal">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t("booking.priority")}</h4>
                  <p className="text-sm text-slate-600">{t("booking.priority_desc")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t("booking.whatsapp_support")}</h4>
                  <p className="text-sm text-slate-600">{t("booking.whatsapp_desc")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="relative">
            <div className="absolute inset-0 bg-brand-teal/10 blur-[100px] rounded-[40px]" />
            <div className="relative glass-panel-strong rounded-[40px] p-8 md:p-10 border border-slate-200 shadow-2xl overflow-hidden">
              
              {/* Progress Bar */}
              <div className="flex mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 h-1.5 mx-1 rounded-full overflow-hidden bg-slate-100 relative">
                    {step >= i && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="absolute inset-0 bg-brand-teal"
                      />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    onSubmit={nextStep}
                    className="space-y-5"
                  >
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">{t("booking.patient_details")}</h3>
                    <div className="space-y-1">
                      <label className="text-sm text-slate-600 pl-4">{t("booking.patient_name")}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                          required 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-brand-teal transition-colors placeholder-gray-600" 
                          placeholder={t("booking.full_name")} 
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-slate-600 pl-4">{t("booking.phone_number")}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                          required 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-brand-teal transition-colors placeholder-gray-600" 
                          placeholder={t("common.phone_val")} 
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full mt-4 bg-brand-teal text-slate-900 py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(0,191,165,0.4)] transition-all">
                      {t("booking.continue")}
                    </button>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    onSubmit={handleBookingSubmit}
                    className="space-y-5"
                  >
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">{t("booking.preferred_time")}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm text-slate-600 pl-4">{t("booking.select_date")}</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                          <input 
                            required 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:outline-none focus:border-brand-teal transition-colors [color-scheme:dark]" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-slate-600 pl-4">Preferred Time Slot</label>
                        <select 
                          value={timeSlot} 
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4 px-4 text-slate-900 focus:outline-none focus:border-brand-teal transition-colors"
                        >
                          <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                          <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                          <option value="Evening (3:00 PM - 6:00 PM)">Evening (3:00 PM - 6:00 PM)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <button 
                        type="button" 
                        disabled={isLoading}
                        onClick={() => setStep(1)} 
                        className="w-full glass-panel text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-colors disabled:opacity-55"
                      >
                        {t("booking.back")}
                      </button>
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-brand-teal text-slate-900 py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(0,191,165,0.4)] transition-all flex items-center justify-center space-x-2 disabled:opacity-55"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>{t("booking.confirm")}</span>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-brand-teal/20 text-brand-teal rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t("booking.request_received")}</h3>
                    <p className="text-slate-600 mb-8 max-w-sm mx-auto leading-normal">
                      {successMessage || t("booking.request_received_desc")}
                    </p>
                    <button onClick={resetForm} className="glass-panel text-brand-teal border border-brand-teal/50 px-8 py-3 rounded-full font-medium hover:bg-brand-teal hover:text-slate-900 transition-all">
                      {t("booking.book_another")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
