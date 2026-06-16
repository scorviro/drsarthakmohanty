"use client";
import { useEffect, useState } from "react";
import { Star, ArrowUpRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import fallbackReviews from "@/data/googleReviews.json";

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  time: string;
  text: string;
  avatar?: string;
  images?: string[];
  timestamp?: number;
}

export default function GoogleReviews() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<ReviewItem[]>(fallbackReviews);
  const [rating, setRating] = useState<number>(4.8);
  const [totalReviews, setTotalReviews] = useState<number>(35);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage = 2;

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/google-reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
            setRating(data.rating || 4.8);
            setTotalReviews(data.totalReviews || 34);
          }
        }
      } catch (err) {
        console.error("Failed to fetch Google reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const googleSearchUrl = "https://www.google.com/search?q=Best+Radiation+Oncologist+in+Rajkot-+Dr+Sarthak+Kumar+Mohanty+Reviews";

  // Calculate indices for current page
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Generate a sliding window of at most 4 page numbers
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + 3);
  if (endPage - startPage < 3) {
    startPage = Math.max(1, endPage - 3);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Pagination navigation helpers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const setPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden" id="google-reviews">
      {/* Background decorative blobs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-brand-teal uppercase tracking-widest text-xs font-bold mb-4 bg-brand-teal/10 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse"></span>
            <span>{t("googleReviews.heading")}</span>
          </div>
          <h2 className="display-font text-4xl md:text-5xl font-bold">
            {t("googleReviews.sub_heading")}{" "}
            <span className="text-brand-teal">{t("googleReviews.sub_heading_gradient")}</span>
          </h2>
        </div>

        {/* Dynamic Summary Panel + Reviews Grid with Pagination */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Summary Score Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl lg:sticky lg:top-28">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Google Rating</span>
              <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full font-bold text-lg">G</div>
            </div>

            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-6xl font-extrabold text-slate-900 tracking-tight">{rating}</span>
              <span className="text-lg text-slate-400 font-medium">/ 5.0</span>
            </div>

            {/* Stars Row */}
            <div className="flex items-center space-x-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => {
                const isHalf = rating - i > 0 && rating - i < 1;
                const isFilled = i < Math.floor(rating);
                return (
                  <Star
                    key={i}
                    size={22}
                    className={`${isFilled
                        ? "text-amber-400 fill-amber-400"
                        : isHalf
                          ? "text-amber-400 fill-amber-400 opacity-70"
                          : "text-slate-200"
                      }`}
                  />
                );
              })}
            </div>

            <p className="text-sm font-medium text-slate-600 mb-8">
              {t("googleReviews.based_on").replace("{count}", totalReviews.toString())}
            </p>

            <div className="space-y-3">
              <a
                href="https://www.google.com/search?sca_esv=9775b4ed3171e694&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOaqfUfhTzIeeG4QoFUWMWKnGFz3RA23kPRluCh7LocnE93diaklfdPQqt6DOH5-BNVHc9Jbl9TK-9-oQhtARXBhK77yqPD0c-X27yMK_IRgwg-wsQj0NW-8YfhDrOxVF2bmq8CICBTDQ5QggVWSKE0brHPF3&q=Best+Radiation+Oncologist+in+Rajkot-+Dr+Sarthak+Kumar+Mohanty+Reviews&sa=X&ved=2ahUKEwjvj_zli4mVAxUenCYFHaoSMNIQ0bkNegQIERAH&biw=1366&bih=652&dpr=1#lrd=0x3959c9013e315623:0x6bc60bb06d9183d4,3,,,,"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-md group"
              >
                <span>{t("googleReviews.write_review")}</span>
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href={googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-transparent hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
              >
                <span>{t("googleReviews.view_more")}</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Reviews Grid & Page Numbers Column */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full">

            {/* 2 Reviews List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
              {loading ? (
                // Skeleton Loader
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4 h-[280px]">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                ))
              ) : (
                currentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white hover:bg-white/95 rounded-2xl p-6 border border-slate-200/60 hover:border-brand-teal/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[285px] h-auto group relative"
                  >
                    <div>
                      {/* Review Card Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          {review.avatar ? (
                            <img
                              src={review.avatar}
                              alt={review.author}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center uppercase shadow-sm">
                              {review.author.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1">{review.author}</h4>
                            <span className="text-slate-400 text-xs font-semibold">{t("googleReviews.verified_google")}</span>
                          </div>
                        </div>
                        <span className="text-blue-500 font-bold text-sm bg-blue-50 px-2 py-0.5 rounded-md text-xs">G</span>
                      </div>

                      {/* Stars & Date */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex space-x-0.5">
                          {Array.from({ length: review.rating }).map((_, idx) => (
                            <Star key={idx} size={14} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">• {review.time}</span>
                      </div>

                      {/* Review Text */}
                      <p className="text-slate-600 text-sm leading-relaxed italic font-playfair line-clamp-4">
                        "{review.text}"
                      </p>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-2 mt-4 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-slate-200">
                          {review.images.map((imgUrl, imgIdx) => (
                            <a
                              key={imgIdx}
                              href={imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200/80 flex-shrink-0 hover:opacity-90 transition-opacity"
                            >
                              <img
                                src={imgUrl}
                                alt={`Review attachment ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Google Search-like Page Numbers Navigation */}
            {!loading && totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-12 px-3">
                {/* Previous Button */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-300 hover:border-brand-teal/50 hover:text-brand-teal ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "shadow-sm active:scale-95"
                    }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((pageNumber) => {
                  const isActive = currentPage === pageNumber;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full border font-semibold text-sm transition-all duration-300 ${isActive
                          ? "bg-brand-teal border-brand-teal text-white shadow-md shadow-brand-teal/20"
                          : "border-slate-200 bg-white text-slate-600 hover:border-brand-teal/50 hover:text-brand-teal"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-300 hover:border-brand-teal/50 hover:text-brand-teal ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "shadow-sm active:scale-95"
                    }`}
                  aria-label="Next Page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
