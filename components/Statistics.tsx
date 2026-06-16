"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Star, X, HeartPulse, Plus, Shield, LogOut, CheckCircle2, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import AdminPanel from "./AdminPanel";
import Toast, { ToastType } from "./Toast";
import { useLanguage } from "@/lib/LanguageContext";

// Counter Component
function Counter({ target, suffix, title }: { target: number, suffix: string, title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = eased * target;

      if (target % 1 === 0) {
        setCount(Math.ceil(currentVal));
      } else {
        setCount(Number(currentVal.toFixed(1)));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <div ref={ref} className="glass-panel-strong p-8 rounded-3xl border border-slate-200 text-center shadow-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <h3 className="display-font text-5xl md:text-6xl font-bold text-slate-900 mb-2">
        {count}{suffix}
      </h3>
      <p className="text-brand-teal font-medium uppercase tracking-widest text-sm">{title}</p>
    </div>
  );
}

// Star Rating Component
const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < Math.floor(rating)
              ? "text-brand-gold fill-brand-gold"
              : "text-slate-200"
          } transition-all duration-300`}
        />
      ))}
    </div>
  );
};

// Interactive Star Rating for review forms
const InteractiveStars = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: 5 }).map((_, i) => {
        const ratingValue = i + 1;
        return (
          <button
            type="button"
            key={i}
            onClick={() => onChange(ratingValue)}
            onMouseEnter={() => setHoverValue(ratingValue)}
            onMouseLeave={() => setHoverValue(null)}
            className="focus:outline-none transition-transform hover:scale-125 duration-200"
            aria-label={`Rate ${ratingValue} stars`}
          >
            <Star
              size={32}
              className={`${
                ratingValue <= (hoverValue || value)
                  ? "text-brand-gold fill-brand-gold"
                  : "text-slate-200"
              } transition-colors duration-200`}
            />
          </button>
        );
      })}
    </div>
  );
};

// Confetti Effect component for success submissions
const Confetti = () => {
  const colors = ["#00BFA5", "#D4A843", "#8B9FF4", "#10B981", "#3B82F6"];
  
  // Stable, server-safe generation using a simple mathematical sequence (no Math.random on render)
  const items = Array.from({ length: 24 }, (_, i) => {
    const size = ((i * 7) % 8) + 6; // pseudo-random stable size
    const delay = ((i * 3) % 10) * 0.05; // pseudo-random stable delay
    const x = ((i * 17) % 100); // pseudo-random stable X position
    const color = colors[i % colors.length];
    return { id: i, size, delay, x, color };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[60]">
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      {items.map(item => (
        <div
          key={item.id}
          className="absolute rounded-full animate-confetti"
          style={{
            left: `${item.x}%`,
            top: "-20px",
            width: item.size,
            height: item.size,
            backgroundColor: item.color,
            animationDelay: `${item.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Skeleton Review Card Loader
const SkeletonReview = () => (
  <div className="glass-panel p-8 rounded-3xl border border-slate-100 flex flex-col justify-between min-h-[220px] animate-pulse">
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="w-24 h-4 bg-slate-200 rounded-md" />
            <div className="w-16 h-3 bg-slate-100 rounded-md" />
          </div>
        </div>
        <div className="w-12 h-3 bg-slate-100 rounded-md" />
      </div>
      <div className="flex space-x-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 bg-slate-200 rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-100 rounded-md" />
        <div className="w-5/6 h-3 bg-slate-100 rounded-md" />
      </div>
    </div>
  </div>
);

export default function Statistics({ 
  initialReviews = [], 
  initialTotalReviews = 0 
}: { 
  initialReviews?: any[], 
  initialTotalReviews?: number 
}) {
  const { t } = useLanguage();

  // Auth & Session States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [detectedNgrokUrl, setDetectedNgrokUrl] = useState("");

  // Review list states
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [loading, setLoading] = useState(initialReviews.length === 0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialTotalReviews / 6) || 1);
  
  // Modals & Form states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [treatmentType, setTreatmentType] = useState("");
  const [botField, setBotField] = useState(""); // Honeypot field
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const treatmentsList = [
    "SBRT Treatment",
    "SRS Radiosurgery",
    "IMRT Radiation",
    "VMAT Therapy",
    "IGRT Guidance",
    "Brachytherapy",
    "Palliative Oncology",
    "Other Consultation"
  ];

  // 1. Fetch Auth Session / URL Redirect OAuth Callback on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname === "127.0.0.1") {
      window.location.href = window.location.href.replace("127.0.0.1", "localhost");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const googleCredential = urlParams.get("google_credential");
    
    if (googleCredential) {
      handleRedirectLogin(googleCredential);
    } else {
      checkSession();
    }
  }, []);

  const handleRedirectLogin = async (credential: string) => {
    // Clear query parameter immediately so refresh doesn't trigger it again
    const url = new URL(window.location.href);
    url.searchParams.delete("google_credential");
    window.history.replaceState({}, document.title, url.toString());

    showToast(t("statistics.toast_processing"), "info");
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      if (res.ok) {
        const data = await res.json();
        handleLoginSuccess(data.user);
      } else {
        const err = await res.json();
        showToast(err.error || t("statistics.toast_auth_failed"), "error");
        checkSession();
      }
    } catch {
      showToast(t("statistics.toast_network_error"), "error");
      checkSession();
    }
  };

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data.detectedNgrokUrl) {
          setDetectedNgrokUrl(data.detectedNgrokUrl);
        }
        if (data.authenticated) {
          setIsAuthenticated(true);
          setCurrentUser(data.user);
        }
      }
    } catch (err) {
      console.error("Session verification failed", err);
    }
  };

  useEffect(() => {
    const isAnyModalOpen = isFormModalOpen || isAuthModalOpen || isAdminPanelOpen;
    if (isAnyModalOpen) {
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
  }, [isFormModalOpen, isAuthModalOpen, isAdminPanelOpen]);

  const isFirstRender = useRef(true);

  // 2. Fetch reviews when page change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialReviews.length > 0) {
        return;
      }
    }
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?page=${page}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error loading reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/session", { method: "DELETE" });
      if (res.ok) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        showToast(t("statistics.toast_signout_success"), "info");
        fetchReviews(); // reload to reflect admin changes if they were admin
      }
    } catch (err) {
      showToast(t("statistics.toast_signout_failed"), "error");
    }
  };

  const handleOpenReviewClick = () => {
    if (isAuthenticated && currentUser) {
      // Prefill previous review if they already submitted
      const existingReview = reviews.find((r) => r.userId === currentUser.userId);
      if (existingReview) {
        setRating(existingReview.rating);
        setTitle(existingReview.title);
        setComment(existingReview.reviewText);
        setTreatmentType(existingReview.treatmentType || "");
        setReviewerName(currentUser.name || "");
        showToast(t("statistics.toast_edit_review"), "info");
      }
    }
    setIsFormModalOpen(true);
  };

  const handleLoginSuccess = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(t("statistics.toast_welcome").replace("{name}", user.name), "success");
    
    // Automatically open the review form smoothly after login
    setTimeout(() => {
      // Prefill if exists
      const existingReview = reviews.find((r) => r.userId === user.userId);
      if (existingReview) {
        setRating(existingReview.rating);
        setTitle(existingReview.title);
        setComment(existingReview.reviewText);
        setTreatmentType(existingReview.treatmentType || "");
        setReviewerName(user.name || "");
      }
      setIsFormModalOpen(true);
    }, 400);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      showToast(t("statistics.toast_fill_required"), "error");
      return;
    }

    if (!isAuthenticated && (!reviewerName || !reviewerName.trim())) {
      showToast("Please enter your name.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewerName.trim(),
          rating,
          title: title.trim(),
          reviewText: comment.trim(),
          treatmentType,
          botField,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Confetti!
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2200);

        showToast(data.message || t("statistics.toast_submit_success"), data.moderated ? "info" : "success");
        setIsFormModalOpen(false);
        
        // Reset form
        setReviewerName("");
        setTitle("");
        setComment("");
        setTreatmentType("");
        
        fetchReviews(); // Reload dynamic feed
      } else {
        showToast(data.error || t("statistics.toast_submit_failed"), "error");
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = "4.9"; // Keep premium standard brand rating on trust strip, but dynamic reviews below

  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden" id="patient-ratings">
      {/* Background ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-brand-teal/5 rounded-[100%] blur-[120px] pointer-events-none transform-gpu" />
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-[100] pointer-events-none flex flex-col space-y-3">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Auth / Admin Toolbar */}
        <div className="flex justify-end items-center mb-8 space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-7 h-7 rounded-full border border-slate-100 shadow-sm"
                width={28}
                height={28}
              />
              <span className="text-xs font-semibold text-slate-800">{currentUser?.name}</span>
              
              {currentUser?.isAdmin && (
                <button
                  onClick={() => setIsAdminPanelOpen(true)}
                  className="bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 transition-colors"
                >
                  <Shield size={10} />
                  <span>Moderate</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs text-slate-500 hover:text-brand-teal font-semibold flex items-center space-x-1 bg-white border border-slate-200 hover:border-brand-teal rounded-full px-4 py-2 shadow-sm transition-all"
            >
              <Lock size={11} />
              <span>{t("statistics.patient_sign_in")}</span>
            </button>
          )}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <Counter target={9000} suffix="+" title={t("statistics.patients_treated")} />
          <Counter target={15} suffix="+" title={t("statistics.years_experience")} />
          <Counter target={12} suffix="+" title={t("statistics.cancer_types")} />
          <Counter target={4.9} suffix="★" title={t("statistics.patient_rating")} />
        </div>

        {/* Dynamic Reviews System */}
        <div className="pt-16 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-brand-teal uppercase tracking-widest text-xs font-bold mb-4">
                <span>{t("statistics.testimonials")}</span>
              </div>
              <h2 className="display-font text-4xl md:text-5xl font-bold mb-4">
                {t("statistics.what_patients_say")} <span className="text-gradient-teal">{t("statistics.patients_say_gradient")}</span>
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-4xl font-extrabold text-slate-900">{avgRating}</span>
                <div className="flex flex-col">
                  <StarRating rating={Number(avgRating)} size={20} />
                  <span className="text-xs text-slate-500 mt-1">{t("statistics.based_on_ratings")}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleOpenReviewClick}
              className="group relative overflow-hidden bg-brand-teal text-slate-900 px-8 py-4 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(0,191,165,0.4)] transition-all flex items-center justify-center space-x-2 self-start md:self-end"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>{isAuthenticated ? t("statistics.share_experience") : t("statistics.write_review")}</span>
            </button>
          </div>

          {/* Grid of Reviews */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonReview />
              <SkeletonReview />
              <SkeletonReview />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-[32px] shadow-sm max-w-lg mx-auto">
              <p className="text-slate-400 text-sm font-semibold mb-2">{t("statistics.no_verified_reviews")}</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">{t("statistics.be_first")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <motion.div 
                  key={review.reviewId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="glass-panel p-8 rounded-3xl border border-slate-200 hover:shadow-2xl hover:bg-white/95 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Pin badge identifier */}
                  {review.isPinned && (
                    <div className="absolute top-0 right-0 bg-brand-gold/10 text-brand-gold text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                      {t("statistics.featured_review")}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-10 h-10 rounded-full border border-slate-200 shadow-sm"
                          width={40}
                          height={40}
                        />
                        <div>
                          <h4 className="text-slate-900 font-bold text-base leading-tight flex items-center space-x-1">
                            <span>{review.name}</span>
                          </h4>
                          {review.treatmentType && (
                            <span className="text-[10px] text-brand-teal font-medium font-mono">
                              {review.treatmentType}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <span className="text-[10px] text-slate-400 font-light">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    
                    <div className="mb-4 flex items-center space-x-2">
                      <StarRating rating={review.rating} />
                      <span className="font-semibold text-xs text-slate-800">{review.title}</span>
                    </div>

                    <p className="text-slate-600 text-sm italic leading-relaxed">
                      "{review.reviewText}"
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs text-brand-teal font-semibold">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span className="text-slate-500 font-light">{t("statistics.verified_patient")} • </span>
                    <span className="text-[#4285F4] flex items-center space-x-0.5">
                      <span>{t("statistics.google_verified")}</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-12 select-none">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-brand-teal hover:border-brand-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="text-xs text-slate-500 font-semibold">
                {t("statistics.page_of").replace("{page}", page.toString()).replace("{totalPages}", totalPages.toString())}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-brand-teal hover:border-brand-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Submission Form Modal */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Confetti container inside modal */}
            {showConfetti && <Confetti />}

            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-xl bg-white rounded-[32px] border border-slate-200 shadow-2xl p-8 md:p-10 z-10 max-h-[90vh] overflow-y-auto"
              data-lenis-prevent
            >
              <button 
                onClick={() => setIsFormModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-brand-teal transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-xl text-slate-900 leading-tight">
                  {t("statistics.modal_title")}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5">
                  Your feedback helps us continuously improve the quality of patient care.
                </p>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Honeypot field (hidden for spam prevention) */}
                <input
                  type="text"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Patient Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-4.5 py-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 ml-1">{t("statistics.label_rating")}</label>
                    <div className="py-1">
                      <InteractiveStars value={rating} onChange={setRating} />
                    </div>
                  </div>

                  {/* Treatment Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 ml-1">{t("statistics.label_treatment")}</label>
                    <select
                      value={treatmentType}
                      onChange={(e) => setTreatmentType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none transition-all text-xs font-medium text-slate-700"
                    >
                      <option value="">{t("statistics.select_treatment")}</option>
                      {treatmentsList.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Review Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">{t("statistics.label_title")}</label>
                  <input
                    type="text"
                    required
                    placeholder={t("statistics.placeholder_title")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4.5 py-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Comment Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 ml-1">{t("statistics.label_experience")}</label>
                  <textarea
                    required
                    rows={4}
                    placeholder={t("statistics.placeholder_experience")}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4.5 py-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative overflow-hidden bg-brand-teal text-slate-900 px-8 py-4 rounded-2xl font-semibold hover:shadow-[0_0_20px_rgba(0,191,165,0.4)] transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center space-x-1.5">
                    <span>{isSubmitting ? t("statistics.btn_submitting") : t("statistics.btn_submit")}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-teal to-[#008f7b] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Admin Panel Modal Trigger */}
      <AnimatePresence>
        {isAdminPanelOpen && (
          <AdminPanel
            isOpen={isAdminPanelOpen}
            onClose={() => setIsAdminPanelOpen(false)}
            onReviewsUpdated={fetchReviews}
            showToast={showToast}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
