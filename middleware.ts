import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import "@/lib/env";

function base64urlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padLen);
  const binaryStr = atob(padded);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

function decodeBase64urlToString(base64url: string): string {
  const bytes = base64urlToUint8Array(base64url);
  return new TextDecoder().decode(bytes);
}

async function verifySessionEdge(token: string | undefined): Promise<any | null> {
  if (!token) return null;
  try {
    const secretStr = process.env.SESSION_SECRET;
    if (!secretStr) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const keyData = encoder.encode(secretStr);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = base64urlToUint8Array(signatureB64);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      signatureBytes as any,
      data as any
    );

    if (!isValid) return null;

    const payloadJson = decodeBase64urlToString(payloadB64);
    const payload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Edge JWT verification failed:", err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/drsarthakkumarmohantylogin") && pathname !== "/drsarthakkumarmohantylogin/login") {
    const token = request.cookies.get("patient_session")?.value;
    const session = await verifySessionEdge(token);

    if (!session || !session.isAdmin) {
      return NextResponse.redirect(new URL("/drsarthakkumarmohantylogin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/drsarthakkumarmohantylogin", "/drsarthakkumarmohantylogin/:path*"],
};
