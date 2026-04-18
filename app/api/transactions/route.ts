export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

// Remove edge runtime for Netlify compatibility
// // export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
       // Instruct client to fall back to LocalStorage
       return NextResponse.json({ fallbackToLocal: true, transactions: [] });
    }

    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          categories (
            name,
            icon,
            color
          )
        `)
        .order('date', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return NextResponse.json(data.map((t: any) => ({
        ...t,
        category_name: t.categories?.name,
        category_icon: t.categories?.icon,
        category_color: t.categories?.color,
      })));
    } catch (dbError) {
      console.error("Supabase Error in transactions:", dbError);
      
      const now = Math.floor(Date.now() / 1000);
      const mockTxns = [
        { id: "m1", description: "Apple Services", amount: 649, type: "expense", date: now - 3600, category_name: "Entertainment", category_color: "#ef4444", payment_method: "Subscription" },
        { id: "m2", description: "HDFC Salary Credit", amount: 52000, type: "income", date: now - 86400, category_name: "Income", category_color: "#10b981", payment_method: "Bank Transfer" },
        { id: "m3", description: "Zomato Limited", amount: 450, type: "expense", date: now - 172800, category_name: "Food", category_color: "#f97316", payment_method: "UPI" },
        { id: "m4", description: "Starbucks India", amount: 320, type: "expense", date: now - 259200, category_name: "Food", category_color: "#f97316", payment_method: "Card" },
        { id: "m5", description: "Uber India", amount: 185, type: "expense", date: now - 345600, category_name: "Transport", category_color: "#3b82f6", payment_method: "UPI" },
        { id: "m6", description: "Amazon.in", amount: 1290, type: "expense", date: now - 432000, category_name: "Shopping", category_color: "#a855f7", payment_method: "Card" },
        { id: "m7", description: "Jio Fiber", amount: 849, type: "expense", date: now - 518400, category_name: "Utilities", category_color: "#eab308", payment_method: "AutoPay" },
      ];
      return NextResponse.json(mockTxns);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ fallbackToLocal: true, mockData: { id: crypto.randomUUID(), ...(data as Record<string, any>) } }, { status: 201 });
    }

    const { data: result, error } = await supabase.from('transactions').insert([data]).select().single();
    if (error) throw error;
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
