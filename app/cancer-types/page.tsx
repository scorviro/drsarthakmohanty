import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Activity, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cancerTypesData } from "@/lib/cancerData";

export const metadata: Metadata = {
  title: "Specialized Cancer Types & Radiation Care Rajkot | Dr. Sarthak Kumar Mohanty",
  description: "Learn about the specialized cancer types treated by Dr. Sarthak Kumar Mohanty using advanced radiotherapy in Rajkot. Comprehensive care for Head & Neck, Breast, Brain, GI, and Gynecological cancers.",
  keywords: [
    "cancers treated Rajkot",
    "breast cancer radiation Rajkot",
    "head and neck cancer treatment Gujarat",
    "brain tumor radiotherapy Saurashtra",
    "cervical cancer radiation therapy",
    "lung cancer SBRT Rajkot",
    "prostate cancer radiotherapy"
  ],
  alternates: {
    canonical: "https://drsarthakkumarmohanty.in/cancer-types"
  }
};

export default function CancerTypesIndexPage() {
  return (
    <main className="min-h-screen relative pt-[96px] bg-[#FAFAFA] selection:bg-brand-teal/30 selection:text-slate-900">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-lavender/5 py-16 md:py-24 overflow-hidden border-b border-slate-200/50">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-lavender/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-5xl text-center">
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center space-x-2 text-sm text-slate-500 mb-8 font-medium">
            <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800">Cancer Types</span>
          </nav>

          <div className="inline-flex items-center space-x-2 bg-brand-teal/10 text-brand-teal px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Shield size={12} />
            <span>Comprehensive Care</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
            Oncology Specialties & <span className="text-brand-teal">Cancer Types</span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Providing tailored, precision radiation oncology protocols for a wide spectrum of solid tumors, ensuring maximum tumor control with minimum impact on surrounding tissues.
          </p>
        </div>
      </section>

      {/* Cancer Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cancerTypesData.map((c) => (
              <div 
                key={c.slug} 
                className="bg-white rounded-[32px] border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md hover:border-brand-teal/30 transition-all group"
              >
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img 
                    src={c.image} 
                    alt={c.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-brand-teal px-3.5 py-1.5 rounded-full">
                    {c.title}
                  </span>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-brand-teal transition-colors">
                      <Link href={`/cancer-types/${c.slug}`}>
                        {c.title}
                      </Link>
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider leading-relaxed">
                      Sub-categories: {c.subTypes}
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {c.shortDesc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <Link 
                      href={`/cancer-types/${c.slug}`} 
                      className="text-brand-teal hover:text-brand-teal/80 transition-colors font-bold text-sm flex items-center space-x-1.5 group"
                    >
                      <span>Read Treatment Protocol</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-[#FAFAFA] border-t border-slate-200/50">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <div className="bg-white rounded-[40px] border border-slate-200/80 p-8 md:p-12 shadow-sm relative overflow-hidden">
            <h3 className="font-serif text-3xl font-bold text-slate-900 mb-4">
              Need a Consultation or Second Opinion?
            </h3>
            <p className="text-slate-600 text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Dr. Sarthak Kumar Mohanty offers customized radiation oncology treatment planning and clinical evaluations for patients across Saurashtra.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/#book" 
                className="bg-brand-teal text-white hover:bg-brand-teal/90 px-8 py-3.5 rounded-full font-bold shadow-lg transition-all w-full sm:w-auto text-center text-sm"
              >
                Book Consultation
              </Link>
              <Link 
                href="tel:+918238286706" 
                className="border border-slate-350 bg-white hover:bg-slate-50 text-slate-800 px-8 py-3.5 rounded-full font-bold transition-all w-full sm:w-auto text-center text-sm"
              >
                Call Coordinator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
