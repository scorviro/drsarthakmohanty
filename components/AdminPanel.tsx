"use client";
import { useState, useEffect } from "react";
import { X, Check, Star, Trash2, Pin, ShieldCheck, Filter, Mail, MessageSquare } from "lucide-react";
import { Review, ContactMessage } from "@/lib/db";
import { motion } from "framer-motion";
import Image from "next/image";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewsUpdated: () => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function AdminPanel({ isOpen, onClose, onReviewsUpdated, showToast }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"reviews" | "inquiries">("reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    if (isOpen) {
      if (activeTab === "reviews") {
        fetchAdminReviews();
      } else {
        fetchAdminMessages();
      }
    }
  }, [isOpen, activeTab, filterStatus]);

  const fetchAdminReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reviews?admin=true");
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      } else {
        showToast("Unauthorized admin session.", "error");
        onClose();
      }
    } catch (err) {
      showToast("Error loading reviews for moderation.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact");
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        showToast("Unauthorized admin session.", "error");
        onClose();
      }
    } catch (err) {
      showToast("Error loading contact messages.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reviewId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/reviews/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });
      if (res.ok) {
        showToast(`Review status updated to ${status}.`, "success");
        fetchAdminReviews();
        onReviewsUpdated();
      } else {
        showToast("Failed to update review status.", "error");
      }
    } catch (err) {
      showToast("Network error while updating status.", "error");
    }
  };

  const handleTogglePin = async (reviewId: string) => {
    try {
      const res = await fetch("/api/reviews/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, action: "pin" }),
      });
      if (res.ok) {
        const data = await res.json();
        const pinned = data.review?.isPinned;
        showToast(pinned ? "Review pinned to home carousel." : "Review unpinned.", "success");
        fetchAdminReviews();
        onReviewsUpdated();
      } else {
        showToast("Failed to toggle pin state.", "error");
      }
    } catch (err) {
      showToast("Network error.", "error");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/admin?reviewId=${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Review deleted permanently.", "success");
        fetchAdminReviews();
        onReviewsUpdated();
      } else {
        showToast("Failed to delete review.", "error");
      }
    } catch (err) {
      showToast("Network error.", "error");
    }
  };

  const handleMarkMessageRead = async (messageId: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      if (res.ok) {
        showToast("Inquiry marked as read.", "success");
        fetchAdminMessages();
      } else {
        showToast("Failed to update message status.", "error");
      }
    } catch (err) {
      showToast("Network error.", "error");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/contact?messageId=${messageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Inquiry deleted permanently.", "success");
        fetchAdminMessages();
      } else {
        showToast("Failed to delete inquiry.", "error");
      }
    } catch (err) {
      showToast("Network error.", "error");
    }
  };

  if (!isOpen) return null;

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Main Drawer Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col z-10 border-l border-slate-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Clinical Reviews Dashboard</h3>
              <p className="text-xs text-slate-500 font-light">Moderate patient testimonials & homepage ratings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 bg-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-bold text-sm transition-all ${
              activeTab === "reviews"
                ? "border-brand-teal text-brand-teal"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare size={16} />
            <span>Patient Reviews</span>
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-bold text-sm transition-all ${
              activeTab === "inquiries"
                ? "border-brand-teal text-brand-teal"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mail size={16} />
            <span>Patient Inquiries</span>
          </button>
        </div>

        {/* Filters (Reviews tab only) */}
        {activeTab === "reviews" && (
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-white">
            <div className="flex items-center space-x-2 text-slate-600 text-xs font-semibold uppercase tracking-wider">
              <Filter size={14} />
              <span>Filter Status</span>
            </div>
            <div className="flex space-x-1">
              {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    filterStatus === status
                      ? "bg-brand-teal text-slate-900 shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <div className="w-8 h-8 border-3 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Refreshing database...</span>
            </div>
          ) : activeTab === "reviews" ? (
            filteredReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
                <span className="text-sm font-semibold mb-1">No Reviews Found</span>
                <p className="text-xs max-w-xs text-slate-400">There are currently no reviews matching the selected filter status.</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.reviewId}
                  className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
                    review.status === "pending"
                      ? "border-amber-300 bg-amber-50/10"
                      : review.status === "rejected"
                      ? "border-rose-100 bg-rose-50/5"
                      : "border-slate-200"
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                    <div
                      className={`h-full w-full ${
                        review.status === "approved"
                          ? "bg-brand-teal"
                          : review.status === "rejected"
                          ? "bg-rose-500"
                          : "bg-amber-400 animate-pulse"
                      }`}
                    />
                  </div>

                  <div className="flex items-start justify-between mb-3 pt-1">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full border border-slate-200 shadow-sm"
                        width={40}
                        height={40}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>{review.name}</span>
                          {review.verified && (
                            <span className="bg-[#4285F4]/10 text-[#4285F4] px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                              Verified Google User
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-400 font-light">{review.email}</p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Rating & Title */}
                  <div className="flex items-center space-x-2.5 mb-2.5">
                    <div className="flex items-center space-x-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "text-brand-gold fill-brand-gold"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-slate-800">{review.title}</span>
                    {review.treatmentType && (
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[10px] font-medium font-mono">
                        {review.treatmentType}
                      </span>
                    )}
                  </div>

                  {/* Text comment */}
                  <p className="text-xs text-slate-650 leading-relaxed italic bg-slate-50 rounded-xl p-3 border border-slate-100/50 mb-4">
                    "{review.reviewText}"
                  </p>

                  {/* Admin controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
                    <div className="flex space-x-1">
                      {review.status !== "approved" && (
                        <button
                          onClick={() => handleStatusUpdate(review.reviewId, "approved")}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors"
                        >
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusUpdate(review.reviewId, "rejected")}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-1.5">
                      {/* Pin button */}
                      <button
                        onClick={() => handleTogglePin(review.reviewId)}
                        className={`p-2 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center ${
                          review.isPinned
                            ? "bg-brand-gold/10 border-brand-gold text-brand-gold hover:bg-brand-gold/20"
                            : "bg-white hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800"
                        }`}
                        title={review.isPinned ? "Pinned review" : "Pin review"}
                      >
                        <Pin size={14} className={review.isPinned ? "fill-brand-gold" : ""} />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(review.reviewId)}
                        className="p-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors flex items-center justify-center"
                        title="Delete permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
              <span className="text-sm font-semibold mb-1">No Inquiries Found</span>
              <p className="text-xs max-w-xs text-slate-400">There are currently no patient inquiries/contact messages in the database.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.messageId}
                className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
                  message.status === "unread"
                    ? "border-brand-teal/40 bg-brand-teal/5"
                    : "border-slate-200"
                }`}
              >
                {/* Status Indicator */}
                <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                  <div
                    className={`h-full w-full ${
                      message.status === "unread"
                        ? "bg-brand-teal animate-pulse"
                        : "bg-slate-350"
                    }`}
                  />
                </div>

                <div className="flex items-start justify-between mb-3 pt-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>{message.name}</span>
                      {message.status === "unread" && (
                        <span className="bg-brand-teal/10 text-brand-teal px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                          New
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 font-light">{message.email}</p>
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(message.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                {/* Message Text */}
                <p className="text-xs text-slate-650 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100/50 mb-4 whitespace-pre-wrap">
                  {message.messageText}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex space-x-1">
                    {message.status === "unread" && (
                      <button
                        onClick={() => handleMarkMessageRead(message.messageId)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal text-xs font-semibold transition-colors"
                      >
                        <Check size={14} />
                        <span>Mark as Read</span>
                      </button>
                    )}
                    {message.status === "read" && (
                      <span className="text-xs text-slate-400 flex items-center space-x-1 font-semibold pl-1">
                        <Check size={14} className="text-emerald-500" />
                        <span>Read</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteMessage(message.messageId)}
                    className="p-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors flex items-center justify-center"
                    title="Delete inquiry permanently"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
