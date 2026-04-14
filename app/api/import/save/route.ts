import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jwt";

// export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await decrypt(session);
    const userId = payload.userId;

    const { transactions } = await req.json() as any;
    
    // @ts-ignore
    const db = process.env.DB as D1Database;

    const now = Math.floor(Date.now() / 1000);
    
    // Prepare batch statements
    const statements = transactions.map((txn: any) => {
      const id = crypto.randomUUID();
      const txnDate = Math.floor(new Date(txn.date).getTime() / 1000);
      
      return db
        .prepare(
          "INSERT INTO transactions (id, user_id, date, amount, type, category_id, description, created_at, updated_at) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(
          id,
          userId,
          txnDate,
          txn.amount,
          txn.type,
          txn.category_id,
          txn.description || null,
          now,
          now
        );
    });

    await db.batch(statements);

    return NextResponse.json({ success: true, count: transactions.length });
  } catch (error: any) {
    console.error("Bulk save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
