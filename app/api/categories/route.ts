import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jwt";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await decrypt(session);
    const userId = payload.userId;

    // @ts-ignore
    const db = process.env.DB as D1Database;

    // Get combined categories (default + user-specific)
    const { results } = await db
      .prepare(
        "SELECT * FROM categories WHERE user_id IS NULL OR user_id = ? ORDER BY is_default DESC, sort_order ASC, name ASC"
      )
      .bind(userId)
      .all();

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await decrypt(session);
    const userId = payload.userId;

    const { name, icon, color } = await req.json() as any;

    // @ts-ignore
    const db = process.env.DB as D1Database;

    const id = crypto.randomUUID();
    await db
      .prepare(
        "INSERT INTO categories (id, user_id, name, icon, color, is_default) VALUES (?, ?, ?, ?, ?, 0)"
      )
      .bind(id, userId, name, icon, color)
      .run();

    return NextResponse.json({ id, name, icon, color }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
