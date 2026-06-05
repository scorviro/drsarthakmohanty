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

export async function GET() {
  try {
    await ensureUploadDir();
    const files = await fs.readdir(UPLOAD_DIR);
    
    const photos = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(UPLOAD_DIR, file);
        const stats = await fs.stat(filePath);
        return {
          filename: file,
          url: `/uploads/${file}`,
          sizeBytes: stats.size,
          uploadedAt: stats.mtime,
        };
      })
    );

    // Sort by uploadedAt descending
    photos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

    return NextResponse.json({ photos });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Security check to avoid path traversal (e.g. filename = ../../../etc/passwd)
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(UPLOAD_DIR, sanitizedFilename);

    try {
      await fs.unlink(filePath);
      return NextResponse.json({ message: "Photo deleted successfully" });
    } catch (e) {
      return NextResponse.json({ error: "File not found or cannot be deleted" }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
