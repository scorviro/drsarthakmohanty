import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbAppointments, insertAppointment, updateAppointmentStatusInDb, deleteAppointmentFromDb } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { isRateLimited } from "@/lib/ratelimit";

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
    console.error("GET appointments error:", error);
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

    // 2. CSRF Protection
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const expectedOrigin = `${protocol}://${host}`;
    if (origin && origin !== expectedOrigin) {
      return NextResponse.json({ error: "CSRF verification failed." }, { status: 403 });
    }

    const body = await request.json();
    const { name, phone, date, timeSlot, botField } = body;

    // Honeypot bot prevention
    if (botField) {
      return NextResponse.json({ error: "Bot activity detected." }, { status: 400 });
    }

    // Input Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Patient name must be at least 2 characters." }, { status: 400 });
    }
    const phoneRegex = /^[0-9+\s-]{8,20}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Appointment date is required." }, { status: 400 });
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
    console.error("POST appointment error:", error);
    return NextResponse.json({ error: "Failed to submit booking due to system error." }, { status: 500 });
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
    console.error("PUT appointment error:", error);
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
    console.error("DELETE appointment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
