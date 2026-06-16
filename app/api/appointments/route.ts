import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbAppointments, insertAppointment, updateAppointmentStatusInDb, deleteAppointmentFromDb } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { isRateLimited } from "@/lib/ratelimit";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

// XSS Sanitizer Helper
function sanitizeHtml(str: string): string {
  if (!str) return "";
  let cleaned = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<[^>]*>/g, "");
  return cleaned
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Helper to authenticate admin session
function getAdminSession() {
  const token = cookies().get("patient_session")?.value;
  if (!token) return null;
  const session = verifySession(token);
  if (!session || !session.isAdmin) return null;
  return session;
}

// GET: Fetch all appointments (Admin only)
export async function GET(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const appointments = await getDbAppointments();
    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    logError("GET appointments error", error);
    return NextResponse.json({ error: "Failed to load appointments." }, { status: 500 });
  }
}

// POST: Patient books an appointment
export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    if (await isRateLimited(ip, 3, 60 * 1000, "appointments")) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute before submitting again." }, { status: 429 });
    }



    const body = await request.json();
    const { name, phone, date, timeSlot, botField } = body;

    // Honeypot bot prevention
    if (botField) {
      return NextResponse.json({ error: "Bot activity detected." }, { status: 400 });
    }

    // Input Validation
    if (!name || name.trim().length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Patient name must be between 2 and 100 characters." }, { status: 400 });
    }
    const phoneRegex = /^[0-9+\s-]{8,20}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date || !dateRegex.test(date)) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date value." }, { status: 400 });
    }
    if (selectedDate < today) {
      return NextResponse.json({ error: "Cannot schedule appointments in the past." }, { status: 400 });
    }
    if (timeSlot && (timeSlot.trim().length > 50 || timeSlot.trim().length < 2)) {
      return NextResponse.json({ error: "Invalid time slot format." }, { status: 400 });
    }

    // Sanitization
    const sanitizedName = sanitizeHtml(name);
    const sanitizedPhone = sanitizeHtml(phone);
    const sanitizedTimeSlot = timeSlot ? sanitizeHtml(timeSlot) : "";

    // Save to Database
    const newAppointment = await insertAppointment({
      name: sanitizedName,
      phone: sanitizedPhone,
      date,
      timeSlot: sanitizedTimeSlot,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your appointment booking request has been received. HCG Cancer Centre will contact you shortly to confirm.",
      data: newAppointment
    });
  } catch (error) {
    logError("POST appointment error", error);
    return NextResponse.json({ error: "Booking failed due to system error." }, { status: 500 });
  }
}

// PUT: Update appointment status (Admin only)
export async function PUT(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ error: "Appointment ID and Status are required." }, { status: 400 });
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const updated = await updateAppointmentStatusInDb(appointmentId, status);
    if (!updated) {
      return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    logError("PUT appointment error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Cancel/Delete appointment (Admin only)
export async function DELETE(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("appointmentId");

    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID is required." }, { status: 400 });
    }

    const success = await deleteAppointmentFromDb(appointmentId);
    if (!success) {
      return NextResponse.json({ error: "Appointment not found or could not be deleted." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("DELETE appointment error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
