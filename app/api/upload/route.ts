import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getDbValue, setDbValue } from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

export async function POST(req: Request) {
  try {
    // Verify admin authentication
    const token = cookies().get("patient_session")?.value;
    const session = verifySession(token);
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    // Sanitize filename
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    
    const finalFilename = `${Date.now()}_${sanitizedName}`;

    // Get current gallery from database
    const photos = await getDbValue("media_gallery", []);
    
    const newPhoto = {
      filename: finalFilename,
      url: dataUrl,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
    };

    photos.unshift(newPhoto);
    await setDbValue("media_gallery", photos);

    return NextResponse.json({ 
      message: "File uploaded successfully", 
      url: dataUrl 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

