import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import AboutSection from "@/components/AboutSection";
import TreatmentsGrid from "@/components/TreatmentsGrid";
import Statistics from "@/components/Statistics";
import CancerTypes from "@/components/CancerTypes";
import Testimonials from "@/components/Testimonials";
import FAQAccordion from "@/components/FAQAccordion";
import BookingWizard from "@/components/BookingWizard";
import BlogTeaser from "@/components/BlogTeaser";
import LocationMap from "@/components/LocationMap";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative pt-[96px] selection:bg-brand-teal/30 selection:text-slate-900">
      <Navbar />
      <HeroSection />
      <TrustStrip />
      <AboutSection />
      <TreatmentsGrid />
      <Statistics />
      <CancerTypes />
      <Testimonials />
      <FAQAccordion />
      <BookingWizard />
      <BlogTeaser />
      <LocationMap />
      <ContactSection />
      <Footer />
    </main>
  );
}

