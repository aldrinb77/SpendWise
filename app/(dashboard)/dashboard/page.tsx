"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import SummaryCards from "@/components/dashboard/summary-cards";
import SpendingChart from "@/components/dashboard/spending-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import CategoryDonut from "@/components/dashboard/category-donut";
import AutoDebitsList from "@/components/dashboard/auto-debits-list";
import AIInsightBanner from "@/components/dashboard/ai-insight-banner";
import AddTransactionButton from "@/components/shared/add-transaction-button";
import { Calendar, Plus, Zap } from "lucide-react";
import TransactionForm from "@/components/transactions/transaction-form";

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("User profile corruption", e);
      }
    }
  }, []);

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-12 animate-fade-in relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      {/* ROW 1: HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 transition-all hover:text-emerald-400 cursor-default">
              System Active · Node 01
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display italic text-slate-900 leading-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Member'}
          </h1>
          <p className="text-slate-900/50 font-medium text-lg tracking-tight">
            April 2026 · <span className="text-slate-900/70 underline decoration-white/10 underline-offset-4">Your financial overview</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900/[0.03] border border-slate-900/5 p-1 rounded-2xl">
            <button className="px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-900/60 hover:text-slate-900 transition-all bg-slate-900/5 shadow-inner">
               This Month
            </button>
            <button className="px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-900/40 hover:text-slate-900 transition-all">
               Last 30 Days
            </button>
          </div>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04050a] font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.05] active:scale-95"
          >
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </header>

      {/* ROW 2: STAT CARDS */}
      <SummaryCards />

      {/* ROW 3: CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-slate-900/5 rounded-[32px] overflow-hidden bg-noise shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="p-8 border-b border-slate-900/5 flex items-center justify-between bg-slate-900/[0.01]">
            <div>
              <h3 className="text-slate-900 font-bold text-lg tracking-tight">Spending Trend</h3>
              <p className="text-[10px] text-slate-900/50 uppercase font-black tracking-widest">30-Day Liquidity Flow</p>
            </div>
          </div>
          <div className="p-4 md:p-8">
            <SpendingChart />
          </div>
        </div>
        
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-slate-900/5 rounded-[32px] overflow-hidden bg-noise shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="p-8 border-b border-slate-900/5 bg-slate-900/[0.01]">
            <h3 className="text-slate-900 font-bold text-lg tracking-tight">Structure</h3>
            <p className="text-[10px] text-slate-900/50 uppercase font-black tracking-widest">Category Distribution</p>
          </div>
          <div className="p-8">
            <CategoryDonut />
          </div>
        </div>
      </div>

      {/* ROW 4: RECENT & AUTO-DEBITS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-slate-900 font-black uppercase tracking-[0.2em] text-[11px]">Recent Transmissions</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
              View all history →
            </button>
          </div>
          <RecentTransactions limit={8} />
        </div>
        
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-slate-900 font-black uppercase tracking-[0.2em] text-[11px] px-2">Upcoming Auto-Debits</h3>
          <AutoDebitsList hideTitle />
        </div>
      </div>

      {/* ROW 5: AI INSIGHT */}
      <AIInsightBanner />

      <footer className="pt-20 pb-12 border-t border-slate-900/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black uppercase tracking-widest">SpendWise v1.0.4</span>
           <span className="text-[10px] font-black uppercase tracking-widest">Local-First Persistence</span>
        </div>
        <div className="flex items-center gap-8">
          <button className="text-[10px] font-black uppercase tracking-widest hover:text-slate-900">API</button>
          <button className="text-[10px] font-black uppercase tracking-widest hover:text-slate-900">GitHub</button>
          <button className="text-[10px] font-black uppercase tracking-widest hover:text-slate-900">Privacy</button>
          <button className="text-[10px] font-black uppercase tracking-widest hover:text-slate-900">Terms</button>
        </div>
      </footer>

      <TransactionForm open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
