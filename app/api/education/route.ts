import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { educationArticles as staticArticles } from "@/lib/educationData";

const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_FILE = path.join(DATA_DIR, "educationArticles.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore
  }
}

async function loadArticles() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(ARTICLES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    // Fallback to static articles and write them
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(staticArticles, null, 2), "utf-8");
    return staticArticles;
  }
}

async function saveArticles(articles: any[]) {
  await ensureDataDir();
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
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
    const body = await req.json();
    const articles = await loadArticles();

    if (!body.title || !body.category || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
    const body = await req.json();
    const articles = await loadArticles();

    if (!body.id) {
      return NextResponse.json({ error: "Article ID is required for editing" }, { status: 400 });
    }

    const index = articles.findIndex((a: any) => a.id === body.id);
    if (index === -index) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
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
