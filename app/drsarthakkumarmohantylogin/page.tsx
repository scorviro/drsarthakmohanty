"use client";
import { useState, useEffect } from "react";
import NextImage from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
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
  Copy,
  Menu
} from "lucide-react";

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

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

interface LanguageContent {
  hero: { trusted: string; oncologist: string; description: string };
  about: { desc1: string; desc2: string };
}

interface WebsiteContent {
  translations: {
    [key: string]: LanguageContent;
    en: LanguageContent;
    hi: LanguageContent;
    gu: LanguageContent;
  };
}

interface Article {
  id: string;
  slug?: string;
  title?: { [key: string]: string | undefined; en?: string; hi?: string; gu?: string };
  summary?: { [key: string]: string | undefined; en?: string; hi?: string; gu?: string };
  content?: { [key: string]: string | undefined; en?: string; hi?: string; gu?: string };
  category: string;
  readTime: number;
  image: string;
  trending: boolean;
}

interface GalleryPhoto {
  filename: string;
  url: string;
  sizeBytes: number;
  uploadedAt: string;
}

import dynamic from "next/dynamic";

const OverviewTab = dynamic(() => import("@/components/admin/OverviewTab"), { ssr: false });
const AppointmentsTab = dynamic(() => import("@/components/admin/AppointmentsTab"), { ssr: false });
const InquiriesTab = dynamic(() => import("@/components/admin/InquiriesTab"), { ssr: false });
const SettingsTab = dynamic(() => import("@/components/admin/SettingsTab"), { ssr: false });
const ArticlesTab = dynamic(() => import("@/components/admin/ArticlesTab"), { ssr: false });
const GalleryTab = dynamic(() => import("@/components/admin/GalleryTab"), { ssr: false });
const PatientsTab = dynamic(() => import("@/components/admin/PatientsTab"), { ssr: false });

