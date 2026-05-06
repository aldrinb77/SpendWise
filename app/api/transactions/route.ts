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
      return NextResponse.json({ fallbackToLocal: true, mockData: { id: crypto.randomUUID(), ...data } }, { status: 201 });
    }

    // Resolve category_name to category_id
    let category_id = null;
    if (data.category_name) {
       const { data: catData, error: catError } = await supabase
         .from('categories')
         .select('id')
         .eq('name', data.category_name)
         .limit(1)
         .single();
         
       if (catData) category_id = catData.id;
    }

    // Strip category_name and prepare insertion data
    const { category_name, ...insertData } = data;
    if (category_id) {
       (insertData as any).category_id = category_id;
    }

    const { data: result, error } = await supabase.from('transactions').insert([insertData]).select().single();
    if (error) {
       console.error("Supabase Insertion Error:", error);
       throw error;
    }
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Transaction POST Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
