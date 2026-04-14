"use client";

import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { name: "Jan", income: 45000, expense: 32000 },
  { name: "Feb", income: 52000, expense: 35000 },
  { name: "Mar", income: 48000, expense: 41000 },
  { name: "Apr", income: 61000, expense: 38000 },
  { name: "May", income: 55000, expense: 42000 },
  { name: "Jun", income: 67000, expense: 39000 },
  { name: "Jul", income: 72000, expense: 45000 },
];

export default function SpendingChart() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/dashboard/chart")
      .then(res => res.json())
      .then(json => {
        const payload = json as any;
        if (payload.fallbackToLocal) {
          const localData = localStorage.getItem("spendwise_transactions");
          if (localData) {
             const txns = JSON.parse(localData);
             const now = new Date();
             const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).getTime() / 1000;
             const chartDataMap: Record<string, any> = {};
             
             txns.filter((t: any) => t.date >= fourteenDaysAgo)
                 .sort((a: any, b: any) => a.date - b.date)
                 .forEach((row: any) => {
                   const dateStr = new Date(row.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                   if (!chartDataMap[dateStr]) chartDataMap[dateStr] = { date: dateStr, income: 0, expense: 0 };
                   if (row.type === 'income') {
                     chartDataMap[dateStr].income += Number(row.amount);
                   } else {
                     chartDataMap[dateStr].expense += Number(row.amount);
                   }
                 });
             const finalized = Object.values(chartDataMap);
             if (finalized.length === 0) {
               // Give some placeholder timeline if no data
               for(let i=13; i>=0; i--) {
                  const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                  finalized.push({ date: d, income: 0, expense: 0 });
               }
             }
             setChartData(finalized as any[]);
          }
        } else {
          setChartData(payload as any[]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="col-span-4 border-none shadow-md overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm h-[450px] animate-pulse">
        <CardHeader>
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="h-64 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 border-none shadow-md overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm group hover:shadow-xl transition-all duration-500">
      <CardHeader>
        <CardTitle>Spending Overview</CardTitle>
        <CardDescription>
          Your income and expenses trend over the last 14 days
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.2 277)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.6 0.2 277)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.2 25)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.6 0.2 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.01 220 / 0.1)" />
              <XAxis
                dataKey="date"
                stroke="oklch(0.45 0.02 220)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.45 0.02 220)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-xl backdrop-blur-md border-none">
                        <p className="text-sm font-bold mb-2">{payload[0].payload.date}</p>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-primary flex items-center gap-2">
                             <span className="h-2 w-2 rounded-full bg-primary" />
                             Income: ₹{payload[0].value?.toLocaleString()}
                           </p>
                           {payload[1] && (
                             <p className="text-xs text-rose-500 flex items-center gap-2">
                               <span className="h-2 w-2 rounded-full bg-rose-500" />
                               Expense: ₹{payload[1].value?.toLocaleString()}
                             </p>
                           )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="oklch(0.6 0.2 277)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="oklch(0.6 0.2 25)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
