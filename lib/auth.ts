import jwt from "jsonwebtoken";

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  iat?: number;
}

const getSecret = (): string => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured in environment variables.");
  }
  return secret;
};

// Sign a session token using standard HS256 JWT
export function signSession(user: Omit<UserSession, "iat">): string {
  const secret = getSecret();
  // Sign token with a 30-day expiration
  return jwt.sign(user, secret, { expiresIn: "30d" });
}

// Verify a session token using standard HS256 JWT
export function verifySession(token?: string): UserSession | null {
  if (!token) return null;
  try {
    const secret = getSecret();
    const decoded = jwt.verify(token, secret) as UserSession;
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Check if an email is registered as an Admin
export function isAdminEmail(email: string): boolean {
  const adminEmailsStr = process.env.ADMIN_EMAILS;
  if (!adminEmailsStr) return false;
  const admins = adminEmailsStr.split(",").map((e) => e.trim().toLowerCase());
  return admins.includes(email.toLowerCase());
}
