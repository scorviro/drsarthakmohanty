import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDbMessages, insertMessage, deleteMessageFromDb, markMessageReadInDb } from "@/lib/db";
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

// GET: Fetch all messages (Admin only)
export async function GET(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const messages = await getDbMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ error: "Failed to load messages." }, { status: 500 });
  }
}

// POST: Patient sends a contact form inquiry
export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    if (await isRateLimited(ip, 3, 60 * 1000, "contact")) {
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
    const { name, email, message, botField } = body;

    // Honeypot bot prevention
    if (botField) {
      return NextResponse.json({ error: "Bot activity detected." }, { status: 400 });
    }

    // Input Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    // Sanitization
    const sanitizedName = sanitizeHtml(name);
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedMessage = sanitizeHtml(message);

    // Save to Database
    const newMessage = await insertMessage({
      name: sanitizedName,
      email: sanitizedEmail,
      messageText: sanitizedMessage,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent successfully. We will get back to you soon.",
      data: newMessage
    });
  } catch (error) {
    console.error("POST message error:", error);
    return NextResponse.json({ error: "Failed to send message due to system error." }, { status: 500 });
  }
}

// PUT: Mark message as read (Admin only)
export async function PUT(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const body = await request.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    }

    const updated = await markMessageReadInDb(messageId);
    if (!updated) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    console.error("PUT message error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete message (Admin only)
export async function DELETE(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json({ error: "Message ID is required." }, { status: 400 });
    }

    const success = await deleteMessageFromDb(messageId);
    if (!success) {
      return NextResponse.json({ error: "Message not found or could not be deleted." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE message error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
