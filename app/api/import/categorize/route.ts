export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jwt";
import { autoCategorize } from "@/lib/categorization/engine";
import { getSupabase } from "@/lib/db/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await decrypt(session);
    const userId = payload.userId;

    const { transactions } = await req.json() as any;
    const supabase = getSupabase();

    const enrichedTransactions = await Promise.all(
      transactions.map(async (txn: any) => {
        let categoryId = txn.category_id;
        
        if (supabase) {
           categoryId = await autoCategorize(txn.description, userId, supabase) || categoryId;
        }

        return { ...txn, category_id: categoryId || undefined };
      })
    );

    return NextResponse.json(enrichedTransactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
