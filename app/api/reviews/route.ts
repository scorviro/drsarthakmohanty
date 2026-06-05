import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbReviews, upsertReview, Review } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { moderateReview } from "@/lib/moderation";

// In-memory sliding window rate limiter cache
const ipCache = new Map<string, number[]>();

function isRateLimited(ip: string, limit = 5, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = ipCache.get(ip) || [];
  const activeTimestamps = timestamps.filter((t) => now - t < windowMs);
  
  if (activeTimestamps.length >= limit) {
    return true;
  }
  
  activeTimestamps.push(now);
  ipCache.set(ip, activeTimestamps);
  return false;
}

// XSS Sanitizer Helper
function sanitizeHtml(str: string): string {
  if (!str) return "";
  // Strip script tags
  let cleaned = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  // Strip all other HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, "");
  // Escaping characters to prevent injection
  return cleaned
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// GET: Fetch reviews
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdminMode = searchParams.get("admin") === "true";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    let reviews = getDbReviews();

    // Session validation if in admin mode
    if (isAdminMode) {
      const token = cookies().get("patient_session")?.value;
      const session = verifySession(token);

      if (!session || !session.isAdmin) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
      // Admins see all reviews
    } else {
      // Normal visitors only see approved reviews
      reviews = reviews.filter((r) => r.status === "approved");
    }

    // Sort: Pinned reviews first, then by date descending
    reviews.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const totalReviews = reviews.length;
    const startIndex = (page - 1) * limit;
    const paginatedReviews = reviews.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      reviews: paginatedReviews,
      total: totalReviews,
      page,
      limit,
      totalPages: Math.ceil(totalReviews / limit),
    });
  } catch (error) {
    console.error("GET reviews error:", error);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

// POST: Add or edit a review (Requires authentication)
export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    if (isRateLimited(ip, 5, 60 * 1000)) {
      return NextResponse.json({ error: "Too many review submissions. Please wait a minute and try again." }, { status: 429 });
    }

    // 2. CSRF Protection
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const expectedOrigin = `${protocol}://${host}`;
    const secureAuthOrigin = process.env.NEXT_PUBLIC_SECURE_AUTH_ORIGIN || "";

    if (origin && origin !== expectedOrigin && (!secureAuthOrigin || origin !== secureAuthOrigin)) {
      return NextResponse.json({ error: "CSRF verification failed." }, { status: 403 });
    }

    // 3. Get token from Authorization header (primary) or cookie (fallback)
    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const cookieToken = cookies().get("patient_session")?.value;
    const token = bearerToken || cookieToken;

    if (!token) {
      return NextResponse.json({ error: "Google Sign-In is required to submit a review." }, { status: 401 });
    }

    const session = verifySession(token);

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired session. Please sign in again." }, { status: 401 });
    }

    // 4. Parse body & check Bot prevention (simple honeypot check or simple captcha token check)
    const body = await request.json();
    const { rating, title, reviewText, treatmentType, botField } = body;

    // Honeypot bot prevention
    if (botField) {
      return NextResponse.json({ error: "Bot activity detected." }, { status: 400 });
    }

    // 5. XSS Sanitization & Form Validation
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
    }

    const sanitizedTitle = sanitizeHtml(title || "");
    const sanitizedReviewText = sanitizeHtml(reviewText || "");

    // 6. Auto-Moderation check
    const moderation = moderateReview(sanitizedTitle, sanitizedReviewText);
    if (!moderation.isValid) {
      return NextResponse.json({ error: moderation.reason }, { status: 400 });
    }

    // Check if moderation flagged profanity (cleanedTitle & cleanedText will be different)
    const finalTitle = moderation.cleanedTitle || sanitizedTitle;
    const finalReviewText = moderation.cleanedText || sanitizedReviewText;
    
    // Profanity drops the review into pending for review, otherwise approved
    const isClean = finalTitle === sanitizedTitle && finalReviewText === sanitizedReviewText;
    const initialStatus = isClean ? "approved" : "pending";

    // 7. Upsert review
    const newReview = upsertReview({
      userId: session.userId,
      name: session.name,
      email: session.email,
      avatar: session.avatar,
      rating: ratingNum,
      title: finalTitle,
      treatmentType: treatmentType || "",
      reviewText: finalReviewText,
      status: initialStatus,
    });

    return NextResponse.json({
      success: true,
      review: newReview,
      moderated: !isClean,
      message: isClean 
        ? "Thank you! Your review has been submitted successfully." 
        : "Your review contains filtered words and has been sent to our team for approval."
    });
  } catch (error) {
    console.error("POST review error:", error);
    return NextResponse.json({ error: "Failed to submit review due to system error." }, { status: 500 });
  }
}
