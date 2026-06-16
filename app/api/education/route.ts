import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getDbArticles as loadArticles, saveDbArticles as saveArticles } from "@/lib/db";

function isValidImageUrl(url: string): boolean {
  if (!url) return true;
  if (url.startsWith("/") || url.startsWith("./")) {
    return !url.includes("javascript:") && !url.includes("..");
  }
  if (url.startsWith("data:image/")) {
    return true;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch (e) {
    return false;
  }
}

export async function GET() {
  try {
    const articles = await loadArticles();
    return NextResponse.json({ articles });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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

    const body = await req.json();
    const articles = await loadArticles();

    if (!body.title || !body.category || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (body.image && !isValidImageUrl(body.image)) {
      return NextResponse.json({ error: "Invalid image URL. Only local uploads or trusted external domains are allowed." }, { status: 400 });
    }

    const newArticle = {
      id: `art-${Date.now()}`,
      slug: body.slug || body.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: body.title,
      summary: body.summary || { en: "", hi: "", gu: "" },
      content: body.content,
      category: body.category,
      readTime: Number(body.readTime) || 3,
      image: body.image || "/favicon.svg",
      trending: Boolean(body.trending),
    };

    articles.unshift(newArticle);
    await saveArticles(articles);

    return NextResponse.json({ message: "Article created successfully", article: newArticle });
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
    const articles = await loadArticles();

    if (!body.id) {
      return NextResponse.json({ error: "Article ID is required for editing" }, { status: 400 });
    }

    const index = articles.findIndex((a: any) => a.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (body.image && !isValidImageUrl(body.image)) {
      return NextResponse.json({ error: "Invalid image URL. Only local uploads or trusted external domains are allowed." }, { status: 400 });
    }

    const updatedArticle = {
      ...articles[index],
      title: body.title || articles[index].title,
      slug: body.slug || articles[index].slug,
      summary: body.summary || articles[index].summary,
      content: body.content || articles[index].content,
      category: body.category || articles[index].category,
      readTime: body.readTime !== undefined ? Number(body.readTime) : articles[index].readTime,
      image: body.image !== undefined ? body.image : articles[index].image,
      trending: body.trending !== undefined ? Boolean(body.trending) : articles[index].trending,
    };

    articles[index] = updatedArticle;
    await saveArticles(articles);

    return NextResponse.json({ message: "Article updated successfully", article: updatedArticle });
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    let articles = await loadArticles();
    const originalLength = articles.length;
    articles = articles.filter((a: any) => a.id !== id);

    if (articles.length === originalLength) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await saveArticles(articles);
    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
