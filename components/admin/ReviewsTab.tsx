import React from "react";
import NextImage from "next/image";
import { Trash2 } from "lucide-react";

interface Review {
  reviewId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  title: string;
  treatmentType?: string;
  reviewText: string;
  status: "pending" | "approved" | "rejected";
  isPinned: boolean;
  verified: boolean;
  createdAt: string;
}

interface ReviewsTabProps {
  reviews: Review[];
  updateReviewStatus: (id: string, status: "pending" | "approved" | "rejected") => Promise<void>;
  toggleReviewPin: (id: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

export default function ReviewsTab({
  reviews,
  updateReviewStatus,
  toggleReviewPin,
  deleteReview,
}: ReviewsTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Testimonials Moderation</h1>
        <p className="text-slate-600 mt-1">Moderate user reviews, pin stories to top, or reject spam submissions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((r) => (
          <div key={r.reviewId} className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <NextImage src={r.avatar || "/dr-sarthak.png"} alt={r.name} className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
                  <div>
                    <h4 className="font-bold text-slate-950 text-sm leading-none">{r.name}</h4>
                    <span className="text-[10px] text-slate-500">{r.email}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 font-bold text-brand-gold text-sm bg-amber-50 px-2 py-0.5 rounded-full">
                  <span>★</span>
                  <span>{r.rating}</span>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 mb-1">{r.title}</h4>
              {r.treatmentType && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider inline-block mb-3">
                  {r.treatmentType}
                </span>
              )}
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{r.reviewText}"</p>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  r.status === "approved" ? "bg-green-100 text-green-800" :
                  r.status === "rejected" ? "bg-red-100 text-red-800" :
                  "bg-amber-100 text-amber-800"
                }`}>
                  {r.status}
                </span>
                {r.isPinned && (
                  <span className="text-[10px] bg-brand-gold text-slate-900 font-bold px-2 py-0.5 rounded-full">
                    Pinned
                  </span>
                )}
              </div>

              <div className="flex space-x-1">
                {r.status !== "approved" && (
                  <button 
                    onClick={() => updateReviewStatus(r.reviewId, "approved")}
                    className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-all"
                  >
                    Approve
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button 
                    onClick={() => updateReviewStatus(r.reviewId, "rejected")}
                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all"
                  >
                    Reject
                  </button>
                )}
                <button 
                  onClick={() => toggleReviewPin(r.reviewId)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    r.isPinned ? "bg-brand-gold text-slate-900" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Pin
                </button>
                <button 
                  onClick={() => deleteReview(r.reviewId)}
                  className="p-1 hover:bg-red-50 text-red-600 rounded-xl transition-all"
                  title="Delete review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="col-span-2 bg-white border border-slate-200 p-12 rounded-[32px] text-center text-slate-400">
            No patient testimonials.
          </div>
        )}
      </div>
    </div>
  );
}
