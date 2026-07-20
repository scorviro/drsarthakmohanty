"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Clock, User, Calendar, Bookmark, Share2, Check } from "lucide-react";
import { Article, categories } from "@/lib/educationData";
import { useState } from "react";

interface Props {
  article: Article;
}

export default function BlogArticleContentClient({ article }: Props) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const titleText = article.title[language] || article.title.en;
  const summaryText = article.summary[language] || article.summary.en;
  const contentHtml = article.content[language] || article.content.en;
  const categoryLabel = categories[article.category][language] || categories[article.category].en;

  return (
    <article className="bg-white rounded-[32px] border border-slate-200/60 p-6 md:p-12 shadow-xl/5 relative z-10">
      {/* Category and Read time */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="px-4 py-1.5 bg-brand-teal/10 text-brand-teal font-semibold text-xs rounded-full uppercase tracking-wider">
          {categoryLabel}
        </span>
        <span className="text-slate-400 text-xs font-semibold flex items-center space-x-1">
          <Clock size={14} />
          <span>{article.readTime} min read</span>
        </span>
      </div>

      {/* Main Title */}
      <h1 className="display-font text-3xl md:text-5xl font-extrabold text-slate-950 leading-[1.2] mb-6">
        {titleText}
      </h1>

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-slate-100 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-bold text-sm">
            SM
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Dr. Sarthak Kumar Mohanty</p>
            <p className="text-xs text-slate-400">Radiation Oncologist</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center space-x-1">
            <Calendar size={14} className="text-slate-450" />
            <span>July 20, 2026</span>
          </span>
          <span className="hidden sm:inline text-slate-200">|</span>
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 font-bold"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-500" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Share Post</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Article Featured Image */}
      <div className="w-full h-[280px] md:h-[450px] rounded-[24px] overflow-hidden relative mb-10 shadow-md bg-slate-100">
        <img
          src={article.image}
          alt={titleText}
          loading="eager"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Short Summary Callout */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/50 mb-8 italic text-slate-600 text-base md:text-lg leading-relaxed">
        {summaryText}
      </div>

      {/* Article Body HTML Content */}
      <div
        className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans space-y-6 
        prose-headings:font-bold prose-headings:text-slate-900 prose-h3:text-2xl prose-h3:mt-8 prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* CTA Box */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[#019E88]/10 via-[#019E88]/5 to-transparent border border-brand-teal/20 text-center max-w-2xl mx-auto">
        <h3 className="display-font text-2xl font-bold text-slate-900 mb-3">
          Need Expert Medical Consultation?
        </h3>
        <p className="text-slate-600 text-sm md:text-base mb-6 leading-relaxed">
          Book a direct appointment with Dr. Sarthak Kumar Mohanty at HCG Cancer Centre, Rajkot, for specialized cancer diagnosis, advanced radiotherapy, and personalized oncology guidance.
        </p>
        <a
          href="/#book"
          className="inline-flex items-center space-x-2 bg-brand-teal text-slate-900 px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-brand-teal/20 transition-all hover:bg-brand-teal/90 active:scale-95 duration-150"
        >
          <span>Schedule Appointment</span>
        </a>
      </div>
    </article>
  );
}
