"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideTrendingUp, LucideTrendingDown, LucideWallet, LucidePiggyBank } from "lucide-react";
import { motion } from "framer-motion";

const summaryData = [
  {
    title: "Total Balance",
    amount: "₹1,24,500",
    description: "Current net worth",
    icon: LucideWallet,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Monthly Income",
    amount: "₹85,000",
    description: "+12.5% from last month",
    icon: LucideTrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Monthly Expense",
    amount: "₹32,400",
    description: "-4.2% from last month",
    icon: LucideTrendingDown,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Total Savings",
    amount: "₹52,600",
    description: "61.8% savings rate",
    icon: LucidePiggyBank,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      ))}
    </div>
  );

  const stats = [
    {
      title: "Total Balance",
      amount: `₹${data?.balance?.toLocaleString() || '0'}`,
      description: "Current net worth",
      icon: LucideWallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Monthly Income",
      amount: `₹${data?.monthlyIncome?.toLocaleString() || '0'}`,
      description: `${data?.incomeTrend > 0 ? '+' : ''}${Math.round(data?.incomeTrend || 0)}% from last month`,
      icon: LucideTrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Monthly Expense",
      amount: `₹${data?.monthlyExpense?.toLocaleString() || '0'}`,
      description: `${data?.expenseTrend > 0 ? '+' : ''}${Math.round(data?.expenseTrend || 0)}% from last month`,
      icon: LucideTrendingDown,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Total Savings",
      amount: `₹${data?.savings?.toLocaleString() || '0'}`,
      description: `${Math.round(data?.savingsRate || 0)}% savings rate`,
      icon: LucidePiggyBank,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`${item.bg} p-2 rounded-lg transition-transform group-hover:scale-110`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{item.amount}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
