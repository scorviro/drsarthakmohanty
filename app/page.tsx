import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import AboutSection from "@/components/AboutSection";

import dynamic from "next/dynamic";
import { getDbReviews, getDbArticles } from "@/lib/db";

export const revalidate = 3600; // Revalidate page data at most every hour

const TreatmentsGrid = dynamic(() => import("@/components/TreatmentsGrid"));
const CancerTypes = dynamic(() => import("@/components/CancerTypes"));
const GoogleReviews = dynamic(() => import("@/components/GoogleReviews"));
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

  // Calculate dynamic review aggregate rating
  const reviewCount = approvedReviews.length;
  const ratingSum = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
  const ratingValue = reviewCount > 0 ? (ratingSum / reviewCount).toFixed(1) : "5.0";

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": "https://drsarthakkumarmohanty.in/#physician",
    "name": "Dr. Sarthak Kumar Mohanty",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount > 0 ? reviewCount : 1,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": approvedReviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.name || "Anonymous Patient"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating,
        "bestRating": "5"
      },
      "reviewBody": r.reviewText || "Highly professional care and treatment."
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <main className="min-h-screen relative pt-[96px] selection:bg-brand-teal/30 selection:text-slate-900">
        <Navbar />
        <HeroSection />
        <TrustStrip />
        <AboutSection />
        <TreatmentsGrid />
        <CancerTypes />
        <BlogTeaser initialArticles={articles} />
        <Testimonials initialReviews={pinnedReviews} />
        <FAQAccordion />
        <GoogleReviews />
        <BookingWizard />
        <LocationMap />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}

