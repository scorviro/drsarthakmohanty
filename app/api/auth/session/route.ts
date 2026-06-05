import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signSession, isAdminEmail, verifySession } from "@/lib/auth";

// Decode base64url Google JWT payload natively
function decodeGoogleJwt(token: string) {
  try {
    const payloadBase64Url = token.split(".")[1];
    const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode Google ID Token:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credential, isDevMode, name, email, avatar, isCredentialsMode, password } = body;

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
      if (portalEmail && portalPassword && cleanEmail === portalEmail.trim().toLowerCase() && cleanPassword === portalPassword.trim()) {
        userProfile = {
          userId: "admin_mohitchudasama",
          name: "Dr. Sarthak Mohanty",
          email: cleanEmail,
          avatar: `https://ui-avatars.com/api/?name=Dr+Sarthak+Mohanty&background=00BFA5&color=fff&bold=true`,
          isAdmin: true,
        };
      } else {
        return NextResponse.json({ error: "Incorrect doctor email or portal password." }, { status: 401 });
      }
    } else if (isDevMode) {
      // Sandbox developer local login fallback
      if (!name || !email) {
        return NextResponse.json({ error: "Developer details missing" }, { status: 400 });
      }
      userProfile = {
        userId: "dev_" + Buffer.from(email).toString("base64").substring(0, 16),
        name,
        email: email.toLowerCase(),
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00BFA5&color=fff&bold=true`,
        isAdmin: isAdminEmail(email),
      };
    } else {
      // Production: Real Google ID Token
      if (!credential) {
        return NextResponse.json({ error: "Google credentials missing" }, { status: 400 });
      }

      const decoded = decodeGoogleJwt(credential);
      if (!decoded) {
        return NextResponse.json({ error: "Invalid Google ID Token." }, { status: 400 });
      }

      // Check token expiration
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        return NextResponse.json({ error: "Google ID Token has expired." }, { status: 400 });
      }

      // Verify Google issuer
      const validIssuers = ["accounts.google.com", "https://accounts.google.com"];
      if (!validIssuers.includes(decoded.iss)) {
        return NextResponse.json({ error: "Invalid token issuer." }, { status: 400 });
      }

      // Verify audience matches our Client ID
      const expectedAud = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
      if (decoded.aud !== expectedAud) {
        return NextResponse.json({ error: "Invalid token audience." }, { status: 400 });
      }

      userProfile = {
        userId: "g_" + decoded.sub,
        name: decoded.name || "Google User",
        email: (decoded.email || "").toLowerCase(),
        avatar: decoded.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.name)}&background=00BFA5&color=fff&bold=true`,
        isAdmin: isAdminEmail(decoded.email || ""),
      };
    }

    if (!userProfile.email) {
      return NextResponse.json({ error: "Failed to extract verified email from Google Account." }, { status: 400 });
    }

    // Sign the secure patient session token (JWT-like Base64 signature)
    const token = signSession(userProfile);

    const response = NextResponse.json({
      success: true,
      token,
      user: userProfile,
    });

    const isHttps = request.url.startsWith("https:") || process.env.NODE_ENV === "production";

    // Save session in HttpOnly secure cookie
    response.cookies.set("patient_session", token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
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
  const ngrokUrl = await detectNgrokUrl();
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
