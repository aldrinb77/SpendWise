import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      return NextResponse.json({ fallbackToLocal: true });
    }

    // Supabase logic (keep for when user configures project)
    const { data: txns, error } = await supabase.from('transactions').select('amount, type');
    if (error) throw error;

    const income = txns.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + Number(t.amount), 0);
    const expense = txns.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    return NextResponse.json({
      balance: income - expense,
      monthlyIncome: income,
      incomeTrend: 0,
      monthlyExpense: expense,
      expenseTrend: 0,
      savings: income - expense,
      savingsRate: income === 0 ? 0 : ((income - expense) / income) * 100
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
