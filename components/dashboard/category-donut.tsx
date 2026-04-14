"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const data = [
  { name: "Food & Dining", value: 12500, color: "oklch(0.7 0.2 25)" },
  { name: "Shopping", value: 8400, color: "oklch(0.6 0.2 295)" },
  { name: "Transportation", value: 4200, color: "oklch(0.6 0.2 220)" },
  { name: "Bills", value: 5300, color: "oklch(0.8 0.1 80)" },
  { name: "Other", value: 2000, color: "oklch(0.5 0.05 220)" },
];

export default function CategoryDonut() {
  return (
    <Card className="col-span-full xl:col-span-2 border-none shadow-md overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Major expense categories this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-xl backdrop-blur-md">
                        <p className="text-sm font-bold">{payload[0].name}</p>
                        <p className="text-xs text-muted-foreground mt-1">₹{payload[0].value?.toLocaleString()}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
