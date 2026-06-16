import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "websiteContent.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore if directory already exists
  }
}

export async function GET() {
  try {
    await ensureDataDir();
    let content = {};
    try {
      const data = await fs.readFile(CONTENT_FILE, "utf-8");
      content = JSON.parse(data);
    } catch (e) {
      // File doesn't exist yet, return empty object
      content = { translations: {} };
    }
    return NextResponse.json(content);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    // Verify admin authentication
    const token = cookies().get("patient_session")?.value;
    const session = verifySession(token);
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureDataDir();
    const body = await req.json();
    
    if (!body.translations) {
      return NextResponse.json({ error: "Invalid translations payload" }, { status: 400 });
    }

    await fs.writeFile(CONTENT_FILE, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ message: "Content updated successfully", translations: body.translations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
