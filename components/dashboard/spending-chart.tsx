"use client";

import React, { useState, useEffect } from "react";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";

export default function SpendingChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/chart")
      .then(res => res.json())
      .then(json => {
        if (json.fallbackToLocal) {
          const localData = localStorage.getItem("spendwise_transactions");
          if (localData) {
            try {
              const txns = JSON.parse(localData);
              if (Array.isArray(txns)) {
                const now = new Date();
                const daysMap: Record<string, any> = {};
                
                // Build 14-day timeline
                for(let i=13; i>=0; i--) {
                  const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                  daysMap[d] = { date: d, income: 0, expense: 0 };
                }
                
                txns.forEach((t: any) => {
                  const d = new Date(t.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                  if (daysMap[d]) {
                    if (t.type === 'income') daysMap[d].income += Number(t.amount);
                    else daysMap[d].expense += Number(t.amount);
                  }
                });
                setChartData(Object.values(daysMap));
              }
            } catch (e) {
              console.error("Chart data corruption", e);
            }
          }
        } else {
          setChartData(Array.isArray(json) ? json : []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-[350px] w-full skeleton rounded-3xl" />;

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255,255,255,0.03)" 
          />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            fontWeight={900}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            fontWeight={900}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.length) {
                return (
                  <div className="bg-[#111826] border border-slate-900/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900/60 mb-3">
                      {payload[0].payload.date}
                    </p>
                    <div className="space-y-2">
                       <div className="flex items-center gap-6 justify-between">
                          <span className="text-[10px] font-bold text-slate-900/80">Income</span>
                          <span className="text-xs font-black text-emerald-400">₹{payload[0].value?.toLocaleString()}</span>
                       </div>
                       <div className="flex items-center gap-6 justify-between">
                          <span className="text-[10px] font-bold text-slate-900/80">Expense</span>
                          <span className="text-xs font-black text-rose-400">₹{payload[1]?.value?.toLocaleString() || 0}</span>
                       </div>
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
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIncome)"
            animationDuration={2000}
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#f43f5e"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorExpense)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
