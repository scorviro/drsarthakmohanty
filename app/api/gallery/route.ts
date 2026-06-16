import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getDbValue, setDbValue } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const photos = await getDbValue("media_gallery", []);
    
    // Sort by uploadedAt descending
    photos.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({ photos });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Verify admin authentication
    const token = cookies().get("patient_session")?.value;
    const session = verifySession(token);
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    let photos = await getDbValue("media_gallery", []);
    const originalLength = photos.length;
    photos = photos.filter((p: any) => p.filename !== filename);

    if (photos.length === originalLength) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    await setDbValue("media_gallery", photos);
    return NextResponse.json({ message: "Photo deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