export default function AdminPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "appointments" | "inquiries" | "settings" | "articles" | "gallery" | "patients"
  >("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Data States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inquiries, setInquiries] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    isBookingEnabled: true,
    contactPhone: "+91 90992 41234",
    clinicTimings: "Mon - Sat: 9:00 AM - 6:00 PM",
    showReviews: true
  });

  // Website Content State
  const [contentForm, setContentForm] = useState<WebsiteContent>({
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
  const [articles, setArticles] = useState<Article[]>([]);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState<Article>({
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
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [uploading, setUploading] = useState(false);

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });
  const [isAuthOpen, setIsAuthOpen] = useState(false);



  // Load Admin Session on Mount
  useEffect(() => {
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

      // If session check fails or is not admin, redirect to login page
      window.location.href = "/drsarthakkumarmohantylogin/login";
    };

    verifyAccess();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [resApp, resMsg, resRev, resSet, resContent, resArticles, resPhotos] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/contact"),
        fetch("/api/reviews/admin"),
        fetch("/api/settings"),
        fetch("/api/content"),
        fetch("/api/education"),
        fetch("/api/gallery"),
      ]);

      if (resApp.ok) {
        const data = await resApp.json();
        setAppointments(data.appointments || []);
      }

      if (resMsg.ok) {
        const data = await resMsg.json();
        setInquiries(data.messages || []);
      }

      if (resRev.ok) {
        const data = await resRev.json();
        setReviews(data.reviews || []);
      }

      if (resSet.ok) {
        const data = await resSet.json();
        setSettings(data.settings);
      }

      if (resContent.ok) {
        const data = await resContent.json();
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

      if (resArticles.ok) {
        const data = await resArticles.json();
        setArticles(data.articles || []);
      }

      if (resPhotos.ok) {
        const data = await resPhotos.json();
        setPhotos(data.photos || []);
      }
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
      window.location.href = "/";
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

  // Render Loading Screen or Redirecting
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mb-4"
        />
        <p className="text-slate-400 font-medium tracking-wide">Securing Clinical Access...</p>
      </div>
    );
  }

  // Calculate stats for Dashboard
  const pendingAppointments = appointments.filter(a => a.status === "pending").length;
  const unreadMessages = inquiries.filter(m => m.status === "unread").length;  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] flex flex-col lg:flex-row text-slate-900 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {actionMessage.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-6 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 font-semibold text-sm ${
              actionMessage.type === "error" ? "bg-red-50 text-red-800 border border-red-200" : "bg-brand-50 text-brand-800 border border-brand-200"
            }`}
          >
            <CheckCircle size={18} className={actionMessage.type === "error" ? "text-red-500" : "text-brand-600"} />
            <span>{actionMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-slate-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Open sidebar menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-extrabold text-brand-500 tracking-wide text-sm">DR. SARTHAK PANEL</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <NextImage
            src={user.avatar || "/dr-sarthak.png"}
            alt={user.name}
            className="w-8 h-8 rounded-full border border-brand-600 object-cover object-top"
            width={32}
            height={32}
          />
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY BACKDROP */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-950 border-r border-slate-800 flex flex-col text-slate-100 justify-between shrink-0 z-40 transform transition-all duration-300 lg:static ${
        isSidebarCollapsed 
          ? "lg:w-0 lg:p-0 lg:overflow-hidden lg:border-r-0 lg:-translate-x-full" 
          : "lg:w-80 lg:p-6 lg:translate-x-0"
      } ${
        isSidebarOpen ? "translate-x-0 w-80 p-6" : "-translate-x-full w-80 p-6"
      }`}>
        <div className="space-y-8">
          {/* Mobile Close Button */}
          <div className="flex justify-end lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Close sidebar menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Doctor Profile Banner */}
          <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
            <NextImage 
              src={user.avatar || "/dr-sarthak.png"} 
              alt={user.name} 
              className="w-12 h-12 rounded-full border-2 border-brand-600 object-cover object-top"
              width={48}
              height={48}
            />
            <div className="overflow-hidden">
              <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button 
              onClick={() => {
                setActiveTab("overview");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "overview" ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard Overview</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab("appointments");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "appointments" ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <CalendarCheck size={20} />
                <span>Appointments</span>
              </div>
              {pendingAppointments > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === "appointments" ? "bg-brand-800 text-white" : "bg-brand-50 text-brand-700"}`}>
                  {pendingAppointments}
                </span>
              )}
            </button>
            <button 
              onClick={() => {
                setActiveTab("inquiries");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "inquiries" ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <Mail size={20} />
                <span>Patient Inquiries</span>
              </div>
              {unreadMessages > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === "inquiries" ? "bg-brand-800 text-white" : "bg-red-500 text-white"}`}>
                  {unreadMessages}
                </span>
              )}
            </button>
            <button 
              onClick={() => {
                setActiveTab("articles");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "articles" ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <FileText size={20} />
              <span>Patient Education</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab("patients");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "patients" ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <User size={20} />
              <span>Patient Details</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab("gallery");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "gallery" ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <ImageIcon size={20} />
              <span>Media Gallery</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab("settings");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3.5 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === "settings" ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
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
      <main className="flex-1 overflow-y-auto p-4 md:p-10 relative" data-lenis-prevent>
        {/* Toggle Sidebar Button for Desktop */}
        <div className="hidden lg:flex items-center justify-between mb-6 border-b border-slate-100 pb-4 select-none">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition shadow-sm text-xs font-semibold"
          >
            <Menu size={14} />
            <span>{isSidebarCollapsed ? "Show Sidebar Navigation" : "Collapse Sidebar"}</span>
          </button>
          
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Clinical Portal · Dr. Sarthak Kumar Mohanty
          </div>
        </div>
        {activeTab === "overview" && (
          <OverviewTab
            appointments={appointments}
            inquiries={inquiries}
            settings={settings}
            setActiveTab={setActiveTab}
            pendingAppointments={pendingAppointments}
            unreadMessages={unreadMessages}
            updateAppointmentStatus={updateAppointmentStatus}
            markMessageRead={markMessageRead}
          />
        )}

        {activeTab === "appointments" && (
          <AppointmentsTab
            appointments={appointments}
            updateAppointmentStatus={updateAppointmentStatus}
            deleteAppointment={deleteAppointment}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            setSearchQuery={setSearchQuery}
            setStatusFilter={setStatusFilter}
          />
        )}

        {activeTab === "inquiries" && (
          <InquiriesTab
            inquiries={inquiries}
            markMessageRead={markMessageRead}
            deleteMessage={deleteMessage}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            settings={settings}
            setSettings={setSettings}
            handleSaveSettings={handleSaveSettings}
          />
        )}

        {activeTab === "articles" && (
          <ArticlesTab
            articles={articles}
            isArticleModalOpen={isArticleModalOpen}
            setIsArticleModalOpen={setIsArticleModalOpen}
            editingArticle={editingArticle}
            articleForm={articleForm}
            setArticleForm={setArticleForm}
            handleSaveArticle={handleSaveArticle}
            handleDeleteArticle={handleDeleteArticle}
            openAddArticle={openAddArticle}
            openEditArticle={openEditArticle}
          />
        )}

        {activeTab === "gallery" && (
          <GalleryTab
            photos={photos}
            uploading={uploading}
            handlePhotoUpload={handlePhotoUpload}
            handleDeletePhoto={handleDeletePhoto}
            showToast={showToast}
          />
        )}

        {activeTab === "patients" && (
          <PatientsTab showToast={showToast} />
        )}
      </main>
    </div>
  );
}
