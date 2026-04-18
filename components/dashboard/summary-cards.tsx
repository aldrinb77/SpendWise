"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LucideTrendingUp, 
  LucideTrendingDown, 
  LucideWallet, 
  LucideTarget, 
  LucideArrowUpRight, 
  LucideDollarSign 
} from "lucide-react";

export default function SummaryCards() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then(res => res.json())
      .then(json => {
        if (json.fallbackToLocal) {
          const localData = localStorage.getItem("spendwise_transactions");
          if (localData) {
            const txns = JSON.parse(localData);
            const income = txns.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + Number(t.amount), 0);
            const expense = txns.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + Number(t.amount), 0);
            setData({
              balance: income - expense,
              monthlyIncome: income,
              incomeTrend: 12.4,
              monthlyExpense: expense,
              expenseTrend: -5.2,
              savings: income - expense,
              savingsRate: income === 0 ? 0 : ((income - expense) / income) * 100
            });
          }
        } else {
          setData(json);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 rounded-[28px] skeleton" />
      ))}
    </div>
  );

  const stats = [
    {
      title: "Net Balance",
      value: `₹${data?.balance?.toLocaleString() || '0'}`,
      change: "+₹2,400 this week",
      icon: LucideWallet,
      color: "text-emerald-500",
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/5",
    },
    {
      title: "Monthly Income",
      value: `₹${data?.monthlyIncome?.toLocaleString() || '0'}`,
      change: `${data?.incomeTrend > 0 ? '+' : ''}${data?.incomeTrend}% vs March`,
      icon: LucideDollarSign,
      color: "text-blue-500",
      border: "border-blue-500/40",
      bg: "bg-blue-500/5",
    },
    {
      title: "Monthly Expense",
      value: `₹${data?.monthlyExpense?.toLocaleString() || '0'}`,
      change: `${data?.expenseTrend > 0 ? '+' : ''}${data?.expenseTrend}% vs March`,
      icon: LucideTrendingDown,
      color: "text-rose-500",
      border: "border-rose-500/40",
      bg: "bg-rose-500/5",
    },
    {
      title: "Savings Rate",
      value: `${Math.round(data?.savingsRate || 0)}%`,
      change: "Efficiency Score: A",
      icon: LucideTarget,
      color: "text-violet-500",
      border: "border-violet-500/40",
      bg: "bg-violet-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            "bg-[#0d1220] border-t-2 border-x border-b border-white/5 rounded-[28px] p-6 relative noise overflow-hidden",
            stat.border
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/30">{stat.title}</p>
              <h4 className={cn("text-3xl font-black tracking-tight", stat.color)}>
                {stat.value}
              </h4>
            </div>
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon size={20} className={stat.color} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wide", stat.bg, stat.color)}>
              {stat.change}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
