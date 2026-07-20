import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Activity, Cpu, Calendar, ShieldCheck, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { treatmentsData } from "@/lib/treatmentData";

export const metadata: Metadata = {
  title: "Advanced Radiotherapy & Cancer Treatments in Rajkot | Dr. Sarthak Kumar Mohanty",
  description: "Explore the advanced precision radiation oncology treatments offered by Dr. Sarthak Kumar Mohanty at HCG Cancer Centre, Rajkot. Learn about SBRT, IMRT, VMAT, and brachytherapy.",
  keywords: [
    "radiotherapy treatments Rajkot",
    "cancer radiation therapy Gujarat",
    "SBRT treatment Rajkot",
    "IMRT cancer therapy Saurashtra",
    "VMAT RapidArc Rajkot",
    "brachytherapy cervical cancer Gujarat",
    "precision oncology treatments"
  ],
  alternates: {
    canonical: "https://drsarthakkumarmohanty.in/treatments"
  }
};

export default function TreatmentsIndexPage() {
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
            <span className="text-slate-800">Treatments</span>
          </nav>

          <div className="inline-flex items-center space-x-2 bg-brand-teal/10 text-brand-teal px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={12} />
            <span>Clinical Precision</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
            Precision Radiotherapy & <span className="text-brand-teal">Cancer Treatments</span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Saurashtra's most sophisticated radiation oncology services, utilizing state-of-the-art linear accelerators and planning software to eradicate cancer cells while preserving quality of life.
          </p>
        </div>
      </section>

      {/* Treatments Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {treatmentsData.map((t) => (
              <div 
                key={t.slug} 
                className="bg-white rounded-[32px] border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-brand-teal/30 transition-all group"
              >
                <div className="space-y-6">
                  {/* Icon & Details */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                      <Cpu size={22} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3.5 py-1.5 rounded-full">
                      {t.sessions.includes("1 to 5") || t.sessions.includes("1 session") ? "Hypofractionated" : "Standard Course"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-brand-teal transition-colors">
                      <Link href={`/treatments/${t.slug}`}>
                        {t.title}
                      </Link>
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {t.shortDesc}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-bold text-slate-500">
                    <div>
                      <span className="text-slate-400">Timeline:</span> {t.sessions}
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link 
                    href={`/treatments/${t.slug}`} 
                    className="text-brand-teal hover:text-brand-teal/80 transition-colors font-bold text-sm flex items-center space-x-1.5 group"
                  >
                    <span>Read Treatment Details</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
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
              Unsure Which Therapy is Suitable?
            </h3>
            <p className="text-slate-600 text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Dr. Sarthak Kumar Mohanty reviews each patient's pathology, imaging scans, and staging reports to build a highly customized, conformal radiotherapy plan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/#book" 
                className="bg-brand-teal text-white hover:bg-brand-teal/90 px-8 py-3.5 rounded-full font-bold shadow-lg transition-all w-full sm:w-auto text-center text-sm"
              >
                Book Clinical Evaluation
              </Link>
              <Link 
                href="/dr-sarthak-kumar-mohanty" 
                className="border border-slate-300 hover:bg-slate-50 text-slate-800 px-8 py-3.5 rounded-full font-bold transition-all w-full sm:w-auto text-center text-sm"
              >
                About Our Oncologist
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
