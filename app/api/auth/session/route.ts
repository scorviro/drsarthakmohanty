import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signSession, isAdminEmail, verifySession } from "@/lib/auth";
import { timingSafeEqual } from "crypto";
import { logError } from "@/lib/logger";

function compareStringsTimingSafe(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Perform a dummy comparison with equal length to maintain constant time
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, isCredentialsMode, password } = body;

    let userProfile = {
      userId: "",
      name: "",
      email: "",
      avatar: "",
      isAdmin: false,
    };

    if (isCredentialsMode) {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
      }
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const portalEmail = process.env.PORTAL_EMAIL;
      const portalPassword = process.env.PORTAL_PASSWORD;

      if (!portalEmail || !portalPassword) {
        return NextResponse.json({ error: "Portal authentication is not configured on the server." }, { status: 500 });
      }

      const emailMatch = compareStringsTimingSafe(cleanEmail, portalEmail.trim().toLowerCase());
      const passwordMatch = compareStringsTimingSafe(cleanPassword, portalPassword.trim());

      if (emailMatch && passwordMatch) {
        userProfile = {
          userId: "admin_mohitchudasama",
          name: "Dr. Sarthak Kumar Mohanty",
          email: cleanEmail,
          avatar: `https://ui-avatars.com/api/?name=Dr+Sarthak+Kumar+Mohanty&background=00BFA5&color=fff&bold=true`,
          isAdmin: true,
        };
      } else {
        return NextResponse.json({ error: "Incorrect doctor email or portal password." }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Unsupported sign-in method." }, { status: 400 });
    }

    if (!userProfile.email) {
      return NextResponse.json({ error: "Failed to extract verified email from profile." }, { status: 400 });
    }

    // Sign the secure patient session token (JWT-like Base64 signature)
    const token = signSession(userProfile);

    const response = NextResponse.json({
      success: true,
      user: userProfile,
    });

    const isHttps = request.url.startsWith("https:") || process.env.NODE_ENV === "production";

    // Save session in HttpOnly secure cookie
    response.cookies.set("patient_session", token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    logError("Session creation error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function detectNgrokUrl(): Promise<string | null> {
  if (process.env.NODE_ENV === "production") return null;
  try {
    const res = await fetch("http://127.0.0.1:4040/api/tunnels", {
      next: { revalidate: 0 }
    } as any);
    if (res.ok) {
      const data = await res.json();
      const tunnels = data.tunnels || [];
      const httpsTunnel = tunnels.find((t: any) => t.proto === "https" || t.public_url?.startsWith("https:"));
      if (httpsTunnel) {
        return httpsTunnel.public_url;
      }
    }
  } catch (e) {
    // Ngrok not running
  }
  return null;
}

// GET: Check active session status
export async function GET() {
  const ngrokUrl = process.env.NODE_ENV === "production" ? null : await detectNgrokUrl();
  try {
    const token = cookies().get("patient_session")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, detectedNgrokUrl: ngrokUrl });
    }

    const session = verifySession(token);

    if (!session) {
      return NextResponse.json({ authenticated: false, detectedNgrokUrl: ngrokUrl });
    }

    return NextResponse.json({
      authenticated: true,
      user: session,
      detectedNgrokUrl: ngrokUrl
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, detectedNgrokUrl: ngrokUrl });
  }
}

// DELETE: Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("patient_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
