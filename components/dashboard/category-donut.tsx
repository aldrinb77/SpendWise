"use client";

import React from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6', '#f97316', '#06b6d4', '#64748b'];

export default function CategoryDonut() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // We'll mock for now based on local storage to show design
    const localData = localStorage.getItem("spendwise_transactions");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          const txns = parsed.filter((t: any) => t.type === 'expense');
          const catMap: Record<string, any> = {};
          txns.forEach((t: any) => {
            const cat = t.category_name || "Other";
            catMap[cat] = (catMap[cat] || 0) + Number(t.amount);
          });
          const finalized = Object.entries(catMap).map(([name, value]) => ({ name, value }));
          setData(finalized.sort((a, b) => b.value - a.value).slice(0, 5));
        }
      } catch (e) {
        console.error("Local data corruption", e);
      }
    } else {
        setData([
          { name: 'Food', value: 4000 },
          { name: 'Shopping', value: 3000 },
          { name: 'Transport', value: 2000 },
          { name: 'Rent', value: 15000 },
          { name: 'Other', value: 1000 },
        ]);
    }
    setLoading(false);
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  if (loading) return <div className="h-[300px] w-full skeleton rounded-full" />;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="h-[240px] w-full relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Burn Rate</span>
          <span className="text-3xl font-black text-white mt-1">₹{(total / 1000).toFixed(1)}k</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={75}
              outerRadius={95}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={400}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <div className="bg-[#111826] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                        {payload[0].name}
                      </p>
                      <p className="text-sm font-black text-white">
                        ₹{payload[0].value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full space-y-3">
        {data.map((item, index) => {
          const percent = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
          return (
            <div key={item.name} className="flex flex-col gap-1.5 group cursor-default">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-tight">{item.name}</span>
                </div>
                <span className="text-[11px] font-black text-white/40">{percent}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ delay: 0.5 + (index * 0.1), duration: 1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
