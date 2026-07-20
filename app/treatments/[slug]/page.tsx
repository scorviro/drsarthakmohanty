import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, Clock, CheckCircle2, Calendar, Phone, ShieldCheck, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { treatmentsData } from "@/lib/treatmentData";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return treatmentsData.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const treatment = treatmentsData.find((t) => t.slug === params.slug);
  if (!treatment) return {};

  const titleText = `${treatment.title} - Radiotherapy Rajkot | Dr. Sarthak Kumar Mohanty`;
  const descText = treatment.shortDesc;
  const canonicalUrl = `https://drsarthakkumarmohanty.in/treatments/${params.slug}`;

  return {
    title: titleText,
    description: descText,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titleText,
      description: descText,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: treatment.image || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: treatment.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [treatment.image || "/og-image.jpg"],
    }
  };
}

export default function TreatmentDetailPage({ params }: Props) {
  const treatment = treatmentsData.find((t) => t.slug === params.slug);
  if (!treatment) {
    notFound();
  }

  // Schema Markup for Medical Procedure
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": treatment.title,
    "description": treatment.shortDesc,
    "procedureType": "Non-invasive",
    "relevantSpecialty": {
      "@type": "MedicalSpecialty",
      "name": "RadiationOncology"
    },
    "legalStatus": {
      "@type": "MedicalProcedure",
      "name": "Clinically Approved"
    },
    "practitioner": {
      "@type": "Physician",
      "name": "Dr. Sarthak Kumar Mohanty",
      "url": "https://drsarthakkumarmohanty.in/dr-sarthak-kumar-mohanty"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <main className="min-h-screen relative pt-[96px] bg-[#FAFAFA] selection:bg-brand-teal/30 selection:text-slate-900">
        <Navbar />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-lavender/5 py-12 md:py-20 overflow-hidden border-b border-slate-200/50">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-lavender/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-5xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8 font-medium">
              <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
              <span className="text-slate-300">/</span>
              <Link href="/treatments" className="hover:text-brand-teal transition-colors">Treatments</Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 truncate max-w-[200px] md:max-w-none">{treatment.title}</span>
            </nav>

            <Link href="/treatments" className="inline-flex items-center space-x-2 text-brand-teal hover:text-brand-teal/80 transition-colors font-semibold text-sm mb-6 group">
              <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Treatments list</span>
            </Link>

            <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
              {treatment.title}
            </h1>
            <p className="text-slate-650 text-base md:text-lg max-w-3xl leading-relaxed">
              {treatment.shortDesc}
            </p>
          </div>
        </section>

        {/* Detailed Grid Info */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="grid lg:grid-cols-12 gap-12">
              
              {/* Left Column: Description & Indications */}
              <div className="lg:col-span-8 space-y-10">
                {treatment.image && (
                  <div className="w-full h-[280px] md:h-[400px] rounded-3xl overflow-hidden shadow-md relative bg-slate-100 mb-6">
                    <img 
                      src={treatment.image} 
                      alt={treatment.title} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}

                {/* Treatment narrative description */}
                <div 
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans space-y-6 
                  prose-headings:font-bold prose-headings:text-slate-900 prose-h3:text-xl prose-h3:mt-8 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: treatment.fullDesc }}
                />

                {/* Indications */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Clinical Indications</h3>
                  <p className="text-slate-600 text-sm">This radiotherapy procedure is typically indicated for the following oncological conditions:</p>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {treatment.clinicalIndications.map((ind, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/50">
                        <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                        <span className="text-slate-700 text-sm font-semibold">{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Clinical Benefits</h3>
                  <div className="space-y-3">
                    {treatment.benefits.map((ben, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-sm text-slate-655 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal mt-2 shrink-0" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Fact Sheet Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Fact Sheet Box */}
                <div className="bg-slate-950 text-white rounded-[32px] p-8 space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
                  <h3 className="font-serif text-2xl font-bold">Treatment Profile</h3>
                  
                  <div className="space-y-5 text-xs text-slate-300">
                    <div className="space-y-1">
                      <p className="text-slate-500 font-bold uppercase tracking-wider">Technology Used</p>
                      <p className="text-slate-200 font-medium leading-relaxed">{treatment.technology}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-slate-500 font-bold uppercase tracking-wider">Clinical Timeline</p>
                      <p className="text-slate-200 font-medium leading-relaxed">{treatment.sessions}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-slate-500 font-bold uppercase tracking-wider">Administering Location</p>
                      <p className="text-slate-200 font-medium leading-relaxed">HCG Cancer Centre, Ayodhya Chowk, Rajkot</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-slate-500 font-bold uppercase tracking-wider">Lead Radiation Oncologist</p>
                      <p className="text-slate-200 font-medium leading-relaxed">Dr. Sarthak Kumar Mohanty, MD</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <a 
                      href="/#book" 
                      className="bg-brand-teal text-white hover:bg-brand-teal/90 w-full py-3.5 rounded-full font-bold shadow-lg transition-all text-center text-xs block"
                    >
                      Request Appointment
                    </a>
                  </div>
                </div>

                {/* FAQ Help Box */}
                <div className="bg-white rounded-[32px] border border-slate-200/80 p-8 space-y-6 shadow-sm">
                  <h4 className="font-serif text-xl font-bold text-slate-900">Patient Support</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Have questions about insurance, scheduling, or what to expect? Our clinical coordinators at HCG Cancer Centre are here to guide you.
                  </p>
                  <a 
                    href="tel:+918238286706" 
                    className="border border-slate-300 hover:bg-slate-50 text-slate-800 w-full py-3.5 rounded-full font-bold transition-all text-center text-xs flex items-center justify-center space-x-2"
                  >
                    <Phone size={14} className="text-brand-teal" />
                    <span>Call +91 82382 86706</span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
