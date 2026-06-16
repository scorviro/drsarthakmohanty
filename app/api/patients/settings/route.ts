import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { verifySession } from "@/lib/auth";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const PATIENT_SETTINGS_FILE = path.join(DATA_DIR, "patientSettings.json");

const DEFAULT_ENABLED_FIELDS = ["name", "phone", "diseaseType", "dateOfVisit"];

// Helper to ensure settings file exists
async function getPatientSettings(): Promise<string[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await fs.readFile(PATIENT_SETTINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    try {
      await fs.writeFile(PATIENT_SETTINGS_FILE, JSON.stringify(DEFAULT_ENABLED_FIELDS, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to initialize patient settings file:", err);
    }
    return DEFAULT_ENABLED_FIELDS;
  }
}

// Helper to authenticate admin session
function getAdminSession() {
  const token = cookies().get("patient_session")?.value;
  if (!token) return null;
  const session = verifySession(token);
  if (!session || !session.isAdmin) return null;
  return session;
}

// GET: Fetch currently enabled fields
export async function GET() {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const enabledFields = await getPatientSettings();
    return NextResponse.json({ success: true, enabledFields });
  } catch (error) {
    logError("GET patient settings error", error);
    return NextResponse.json({ error: "Failed to load patient fields settings." }, { status: 500 });
  }
}

// PUT: Save enabled fields (Admin only)
export async function PUT(request: Request) {
  try {
    const session = getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin access." }, { status: 401 });
    }

    const body = await request.json();
    const { enabledFields } = body;
    if (!Array.isArray(enabledFields)) {
      return NextResponse.json({ error: "Invalid fields format." }, { status: 400 });
    }

    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(PATIENT_SETTINGS_FILE, JSON.stringify(enabledFields, null, 2), "utf-8");

    return NextResponse.json({ success: true, enabledFields });
  } catch (error) {
    logError("PUT patient settings error", error);
    return NextResponse.json({ error: "Failed to save patient fields settings." }, { status: 500 });
  }
}
