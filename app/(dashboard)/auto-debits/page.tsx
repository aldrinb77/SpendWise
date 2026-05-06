import React from "react";
import AutoDebitsList from "@/components/dashboard/auto-debits-list";
import { Repeat } from "lucide-react";

export default function AutoDebitsPage() {
  return (
    <div className="container mx-auto p-6 md:p-12 space-y-12 animate-fade-in relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60 transition-all hover:text-amber-400 cursor-default">
              Recurring Pipeline · Active
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display italic text-slate-900 leading-tight">
            Auto-Debits
          </h1>
          <p className="text-slate-900/50 font-medium text-lg tracking-tight px-1">
            Predictive modeling of your <span className="text-slate-900/70 underline decoration-white/10 underline-offset-4">recurring outflows</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#04050a] font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-[1.05] active:scale-95">
            <Repeat size={16} /> New Pipeline
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <AutoDebitsList hideTitle />
        </div>
        <div className="space-y-8">
           <div className="bg-[#FFFFFF] border border-slate-900/5 rounded-[32px] p-8 bg-noise shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
             <h3 className="text-slate-900 font-bold text-lg mb-2">Pipeline Integrity</h3>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-900/50 mb-6">Status: Nominal</p>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900/[0.02] border border-slate-900/5">
                   <span className="text-xs font-black uppercase tracking-widest text-slate-900/60">Total Next 30D</span>
                   <span className="text-lg font-black text-amber-500 tabular-nums">₹0.00</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-900/[0.02] border border-slate-900/5">
                   <span className="text-xs font-black uppercase tracking-widest text-slate-900/60">Active Pipelines</span>
                   <span className="text-lg font-black text-slate-900 tabular-nums">0</span>
                </div>
             </div>
             
             <div className="mt-8 pt-8 border-t border-slate-900/5">
               <p className="text-[10px] text-slate-900/40 font-medium leading-relaxed">
                  Terminal continuously monitors known merchants and subscription providers to automatically detect recurring outflows based on your transaction history.
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
