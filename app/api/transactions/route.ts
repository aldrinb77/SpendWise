export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
       return NextResponse.json({ fallbackToLocal: true, transactions: [] });
    }

    // Fetch transactions without the broken relational join
    const { data: txns, error: txnsError } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (txnsError) {
      console.error("Supabase Transaction Fetch Error:", txnsError);
      return NextResponse.json([]);
    }

    // Fetch categories to manually join
    const { data: cats } = await supabase.from('categories').select('*');
    const catMap = new Map();
    if (cats) {
       cats.forEach(c => catMap.set(c.id, c));
    }

    // Map the category details manually
    const enrichedData = txns.map((t: any) => {
       const category = catMap.get(t.category_id);
       return {
         ...t,
         category_name: category ? category.name : (t.category_name || "Uncategorized"),
         category_icon: category ? category.icon : null,
         category_color: category ? category.color : null,
       };
    });

    return NextResponse.json(enrichedData);
  } catch (error: any) {
    console.error("GET transactions Exception:", error);
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
