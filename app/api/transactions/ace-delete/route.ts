export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ fallbackToLocal: true }, { status: 200 });
    }

    // Delete all records (assuming no RLS or matching all)
    // Note: Supabase requires a filter for deletes. .neq('id', '0') will match all UUIDs.
    const { error } = await supabase.from('transactions').delete().neq('id', '0');
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
