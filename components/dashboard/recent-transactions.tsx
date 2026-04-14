"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LucideShoppingBag, LucideCoffee, LucideCar, LucideHome, LucideSmartphone } from "lucide-react";

const transactions = [
  {
    id: "1",
    merchant: "Zomato",
    category: "Food & Dining",
    amount: -450,
    date: "Today, 12:30 PM",
    icon: LucideCoffee,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "2",
    merchant: "Uber",
    category: "Transportation",
    amount: -280,
    date: "Today, 09:15 AM",
    icon: LucideCar,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "3",
    merchant: "Salary",
    category: "Income",
    amount: 85000,
    date: "Yesterday",
    icon: LucideHome,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "4",
    merchant: "Amazon",
    category: "Shopping",
    amount: -1250,
    date: "Yesterday",
    icon: LucideShoppingBag,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "5",
    merchant: "Jio Recharge",
    category: "Bills",
    amount: -749,
    date: "2 days ago",
    icon: LucideSmartphone,
    color: "bg-indigo-500/10 text-indigo-500",
  },
];

export default function RecentTransactions() {
  return (
    <Card className="col-span-full xl:col-span-3 border-none shadow-md overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>You have 12 transactions this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between group cursor-pointer hover:bg-muted/50 p-2 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={`h-11 w-11 rounded-full ${t.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <t.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">{t.merchant}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.category} • {t.date}</p>
                </div>
              </div>
              <div className={`text-sm font-bold ${t.amount > 0 ? "text-emerald-500" : "text-foreground"}`}>
                {t.amount > 0 ? "+" : ""}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
