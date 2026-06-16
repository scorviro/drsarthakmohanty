import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbReviews, upsertReview, Review } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { moderateReview } from "@/lib/moderation";
import { isRateLimited } from "@/lib/ratelimit";
import { logError } from "@/lib/logger";

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

    let reviews = await getDbReviews();

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
    logError("GET reviews error", error);
    return NextResponse.json({ error: "Failed to load reviews." }, { status: 500 });
  }
}

// POST: Add or edit a review (Requires authentication)
export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    if (await isRateLimited(ip, 5, 60 * 1000, "reviews")) {
      return NextResponse.json({ error: "Too many review submissions. Please wait a minute and try again." }, { status: 429 });
    }

    // 2. CSRF Protection is handled at the browser level via sameSite: strict session cookies.

    // 3. Parse body & check Bot prevention (simple honeypot check or simple captcha token check)
    const body = await request.json();
    const { name, rating, title, reviewText, treatmentType, botField } = body;

    // Honeypot bot prevention
    if (botField) {
      return NextResponse.json({ error: "Bot activity detected." }, { status: 400 });
    }

    let reviewerName = "";
    let reviewerEmail = "";
    let reviewerAvatar = "";
    let reviewerUserId = "anonymous";

    // 4. Resolve session if token exists
    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const cookieToken = cookies().get("patient_session")?.value;
    const token = bearerToken || cookieToken;

    if (token) {
      const session = verifySession(token);
      if (session) {
        reviewerName = session.name;
        reviewerEmail = session.email;
        reviewerAvatar = session.avatar;
        reviewerUserId = session.userId;
      }
    }

    // If not authenticated, require a name parameter in the request body
    if (!reviewerName) {
      if (!name || name.trim().length < 2) {
        return NextResponse.json({ error: "Patient name is required and must be at least 2 characters." }, { status: 400 });
      }
      reviewerName = sanitizeHtml(name.trim());
      reviewerEmail = "";
      reviewerAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=00BFA5&color=fff&bold=true`;
      reviewerUserId = "anonymous";
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
    const newReview = await upsertReview({
      userId: reviewerUserId,
      name: reviewerName,
      email: reviewerEmail,
      avatar: reviewerAvatar,
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
    logError("POST review error", error);
    return NextResponse.json({ error: "Failed to submit review due to system error." }, { status: 500 });
  }
}
