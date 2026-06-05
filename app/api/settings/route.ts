import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbSettings, saveDbSettings } from "@/lib/db";
import { verifySession } from "@/lib/auth";

// Helper to authenticate admin session
function getAdminSession() {
  const token = cookies().get("patient_session")?.value;
  if (!token) return null;
  const session = verifySession(token);
  if (!session || !session.isAdmin) return null;
  return session;
}

// GET: Fetch current system settings (Public)
export async function GET(request: Request) {
  try {
    const settings = getDbSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Failed to load system settings." }, { status: 500 });
  }
}

// PUT: Update system settings (Admin only)
export async function PUT(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const body = await request.json();
    const { isBookingEnabled, contactPhone, clinicTimings, showReviews } = body;

    // Build sanitization / validation
    const currentSettings = getDbSettings();
    const updatedSettings = {
      isBookingEnabled: typeof isBookingEnabled === "boolean" ? isBookingEnabled : currentSettings.isBookingEnabled,
      contactPhone: contactPhone ? String(contactPhone).trim() : currentSettings.contactPhone,
      clinicTimings: clinicTimings ? String(clinicTimings).trim() : currentSettings.clinicTimings,
      showReviews: typeof showReviews === "boolean" ? showReviews : currentSettings.showReviews,
    };

    const success = saveDbSettings(updatedSettings);
    if (!success) {
      return NextResponse.json({ error: "Failed to write settings to database." }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
