export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
       return NextResponse.json({ fallbackToLocal: true, transactions: [] });
    }

    const { data, error } = await supabase
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

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json([]); // Return empty array instead of mock data
    }

    return NextResponse.json(data.map((t: any) => ({
      ...t,
      category_name: t.categories?.name,
      category_icon: t.categories?.icon,
      category_color: t.categories?.color,
    })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = getSupabase();
    
    if (!supabase) {
      // In development/test with no Supabase, allow LocalStorage persistence via client response
      return NextResponse.json({ fallbackToLocal: true, mockData: { id: crypto.randomUUID(), ...(data as Record<string, any>) } }, { status: 201 });
    }

    const { data: result, error } = await supabase.from('transactions').insert([data]).select().single();
    if (error) throw error;
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
