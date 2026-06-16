import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    // Ignore
  }
}

export async function POST(req: Request) {
  try {
    // Verify admin authentication
    const token = cookies().get("patient_session")?.value;
    const session = verifySession(token);
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureUploadDir();
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file format." }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds the 5MB limit." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    
    // Prefix with timestamp to avoid duplicates
    const finalFilename = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(UPLOAD_DIR, finalFilename);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      message: "File uploaded successfully", 
      url: `/uploads/${finalFilename}` 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
