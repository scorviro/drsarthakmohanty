"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Award, Briefcase, GraduationCap, Users, X, Check, Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDirection, setAnimDirection] = useState<"forward" | "backward" | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      if ((window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = "";
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [isModalOpen]);

  const handleNextPage = () => {
    if (isAnimating || spreadIndex >= 4) return;
    setAnimDirection("forward");
    setDirection(1);
    setIsAnimating(true);
    setTimeout(() => {
      setSpreadIndex(prev => prev + 1);
      setIsAnimating(false);
      setAnimDirection(null);
    }, 600);
  };

  const handlePrevPage = () => {
    if (isAnimating || spreadIndex <= 1) return;
    setAnimDirection("backward");
    setDirection(-1);
    setIsAnimating(true);
    setTimeout(() => {
      setSpreadIndex(prev => prev - 1);
      setIsAnimating(false);
      setAnimDirection(null);
    }, 600);
  };

  const getPageContent = (index: number, side: "left" | "right") => {
    if (index === 1) {
      if (side === "left") {
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full border-2 border-brand-teal overflow-hidden">
                <img src="/dr-sarthak-about.jpg" alt="Dr. Sarthak Kumar Mohanty - Radiation Oncologist, Rajkot" className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-xl">Dr. Sarthak Kumar Mohanty</h3>
                <p className="text-xs text-brand-teal font-semibold">MD Radiation Oncology</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif font-bold text-brand-teal text-sm border-b border-brand-teal/20 pb-1 uppercase tracking-wider">Professional Summary</h4>
              <p className="text-slate-700 text-sm leading-relaxed text-justify">
                Dr. Sarthak Kumar Mohanty is a highly accomplished Senior Radiation Oncologist with <strong>over 17 years of experience</strong> (2008–2025) in Radiation Oncology, including <strong>14+ years of post-MD clinical practice</strong>. He combines a robust academic foundation with advanced international training and a strong commitment to ethical, evidence-based cancer care.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif font-bold text-brand-teal text-sm border-b border-brand-teal/20 pb-1 uppercase tracking-wider">Personal Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                <div><strong>Hometown:</strong> Balasore, Odisha</div>
                <div><strong>Marital Status:</strong> Married</div>
                <div><strong>Contact:</strong> +91 82382 86706</div>
                <div><strong>Email:</strong> sarthak1982@gmail.com</div>
                <div className="col-span-2 mt-1"><strong>Address:</strong> Savan Saffron Apartment, Raiya Road, Rajkot</div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-slate-900 text-xl border-b border-[#E8E4D9] pb-2">Career Timeline</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Associate Director & Senior Consultant</h4>
                <p className="text-xs text-brand-teal font-semibold font-serif">Sterling Hospital, Rajkot, Gujarat</p>
                <p className="text-[10px] text-slate-400">February 2020 – Present (Designated Associate Director: August 2025)</p>
              </div>

              <div className="relative border-l border-slate-300 pl-4 ml-2 space-y-4 text-xs">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-teal" />
                  <strong>2013 – 2020: Consultant Radiation Oncologist</strong>
                  <p className="text-slate-600">Shrinathalal Parekh (NP) Cancer Hospital, Rajkot</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <strong>2011 – 2013: Certified Fellowship</strong>
                  <p className="text-slate-600">Tata Memorial Centre, Mumbai</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <strong>2008 – 2011: MD Radiotherapy Resident</strong>
                  <p className="text-slate-600">AHRCC, Cuttack, Odisha</p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    if (index === 2) {
      if (side === "left") {
        return (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-slate-900 text-xl border-b border-[#E8E4D9] pb-2">Education & Certifications</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="text-brand-teal mt-1"><GraduationCap size={18} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">MBBS & Internship</h4>
                  <p className="text-xs text-slate-600 font-serif">Maharaja Krushna Chandra Gajapati Medical College, Berhampur</p>
                  <p className="text-[10px] text-slate-400">May 2000 – December 2006</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-brand-teal mt-1"><GraduationCap size={18} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">MD Radiotherapy (Radiation Oncology)</h4>
                  <p className="text-xs text-slate-600 font-serif">Acharya Harihar Regional Cancer Institute (AHRCC), Cuttack</p>
                  <p className="text-[10px] text-slate-400">June 2008 – June 2011</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="text-brand-teal mt-1"><Award size={18} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Certified Fellowship — IMRT & IGRT</h4>
                  <p className="text-xs text-slate-600 font-serif">Tata Memorial Centre (TMC), Mumbai</p>
                  <p className="text-[10px] text-slate-400">August 2011 – July 2013 (2 years)</p>
                  <p className="text-xs text-slate-500 mt-1">Convocated with Scroll of Honour by the Hon'ble Health Minister of Maharashtra.</p>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-slate-900 text-xl border-b border-[#E8E4D9] pb-2">International Training</h3>
            
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-2xl border border-brand-teal/20 bg-brand-teal/[0.01] space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>UICC International Fellow</span>
                  <span className="text-[10px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded font-serif">USA</span>
                </h4>
                <p className="text-xs text-slate-700">Discipline: Head & Neck Cancers</p>
                <p className="text-xs text-slate-600">University of Michigan, Ann Arbor, USA (Mentor: Prof. Dr. Avraham Eisbruch). Awarded by Union for International Cancer Control.</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-brand-teal/20 bg-brand-teal/[0.01] space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>Proton Therapy Observership</span>
                  <span className="text-[10px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded font-serif">Austria</span>
                </h4>
                <p className="text-xs text-slate-700">MedAustron Hospital, Austria (October 2025)</p>
                <p className="text-xs text-slate-600">Clinical observership at one of the premier proton and carbon ion therapy facilities in Europe.</p>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-brand-teal/20 bg-brand-teal/[0.01] space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>IGRT & RPM Gating Certification</span>
                  <span className="text-[10px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded font-serif">Poland</span>
                </h4>
                <p className="text-xs text-slate-600">Maria Sklodowska-Curie Memorial Cancer Centre & Institute of Oncology, Gliwice, Poland.</p>
              </div>
            </div>
          </div>
        );
      }
    }

    if (index === 3) {
      if (side === "left") {
        return (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-slate-900 text-xl border-b border-[#E8E4D9] pb-2">Clinical Techniques</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-serif font-bold text-brand-teal text-xs uppercase tracking-wider mb-2">Radiotherapy Planning & Delivery</h4>
                <div className="flex flex-wrap gap-2">
                  {["SBRT / SRS / SRT", "IMRT (Intensity-Modulated)", "IGRT (Image-Guided)", "VMAT / RapidArc", "3D-CRT", "Proton Therapy Setup"].map(tech => (
                    <span key={tech} className="px-2.5 py-1 bg-slate-200/60 rounded text-[11px] font-semibold text-slate-800">{tech}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-brand-teal text-xs uppercase tracking-wider mb-2">Brachytherapy Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {["ICRT (Intracavitary)", "IVRT (Intravaginal)", "MUPIT Template", "Interstitial Brachytherapy", "Ultrasound-Guided Neck Nodal"].map(tech => (
                    <span key={tech} className="px-2.5 py-1 bg-brand-teal/10 rounded text-[11px] font-semibold text-brand-teal">{tech}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-brand-teal text-xs uppercase tracking-wider mb-2">Motion Management</h4>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  Real-time Position Management (RPM) Gating and deep inspiration breath-hold (DIBH) techniques for lung and left-sided breast cancer protection.
                </p>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-slate-900 text-xl border-b border-[#E8E4D9] pb-2">Research & Contributions</h3>
            
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed text-justify">
              <div className="bg-slate-50 p-3 rounded-xl border border-[#E8E4D9]">
                <strong>Cervical Cancer QoL Study (First Author):</strong>
                <p className="text-slate-600 mt-1">A comparative analysis of Quality of Life after postoperative IMRT or 3DCRT for cervical cancer, published in the <em>Indian Journal of Cancer</em>.</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-[#E8E4D9]">
                <strong>Temozolomide Toxicity Audit (Co-author):</strong>
                <p className="text-slate-600 mt-1">Factors predicting temozolomide-induced acute hematologic toxicity in high-grade gliomas, published in <em>Clinical Neurology and Neurosurgery</em>.</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-[#E8E4D9]">
                <strong>ESTRO Forum, Geneva (2013):</strong>
                <p className="text-slate-600 mt-1">Presented landmark prospective data on quality of life in women undergoing postoperative IG-IMRT.</p>
              </div>
            </div>
          </div>
        );
      }
    }

    if (index === 4) {
      if (side === "left") {
        return (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-slate-900 text-xl border-b border-[#E8E4D9] pb-2">Academic & Faculty Roles</h3>
            
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="border-l-2 border-brand-teal pl-3 py-1 bg-slate-50">
                <strong>Guest Speaker / Debater</strong> — YROC 2025 Madurai, AROI Odisha 2025 Puri, AROI Gujarat Chapter Daman
                <p className="text-slate-500 mt-1">Presented on topics like Bladder Preservation vs Cystectomy, CNS Tumour management, and extreme hypofractionation.</p>
              </div>

              <div className="border-l-2 border-brand-teal pl-3 py-1 bg-slate-50">
                <strong>Chairperson / Panelist</strong> — FHNO 2024 Mumbai, IBSCON 2024 Gurugram, Indian Cancer Congress Mumbai
                <p className="text-slate-500 mt-1">Chaired discussions on Laryngeal Cartilage Invasion and Interstitial Brachytherapy panels.</p>
              </div>

              <div className="border-l-2 border-brand-teal pl-3 py-1 bg-slate-50">
                <strong>Organizing Contributions</strong>
                <p className="text-slate-500 mt-0.5 font-serif">Organising Secretary for 3rd AROICON Gujarat Chapter (2018) in Rajkot and Co-organiser of 41st National AROICON (2019) in Ahmedabad.</p>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-slate-900 text-xl border-b border-[#E8E4D9] pb-2">Awards & Honors</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 text-xs">
                <div className="text-amber-500 font-bold shrink-0 mt-0.5">★</div>
                <div>
                  <strong>Fellowship of AROI (FAROI):</strong>
                  <p className="text-slate-600">Conferred by the Association of Radiation Oncologists of India (2024–2025) for exceptional clinical and academic contributions.</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="text-amber-500 font-bold shrink-0 mt-0.5">★</div>
                <div>
                  <strong>Scroll of Honour:</strong>
                  <p className="text-slate-600 font-serif">Awarded by the Health Minister of Maharashtra during convocation of IMRT/IGRT Fellowship at Tata Memorial Hospital.</p>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-brand-teal text-xs uppercase tracking-wider mb-2">Professional Memberships</h4>
                <div className="flex flex-wrap gap-1.5 font-serif">
                  {["AROI Life Member", "ICRO Life Member", "ISNO Life Member", "FHNO Member", "IAPC Certified"].map(m => (
                    <span key={m} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-700">{m}</span>
                  ))}
                </div>
              </div>

              <p className="text-slate-500 text-[10px] italic">Interests outside oncology: Painting, Badminton, Tennis.</p>
            </div>
          </div>
        );
      }
    }
    return null;
  };

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
    { icon: <Users size={24} />, title: t("about.stat3_title"), subtitle: t("about.stat3_subtitle") },
    { icon: <Award size={24} />, title: t("about.stat4_title"), subtitle: t("about.stat4_subtitle") },
    { icon: <Globe size={24} />, title: t("about.stat5_title"), subtitle: t("about.stat5_subtitle") },
    { icon: <Check size={24} />, title: t("about.stat6_title"), subtitle: t("about.stat6_subtitle") },
    { icon: <Award size={24} />, title: t("about.stat7_title"), subtitle: t("about.stat7_subtitle") },
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
                src="/dr-sarthak-about.jpg"
                alt="Dr. Sarthak Kumar Mohanty - Precision Radiotherapy Expert in Rajkot"
                style={{ y: yVal }}
                loading="lazy"
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
                <div 
                  key={idx} 
                  className={`stat-card glass-panel p-5 rounded-2xl hover:bg-slate-50/50 transition-colors border border-slate-200 flex flex-col justify-center ${
                    idx === 6 ? "col-span-2" : ""
                  }`}
                >
                  <div className="text-brand-teal mb-3">{stat.icon}</div>
                  <h4 className="text-slate-900 font-semibold text-sm mb-1">{stat.title}</h4>
                  <p className="text-slate-600 text-xs">{stat.subtitle}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => { setIsModalOpen(true); setSpreadIndex(0); }}
              className="mt-12 glass-panel text-brand-teal px-8 py-3 rounded-full font-medium hover:bg-brand-teal hover:text-slate-900 transition-all border border-brand-teal/50 active:scale-95 duration-200"
            >
              {t("about.read_profile")}
            </button>
          </div>
          
        </div>
      </div>

      {/* Clinical Profile CV Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-10"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-4xl h-[650px] max-h-[85vh] bg-[#FAF8F5] rounded-3xl overflow-hidden border-4 border-[#4E3629] shadow-2xl flex flex-col z-50"
              style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 z-50 w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer border border-slate-200"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Spine/crease down the middle (Desktop only) */}
              {spreadIndex > 0 && (
                <div className="hidden md:block absolute left-1/2 top-0 w-[10px] bg-gradient-to-r from-black/10 via-black/25 to-black/10 h-full z-20 pointer-events-none" style={{ transform: "translateX(-50%)" }} />
              )}

              <AnimatePresence initial={false} mode="wait" custom={direction}>
                {spreadIndex === 0 ? (
                  /* CLOSED BOOK COVER */
                  <motion.div
                    key="cover"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ transformOrigin: "left center", transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                    onClick={() => { setDirection(1); setSpreadIndex(1); }}
                    className="absolute inset-0 z-40 bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#0D1B2A] text-amber-400 p-8 flex flex-col items-center justify-center border-[12px] border-double border-amber-500/35 m-1 rounded-[20px] cursor-pointer hover:brightness-105 transition-all shadow-2xl overflow-hidden"
                  >
                    {/* Decorative gold frames */}
                    <div className="absolute inset-3 border border-amber-500/20 rounded-lg pointer-events-none" />
                    <div className="absolute inset-5 border border-dashed border-amber-500/10 rounded-lg pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md">
                      <Award size={56} className="text-amber-400/90 animate-pulse" />
                      
                      <div className="space-y-2">
                        <h2 className="display-font text-3xl font-bold tracking-widest text-white uppercase font-serif">
                          Dr. Sarthak Kumar Mohanty
                        </h2>
                        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
                        <p className="text-brand-teal text-xs font-semibold uppercase tracking-widest mt-1">
                          {t("about.profile_modal_subtitle")}
                        </p>
                      </div>

                      <div className="w-24 h-24 rounded-full border-4 border-amber-400/40 overflow-hidden shadow-xl">
                        <img 
                          src="/dr-sarthak-about.jpg" 
                          alt="Dr. Sarthak Kumar Mohanty - Senior Consultant Oncologist Rajkot"
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      <div className="space-y-4">
                        <p className="text-slate-300 text-xs italic">
                          "Trained in USA, Europe, & Tata Memorial Hospital Mumbai"
                        </p>
                        <div className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-amber-500/20">
                          Open Biography Book →
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* OPEN SPREADS */
                  <>
                    {/* Desktop Book Layout */}
                    <div className="hidden md:flex relative flex-row w-full h-[590px] overflow-hidden bg-[#FCFBF7] select-none" style={{ perspective: "1500px" }}>
                      {/* Static Left Page */}
                      <div className="w-1/2 p-6 md:p-10 flex flex-col justify-between h-full bg-[#FCFBF7] border-r border-[#E8E4D9] z-0">
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin" data-lenis-prevent>
                          {animDirection === "forward" 
                            ? getPageContent(spreadIndex, "left") 
                            : animDirection === "backward"
                            ? getPageContent(spreadIndex - 1, "left")
                            : getPageContent(spreadIndex, "left")}
                        </div>
                        <div className="text-[10px] text-slate-400 font-serif text-left pt-2 shrink-0 border-t border-[#F0ECE3] mt-2">
                          Page {animDirection === "forward" ? spreadIndex * 2 - 1 : animDirection === "backward" ? (spreadIndex - 1) * 2 - 1 : spreadIndex * 2 - 1}
                        </div>
                      </div>

                      {/* Static Right Page */}
                      <div className="w-1/2 p-6 md:p-10 flex flex-col justify-between h-full bg-[#FCFBF7] z-0">
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin" data-lenis-prevent>
                          {animDirection === "forward" 
                            ? getPageContent(spreadIndex + 1, "right") 
                            : animDirection === "backward"
                            ? getPageContent(spreadIndex, "right")
                            : getPageContent(spreadIndex, "right")}
                        </div>
                        <div className="text-[10px] text-slate-400 font-serif text-right pt-2 shrink-0 border-t border-[#F0ECE3] mt-2">
                          Page {animDirection === "forward" ? (spreadIndex + 1) * 2 : animDirection === "backward" ? spreadIndex * 2 : spreadIndex * 2}
                        </div>
                      </div>

                      {/* Turning Page Animation Overlay */}
                      <AnimatePresence>
                        {isAnimating && animDirection === "forward" && (
                          <motion.div
                            key={`flip-forward-${spreadIndex}`}
                            initial={{ rotateY: 0 }}
                            animate={{ rotateY: -180 }}
                            exit={{ rotateY: -180 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{ 
                              transformOrigin: "left center", 
                              transformStyle: "preserve-3d",
                              backfaceVisibility: "hidden" 
                            }}
                            className="absolute left-1/2 top-0 w-1/2 h-full bg-[#FCFBF7] shadow-2xl z-30"
                          >
                            {/* Front side of flipping sheet (visible from 0 to -90 degrees) */}
                            <div 
                              className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between h-full bg-[#FCFBF7] border-l border-[#E8E4D9]"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <div className="flex-1 overflow-y-auto" data-lenis-prevent>
                                {getPageContent(spreadIndex, "right")}
                              </div>
                              <div className="text-[10px] text-slate-400 font-serif text-right pt-2 shrink-0 border-t border-[#F0ECE3] mt-2">
                                Page {spreadIndex * 2}
                              </div>
                            </div>

                            {/* Back side of flipping sheet (visible from -90 to -180 degrees) */}
                            <div 
                              className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between h-full bg-[#FCFBF7] border-r border-[#E8E4D9]"
                              style={{ 
                                transform: "rotateY(180deg)", 
                                backfaceVisibility: "hidden" 
                              }}
                            >
                              <div className="flex-1 overflow-y-auto" data-lenis-prevent>
                                {getPageContent(spreadIndex + 1, "left")}
                              </div>
                              <div className="text-[10px] text-slate-400 font-serif text-left pt-2 shrink-0 border-t border-[#F0ECE3] mt-2">
                                Page {(spreadIndex + 1) * 2 - 1}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {isAnimating && animDirection === "backward" && (
                          <motion.div
                            key={`flip-backward-${spreadIndex}`}
                            initial={{ rotateY: 0 }}
                            animate={{ rotateY: 180 }}
                            exit={{ rotateY: 180 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{ 
                              transformOrigin: "right center", 
                              transformStyle: "preserve-3d",
                              backfaceVisibility: "hidden" 
                            }}
                            className="absolute left-0 top-0 w-1/2 h-full bg-[#FCFBF7] shadow-2xl z-30"
                          >
                            {/* Front side of flipping sheet (visible from 0 to 90 degrees) */}
                            <div 
                              className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between h-full bg-[#FCFBF7] border-r border-[#E8E4D9]"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <div className="flex-1 overflow-y-auto" data-lenis-prevent>
                                {getPageContent(spreadIndex, "left")}
                              </div>
                              <div className="text-[10px] text-slate-400 font-serif text-left pt-2 shrink-0 border-t border-[#F0ECE3] mt-2">
                                Page {spreadIndex * 2 - 1}
                              </div>
                            </div>

                            {/* Back side of flipping sheet (visible from 90 to 180 degrees) */}
                            <div 
                              className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between h-full bg-[#FCFBF7] border-l border-[#E8E4D9]"
                              style={{ 
                                transform: "rotateY(-180deg)", 
                                backfaceVisibility: "hidden" 
                              }}
                            >
                              <div className="flex-1 overflow-y-auto" data-lenis-prevent>
                                {getPageContent(spreadIndex - 1, "right")}
                              </div>
                              <div className="text-[10px] text-slate-400 font-serif text-right pt-2 shrink-0 border-t border-[#F0ECE3] mt-2">
                                Page {(spreadIndex - 1) * 2}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Mobile Book Layout (Vertical Scrollable Spreads) */}
                    <div className="md:hidden flex flex-col w-full h-[590px] overflow-y-auto bg-[#FCFBF7] p-6 space-y-8 select-none" data-lenis-prevent>
                      <div className="space-y-6 pb-6 border-b border-[#E8E4D9]">
                        <div className="text-[9px] bg-brand-teal/10 text-brand-teal font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded w-max">
                          Page {spreadIndex * 2 - 1}
                        </div>
                        {getPageContent(spreadIndex, "left")}
                      </div>
                      <div className="space-y-6 pb-8">
                        <div className="text-[9px] bg-brand-teal/10 text-brand-teal font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded w-max">
                          Page {spreadIndex * 2}
                        </div>
                        {getPageContent(spreadIndex, "right")}
                      </div>
                    </div>
                  </>
                )}
              </AnimatePresence>

              {/* Bottom Book Navigation */}
              {spreadIndex > 0 && (
                <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-[#FCFBF7] border-t border-[#E8E4D9] pointer-events-auto">
                  <button 
                    disabled={spreadIndex === 1 || isAnimating}
                    onClick={handlePrevPage}
                    className="flex items-center text-xs font-bold text-brand-teal disabled:text-slate-300 hover:text-slate-900 transition-colors disabled:pointer-events-none cursor-pointer"
                  >
                    ← Previous Page
                  </button>
                  <div className="text-xs font-serif text-slate-500">
                    Spread {spreadIndex} of 4
                  </div>
                  <button 
                    disabled={spreadIndex === 4 || isAnimating}
                    onClick={handleNextPage}
                    className="flex items-center text-xs font-bold text-brand-teal disabled:text-slate-300 hover:text-slate-900 transition-colors disabled:pointer-events-none cursor-pointer"
                  >
                    Next Page →
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
