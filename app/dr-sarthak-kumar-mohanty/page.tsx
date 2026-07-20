import { Metadata } from "next";
import Link from "next/link";
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  BookOpen, 
  Heart, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Activity, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dr. Sarthak Kumar Mohanty | Senior Consultant Radiation Oncologist Rajkot",
  description: "Official profile of Dr. Sarthak Kumar Mohanty, Senior Consultant Radiation Oncologist at HCG Cancer Centre, Rajkot. 17+ years experience in SBRT, IMRT, VMAT, and brachytherapy.",
  keywords: [
    "Sarthak Mohanty",
    "Dr Sarthak Kumar Mohanty",
    "Radiation Oncologist Rajkot",
    "Cancer Specialist Rajkot",
    "SBRT Cancer treatment Gujarat",
    "Tata Memorial Hospital fellowship oncologist",
    "HCG Cancer Centre Rajkot doctor",
    "best radiation oncologist Saurashtra",
    "cancer radiation therapy Rajkot"
  ],
  alternates: {
    canonical: "https://drsarthakkumarmohanty.in/dr-sarthak-kumar-mohanty"
  },
  openGraph: {
    title: "Dr. Sarthak Kumar Mohanty | Radiation Oncology Expert",
    description: "Senior Consultant Radiation Oncologist at HCG Cancer Centre, Rajkot. Specializing in advanced precision radiotherapy.",
    url: "https://drsarthakkumarmohanty.in/dr-sarthak-kumar-mohanty",
    type: "profile",
    images: [
      {
        url: "/dr-sarthak-about.jpg",
        width: 800,
        height: 800,
        alt: "Dr. Sarthak Kumar Mohanty"
      }
    ]
  }
};

