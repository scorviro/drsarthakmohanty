"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  CalendarCheck, 
  Mail, 
  Star, 
  Settings, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Phone, 
  User, 
  Search, 
  Sliders, 
  Database,
  Eye,
  Trash2,
  BookmarkCheck,
  Check,
  Edit,
  FileText,
  Image as ImageIcon,
  Upload,
  Plus,
  X,
  ExternalLink,
  Copy
} from "lucide-react";
import GoogleAuthModal from "@/components/GoogleAuthModal";

interface Appointment {
  appointmentId: string;
  name: string;
  phone: string;
  date: string;
  timeSlot?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface ContactMessage {
  messageId: string;
  name: string;
  email: string;
  messageText: string;
  status: "unread" | "read";
  createdAt: string;
}

interface Review {
  reviewId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  title: string;
  treatmentType?: string;
  reviewText: string;
  status: "pending" | "approved" | "rejected";
  isPinned: boolean;
  verified: boolean;
  createdAt: string;
}

interface SystemSettings {
  isBookingEnabled: boolean;
  contactPhone: string;
  clinicTimings: string;
  showReviews: boolean;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "appointments" | "inquiries" | "reviews" | "settings" | "content" | "articles" | "gallery"
  >("overview");
  
  // Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    isBookingEnabled: true,
    contactPhone: "+91 99982 90040",
    clinicTimings: "Mon - Sat: 9:00 AM - 6:00 PM",
    showReviews: true
  });

  // Website Content State
  const [contentForm, setContentForm] = useState<any>({
    translations: {
      en: {
        hero: { trusted: "", oncologist: "", description: "" },
        about: { desc1: "", desc2: "" }
      },
      hi: {
        hero: { trusted: "", oncologist: "", description: "" },
        about: { desc1: "", desc2: "" }
      },
      gu: {
        hero: { trusted: "", oncologist: "", description: "" },
        about: { desc1: "", desc2: "" }
      }
    }
  });

  // Patient Education Articles State
  const [articles, setArticles] = useState<any[]>([]);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [articleForm, setArticleForm] = useState<any>({
    id: "",
    category: "preventive",
    readTime: 5,
    image: "",
    trending: false,
    title: { en: "", hi: "", gu: "" },
    summary: { en: "", hi: "", gu: "" },
    content: { en: "", hi: "", gu: "" }
  });

  // Media Gallery / Photo Upload State
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Manual Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Load Admin Session on Mount with secret shortcut verification
  useEffect(() => {
    const isAllowed = document.cookie.includes("admin_access_allowed=true");

    const verifyAccess = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user?.isAdmin) {
            setUser(data.user);
            loadDashboardData();
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Session check error during verification:", err);
      }

      // If not logged in, they must have accessed via the secret shortcut
      if (!isAllowed) {
        window.location.href = "/";
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    verifyAccess();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch Appointments
      const resApp = await fetch("/api/appointments");
      if (resApp.ok) {
        const data = await resApp.json();
        setAppointments(data.appointments || []);
      }

      // Fetch Messages
      const resMsg = await fetch("/api/contact");
      if (resMsg.ok) {
        const data = await resMsg.json();
        setInquiries(data.messages || []);
      }

      // Fetch Reviews
      const resRev = await fetch("/api/reviews/admin");
      if (resRev.ok) {
        const data = await resRev.json();
        setReviews(data.reviews || []);
      }

      // Fetch Settings
      const resSet = await fetch("/api/settings");
      if (resSet.ok) {
        const data = await resSet.json();
        setSettings(data.settings);
      }

      // Load CMS data
      loadContentTranslations();
      loadArticles();
      loadPhotos();
    } catch (err) {
      showToast("Failed to reload data.", "error");
    }
  };

  // CMS: Website Content Translations
  const loadContentTranslations = async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        if (data.translations && Object.keys(data.translations).length > 0) {
          setContentForm(data);
        } else {
          // Initialize with some structure if empty
          setContentForm({
            translations: {
              en: {
                hero: { trusted: "Rajkot's Most Trusted", oncologist: "Radiation Oncologist", description: "15+ years of precision cancer care. State-of-the-art radiotherapy at HCG Hospital, Rajkot — serving all of Saurashtra with compassion and hope." },
                about: { desc1: "Dr. Sarthak Kumar Mohanty is a Senior Consultant Radiation Oncologist at HCG Cancer Centre, Rajkot — with over 15 years of focused experience in treating complex malignancies using the most advanced radiotherapy technologies available in India.", desc2: "Trained at the prestigious Acharya Harihar Regional Cancer Centre (AHRCC), Cuttack — one of India's top radiation oncology centres — Dr. Sarthak brings world-class expertise to every patient he treats." }
              },
              hi: {
                hero: { trusted: "राजकोट के सबसे विश्वसनीय", oncologist: "रेडिएशन ऑन्कोलॉजिस्ट", description: "15+ वर्षों की सटीक कैंसर देखभाल। एचसीजी अस्पताल, राजकोट में अत्याधुनिक रेडियोथेरेपी - पूरे सौराष्ट्र की करुणा और आशा के साथ सेवा।" },
                about: { desc1: "डॉ. सार्थक कुमार मोहंटी राजकोट के एचसीजी कैंसर सेंटर में सीनियर कंसलटेंट रेडिएशन ऑन्कोलॉजिस्ट हैं - भारत में उपलब्ध सबसे उन्नत रेडियोथेरेपी तकनीकों का उपयोग करके जटिल विकृतियों के इलाज में 15 से अधिक वर्षों का अनुभव रखते हैं।", desc2: "प्रतिष्ठित आचार्य हरिहर क्षेत्रीय कैंसर केंद्र (एएचआरसीसी), कटक से प्रशिक्षित डॉ. सार्थक हर मरीज के लिए विश्वस्तरीय विशेषज्ञता लाते हैं।" }
              },
              gu: {
                hero: { trusted: "રાજકોટના સૌથી વિશ્વસનીય", oncologist: "રેડિયેશન ઓન્કોલોજિસ્ટ", description: "15+ વર્ષની કેન્સર કેરનો અનુભવ. એચસીજી હોસ્પિટલ, રાજકોટ ખાતે અત્યાધુનિક રેડિયોથેરાપી - સમગ્ર સૌરાષ્ટ્રના દર્દીઓની સેવામાં સમર્પિત." },
                about: { desc1: "ડો. સાર્થક કુમાર મોહંતી રાજકોટના એચસીજી કેન્સર સેન્ટર ખાતે સિનિયર કન્સલ્ટન્ટ રેડિયેશન ઓન્કોલોજિસ્ટ છે. તેઓ ભારતમાં ઉપલબ્ધ રેડિયોથેરાપી સારવારના સંશોધન અને જટિલ કેન્સરની સારવારમાં ૧૫ વર્ષથી વધુનો અનુભવ ધરાવે છે.", desc2: "ભારતની પ્રખ્યાત આચાર્ય હરિહર પ્રાદેશિક કેન્સર કેન્દ્ર (AHRCC), કટકથી તાલીમ મેળવેલ ડો. સાર્થક દર્દીઓ માટે ઉત્તમ સેવા પ્રદાન કરે છે." }
              }
            }
          });
        }
      }
    } catch (err) {
      console.error("Error loading translations:", err);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentForm),
      });
      if (res.ok) {
        showToast("Website content paragraphs updated successfully.");
      } else {
        showToast("Failed to save content paragraphs.", "error");
      }
    } catch (err) {
      showToast("Error updating content.", "error");
    }
  };

  // CMS: Patient Education Articles CRUD
  const loadArticles = async () => {
    try {
      const res = await fetch("/api/education");
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error("Error loading articles:", err);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = articleForm.id ? "PUT" : "POST";
      const res = await fetch("/api/education", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleForm),
      });

      if (res.ok) {
        showToast(articleForm.id ? "Article updated successfully." : "New article published successfully.");
        setIsArticleModalOpen(false);
        setArticleForm({
          id: "",
          category: "preventive",
          readTime: 5,
          image: "",
          trending: false,
          title: { en: "", hi: "", gu: "" },
          summary: { en: "", hi: "", gu: "" },
          content: { en: "", hi: "", gu: "" }
        });
        loadArticles();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to save article.", "error");
      }
    } catch (err) {
      showToast("Error saving article.", "error");
    }
  };

  const openEditArticle = (art: any) => {
    setEditingArticle(art);
    setArticleForm({
      id: art.id,
      category: art.category,
      readTime: art.readTime,
      image: art.image,
      trending: art.trending,
      title: { ...art.title },
      summary: { ...art.summary },
      content: { ...art.content }
    });
    setIsArticleModalOpen(true);
  };

  const openAddArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      id: "",
      category: "preventive",
      readTime: 5,
      image: "",
      trending: false,
      title: { en: "", hi: "", gu: "" },
      summary: { en: "", hi: "", gu: "" },
      content: { en: "", hi: "", gu: "" }
    });
    setIsArticleModalOpen(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this patient education article?")) return;
    try {
      const res = await fetch(`/api/education?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Article deleted permanently.");
        loadArticles();
      } else {
        showToast("Failed to delete article.", "error");
      }
    } catch (err) {
      showToast("Network error deleting article.", "error");
    }
  };

  // CMS: Media Gallery / Photo Upload
  const loadPhotos = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error("Error loading gallery:", err);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileList[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showToast("Photo uploaded to public/uploads/ successfully!");
        loadPhotos();
      } else {
        showToast("Failed to upload photo.", "error");
      }
    } catch (err) {
      showToast("Network error uploading photo.", "error");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleDeletePhoto = async (filename: string) => {
    if (!confirm("Are you sure you want to delete this photo from the uploads folder? This may break sections referencing its URL.")) return;
    try {
      const res = await fetch(`/api/gallery?filename=${filename}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Photo deleted successfully.");
        loadPhotos();
      } else {
        showToast("Failed to delete photo.", "error");
      }
    } catch (err) {
      showToast("Error deleting photo.", "error");
    }
  };

  const showToast = (text: string, type = "success") => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage({ text: "", type: "" }), 4000);
  };

  // Auth Operations
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      setUser(null);
      showToast("Logged out successfully.");
    } catch (err) {
      showToast("Failed to log out.", "error");
    }
  };

  // Appointment Operations
  const updateAppointmentStatus = async (appointmentId: string, status: Appointment["status"]) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status }),
      });
      if (res.ok) {
        setAppointments(prev => 
          prev.map(a => a.appointmentId === appointmentId ? { ...a, status } : a)
        );
        showToast(`Appointment status updated to ${status}.`);
      } else {
        const err = await res.json();
        showToast(err.error || "Update failed.", "error");
      }
    } catch (err) {
      showToast("Network error updating status.", "error");
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to permanently delete this appointment booking?")) return;
    try {
      const res = await fetch(`/api/appointments?appointmentId=${appointmentId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setAppointments(prev => prev.filter(a => a.appointmentId !== appointmentId));
        showToast("Appointment deleted permanently.");
      }
    } catch (err) {
      showToast("Failed to delete appointment.", "error");
    }
  };

  // Message Operations
  const markMessageRead = async (messageId: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      if (res.ok) {
        setInquiries(prev => 
          prev.map(m => m.messageId === messageId ? { ...m, status: "read" } : m)
        );
        showToast("Message marked as read.");
      }
    } catch (err) {
      showToast("Failed to update message.", "error");
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Delete this patient inquiry permanently?")) return;
    try {
      const res = await fetch(`/api/contact?messageId=${messageId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(m => m.messageId !== messageId));
        showToast("Message deleted permanently.");
      }
    } catch (err) {
      showToast("Failed to delete message.", "error");
    }
  };

  // Review Operations
  const updateReviewStatus = async (reviewId: string, status: Review["status"]) => {
    try {
      const res = await fetch("/api/reviews/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });
      if (res.ok) {
        setReviews(prev => 
          prev.map(r => r.reviewId === reviewId ? { ...r, status } : r)
        );
        showToast(`Review status updated to ${status}.`);
      }
    } catch (err) {
      showToast("Failed to update review.", "error");
    }
  };

  const toggleReviewPin = async (reviewId: string) => {
    try {
      const res = await fetch("/api/reviews/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => 
          prev.map(r => r.reviewId === reviewId ? { ...r, isPinned: data.review.isPinned } : r)
        );
        showToast(data.review.isPinned ? "Review pinned to top." : "Review unpinned.");
      }
    } catch (err) {
      showToast("Failed to pin review.", "error");
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Delete this patient review permanently?")) return;
    try {
      const res = await fetch(`/api/reviews/admin?reviewId=${reviewId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.reviewId !== reviewId));
        showToast("Review deleted permanently.");
      }
    } catch (err) {
      showToast("Failed to delete review.", "error");
    }
  };

  // Settings Operations
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showToast("System settings updated successfully.");
      } else {
        showToast("Failed to save settings.", "error");
      }
    } catch (err) {
      showToast("Network error saving settings.", "error");
    }
  };

  // Developer Bypass Auth for testing locally
  const handleDevBypass = async () => {
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isDevMode: true,
          name: "Dr. Sarthak Mohanty (Dev Bypass)",
          email: "doctor@hcg.com",
          avatar: "https://ui-avatars.com/api/?name=Dr.+Sarthak+Mohanty&background=00BFA5&color=fff&bold=true",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        loadDashboardData();
        showToast("Welcome to Developer Session.");
      }
    } catch (err) {
      showToast("Developer bypass failed.", "error");
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isCredentialsMode: true,
          email: loginEmail,
          password: loginPassword,
        }),
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        loadDashboardData();
        showToast(`Logged in successfully as ${data.user.name}`);
      } else {
        setLoginError(data.error || "Invalid doctor credentials.");
      }
    } catch (err) {
      setLoginError("Connection error. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  // Render Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 rounded-full border-2 border-brand-teal border-t-transparent animate-spin mb-4"
        />
        <p className="text-slate-400 font-medium tracking-wide">Securing Clinical Access...</p>
      </div>
    );
  }

  // Render Login Portal if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#070b12] to-[#121c2e] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,191,165,0.08),transparent_70%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[32px] p-8 text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-teal border border-brand-teal/20">
            <ShieldAlert size={32} />
          </div>
          
          <h2 className="display-font text-2xl font-bold text-white mb-2">Clinical Command Portal</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Authorized admin access only. Please authenticate using your clinical doctor credentials.
          </p>

          <form onSubmit={handleManualLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Doctor Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="doctor@example.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 outline-none transition-all text-white placeholder:text-slate-500 font-medium text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Portal Key / Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 outline-none transition-all text-white placeholder:text-slate-500 font-medium text-sm"
              />
            </div>
            
            {loginError && (
              <p className="text-rose-500 text-xs font-semibold">{loginError}</p>
            )}

            <button 
              type="submit"
              disabled={loggingIn}
              className="w-full bg-brand-teal hover:bg-[#00a892] text-slate-950 py-3.5 px-6 rounded-2xl font-extrabold tracking-wide transition-all shadow-[0_0_20px_rgba(0,191,165,0.25)] flex items-center justify-center space-x-2 text-sm mt-6"
            >
              {loggingIn ? "Verifying..." : "Access Portal"}
            </button>
          </form>

        </motion.div>
      </div>
    );
  }

  // Calculate stats for Dashboard
  const pendingAppointments = appointments.filter(a => a.status === "pending").length;
  const pendingReviews = reviews.filter(r => r.status === "pending").length;
  const unreadMessages = inquiries.filter(m => m.status === "unread").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {actionMessage.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 font-semibold text-sm ${
              actionMessage.type === "error" ? "bg-red-50 text-red-800 border border-red-200" : "bg-teal-50 text-teal-800 border border-teal-200"
            }`}
          >
            <CheckCircle size={18} className={actionMessage.type === "error" ? "text-red-500" : "text-teal-600"} />
            <span>{actionMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR */}
      <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col p-6 text-slate-100 justify-between shrink-0">
        <div className="space-y-8">
          {/* Doctor Profile Banner */}
          <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
            <img 
              src={user.avatar || "/dr-sarthak.png"} 
              alt={user.name} 
              className="w-12 h-12 rounded-full border-2 border-brand-teal object-cover object-top"
            />
            <div className="overflow-hidden">
              <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "overview" ? "bg-brand-teal text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab("appointments")}
              className={`w-full flex items-center justify-between py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "appointments" ? "bg-brand-teal text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <CalendarCheck size={20} />
                <span>Appointments</span>
              </div>
              {pendingAppointments > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === "appointments" ? "bg-slate-950 text-white" : "bg-brand-teal text-slate-950"}`}>
                  {pendingAppointments}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("inquiries")}
              className={`w-full flex items-center justify-between py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "inquiries" ? "bg-brand-teal text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <Mail size={20} />
                <span>Patient Inquiries</span>
              </div>
              {unreadMessages > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === "inquiries" ? "bg-slate-950 text-white" : "bg-red-500 text-white"}`}>
                  {unreadMessages}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center justify-between py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "reviews" ? "bg-brand-teal text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <Star size={20} />
                <span>Testimonials</span>
              </div>
              {pendingReviews > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === "reviews" ? "bg-slate-950 text-white" : "bg-brand-teal text-slate-950"}`}>
                  {pendingReviews}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("content")}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "content" ? "bg-brand-teal text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Edit size={20} />
              <span>Website Content</span>
            </button>
            <button 
              onClick={() => setActiveTab("articles")}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "articles" ? "bg-brand-teal text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <FileText size={20} />
              <span>Patient Education</span>
            </button>
            <button 
              onClick={() => setActiveTab("gallery")}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "gallery" ? "bg-brand-teal text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <ImageIcon size={20} />
              <span>Media Gallery</span>
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "settings" ? "bg-brand-teal text-slate-950" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Settings size={20} />
              <span>System Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 py-3 px-4 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all mt-auto"
        >
          <LogOut size={18} />
          <span>Exit Panel</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-10">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinical Dashboard</h1>
              <p className="text-slate-600 mt-1">Real-time patient activity, testimonials verification, and clinical booking summary.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-brand-teal border border-teal-100">
                    <CalendarCheck size={20} />
                  </div>
                  {pendingAppointments > 0 && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {pendingAppointments} Pending
                    </span>
                  )}
                </div>
                <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Bookings</h4>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{appointments.length}</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                    <Star size={20} />
                  </div>
                  {pendingReviews > 0 && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {pendingReviews} New
                    </span>
                  )}
                </div>
                <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Reviews</h4>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{reviews.length}</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <Mail size={20} />
                  </div>
                  {unreadMessages > 0 && (
                    <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                      {unreadMessages} Unread
                    </span>
                  )}
                </div>
                <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Inquiries</h4>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{inquiries.length}</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                    <Sliders size={20} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${settings.isBookingEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {settings.isBookingEnabled ? "Active" : "Paused"}
                  </span>
                </div>
                <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Booking Hub</h4>
                <div className="text-xl font-bold text-slate-900 mt-2 truncate">{settings.clinicTimings}</div>
              </div>
            </div>

            {/* Quick overview grids */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Recent Pending Appointments */}
              <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 text-lg">Pending Booking Requests</h3>
                  <button onClick={() => setActiveTab("appointments")} className="text-brand-teal text-xs font-bold hover:underline">View All</button>
                </div>
                
                {appointments.filter(a => a.status === "pending").length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    No pending appointment requests. All clear!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.filter(a => a.status === "pending").slice(0, 4).map((a) => (
                      <div key={a.appointmentId} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">{a.name}</h4>
                          <p className="text-xs text-slate-600 flex items-center space-x-1.5 mt-0.5">
                            <span>{a.phone}</span>
                            <span>•</span>
                            <span className="font-medium text-slate-800">{a.date}</span>
                            <span>•</span>
                            <span>{a.timeSlot}</span>
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => updateAppointmentStatus(a.appointmentId, "confirmed")}
                            className="w-8 h-8 rounded-full bg-teal-50 hover:bg-teal-100 text-brand-teal flex items-center justify-center transition-colors"
                            title="Confirm Booking"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => updateAppointmentStatus(a.appointmentId, "cancelled")}
                            className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                            title="Reject Booking"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Unread Messages */}
              <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 text-lg">Recent Inquiries</h3>
                  <button onClick={() => setActiveTab("inquiries")} className="text-brand-teal text-xs font-bold hover:underline">View All</button>
                </div>

                {inquiries.filter(m => m.status === "unread").length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    No unread patient inquiries. All caught up!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.filter(m => m.status === "unread").slice(0, 3).map((m) => (
                      <div key={m.messageId} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm">{m.name}</h4>
                            <p className="text-xs text-slate-500">{m.email}</p>
                          </div>
                          <button 
                            onClick={() => markMessageRead(m.messageId)}
                            className="text-xs text-brand-teal font-bold hover:underline"
                          >
                            Mark Read
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 italic mt-3 bg-white p-3 rounded-xl border border-slate-100 line-clamp-2">
                          "{m.messageText}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS SCHEDULER */}
        {activeTab === "appointments" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments Scheduler</h1>
                <p className="text-slate-600 mt-1">Manage consultation requests, confirm slots, and update patient appointment status.</p>
              </div>

              {/* Filters / Search */}
              <div className="flex items-center space-x-3 shrink-0">
                <div className="relative">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient..."
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal transition-colors"
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-4 px-6">Patient</th>
                      <th className="py-4 px-6">Phone</th>
                      <th className="py-4 px-6">Preferred Date & Slot</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {appointments
                      .filter(a => {
                        const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.phone.includes(searchQuery);
                        const matchesStatus = statusFilter === "all" || a.status === statusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((a) => (
                        <tr key={a.appointmentId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-slate-900">{a.name}</td>
                          <td className="py-4 px-6 text-slate-600">{a.phone}</td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-800">{a.date}</div>
                            <div className="text-xs text-slate-600">{a.timeSlot || "Not specified"}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              a.status === "pending" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                              a.status === "confirmed" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                              a.status === "completed" ? "bg-green-50 text-green-800 border border-green-200" :
                              "bg-red-50 text-red-800 border border-red-200"
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                            {a.status === "pending" && (
                              <button 
                                onClick={() => updateAppointmentStatus(a.appointmentId, "confirmed")}
                                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-brand-teal rounded-xl text-xs font-bold transition-colors"
                              >
                                Confirm
                              </button>
                            )}
                            {a.status === "confirmed" && (
                              <button 
                                onClick={() => updateAppointmentStatus(a.appointmentId, "completed")}
                                className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-colors"
                              >
                                Mark Done
                              </button>
                            )}
                            <button 
                              onClick={() => deleteAppointment(a.appointmentId)}
                              className="p-1.5 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl transition-colors inline-flex items-center"
                              title="Delete permanently"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          No appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PATIENT INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Inquiries</h1>
              <p className="text-slate-600 mt-1">Review incoming queries sent via the contact form and respond to patients directly.</p>
            </div>

            <div className="space-y-4">
              {inquiries.map((m) => (
                <div key={m.messageId} className={`p-6 bg-white border rounded-[32px] shadow-sm transition-all ${m.status === "unread" ? "border-l-4 border-l-brand-teal border-slate-200" : "border-slate-200"}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-slate-900 text-base">{m.name}</h3>
                        {m.status === "unread" && (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{m.email} • Received: {new Date(m.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2 shrink-0">
                      {m.status === "unread" && (
                        <button 
                          onClick={() => markMessageRead(m.messageId)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                      <a 
                        href={`mailto:${m.email}?subject=Response from Dr. Sarthak Mohanty`}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-brand-teal rounded-xl text-xs font-bold transition-colors"
                      >
                        Reply Email
                      </a>
                      <button 
                        onClick={() => deleteMessage(m.messageId)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                    "{m.messageText}"
                  </div>
                </div>
              ))}
              {inquiries.length === 0 && (
                <div className="bg-white border border-slate-200 p-12 rounded-[32px] text-center text-slate-400">
                  No patient inquiries received.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TESTIMONIALS */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Testimonials Moderation</h1>
              <p className="text-slate-600 mt-1">Moderate user reviews, pin stories to top, or reject spam submissions.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.reviewId} className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <img src={r.avatar || "/dr-sarthak.png"} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-950 text-sm leading-none">{r.name}</h4>
                          <span className="text-[10px] text-slate-500">{r.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 font-bold text-brand-gold text-sm bg-amber-50 px-2 py-0.5 rounded-full">
                        <span>★</span>
                        <span>{r.rating}</span>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 mb-1">{r.title}</h4>
                    {r.treatmentType && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-3">
                        {r.treatmentType}
                      </span>
                    )}
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{r.reviewText}"</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        r.status === "approved" ? "bg-green-100 text-green-800" :
                        r.status === "rejected" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {r.status}
                      </span>
                      {r.isPinned && (
                        <span className="text-[10px] bg-brand-gold text-slate-900 font-bold px-2 py-0.5 rounded-full">
                          Pinned
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-1">
                      {r.status !== "approved" && (
                        <button 
                          onClick={() => updateReviewStatus(r.reviewId, "approved")}
                          className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-all"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button 
                          onClick={() => updateReviewStatus(r.reviewId, "rejected")}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all"
                        >
                          Reject
                        </button>
                      )}
                      <button 
                        onClick={() => toggleReviewPin(r.reviewId)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                          r.isPinned ? "bg-brand-gold text-slate-900" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        Pin
                      </button>
                      <button 
                        onClick={() => deleteReview(r.reviewId)}
                        className="p-1 hover:bg-red-50 text-red-600 rounded-xl transition-all"
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="col-span-2 bg-white border border-slate-200 p-12 rounded-[32px] text-center text-slate-400">
                  No patient testimonials.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
              <p className="text-slate-600 mt-1">Configure global variables, clinic hours, contact details, and feature flags.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
              
              {/* Toggle Booking */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900">Enable Patient Booking system</h4>
                  <p className="text-xs text-slate-500">Temporarily pause/unpause bookings on the website homepage.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, isBookingEnabled: !prev.isBookingEnabled }))}
                  className={`w-14 h-8 rounded-full p-1 transition-all ${settings.isBookingEnabled ? "bg-brand-teal flex justify-end" : "bg-slate-200 flex justify-start"}`}
                >
                  <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Toggle Reviews */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900">Show Reviews Section</h4>
                  <p className="text-xs text-slate-500">Toggle display of testimonials feed on the live site.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, showReviews: !prev.showReviews }))}
                  className={`w-14 h-8 rounded-full p-1 transition-all ${settings.showReviews ? "bg-brand-teal flex justify-end" : "bg-slate-200 flex justify-start"}`}
                >
                  <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Clinic Timings */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800">Clinic Timings (Text)</label>
                <input 
                  type="text" 
                  value={settings.clinicTimings}
                  onChange={(e) => setSettings(prev => ({ ...prev, clinicTimings: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm"
                  required
                />
              </div>

              {/* Clinic Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800">Contact Phone Number</label>
                <input 
                  type="text" 
                  value={settings.contactPhone}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm"
                  required
                />
              </div>

            </form>
          </div>
        )}

        {/* TAB 6: WEBSITE CONTENT MANAGER */}
        {activeTab === "content" && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Website Content Manager</h1>
              <p className="text-slate-600 mt-1">Directly edit all landing page text paragraphs and headings in English, Hindi, and Gujarati.</p>
            </div>

            <form onSubmit={handleSaveContent} className="space-y-6">
              {["en", "hi", "gu"].map((lang) => (
                <div key={lang} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 capitalize border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-teal" />
                    <span>{lang === "en" ? "English Content" : lang === "hi" ? "Hindi Content (हिंदी)" : "Gujarati Content (ગુજરાતી)"}</span>
                  </h3>

                  {/* Hero Copy */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hero Tagline</label>
                      <input 
                        type="text"
                        value={contentForm.translations?.[lang]?.hero?.trusted || ""}
                        onChange={(e) => {
                          const updated = { ...contentForm };
                          updated.translations[lang].hero.trusted = e.target.value;
                          setContentForm(updated);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hero Title</label>
                      <input 
                        type="text"
                        value={contentForm.translations?.[lang]?.hero?.oncologist || ""}
                        onChange={(e) => {
                          const updated = { ...contentForm };
                          updated.translations[lang].hero.oncologist = e.target.value;
                          setContentForm(updated);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hero Description Paragraph</label>
                    <textarea 
                      rows={3}
                      value={contentForm.translations?.[lang]?.hero?.description || ""}
                      onChange={(e) => {
                        const updated = { ...contentForm };
                        updated.translations[lang].hero.description = e.target.value;
                        setContentForm(updated);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm leading-relaxed"
                    />
                  </div>

                  {/* About Copy */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">About Doctor Paragraph 1</label>
                    <textarea 
                      rows={3}
                      value={contentForm.translations?.[lang]?.about?.desc1 || ""}
                      onChange={(e) => {
                        const updated = { ...contentForm };
                        updated.translations[lang].about.desc1 = e.target.value;
                        setContentForm(updated);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">About Doctor Paragraph 2</label>
                    <textarea 
                      rows={3}
                      value={contentForm.translations?.[lang]?.about?.desc2 || ""}
                      onChange={(e) => {
                        const updated = { ...contentForm };
                        updated.translations[lang].about.desc2 = e.target.value;
                        setContentForm(updated);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-sm leading-relaxed"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  className="bg-brand-teal hover:bg-[#00a892] text-slate-950 font-bold py-3.5 px-10 rounded-2xl tracking-wide transition-all shadow-lg"
                >
                  Save All Paragraph Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 7: PATIENT EDUCATION ARTICLES */}
        {activeTab === "articles" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Education</h1>
                <p className="text-slate-600 mt-1">Publish oncology research, awareness guides, and healthy living articles.</p>
              </div>
              <button 
                onClick={openAddArticle}
                className="bg-brand-teal hover:bg-[#00a892] text-slate-950 font-bold py-3 px-5 rounded-2xl flex items-center space-x-2 transition-all shadow-md text-sm"
              >
                <Plus size={18} />
                <span>Publish Article</span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {articles.map((art) => (
                <div key={art.id} className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="relative h-44 bg-gradient-to-br from-brand-teal/15 to-slate-900 flex items-center justify-center overflow-hidden">
                    <ImageIcon className="text-brand-teal/20 absolute" size={36} />
                    <img 
                      src={art.image} 
                      alt={art.title?.en} 
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e: any) => { e.target.style.opacity = "0"; }}
                    />
                    <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border border-white/10 z-10">
                      {art.category}
                    </span>
                    {art.trending && (
                      <span className="absolute top-4 right-4 bg-brand-teal text-slate-950 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full z-10">
                        Trending
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-slate-400 text-xs font-bold block mb-1">{art.readTime} min read</span>
                      <h4 className="font-extrabold text-slate-900 text-base line-clamp-2 leading-snug mb-2">
                        {art.title?.en || "Untitled Article"}
                      </h4>
                      <p className="text-slate-500 text-xs line-clamp-2 mb-4">
                        {art.summary?.en}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4">
                      <button 
                        onClick={() => openEditArticle(art)}
                        className="text-xs font-bold text-brand-teal hover:underline flex items-center space-x-1"
                      >
                        <Edit size={14} />
                        <span>Edit Content</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteArticle(art.id)}
                        className="text-xs font-bold text-red-600 hover:underline flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <div className="col-span-3 bg-white border border-slate-200 p-12 rounded-[32px] text-center text-slate-400">
                  No articles published yet. Click the publish button to add one!
                </div>
              )}
            </div>

            {/* ARTICLE WRITER MODAL */}
            <AnimatePresence>
              {isArticleModalOpen && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white border border-slate-200 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center pb-6 border-b border-slate-150 mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          {editingArticle ? "Edit Patient Education Article" : "Publish New Education Article"}
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">Write once, publish in English, Hindi, and Gujarati automatically.</p>
                      </div>
                      <button 
                        onClick={() => setIsArticleModalOpen(false)}
                        className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveArticle} className="space-y-6">
                      {/* Meta information */}
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600">Category</label>
                          <select
                            value={articleForm.category}
                            onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-xs font-semibold"
                          >
                            <option value="heart">Heart Health</option>
                            <option value="diabetes">Diabetes</option>
                            <option value="cancer">Cancer Awareness</option>
                            <option value="women">Women's Health</option>
                            <option value="child">Child Care</option>
                            <option value="nutrition">Nutrition & Diet</option>
                            <option value="mental">Mental Wellness</option>
                            <option value="preventive">Preventive Care</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600">Read Time (minutes)</label>
                          <input 
                            type="number" 
                            min={1} 
                            max={60}
                            value={articleForm.readTime}
                            onChange={(e) => setArticleForm({ ...articleForm, readTime: Number(e.target.value) })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <label className="text-xs font-bold text-slate-600">Cover Image URL (e.g. from Media Gallery)</label>
                          <input 
                            type="text" 
                            value={articleForm.image}
                            onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                            placeholder="/uploads/your_photo.jpg or external url"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 py-2">
                        <input 
                          type="checkbox" 
                          id="trending"
                          checked={articleForm.trending}
                          onChange={(e) => setArticleForm({ ...articleForm, trending: e.target.checked })}
                          className="w-4 h-4 text-brand-teal border-slate-300 rounded focus:ring-brand-teal"
                        />
                        <label htmlFor="trending" className="text-xs font-bold text-slate-700 cursor-pointer">
                          Feature as Trending Article on Homepage
                        </label>
                      </div>

                      {/* Language tabs form inputs */}
                      <div className="grid md:grid-cols-3 gap-6">
                        {["en", "hi", "gu"].map((lang) => (
                          <div key={lang} className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
                            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 border-b pb-2 flex justify-between items-center">
                              <span>{lang === "en" ? "English" : lang === "hi" ? "Hindi (हिंदी)" : "Gujarati (ગુજરાતી)"}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                            </h4>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                              <input 
                                type="text"
                                value={articleForm.title?.[lang] || ""}
                                onChange={(e) => {
                                  const updated = { ...articleForm };
                                  if (!updated.title) updated.title = {};
                                  updated.title[lang] = e.target.value;
                                  setArticleForm(updated);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal transition-all text-xs font-semibold"
                                required={lang === "en"}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Short Summary</label>
                              <textarea 
                                rows={2}
                                value={articleForm.summary?.[lang] || ""}
                                onChange={(e) => {
                                  const updated = { ...articleForm };
                                  if (!updated.summary) updated.summary = {};
                                  updated.summary[lang] = e.target.value;
                                  setArticleForm(updated);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal transition-all text-xs"
                                required={lang === "en"}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Article Content (HTML allowed)</label>
                              <textarea 
                                rows={8}
                                value={articleForm.content?.[lang] || ""}
                                onChange={(e) => {
                                  const updated = { ...articleForm };
                                  if (!updated.content) updated.content = {};
                                  updated.content[lang] = e.target.value;
                                  setArticleForm(updated);
                                }}
                                placeholder="<h3>Heading</h3><p>Your paragraphs here...</p>"
                                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-900 focus:outline-none focus:border-brand-teal transition-all text-xs font-mono"
                                required={lang === "en"}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-150">
                        <button 
                          type="button"
                          onClick={() => setIsArticleModalOpen(false)}
                          className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-6 py-2.5 bg-brand-teal hover:bg-[#00a892] text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md"
                        >
                          {editingArticle ? "Save Changes" : "Publish Article"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 8: MEDIA GALLERY & PHOTO UPLOAD */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Media Gallery</h1>
              <p className="text-slate-600 mt-1">Upload and store clinical photos, team assets, and article covers. Copy their URLs to paste in content fields.</p>
            </div>

            {/* Upload Zone */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <Upload size={18} className="text-brand-teal" />
                <span>Upload New Asset</span>
              </h3>
              
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-50/50 transition-colors relative cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {uploading ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-brand-teal border-t-transparent animate-spin" />
                    <p className="text-sm font-bold text-brand-teal">Saving file to uploads folder...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-brand-teal border border-teal-100 group-hover:scale-110 transition-transform">
                      <Plus size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Click to select photo or drag it here</p>
                    <p className="text-xs text-slate-400">Supports PNG, JPG, JPEG, WEBP and SVG.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div key={photo.filename} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div className="relative h-40 bg-slate-100 flex items-center justify-center">
                    <img 
                      src={photo.url} 
                      alt={photo.filename} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(photo.url);
                          showToast("Copied photo URL to clipboard!");
                        }}
                        className="p-2 rounded-full bg-white text-slate-900 hover:scale-110 transition-transform"
                        title="Copy relative URL"
                      >
                        <Copy size={16} />
                      </button>
                      <a 
                        href={photo.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-2 rounded-full bg-white text-slate-900 hover:scale-110 transition-transform"
                        title="View photo"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <p className="text-slate-800 text-xs font-bold truncate" title={photo.filename}>
                      {photo.filename.replace(/^\d+_\d*_/, "")}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {(photo.sizeBytes / 1024).toFixed(1)} KB
                      </span>
                      <button 
                        onClick={() => handleDeletePhoto(photo.filename)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                        title="Delete permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {photos.length === 0 && (
                <div className="col-span-4 bg-white border border-slate-200 p-12 rounded-[32px] text-center text-slate-400">
                  No photos uploaded yet. Upload your first photo above!
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
