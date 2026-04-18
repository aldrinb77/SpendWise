export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

// export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ fallbackToLocal: true });
    }

    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).getTime() / 1000;

    try {
      const { data: txns, error } = await supabase
        .from('transactions')
        .select('date, type, amount')
        .gte('date', fourteenDaysAgo)
        .order('date', { ascending: true });

      if (error) throw error;

      const chartDataMap: Record<string, any> = {};
      
      txns.forEach((row: any) => {
        const dateStr = new Date(row.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        if (!chartDataMap[dateStr]) {
          chartDataMap[dateStr] = { date: dateStr, income: 0, expense: 0 };
        }
        if (row.type === 'income') {
          chartDataMap[dateStr].income += Number(row.amount);
        } else {
          chartDataMap[dateStr].expense += Number(row.amount);
        }
      });

      return NextResponse.json(Object.values(chartDataMap));
    } catch (dbError) {
       console.error("Supabase Error in chart:", dbError);
       return NextResponse.json({ fallbackToLocal: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
