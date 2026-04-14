"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideTrendingUp, LucideTrendingDown, LucideWallet, LucidePiggyBank } from "lucide-react";
import { motion } from "framer-motion";

export default function SummaryCards() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/dashboard/summary")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      ))}
    </div>
  );

  const stats = [
    {
      title: "Total Balance",
      amount: `₹${data?.balance?.toLocaleString() || '0'}`,
      description: "Net Liquidity",
      icon: LucideWallet,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Monthly Income",
      amount: `₹${data?.monthlyIncome?.toLocaleString() || '0'}`,
      description: `${data?.incomeTrend > 0 ? '+' : ''}${Math.round(data?.incomeTrend || 0)}% Monthly`,
      icon: LucideTrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Monthly Expense",
      amount: `₹${data?.monthlyExpense?.toLocaleString() || '0'}`,
      description: `${data?.expenseTrend > 0 ? '+' : ''}${Math.round(data?.expenseTrend || 0)}% Monthly`,
      icon: LucideTrendingDown,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Total Savings",
      amount: `₹${data?.savings?.toLocaleString() || '0'}`,
      description: `${Math.round(data?.savingsRate || 0)}% Savings Rate`,
      icon: LucidePiggyBank,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group glass-card rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </CardTitle>
              <div className={`${item.bg} p-2.5 rounded-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight font-heading">{item.amount}</div>
              <p className="text-[11px] font-bold text-muted-foreground/80 mt-1 uppercase tracking-widest flex items-center gap-1">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
