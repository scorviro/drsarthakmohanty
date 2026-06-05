"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Activity, 
  ShieldAlert, 
  User, 
  Baby, 
  Utensils, 
  Brain, 
  Stethoscope, 
  Search, 
  Bookmark, 
  Share2, 
  X, 
  Clock, 
  ArrowRight, 
  Check 
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { educationArticles, categories, Article } from "@/lib/educationData";

// Category Icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  heart: <Heart className="w-6 h-6 text-[#E11D48]" />,
  diabetes: <Activity className="w-6 h-6 text-[#059669]" />,
  cancer: <ShieldAlert className="w-6 h-6 text-[#7C3AED]" />,
  women: <User className="w-6 h-6 text-[#DB2777]" />,
  child: <Baby className="w-6 h-6 text-[#2563EB]" />,
  nutrition: <Utensils className="w-6 h-6 text-[#D97706]" />,
  mental: <Brain className="w-6 h-6 text-[#0891B2]" />,
  preventive: <Stethoscope className="w-6 h-6 text-[#0D9488]" />,
};

export default function BlogTeaser() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>(educationArticles);
  
  // States stored in localStorage
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const articleContentRef = useRef<HTMLDivElement>(null);
  const [readProgress, setReadProgress] = useState(0);

  // Sync state from localStorage on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem("health_bookmarks");
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
      const savedRecent = localStorage.getItem("health_recent_viewed");
      if (savedRecent) {
        setRecentlyViewed(JSON.parse(savedRecent));
      }
    } catch (e) {
      console.error("Failed to load local storage data:", e);
    }

    // Fetch dynamic articles
    fetch("/api/education")
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) {
          setArticles(data.articles);
        }
      })
      .catch((err) => console.error("Failed to fetch dynamic articles:", err));
  }, []);

  // Handle Bookmarks
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter((b) => b !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    localStorage.setItem("health_bookmarks", JSON.stringify(updated));
  };

  // Handle Recently Viewed
  const addToRecentlyViewed = (id: string) => {
    const filtered = recentlyViewed.filter((item) => item !== id);
    const updated = [id, ...filtered].slice(0, 4); // Keep top 4 recent
    setRecentlyViewed(updated);
    localStorage.setItem("health_recent_viewed", JSON.stringify(updated));
  };

  // Copy Link / Share Action
  const shareArticle = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#patient-education?article=${article.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filtered & Searched Articles for the full screen Hub
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
      const titleMatch = article.title[language]?.toLowerCase().includes(searchQuery.toLowerCase());
      const summaryMatch = article.summary[language]?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && (titleMatch || summaryMatch);
    });
  }, [articles, selectedCategory, searchQuery, language]);

  // Handle scroll progress within the expanded article content
  const handleScroll = () => {
    if (articleContentRef.current) {
      const element = articleContentRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      if (totalHeight > 0) {
        setReadProgress((element.scrollTop / totalHeight) * 100);
      }
    }
  };

  // Home preview articles (Top 3 trending or default)
  const previewArticles = useMemo(() => {
    return articles.filter((a) => a.trending).slice(0, 3);
  }, [articles]);

  return (
    <section className="py-24 bg-gradient-to-b from-[#f8fbff] to-white relative overflow-hidden" id="patient-education">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none transform-gpu" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none transform-gpu" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-brand-teal uppercase tracking-widest text-xs font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              <span>{t("patientEducation.title")}</span>
            </div>
            <h2 className="display-font text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Latest Insights & <span className="text-gradient-teal">Health Awareness</span>
            </h2>
            <p className="text-slate-500 mt-3 text-lg max-w-xl">
              {t("patientEducation.subtitle")}
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-brand-teal flex items-center space-x-2 font-semibold hover:text-slate-900 transition-colors group text-lg"
          >
            <span>{t("patientEducation.title")} Hub</span>
            <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {Object.entries(categories).map(([key, val]) => (
            <motion.div
              key={key}
              whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(0,191,165,0.08)" }}
              onClick={() => {
                setSelectedCategory(key);
                setIsModalOpen(true);
              }}
              className="glass-panel-strong p-6 rounded-3xl border border-slate-200/60 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/70"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 shadow-inner">
                {categoryIcons[key]}
              </div>
              <span className="font-semibold text-slate-800 text-sm md:text-base leading-snug">
                {val[language]}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Highlighted Articles Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {previewArticles.map((article) => (
            <motion.div
              key={article.id}
              whileHover={{ y: -8 }}
              onClick={() => {
                addToRecentlyViewed(article.id);
                setActiveArticle(article);
                setIsModalOpen(true);
              }}
              className="glass-panel-strong group cursor-pointer overflow-hidden rounded-[32px] border border-slate-200/60 bg-white shadow-xl/5 flex flex-col h-full"
            >
              <div className="h-56 overflow-hidden relative bg-gradient-to-br from-brand-teal/15 to-slate-900 flex items-center justify-center">
                <Stethoscope className="text-brand-teal/20 absolute" size={40} />
                <img 
                  src={article.image}
                  alt={article.title[language]}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e: any) => {
                    e.target.style.opacity = "0";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-4 left-4 glass-panel px-4 py-1.5 rounded-full text-xs font-semibold text-slate-900 border border-slate-300 bg-white/95 z-10">
                  {categories[article.category][language]}
                </span>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-3 font-medium">
                  <Clock size={14} />
                  <span>{article.readTime} min read</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-950 mb-3 group-hover:text-brand-teal transition-colors line-clamp-2 leading-snug">
                  {article.title[language]}
                </h3>
                
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                  {article.summary[language]}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="text-brand-teal font-semibold text-sm flex items-center space-x-1">
                    <span>{t("patientEducation.read_more")}</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => toggleBookmark(article.id, e)}
                      className={`p-2 rounded-xl border transition-colors ${bookmarks.includes(article.id) ? "bg-brand-teal/10 border-brand-teal/30 text-brand-teal" : "border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                    >
                      <Bookmark size={16} fill={bookmarks.includes(article.id) ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={(e) => shareArticle(article, e)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative"
                    >
                      {copiedId === article.id ? <Check size={16} className="text-emerald-500 animate-pulse" /> : <Share2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Fullscreen Interactive Knowledge Center Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-xl flex justify-end overflow-hidden"
          >
            {/* Modal Body container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="w-full max-w-6xl bg-[#F8FAFC] h-full flex flex-col md:flex-row relative shadow-2xl overflow-hidden"
            >
              {/* Left / Sidebar Section (Filters, Search, Bookmarks) */}
              <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-[40vh] md:h-full flex-shrink-0">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">Knowledge Hub</h3>
                    <p className="text-xs text-slate-400 mt-1">Health Center Articles</p>
                  </div>
                  {/* Close button for Mobile only (hidden on desktop to use top right one) */}
                  <button 
                    onClick={() => { setIsModalOpen(false); setActiveArticle(null); }}
                    className="p-2 md:hidden rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Live Search */}
                <div className="p-6 pb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder={t("patientEducation.search_placeholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium text-sm"
                    />
                  </div>
                </div>

                {/* Category Sidebar Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar-light">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${selectedCategory === "all" ? "bg-brand-teal/10 text-brand-teal" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span className="flex items-center space-x-3">
                      <Stethoscope size={18} />
                      <span>{t("patientEducation.all_categories")}</span>
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-400 group-hover:bg-slate-200">
                      {articles.length}
                    </span>
                  </button>

                  {Object.entries(categories).map(([key, val]) => {
                    const count = articles.filter((a) => a.category === key).length;
                    const isActive = selectedCategory === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${isActive ? "bg-brand-teal/10 text-brand-teal" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        <span className="flex items-center space-x-3">
                          <span className="scale-90">{categoryIcons[key]}</span>
                          <span>{val[language]}</span>
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-400">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bookmarks Section */}
                {bookmarks.length > 0 && (
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
                      <Bookmark size={12} fill="currentColor" />
                      <span>Your Saved Guides ({bookmarks.length})</span>
                    </h4>
                    <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar-light">
                      {articles
                        .filter((a) => bookmarks.includes(a.id))
                        .map((a) => (
                          <div 
                            key={a.id}
                            onClick={() => { addToRecentlyViewed(a.id); setActiveArticle(a); }}
                            className="text-xs font-semibold text-slate-700 hover:text-brand-teal cursor-pointer line-clamp-1 py-1"
                          >
                            • {a.title[language]}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Center / Right Section (Articles List or Single Article Detail view) */}
              <div className="flex-1 flex flex-col h-[60vh] md:h-full relative bg-white">
                {/* Header controls */}
                <div className="absolute top-6 right-6 z-30 flex items-center space-x-3">
                  <button
                    onClick={() => {
                      if (activeArticle) {
                        setActiveArticle(null);
                        setReadProgress(0);
                      } else {
                        setIsModalOpen(false);
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shadow-sm"
                  >
                    <X size={20} />
                  </button>
                </div>

                {activeArticle ? (
                  // Expandable Article View
                  <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Top reading progress indicator */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 z-30">
                      <div 
                        className="h-full bg-brand-teal transition-all duration-75"
                        style={{ width: `${readProgress}%` }}
                      />
                    </div>

                    {/* Back Button */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                      <button
                        onClick={() => { setActiveArticle(null); setReadProgress(0); }}
                        className="text-slate-500 hover:text-slate-900 font-semibold text-sm flex items-center space-x-2"
                      >
                        <ArrowRight className="transform rotate-180" size={16} />
                        <span>Back to Education Center</span>
                      </button>
                    </div>

                    {/* Scrollable Article Body */}
                    <div 
                      ref={articleContentRef}
                      onScroll={handleScroll}
                      className="flex-1 overflow-y-auto px-6 py-10 md:px-12 custom-scrollbar-light"
                    >
                      <div className="max-w-2xl mx-auto">
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="px-3 py-1 bg-brand-teal/10 text-brand-teal font-semibold text-xs rounded-full">
                            {categories[activeArticle.category][language]}
                          </span>
                          <span className="text-slate-400 text-xs font-semibold flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{activeArticle.readTime} min read</span>
                          </span>
                        </div>

                        <h1 className="display-font text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight mb-6">
                          {activeArticle.title[language]}
                        </h1>

                        {/* Article Header Image */}
                        <div className="w-full h-64 md:h-80 rounded-[24px] overflow-hidden relative bg-gradient-to-br from-brand-teal/15 to-slate-900 flex items-center justify-center mb-8 shadow-md">
                          <Stethoscope className="text-brand-teal/20 absolute" size={60} />
                          <img 
                            src={activeArticle.image}
                            alt={activeArticle.title[language]}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.style.opacity = "0";
                            }}
                          />
                        </div>

                        {/* Rich HTML content render */}
                        <div 
                          className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans space-y-6"
                          dangerouslySetInnerHTML={{ __html: activeArticle.content[language] }}
                        />

                        {/* Footer details */}
                        <div className="mt-12 pt-8 border-t border-slate-150 flex items-center justify-between">
                          <div className="flex space-x-3">
                            <button
                              onClick={(e) => toggleBookmark(activeArticle.id, e)}
                              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-colors ${bookmarks.includes(activeArticle.id) ? "bg-brand-teal/10 border-brand-teal/30 text-brand-teal" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                            >
                              <Bookmark size={16} fill={bookmarks.includes(activeArticle.id) ? "currentColor" : "none"} />
                              <span>{bookmarks.includes(activeArticle.id) ? "Saved" : "Save Article"}</span>
                            </button>
                            <button
                              onClick={(e) => shareArticle(activeArticle, e)}
                              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
                            >
                              {copiedId === activeArticle.id ? (
                                <>
                                  <Check size={16} className="text-emerald-500" />
                                  <span className="text-emerald-600">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Share2 size={16} />
                                  <span>Share</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Related / Suggested articles */}
                        <div className="mt-16 pt-8 border-t border-slate-100">
                          <h4 className="font-extrabold text-slate-900 mb-6 text-lg">Suggested Related Reading</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            {articles
                              .filter((a) => a.id !== activeArticle.id && (a.category === activeArticle.category || a.trending))
                              .slice(0, 2)
                              .map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => { addToRecentlyViewed(item.id); setActiveArticle(item); setReadProgress(0); }}
                                  className="p-5 border border-slate-150 rounded-2xl hover:border-brand-teal/40 hover:shadow-lg transition-all cursor-pointer bg-white"
                                >
                                  <span className="text-xs text-brand-teal font-semibold block mb-2">
                                    {categories[item.category][language]}
                                  </span>
                                  <h5 className="font-bold text-slate-900 text-sm md:text-base line-clamp-2 leading-snug">
                                    {item.title[language]}
                                  </h5>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Grid View of categorized articles
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-slate-100 bg-white z-10 flex items-center justify-between">
                      <div>
                        <h2 className="display-font text-2xl font-bold text-slate-950">Patient Health & Wellness Hub</h2>
                        <p className="text-sm text-slate-400 mt-1">Discover, learn, and grow healthy habits with clinical guides.</p>
                      </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8FAFC] custom-scrollbar-light">
                      {filteredArticles.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                          {filteredArticles.map((article) => (
                            <motion.div
                              key={article.id}
                              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}
                              onClick={() => { addToRecentlyViewed(article.id); setActiveArticle(article); }}
                              className="p-6 rounded-[24px] border border-slate-200/50 bg-white hover:border-brand-teal/20 transition-all flex flex-col justify-between cursor-pointer h-64 shadow-sm"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-xs text-brand-teal font-semibold bg-brand-teal/5 px-2.5 py-1 rounded-full">
                                    {categories[article.category][language]}
                                  </span>
                                  <span className="text-slate-400 text-xs font-semibold flex items-center space-x-1">
                                    <Clock size={12} />
                                    <span>{article.readTime} min read</span>
                                  </span>
                                </div>
                                <h4 className="font-extrabold text-slate-950 text-base md:text-lg line-clamp-2 leading-snug mb-2 hover:text-brand-teal transition-colors">
                                  {article.title[language]}
                                </h4>
                                <p className="text-slate-400 text-xs md:text-sm line-clamp-3">
                                  {article.summary[language]}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                                <span className="text-xs font-bold text-brand-teal hover:underline flex items-center space-x-1">
                                  <span>{t("patientEducation.read_more")}</span>
                                  <ArrowRight size={12} />
                                </span>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={(e) => toggleBookmark(article.id, e)}
                                    className={`p-2 rounded-lg transition-colors ${bookmarks.includes(article.id) ? "text-brand-teal bg-brand-teal/5" : "text-slate-350 hover:text-slate-500 hover:bg-slate-50"}`}
                                  >
                                    <Bookmark size={14} fill={bookmarks.includes(article.id) ? "currentColor" : "none"} />
                                  </button>
                                  <button
                                    onClick={(e) => shareArticle(article, e)}
                                    className="p-2 rounded-lg text-slate-350 hover:text-slate-500 hover:bg-slate-50 transition-colors"
                                  >
                                    {copiedId === article.id ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                          <Stethoscope size={48} className="mb-4 text-slate-300" />
                          <p className="font-semibold">No health articles match your search.</p>
                          <button 
                            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                            className="text-xs text-brand-teal font-semibold mt-2 underline"
                          >
                            Clear filters
                          </button>
                        </div>
                      )}

                      {/* Recently Viewed Bar inside the Modal list view */}
                      {recentlyViewed.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-slate-200">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-4">Recently Viewed Articles</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {articles
                              .filter((a) => recentlyViewed.includes(a.id))
                              .map((a) => (
                                <div
                                  key={a.id}
                                  onClick={() => setActiveArticle(a)}
                                  className="p-4 rounded-xl border border-slate-150 bg-white hover:border-brand-teal/20 transition-all cursor-pointer"
                                >
                                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                                    {categories[a.category][language]}
                                  </span>
                                  <h5 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug">
                                    {a.title[language]}
                                  </h5>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
