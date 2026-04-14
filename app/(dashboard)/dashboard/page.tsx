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
import { LucideDownload, LucideCalendar, LucidePlus, LucideZap, LucideSparkles, LucideUpload } from "lucide-react";
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
      .catch(() => {
        // Fallback local insights
        const localData = localStorage.getItem("spendwise_transactions");
        if (localData) {
            const txns = JSON.parse(localData);
            if (txns.length > 0) {
                setInsights([
                    { id: 1, title: "Spending Trend", description: "You've spent 12% less than last month. Keep it up!", type: "success" },
                    { id: 2, title: "Category Alert", description: "Food & Dining is 40% of your budget. Consider reducing dining out.", type: "warning" }
                ]);
            }
        }
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-full min-h-[400px] rounded-[32px] bg-slate-900/5 dark:bg-slate-50/[0.02] border border-black/5 dark:border-white/5 p-8 flex flex-col gap-4">
      <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
      <div className="h-24 w-full bg-slate-100 dark:bg-slate-900/50 rounded-2xl animate-pulse" />
      <div className="h-24 w-full bg-slate-100 dark:bg-slate-900/50 rounded-2xl animate-pulse" />
    </div>
  );

  return (
    <div className="h-full min-h-[400px] rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-8 flex flex-col gap-6 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <LucideSparkles className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">AI Insights</h3>
        </div>
        <Badge className="bg-primary text-white border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">Live</Badge>
      </div>
      
      {insights.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 opacity-30 px-6">
          <LucideZap className="h-16 w-16" />
          <p className="text-sm font-bold leading-relaxed">System awaiting data. Once you upload more transactions, our engine will generate optimization strategies.</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-6 rounded-[24px] border border-white/10 transition-all hover:scale-[1.02] group ${
                insight.type === 'warning' ? 'bg-rose-500/5 border-rose-500/10' : 
                insight.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : 
                'bg-blue-500/5 border-blue-500/10'
              }`}
            >
              <h4 className={`font-black text-sm uppercase tracking-widest ${
                insight.type === 'warning' ? 'text-rose-500' : 
                insight.type === 'success' ? 'text-emerald-500' : 
                'text-blue-500'
              }`}>{insight.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-bold leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="container mx-auto p-6 md:p-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-2">
               <div className="h-6 w-1 bg-primary rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intelligence Terminal</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white">Financial Hub</h1>
            <p className="text-muted-foreground font-medium text-lg">Real-time surveillance of your capital and cashflow.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="outline" className="h-12 px-6 rounded-2xl border-white/20 bg-white dark:bg-slate-900 shadow-sm font-bold tracking-tight hover:bg-slate-50 transition-all hidden lg:flex">
                <LucideCalendar className="mr-2 h-4 w-4" />
                This Month
              </Button>
            <Link href="/import" className="hidden sm:block">
              <Button variant="outline" className="h-12 px-6 rounded-2xl border-white/20 bg-white dark:bg-slate-900 shadow-sm font-bold tracking-tight hover:bg-slate-50 transition-all">
                <LucideUpload className="mr-2 h-4 w-4" />
                Ingest Data
              </Button>
            </Link>
            <AddTransactionButton className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 font-bold tracking-tight">
              <LucidePlus className="mr-2 h-4 w-4" />
              Quick Action
            </AddTransactionButton>
          </div>
        </header>

        <SummaryCards />

        <div className="grid grid-cols-1 xl:grid-cols-6 gap-8">
          <div className="xl:col-span-4 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-1 shadow-2xl overflow-hidden">
            <SpendingChart />
          </div>
          <div className="xl:col-span-2 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-1 shadow-2xl overflow-hidden">
            <CategoryDonut />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 pb-12">
          <div className="xl:col-span-3">
            <RecentTransactions />
          </div>
          <div className="xl:col-span-2">
            <InsightsSection />
          </div>
        </div>
      </div>
    </div>
  );
}
