import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/supabase";

export async function GET(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        balance: 1450,
        monthlyIncome: 1116,
        incomeTrend: 12.5,
        monthlyExpense: 704,
        expenseTrend: -5.2,
        savings: 412,
        savingsRate: 36.9
      });
    }

    // Get basic stats from Supabase
    const { data: txns, error } = await supabase
      .from('transactions')
      .select('amount, type, date');

    if (error) throw error;

    const totalIncome = txns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalExpense = txns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return NextResponse.json({
      balance: totalIncome - totalExpense,
      monthlyIncome: totalIncome, // Simple mock for total instead of monthly for now
      incomeTrend: 0,
      monthlyExpense: totalExpense,
      expenseTrend: 0,
      savings: totalIncome - totalExpense,
      savingsRate: totalIncome === 0 ? 0 : ((totalIncome - totalExpense) / totalIncome) * 100
    });
  } catch (error: any) {
    console.error("Summary error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