export default function DoctorProfilePage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Physician",
        "@id": "https://drsarthakkumarmohanty.in/dr-sarthak-kumar-mohanty/#physician",
        "name": "Dr. Sarthak Kumar Mohanty",
        "alternateName": [
          "Dr. Sarthak Mohanty",
          "Dr Sarthak Mohanty",
          "Dr. Sarthak Kumar Mohanty",
          "Sarthak Mohanty"
        ],
        "image": "https://drsarthakkumarmohanty.in/dr-sarthak-about.jpg",
        "url": "https://drsarthakkumarmohanty.in/dr-sarthak-kumar-mohanty",
        "telephone": "+918238286706",
        "medicalSpecialty": "Oncologic",
        "description": "Dr. Sarthak Kumar Mohanty is a highly accomplished Senior Radiation Oncologist in Rajkot, specializing in precision cancer care, advanced radiotherapy technologies (SBRT, IMRT, VMAT, and IGRT).",
        "sameAs": [
          "https://www.linkedin.com/in/dr-sarthak-kumar-mohanty",
          "https://www.practo.com/rajkot/doctor/dr-sarthak-kumar-mohanty",
          "https://www.justdial.com/Rajkot/Dr-Sarthak-Kumar-Mohanty-Gandhigram/0281PX281-X281-220716172605-B9E4_BZDET",
          "https://www.facebook.com/sarthak.mohanty"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "HCG Cancer Centre, Ayodhya Chowk, 150 Feet Ring Road",
          "addressLocality": "Rajkot",
          "addressRegion": "Gujarat",
          "postalCode": "360005",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "22.3168",
          "longitude": "70.7749"
        },
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Acharya Harihar Regional Cancer Centre (AHRCC)"
        },
        "knowsAbout": [
          "Radiation Oncology",
          "Cancer Treatment",
          "Stereotactic Body Radiotherapy (SBRT)",
          "Intensity-Modulated Radiation Therapy (IMRT)",
          "Volumetric Modulated Arc Therapy (VMAT)",
          "Image-Guided Radiation Therapy (IGRT)",
          "Brachytherapy"
        ],
        "hospitalAffiliation": {
          "@type": "Hospital",
          "name": "HCG Cancer Centre, Rajkot",
          "url": "https://drsarthakkumarmohanty.in"
        }
      }
    ]
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
        <section className="relative bg-gradient-to-br from-brand-teal/10 via-transparent to-brand-lavender/5 py-16 md:py-24 overflow-hidden border-b border-slate-200/50">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-lavender/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8 font-medium">
              <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="text-slate-800">Our Specialist</span>
            </nav>

            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Image Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[420px] aspect-square rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-white group">
                  <img 
                    src="/dr-sarthak-about.jpg" 
                    alt="Dr. Sarthak Kumar Mohanty - Radiation Oncologist Rajkot" 
                    className="w-full h-full object-cover object-top filter contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-brand-teal/10 text-brand-teal px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={12} />
                  <span>Associate Director & Senior Consultant</span>
                </div>
                
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                  Dr. Sarthak Kumar Mohanty
                </h1>
                
                <p className="font-serif text-xl md:text-2xl text-slate-700 italic">
                  MD Radiation Oncology | UICC Fellow (USA)
                </p>

                <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
                  With over 17 years of oncology experience (including 14+ years post-MD clinical practice), Dr. Sarthak specializes in precision cancer treatment using state-of-the-art technologies (SBRT, IMRT, VMAT, and Brachytherapy) at HCG Cancer Centre, Rajkot.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4 text-sm font-semibold text-slate-700">
                  <div className="flex items-center space-x-3 bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <MapPin size={18} className="text-brand-teal" />
                    <span>HCG Cancer Centre, Rajkot</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <ShieldCheck size={18} className="text-brand-teal" />
                    <span>GMC Reg No: G-48281</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <a 
                    href="/#book" 
                    className="bg-brand-teal text-white hover:bg-brand-teal/90 px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-brand-teal/20 transition-all flex items-center space-x-2"
                  >
                    <Calendar size={18} />
                    <span>Book Consultation</span>
                  </a>
                  <a 
                    href="tel:+918238286706" 
                    className="border border-slate-350 hover:bg-slate-50 text-slate-800 px-8 py-3.5 rounded-full font-bold transition-all flex items-center space-x-2"
                  >
                    <Phone size={18} className="text-brand-teal" />
                    <span>+91 82382 86706</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Info Tabs & Sections */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-12 max-w-6xl">
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Left Column: Bio and Timeline */}
              <div className="lg:col-span-8 space-y-12">
                
                {/* Biography */}
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                    Clinical Biography
                  </h2>
                  <p className="text-slate-700 text-lg leading-relaxed text-justify">
                    Dr. Sarthak Kumar Mohanty is a highly distinguished Radiation Oncologist serving the Saurashtra and Gujarat regions with patient-centric, evidence-based clinical excellence. Having graduated with an MBBS from Maharaja Krushna Chandra Gajapati Medical College in 2006, he subsequently pursued his MD in Radiotherapy from the prestigious Acharya Harihar Regional Cancer Centre (AHRCC), Cuttack—one of India's premier regional cancer institutes.
                  </p>
                  <p className="text-slate-700 text-lg leading-relaxed text-justify">
                    To specialize in the most sophisticated modes of precision cancer care, Dr. Sarthak completed a intensive 2-year clinical fellowship in IMRT and IGRT at the world-renowned Tata Memorial Centre in Mumbai. His efforts earned him a Scroll of Honour presented by the Health Minister of Maharashtra.
                  </p>
                  <p className="text-slate-700 text-lg leading-relaxed text-justify">
                    Believing that modern cancer care requires a global perspective, Dr. Sarthak was selected as a UICC International Fellow at the University of Michigan, Ann Arbor, USA, training in advanced Head & Neck oncological treatment. He has further completed specialized clinical observerships in europe, notably in carbon ion and proton therapy at MedAustron in Austria, and motion management in Poland.
                  </p>
                </div>

                {/* Fellowships & Education */}
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                    Education & Advanced Fellowships
                  </h2>
                  <div className="space-y-6 relative border-l-2 border-brand-teal/20 pl-6 ml-4">
                    
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-brand-teal bg-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">Fellowship in IMRT & IGRT</h3>
                      <p className="text-slate-500 font-serif text-sm font-semibold">Tata Memorial Centre (TMC), Mumbai | 2011 – 2013</p>
                      <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                        A rigorous 2-year clinical fellowship focused on high-precision planning and delivery, conformal therapies, and advanced patient management workflows. Convocated with the prestigious Scroll of Honour.
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-brand-teal bg-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">UICC International Fellow (Head & Neck)</h3>
                      <p className="text-slate-500 font-serif text-sm font-semibold">University of Michigan, Ann Arbor, USA</p>
                      <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                        International training under the mentorship of world-famous radiation oncologist Prof. Dr. Avraham Eisbruch, specializing in toxicity reduction strategies and IMRT planning for complex Head and Neck carcinomas.
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-brand-teal bg-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">Proton Therapy & Particle Observership</h3>
                      <p className="text-slate-500 font-serif text-sm font-semibold">MedAustron Hospital, Austria | 2025</p>
                      <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                        Clinical observership at MedAustron, one of Europe's cutting-edge centers for carbon ion and proton beam therapy.
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-brand-teal bg-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">MD Radiotherapy (Radiation Oncology)</h3>
                      <p className="text-slate-500 font-serif text-sm font-semibold">Acharya Harihar Regional Cancer Centre (AHRCC), Cuttack | 2008 – 2011</p>
                      <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                        Formal residency training at an apex regional cancer research and treatment hospital, managing thousands of cases.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Specialized Clinical Techniques */}
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                    Precision Radiotherapy Specialties
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-55/60 p-6 rounded-2xl border border-slate-200/50">
                      <h3 className="font-bold text-slate-955 text-lg mb-3 flex items-center space-x-2">
                        <Activity className="text-brand-teal" size={20} />
                        <span>External Beam Radiation</span>
                      </h3>
                      <ul className="space-y-2.5 text-slate-600 text-sm">
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                          <span><strong>SBRT:</strong> Stereotactic Body Radiotherapy (3 to 5 sessions)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                          <span><strong>IMRT:</strong> Intensity-Modulated Radiation Therapy</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                          <span><strong>VMAT / RapidArc:</strong> 360-degree arc-based precision delivery</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                          <span><strong>SRS / SRT:</strong> Stereotactic Radiosurgery (Brain tumors)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-55/60 p-6 rounded-2xl border border-slate-200/50">
                      <h3 className="font-bold text-slate-955 text-lg mb-3 flex items-center space-x-2">
                        <Heart className="text-brand-teal" size={20} />
                        <span>Brachytherapy & Internals</span>
                      </h3>
                      <ul className="space-y-2.5 text-slate-600 text-sm">
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                          <span><strong>ICRT:</strong> Intracavitary Brachytherapy for gynecological tumors</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                          <span><strong>MUPIT:</strong> Template-guided interstitial brachytherapy</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                          <span><strong>DIBH / Gating:</strong> Deep Inspiration Breath-Hold heart shielding</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle2 size={16} className="text-brand-teal mt-0.5 shrink-0" />
                          <span>Palliative, short-course radiotherapy for rapid pain relief</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Publications */}
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                    Research & Publications
                  </h2>
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 text-sm flex items-start space-x-4">
                      <FileText className="text-slate-400 mt-1 shrink-0" size={20} />
                      <div>
                        <h4 className="font-bold text-slate-900">
                          Quality of Life in Cervical Cancer Patients Undergoing Postoperative IMRT vs. 3DCRT
                        </h4>
                        <p className="text-slate-500 font-serif text-xs mt-1">First Author | Published in Indian Journal of Cancer</p>
                        <p className="text-slate-600 mt-2">
                          A prospective study demonstrating the significant reduction of chronic gastrointestinal toxicity and improvement of daily quality-of-life indices using image-guided IMRT.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 text-sm flex items-start space-x-4">
                      <FileText className="text-slate-400 mt-1 shrink-0" size={20} />
                      <div>
                        <h4 className="font-bold text-slate-900">
                          Predictors of Temozolomide-Induced Acute Hematologic Toxicity in High-Grade Gliomas
                        </h4>
                        <p className="text-slate-500 font-serif text-xs mt-1">Co-Author | Published in Clinical Neurology and Neurosurgery</p>
                        <p className="text-slate-600 mt-2">
                          Audited clinical variables and bone marrow parameters to predict toxicity flags early during concurrent chemoradiation cycles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Sidebar Stats */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Clinic Card */}
                <div className="bg-slate-950 text-white rounded-[32px] p-8 space-y-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
                  <h3 className="font-serif text-2xl font-bold">Clinical Locations</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="border-l-2 border-brand-teal pl-4 space-y-1">
                      <p className="font-bold text-slate-200">HCG Cancer Centre</p>
                      <p className="text-slate-400">Ayodhya Chowk, 150 Feet Ring Road, Rajkot, Gujarat 360005</p>
                      <p className="text-xs text-brand-teal font-semibold">Consultant Radiation Oncologist</p>
                    </div>

                    <div className="border-l-2 border-brand-gold pl-4 space-y-1">
                      <p className="font-bold text-slate-200">Sterling Hospital</p>
                      <p className="text-slate-400">150 Feet Ring Road, Near Raiya Circle, Rajkot, Gujarat 360007</p>
                      <p className="text-xs text-brand-gold font-semibold">Associate Director & Senior Consultant</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                    <p><strong>Days:</strong> Monday – Saturday</p>
                    <p><strong>Timings:</strong> 09:00 AM – 06:00 PM</p>
                  </div>
                </div>

                {/* Professional Memberships */}
                <div className="bg-white rounded-[32px] border border-slate-200/80 p-8 space-y-6 shadow-sm">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Memberships</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "AROI (Association of Radiation Oncologists of India)",
                      "ICRO (Indian College of Radiation Oncology)",
                      "ISNO (Indian Society of Neuro-Oncology)",
                      "FHNO (Foundation for Head and Neck Oncology)",
                      "Life Member, Association of Medical Physicists of India (Affiliated)"
                    ].map(member => (
                      <span key={member} className="px-3.5 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-700 leading-snug block w-full">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Medical Registrations */}
                <div className="bg-white rounded-[32px] border border-slate-200/80 p-8 space-y-6 shadow-sm">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">Credentials & Licenses</h3>
                  <div className="space-y-4 text-xs text-slate-600">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold">Gujarat Medical Council</span>
                      <span>Reg No: G-48281</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold">Odisha Medical Council</span>
                      <span>Reg No: 16900</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold">Fellowship AROI (FAROI)</span>
                      <span>Awarded 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">UICC Fellowship (USA)</span>
                      <span>Awarded 2013</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Booking Box */}
        <section className="py-16 bg-[#FAFAFA] border-t border-slate-200/50">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
            <div className="bg-white rounded-[40px] border border-slate-200/80 p-8 md:p-12 shadow-xl/5 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Schedule a Precision Oncology Session
              </h3>
              <p className="text-slate-600 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Connect directly with Dr. Sarthak Kumar Mohanty to plan your radiation oncology strategy, schedule advanced treatment protocols, or request a clinical second opinion.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/#book" 
                  className="bg-brand-teal text-white hover:bg-brand-teal/90 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-brand-teal/20 transition-all flex items-center justify-center space-x-2 text-sm w-full sm:w-auto"
                >
                  <Calendar size={16} />
                  <span>Book Appointment Online</span>
                </Link>
                <a 
                  href="tel:+918238286706" 
                  className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center space-x-2 text-sm w-full sm:w-auto"
                >
                  <Phone size={16} className="text-brand-teal" />
                  <span>Call Clinical Coordinator</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
