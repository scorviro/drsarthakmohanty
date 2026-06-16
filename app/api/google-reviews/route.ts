import { NextResponse } from "next/server";
import crypto from "crypto";

export const revalidate = 3600;

function parseRelativeTime(timeStr: string): number {
  const now = Date.now();
  const lower = timeStr.toLowerCase();
  if (lower.includes("second") || lower.includes("minute") || lower.includes("hour")) {
    return now;
  }
  if (lower.includes("day")) {
    const match = lower.match(/\d+/);
    const count = match ? parseInt(match[0]) : 1;
    return now - count * 86400000;
  }
  if (lower.includes("week")) {
    const match = lower.match(/\d+/);
    const count = match ? parseInt(match[0]) : 1;
    return now - count * 86400000 * 7;
  }
  if (lower.includes("month")) {
    const match = lower.match(/\d+/);
    const count = match ? parseInt(match[0]) : 1;
    return now - count * 86400000 * 30;
  }
  if (lower.includes("year")) {
    const match = lower.match(/\d+/);
    const count = match ? parseInt(match[0]) : 1;
    return now - count * 86400000 * 365;
  }
  return now;
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json(
      { 
        error: "Google Places API configuration missing",
        details: "Please configure GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in env."
      },
      { status: 400 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: `Google Places API returned status: ${data.status}`, details: data.error_message },
        { status: 500 }
      );
    }

    const reviews = data.result.reviews || [];
    const rating = data.result.rating || 4.8;
    const totalReviews = data.result.user_ratings_total || 34;

    // Map to a clean, uniform format
    const formattedReviews = reviews.map((r: any) => ({
      id: r.time.toString() + crypto.randomBytes(4).toString("hex"),
      author: r.author_name,
      rating: r.rating,
      time: r.relative_time_description,
      text: r.text,
      avatar: r.profile_photo_url,
      timestamp: parseRelativeTime(r.relative_time_description)
    }));

    // Read local reviews to merge and show more than 5 reviews
    const fs = require("fs/promises");
    const path = require("path");
    const jsonPath = path.join(process.cwd(), "data", "googleReviews.json");
    let localReviews = [];
    try {
      const jsonContent = await fs.readFile(jsonPath, "utf-8");
      localReviews = JSON.parse(jsonContent);
    } catch (e) {
      console.error("Failed to read local googleReviews.json", e);
    }

    // Auto-save new reviews to local JSON database to prevent losing them when pushed out of Google's top 5
    let localUpdated = false;
    formattedReviews.forEach((fr: any) => {
      const existsInLocal = localReviews.some(
        (lr: any) => lr.author.toLowerCase().trim() === fr.author.toLowerCase().trim()
      );
      if (!existsInLocal) {
        localReviews.unshift({
          id: `gr-${Date.now()}-${crypto.randomBytes(2).toString("hex")}`,
          author: fr.author,
          rating: fr.rating,
          time: fr.time,
          text: fr.text,
          avatar: fr.avatar || ""
        });
        localUpdated = true;
      }
    });

    if (localUpdated) {
      try {
        await fs.writeFile(jsonPath, JSON.stringify(localReviews, null, 2), "utf-8");
      } catch (err) {
        console.error("Failed to auto-save new reviews to googleReviews.json", err);
      }
    }

    const combinedReviews = [...formattedReviews];
    localReviews.forEach((lr: any) => {
      const exists = combinedReviews.some(
        (cr: any) => cr.author.toLowerCase().trim() === lr.author.toLowerCase().trim()
      );
      if (!exists) {
        combinedReviews.push({
          id: lr.id || `gr-fallback-${crypto.randomBytes(4).toString("hex")}`,
          author: lr.author,
          rating: lr.rating,
          time: lr.time,
          text: lr.text,
          avatar: lr.avatar || "",
          timestamp: lr.time ? parseRelativeTime(lr.time) : Date.now() - 365 * 86400000
        });
      }
    });

    // Sort combined reviews: newest to oldest
    combinedReviews.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      reviews: combinedReviews,
      rating,
      totalReviews
    });
  } catch (error: any) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch Google reviews", details: error.message },
      { status: 500 }
    );
  }
}
