export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jwt";
import { getSupabase } from "@/lib/db/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await decrypt(session);
    const userId = payload.userId;

    const supabase = getSupabase();
    if (!supabase) {
       return NextResponse.json([
         // Mock categories
         { id: "1", name: "Food & Dining", icon: "pizza", color: "#F87171" },
         { id: "2", name: "Transportation", icon: "car", color: "#60A5FA" },
         { id: "3", name: "Shopping", icon: "shopping-bag", color: "#A78BFA" },
         { id: "4", name: "Income", icon: "landmark", color: "#34D399" },
         { id: "5", name: "Other", icon: "help-circle", color: "#9CA3AF" }
       ]);
    }

    // Get combined categories (default + user-specific)
    const { data: results, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .order('is_default', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get("session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await decrypt(session);
    const userId = payload.userId;

    const { name, icon, color } = await req.json() as any;

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ id: crypto.randomUUID(), name, icon, color }, { status: 201 });
    }

    const id = crypto.randomUUID();
    const { error } = await supabase
      .from('categories')
      .insert({ id, user_id: userId, name, icon, color, is_default: 0 });

    if (error) throw error;

    return NextResponse.json({ id, name, icon, color }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
