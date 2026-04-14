import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

// Remove edge runtime for Netlify compatibility
// export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
       // High quality mock data for dev
       const now = Math.floor(Date.now() / 1000);
       return NextResponse.json([
         // ... (keep current mock data)
         { 
           id: "1", 
           date: now - 3600, 
           description: "Hans Filling Station (Fuel)", 
           amount: 300, 
           type: "expense", 
           category_name: "Transportation", 
           category_color: "#60A5FA", 
           payment_method: "UPI" 
         },
         { 
           id: "2", 
           date: now - 86400, 
           description: "Swiggy (Food)", 
           amount: 205, 
           type: "expense", 
           category_name: "Food & Dining", 
           category_color: "#F87171", 
           payment_method: "UPI" 
         },
         { 
           id: "3", 
           date: now - 172800, 
           description: "Philip Michael (Salary)", 
           amount: 1000, 
           type: "income", 
           category_name: "Income", 
           category_color: "#10B981", 
           payment_method: "Transfer" 
         }
       ]);
    }

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
  } catch (error: any) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ id: crypto.randomUUID(), ...(data as Record<string, any>) }, { status: 201 });
    }

    const { data: result, error } = await supabase.from('transactions').insert([data]).select().single();
    if (error) throw error;
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
