import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft, Calendar, User, Bookmark } from "lucide-react";
import { educationArticles } from "@/lib/educationData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogArticleContentClient from "@/app/blog/[slug]/BlogArticleContentClient";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return educationArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = educationArticles.find((a) => a.slug === params.slug);
  if (!article) return {};

  const titleText = `${article.title.en} | Dr. Sarthak Kumar Mohanty`;
  const descText = article.summary.en;
  const canonicalUrl = `https://drsarthakkumarmohanty.in/blog/${params.slug}`;

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
      type: "article",
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title.en,
        },
      ],
      publishedTime: "2026-07-20T12:00:00.000Z",
      authors: ["Dr. Sarthak Kumar Mohanty"],
      section: "Cancer Care & Preventive Health",
      tags: ["Cancer Awareness", "Preventive Health", "Oncology", "Rajkot"],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
      images: [article.image],
    },
  };
}

export default function BlogDetailPage({ params }: Props) {
  const article = educationArticles.find((a) => a.slug === params.slug);
  if (!article) {
    notFound();
  }

  // Schema Markup for the article page
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://drsarthakkumarmohanty.in/blog/${article.slug}`
    },
    "headline": article.title.en,
    "image": [article.image],
    "datePublished": "2026-07-20T12:00:00.000Z",
    "dateModified": "2026-07-20T12:00:00.000Z",
    "author": {
      "@type": "Person",
      "name": "Dr. Sarthak Kumar Mohanty",
      "jobTitle": "Senior Consultant Radiation Oncologist",
      "url": "https://drsarthakkumarmohanty.in"
    },
    "publisher": {
      "@type": "MedicalOrganization",
      "name": "Dr. Sarthak Kumar Mohanty - Cancer Care Rajkot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drsarthakkumarmohanty.in/favicon.svg"
      }
    },
    "description": article.summary.en
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <main className="min-h-screen relative pt-[96px] bg-[#FAFAFA] selection:bg-brand-teal/30 selection:text-slate-900">
        <Navbar />

        {/* Hero Banner section */}
        <div className="relative bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-lavender/5 py-12 md:py-20 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none transform-gpu" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-lavender/5 rounded-full blur-[80px] pointer-events-none transform-gpu" />
          
          <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-4xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8 font-medium">
              <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#patient-education" className="hover:text-brand-teal transition-colors">Education Hub</Link>
              <span>/</span>
              <span className="text-slate-700 truncate max-w-[240px] md:max-w-none">{article.title.en}</span>
            </nav>

            <Link href="/#patient-education" className="inline-flex items-center space-x-2 text-brand-teal hover:text-brand-teal/80 transition-colors font-semibold text-sm mb-6 group">
              <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Education Center</span>
            </Link>

            <BlogArticleContentClient article={article} />
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
