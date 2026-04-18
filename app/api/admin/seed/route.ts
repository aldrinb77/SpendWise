export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { seedCategories } from "@/lib/db/seed";

// export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // @ts-ignore
    const db = process.env.DB as D1Database;
    await seedCategories(db);
    return NextResponse.json({ message: "Seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
