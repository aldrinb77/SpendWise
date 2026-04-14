export interface Insight {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  description: string;
}

export async function generateRuleBasedInsights(
  userId: string,
  // @ts-ignore
  db: D1Database
): Promise<Insight[]> {
  const insights: Insight[] = [];
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000;
  const lastMonthFirstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime() / 1000;

  // 1. Fetch category totals for this month and last month
  const categoryTotals = await db
    .prepare(
      `SELECT c.name, SUM(t.amount) as total 
       FROM transactions t 
       JOIN categories c ON t.category_id = c.id 
       WHERE t.user_id = ? AND t.type = 'expense' AND t.date >= ? 
       GROUP BY c.id`
    )
    .bind(userId, firstDayOfMonth)
    .all();

  const lastMonthTotals = await db
    .prepare(
      `SELECT c.name, SUM(t.amount) as total 
       FROM transactions t 
       JOIN categories c ON t.category_id = c.id 
       WHERE t.user_id = ? AND t.type = 'expense' AND t.date >= ? AND t.date < ? 
       GROUP BY c.id`
    )
    .bind(userId, lastMonthFirstDay, firstDayOfMonth)
    .all();

  const currentTotal = (categoryTotals.results as any[]).reduce((acc, curr) => acc + curr.total, 0);

  // Insight: High spending categories (>30% of total)
  for (const cat of (categoryTotals.results as any[])) {
    if (cat.total > currentTotal * 0.3 && currentTotal > 1000) {
      insights.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: `High ${cat.name} Spending`,
        description: `Your spending on ${cat.name} accounts for ${Math.round((cat.total / currentTotal) * 100)}% of your total expenses this month.`
      });
    }
  }

  // Insight: Category increases vs last month
  for (const cat of (categoryTotals.results as any[])) {
    const lastMonthCat = (lastMonthTotals.results as any[]).find(l => l.name === cat.name);
    if (lastMonthCat && cat.total > lastMonthCat.total * 1.2) {
       insights.push({
        id: crypto.randomUUID(),
        type: "info",
        title: `${cat.name} is on the rise`,
        description: `You've spent ₹${Math.round(cat.total - lastMonthCat.total)} more on ${cat.name} compared to last month.`
      });
    }
  }

  // Insight: Savings Rate
  const incomeResult = await db
    .prepare("SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = 'income' AND date >= ?")
    .bind(userId, firstDayOfMonth)
    .first();
  
  const income = (incomeResult as any)?.total || 0;
  if (income > 0) {
    const savingsRate = ((income - currentTotal) / income) * 100;
    if (savingsRate > 20) {
      insights.push({
        id: crypto.randomUUID(),
        type: "success",
        title: "Great Savings Rate!",
        description: `You've saved ${Math.round(savingsRate)}% of your income so far this month. Keep it up!`
      });
    } else if (savingsRate < 5) {
      insights.push({
        id: crypto.randomUUID(),
        type: "warning",
        title: "Low Savings Alert",
        description: "Your savings rate is currently below 5%. Consider reviewing your 'Other' or 'Shopping' expenses."
      });
    }
  }

  return insights;
}
