export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jwt";
import { getSupabase } from "@/lib/db/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await decrypt(session);
    const userId = payload.userId;

    const { transactions } = await req.json() as any;
    
    const supabase = getSupabase();
    if (!supabase) {
      // Simulate successful save in mock dev environment
      return NextResponse.json({ success: true, count: transactions.length, mock: true });
    }

    const now = Math.floor(Date.now() / 1000);
    
    // Prepare batch statements
    const rowsToInsert = transactions.map((txn: any) => ({
      id: crypto.randomUUID(),
      user_id: userId,
      date: Math.floor(new Date(txn.date).getTime() / 1000),
      amount: txn.amount,
      type: txn.type,
      category_id: txn.category_id || null,
      description: txn.description || null,
      created_at: now,
      updated_at: now
    }));

    const { error } = await supabase.from('transactions').insert(rowsToInsert);

    if (error) throw error;

    return NextResponse.json({ success: true, count: transactions.length });
  } catch (error: any) {
    console.error("Bulk save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
