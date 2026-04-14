import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jwt";

// export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await decrypt(session);
    const userId = payload.userId;

    // @ts-ignore
    const db = process.env.DB as D1Database;

    if (!db || process.env.NODE_ENV === "development") {
      if (!db) {
         return NextResponse.json([
           { date: "10 Dec", income: 500, expense: 300 },
           { date: "12 Dec", income: 800, expense: 450 },
           { date: "14 Dec", income: 1200, expense: 600 },
           { date: "16 Dec", income: 900, expense: 800 },
           { date: "18 Dec", income: 1500, expense: 500 },
           { date: "20 Dec", income: 2000, expense: 700 },
           { date: "22 Dec", income: 1800, expense: 1200 }
         ]);
      }
    }

    const now = new Date();
    // Get last 7 days or current month days
    // Let's do daily totals for the last 14 days
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).getTime() / 1000;

    const { results } = await db
      .prepare(
        `SELECT date, type, SUM(amount) as total 
         FROM transactions 
         WHERE user_id = ? AND date >= ? 
         GROUP BY date, type 
         ORDER BY date ASC`
      )
      .bind(userId, fourteenDaysAgo)
      .all();

    // Format for Recharts
    const chartDataMap: Record<string, any> = {};
    
    (results as any[]).forEach(row => {
      const dateStr = new Date(row.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      if (!chartDataMap[dateStr]) {
        chartDataMap[dateStr] = { date: dateStr, income: 0, expense: 0 };
      }
      if (row.type === 'income') {
        chartDataMap[dateStr].income += row.total;
      } else {
        chartDataMap[dateStr].expense += row.total;
      }
    });

    return NextResponse.json(Object.values(chartDataMap));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
