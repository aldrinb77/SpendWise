export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ fallbackToLocal: true }, { status: 200 });
    }

    // Delete all records by filtering for non-null IDs (which effectively matches all records)
    const { error } = await supabase.from('transactions').delete().not('id', 'is', null);
    
    if (error) {
       console.error("Supabase ACE Delete Error:", error);
       throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ACE Delete Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
