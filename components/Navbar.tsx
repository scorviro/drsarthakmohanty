"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  const isHome = pathname === '/';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (isHome) {
      e.preventDefault();
      if (hash === "home") {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        window.history.pushState(null, "", "/");
      } else {
        const element = document.getElementById(hash);
        if (element) {
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(element);
          } else {
            element.scrollIntoView({ behavior: "smooth" });
          }
          window.history.pushState(null, "", `#${hash}`);
        }
      }
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: t("nav.home"), hash: "home" },
    { name: t("nav.about"), hash: "about" },
    { name: t("nav.treatments"), hash: "treatments" },
    { name: t("nav.cancer_types"), hash: "cancer-types" },
    { name: t("nav.stories"), hash: "stories" },
    { name: t("nav.contact"), hash: "contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#019E88]/95 backdrop-blur-md py-4 shadow-lg border-b border-[#017C6B]/20" : "bg-[#019E88] py-6 shadow-md"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <span className="display-font text-2xl font-bold tracking-tight text-white">
            Dr. Sarthak
          </span>
          <span className="text-xs text-teal-100 tracking-widest uppercase">
            {t("nav.logo_subtitle")}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => {
            const href = isHome ? `#${item.hash}` : `/#${item.hash}`;
            return (
              <a
                key={item.name}
                href={href}
                onClick={(e) => handleNavClick(e, item.hash)}
                className="text-sm text-white/80 hover:text-white transition-colors relative group font-medium"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold transition-all group-hover:w-full"></span>
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <LanguageSwitcher />
          
          <a
            href={isHome ? "#book" : "/#book"}
            onClick={(e) => handleNavClick(e, "book")}
            className="relative overflow-hidden group bg-white text-[#019E88] px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center space-x-2"
          >
            <Calendar size={16} className="relative z-10 text-[#019E88]" />
            <span className="relative z-10">{t("common.book_appointment")}</span>
            <div className="absolute inset-0 bg-teal-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Mobile Toggle & Actions */}
        <div className="flex items-center space-x-4 md:hidden z-50 relative">
          <LanguageSwitcher />
          
          <button
            className="text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 h-screen overflow-y-auto z-40 pt-24"
          >
            <div className="flex flex-col px-6 space-y-6">
              {navLinks.map((item) => {
                const href = isHome ? `#${item.hash}` : `/#${item.hash}`;
                return (
                  <a
                    key={item.name}
                    href={href}
                    onClick={(e) => handleNavClick(e, item.hash)}
                    className="text-xl font-medium text-slate-800"
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="pt-6 border-t border-slate-200 flex flex-col space-y-6">
                <a
                  href={isHome ? "#book" : "/#book"}
                  onClick={(e) => handleNavClick(e, "book")}
                  className="bg-brand-teal text-slate-900 px-6 py-3 rounded-full text-center font-medium"
                >
                  {t("common.book_appointment")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
