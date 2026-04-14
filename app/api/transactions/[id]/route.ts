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
      return NextResponse.json({ success: true, fallbackToLocal: true, mockData: { id, ...(data as any) } });
    }

    const { data: result, error } = await supabase
      .from('transactions')
      .update(data as any)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
