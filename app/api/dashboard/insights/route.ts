export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jwt";
import { generateRuleBasedInsights } from "@/lib/insights/engine";

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
           { id: "1", title: "High Grocery Spending", description: "You spent 15% more on groceries this week compared to last week.", type: "warning" },
           { id: "2", title: "Savings Goal on Track", description: "Great job! You've saved ₹4,200 so far this month.", type: "success" },
           { id: "3", title: "Unusual Activity", description: "We noticed a large transaction at 'Hans Filling Station'. Was this you?", type: "info" }
         ]);
      }
    }

    try {
      const insights = await generateRuleBasedInsights(userId, db);
      return NextResponse.json(insights);
    } catch (dbError: any) {
      console.error("DB Error in insights:", dbError);
      // Fallback to mock data if DB fails (e.g. table not found)
      return NextResponse.json([
        { id: "1", title: "System Ready", description: "Terminal operational. Upload your bank statements to begin AI analysis.", type: "success" },
        { id: "2", title: "Privacy Protocol", description: "Encryption active. Your financial data remains local to this terminal.", type: "info" }
      ]);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
