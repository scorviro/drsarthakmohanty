import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import AboutSection from "@/components/AboutSection";

import dynamic from "next/dynamic";
import { getDbReviews, getDbArticles } from "@/lib/db";

const TreatmentsGrid = dynamic(() => import("@/components/TreatmentsGrid"));
const Statistics = dynamic(() => import("@/components/Statistics"));
const CancerTypes = dynamic(() => import("@/components/CancerTypes"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const FAQAccordion = dynamic(() => import("@/components/FAQAccordion"));
const BookingWizard = dynamic(() => import("@/components/BookingWizard"));
const BlogTeaser = dynamic(() => import("@/components/BlogTeaser"));
const LocationMap = dynamic(() => import("@/components/LocationMap"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/Footer"));

export default async function Home() {
  const allReviews = await getDbReviews();
  const approvedReviews = allReviews.filter((r) => r.status === "approved");
  
  // Sort reviews: Pinned reviews first, then by date descending
  approvedReviews.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const pinnedReviews = approvedReviews.filter((r) => r.isPinned);
  const articles = await getDbArticles();

  return (
    <main className="min-h-screen relative pt-[96px] selection:bg-brand-teal/30 selection:text-slate-900">
      <Navbar />
      <HeroSection />
      <TrustStrip />
      <AboutSection />
      <TreatmentsGrid />
      <Statistics initialReviews={approvedReviews.slice(0, 6)} initialTotalReviews={approvedReviews.length} />
      <CancerTypes />
      <Testimonials initialReviews={pinnedReviews} />
      <FAQAccordion />
      <BookingWizard />
      <BlogTeaser initialArticles={articles} />
      <LocationMap />
      <ContactSection />
      <Footer />
    </main>
  );
}

