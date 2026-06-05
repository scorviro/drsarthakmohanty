"use client";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#019E88] pt-20 pb-10 border-t border-white/10 relative overflow-hidden">

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col mb-6">
              <span className="display-font text-2xl font-bold tracking-tight text-white">
                Dr. Sarthak
              </span>
              <span className="text-xs text-teal-100 tracking-widest uppercase mt-1">
                {t("nav.logo_subtitle")}
              </span>
            </Link>
            <p className="text-white/85 text-sm leading-relaxed mb-6">
              {t("footer.description")}
            </p>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-white font-bold mb-6">{t("footer.treatments_title")}</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li><Link href="#treatments" className="hover:text-brand-gold transition-colors">SBRT / SRS</Link></li>
              <li><Link href="#treatments" className="hover:text-brand-gold transition-colors">IMRT & VMAT</Link></li>
              <li><Link href="#treatments" className="hover:text-brand-gold transition-colors">IGRT</Link></li>
              <li><Link href="#treatments" className="hover:text-brand-gold transition-colors">{t("treatments.brachy_title") || "Brachytherapy"}</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-white font-bold mb-6">{t("footer.resources_title")}</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li><Link href="#cancer-types" className="hover:text-brand-gold transition-colors">{t("nav.cancer_types")}</Link></li>
              <li><Link href="#stories" className="hover:text-brand-gold transition-colors">{t("nav.stories")}</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">{t("footer.faq_prep")}</Link></li>
              <li><Link href="#" className="hover:text-brand-gold transition-colors">{t("footer.second_opinion")}</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-bold mb-6">{t("footer.contact_title")}</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <span>{t("location.heading")} {t("location.address_val").replace("\n", ", ")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-brand-gold flex-shrink-0" />
                <span>{t("common.phone_val")}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-brand-gold flex-shrink-0" />
                <span>{t("common.email_val")}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between text-xs text-white/60">
          <p>{t("footer.all_rights_reserved").replace("{year}", new Date().getFullYear().toString())}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">{t("footer.privacy_policy")}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t("footer.terms_of_service")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
