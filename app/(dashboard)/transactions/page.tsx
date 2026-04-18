"use client";

import React, { useState } from "react";
import TransactionTable from "@/components/transactions/transaction-table";
import { LucidePlus, LucideUpload, LucideHistory, LucideFileText } from "lucide-react";
import Link from "next/link";
import TransactionForm from "@/components/transactions/transaction-form";

export default function TransactionsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-12 animate-fade-in relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60 transition-all hover:text-blue-400 cursor-default">
              Ledger Terminal · Active
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display italic text-white leading-tight">
            Transmissions
          </h1>
          <p className="text-white/30 font-medium text-lg tracking-tight px-1">
            Surveillance of your complete <span className="text-white/50 underline decoration-white/10 underline-offset-4">financial footprint</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/import">
            <button className="h-12 px-6 rounded-22 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 hover:scale-[1.05] active:scale-95" style={{ borderRadius: 'var(--r-xl)' }}>
              <LucideUpload size={16} /> Import Data
            </button>
          </Link>
          <button 
             onClick={() => setIsAddOpen(true)}
             className="h-12 px-6 rounded-22 bg-blue-500 hover:bg-blue-400 text-[#04050a] font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.05] active:scale-95"
             style={{ borderRadius: 'var(--r-xl)' }}
          >
            <LucidePlus size={16} /> Manual Record
          </button>
        </div>
      </header>

      {/* DYNAMIC LEDGER TABLE */}
      <div className="relative">
        <TransactionTable />
      </div>

      <footer className="pt-20 pb-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
        <div className="flex items-center gap-6">
           <span className="text-[10px] font-black uppercase tracking-widest">Surveillance Node: ACTIVE</span>
           <span className="text-[10px] font-black uppercase tracking-widest">Last Integrity Check: Just Now</span>
        </div>
        <div className="flex items-center gap-8">
          <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
            <LucideFileText size={12} /> Export CSV
          </button>
          <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
            <LucideFileText size={12} /> Export PDF
          </button>
        </div>
      </footer>

      <TransactionForm open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
