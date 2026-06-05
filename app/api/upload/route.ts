import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    // Ignore
  }
}

export async function POST(req: Request) {
  try {
    await ensureUploadDir();
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
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
