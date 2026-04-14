import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/supabase";

// Remove edge runtime for Netlify compatibility
// export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // For Netlify/Supabase, we usually get the user from the headers or token
    // For now, I'll allow a mock user if Supabase isn't configured for easy testing
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
       // Mock data for dev if no Supabase
       return NextResponse.json([
         { id: "1", date: new Date().toISOString(), description: "Netlify Demo Txn", amount: 100, type: "expense", category_name: "Other" }
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

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Flatten the categories relationship
    const results = data.map((t: any) => ({
      ...t,
      category_name: t.categories?.name,
      category_icon: t.categories?.icon,
      category_color: t.categories?.color,
    }));

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ id: "mock-id", ...data }, { status: 201 });
    }

    const { data: result, error } = await supabase
      .from('transactions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Supabase POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
