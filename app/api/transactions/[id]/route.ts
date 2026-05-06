export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ success: true, fallbackToLocal: true });
    }

    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ success: true, fallbackToLocal: true, mockData: { id, ...data } });
    }

    // Resolve category_name to category_id
    let category_id = null;
    if (data.category_name) {
       const { data: catData } = await supabase
         .from('categories')
         .select('id')
         .eq('name', data.category_name)
         .limit(1)
         .single();
         
       if (catData) category_id = catData.id;
    }

    // Strip category_name and prepare update data
    const { category_name, ...updateData } = data;
    if (category_id) {
       (updateData as any).category_id = category_id;
    }

    const { data: result, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
       console.error("Supabase Update Error:", error);
       throw error;
    }
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PUT Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
