"use client";

export const dynamic = "force-dynamic";

import React from "react";
import SummaryCards from "@/components/dashboard/summary-cards";
import SpendingChart from "@/components/dashboard/spending-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import CategoryDonut from "@/components/dashboard/category-donut";
import AddTransactionButton from "@/components/shared/add-transaction-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideDownload, LucideCalendar, LucidePlus, LucideUpload } from "lucide-react";
import Link from "next/link";

const InsightsSection = () => {
  const [insights, setInsights] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/dashboard/insights")
      .then(res => res.json())
      .then(json => {
        setInsights(json as any[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-full min-h-[400px] rounded-3xl bg-primary/5 border border-primary/10 p-6 flex flex-col gap-4">
      <div className="h-8 w-32 bg-primary/10 rounded animate-pulse" />
      <div className="h-24 w-full bg-primary/5 rounded animate-pulse" />
      <div className="h-24 w-full bg-primary/5 rounded animate-pulse" />
    </div>
  );

  return (
    <div className="h-full min-h-[400px] rounded-3xl bg-primary/5 border border-primary/10 p-6 flex flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-primary">Smart Insights</h3>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Rule Based</Badge>
      </div>
      
      {insights.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 opacity-50">
          <LucidePlus className="h-12 w-12 text-primary/30" />
          <p className="text-sm">Add more transactions to unlock personalized insights.</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-4 rounded-2xl border ${
                insight.type === 'warning' ? 'bg-rose-500/10 border-rose-500/20' : 
                insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                'bg-blue-500/10 border-blue-500/20'
              }`}
            >
              <h4 className={`font-bold text-sm ${
                insight.type === 'warning' ? 'text-rose-600' : 
                insight.type === 'success' ? 'text-emerald-600' : 
                'text-blue-600'
              }`}>{insight.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 font-medium leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your money.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl glass">
            <LucideCalendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Link href="/import">
            <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl glass hover:bg-primary/10 transition-colors">
              <LucideDownload className="mr-2 h-4 w-4" />
              Import Statement
            </Button>
          </Link>
          <AddTransactionButton size="sm" className="bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <LucidePlus className="mr-2 h-4 w-4" />
            Add Transaction
          </AddTransactionButton>
        </div>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 xl:grid-cols-6 gap-6">
        <div className="xl:col-span-4">
          <SpendingChart />
        </div>
        <div className="xl:col-span-2">
          <CategoryDonut />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 pb-12">
        <div className="xl:col-span-3">
          <RecentTransactions />
        </div>
        <div className="xl:col-span-2">
          <InsightsSection />
        </div>
      </div>
    </div>
  );
}
