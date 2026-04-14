"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { motion } from "framer-motion";
import { LucidePieChart, LucideTrendingUp, LucideInfo, LucideArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InsightsPage() {
  const [data, setData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localData = localStorage.getItem("spendwise_transactions");
    if (localData) {
      const txns = JSON.parse(localData);
      setData(txns);

      // Category breakdown (Expenses only)
      const categories: Record<string, any> = {};
      txns.filter((t: any) => t.type === 'expense').forEach((t: any) => {
        const name = t.category_name || "Uncategorized";
        if (!categories[name]) {
          categories[name] = { name, value: 0, color: t.category_color || "#94a3b8" };
        }
        categories[name].value += Number(t.amount);
      });
      setCategoryData(Object.values(categories).sort((a, b) => b.value - a.value));

      // Monthly breakdown
      const months: Record<string, any> = {};
      txns.forEach((t: any) => {
        const date = new Date(t.date * 1000);
        const monthStr = date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
        if (!months[monthStr]) {
          months[monthStr] = { month: monthStr, income: 0, expense: 0 };
        }
        if (t.type === 'income') months[monthStr].income += Number(t.amount);
        else months[monthStr].expense += Number(t.amount);
      });
      setMonthlyData(Object.values(months).reverse());
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8">Loading insights...</div>;

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-slate-100">Financial Insights</h1>
          <p className="text-muted-foreground font-bold tracking-tight mt-1 uppercase text-xs">Deep dive into your spending patterns</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20 flex items-center gap-3">
          <LucideInfo className="h-5 w-5 text-primary" />
          <p className="text-xs font-bold text-primary max-w-[200px]">We've noticed you spend most on Food & Dining this month.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-2xl glass-card rounded-[32px] overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl h-[450px]">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-3 rounded-2xl">
                  <LucidePieChart className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">Spending by Category</CardTitle>
                  <CardDescription className="font-bold uppercase text-[10px] tracking-widest">Where your money goes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      formatter={(val: number) => `₹${val.toLocaleString()}`}
                    />
                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income vs Expense */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-none shadow-2xl glass-card rounded-[32px] overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl h-[450px]">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-3 rounded-2xl">
                  <LucideTrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">Income vs Expense</CardTitle>
                  <CardDescription className="font-bold uppercase text-[10px] tracking-widest">Monthly cashflow analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="month" strokeOpacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis strokeOpacity={0.5} fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="income" fill="oklch(0.6 0.2 160)" radius={[10, 10, 0, 0]} barSize={20} />
                    <Bar dataKey="expense" fill="oklch(0.6 0.2 25)" radius={[10, 10, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Savings Goal", text: "You're consistent! Put ₹5k more this month for your vacation fund.", color: "bg-amber-500/5 text-amber-600" },
          { title: "Subscriptions", text: "Found 2 unused subscriptions. Cancel them to save ₹899/mo.", color: "bg-rose-500/5 text-rose-600" },
          { title: "Budget Alert", text: "Your shopping budget is at 92%. Try to hold off for 4 more days.", color: "bg-primary/5 text-primary" },
        ].map((rec, i) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className={`p-6 rounded-[28px] ${rec.color} border border-current/10 flex flex-col justify-between`}
          >
            <div>
              <h3 className="font-black text-lg mb-2">{rec.title}</h3>
              <p className="text-sm font-bold opacity-80">{rec.text}</p>
            </div>
            <Button variant="ghost" className="mt-4 w-fit h-8 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-current/10 px-0">
              Learn More <LucideArrowRight className="h-3 w-3" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
