import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getDbValue, setDbValue } from "@/lib/db";
import staticContent from "@/data/websiteContent.json";

export async function GET() {
  try {
    const content = await getDbValue("website_content", staticContent);
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

    const body = await req.json();
    
    if (!body.translations) {
      return NextResponse.json({ error: "Invalid translations payload" }, { status: 400 });
    }

    await setDbValue("website_content", body);
    return NextResponse.json({ message: "Content updated successfully", translations: body.translations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
