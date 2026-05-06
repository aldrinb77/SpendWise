import React from "react";
import { Target, PieChart } from "lucide-react";

export default function BudgetsPage() {
  return (
    <div className="container mx-auto p-6 md:p-12 space-y-12 animate-fade-in relative">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-rose-500/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500/60 transition-all hover:text-rose-400 cursor-default">
              Capital Allocation · Active
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display italic text-slate-900 leading-tight">
            Budgets
          </h1>
          <p className="text-slate-900/50 font-medium text-lg tracking-tight px-1">
            Tactical distribution of <span className="text-slate-900/70 underline decoration-white/10 underline-offset-4">financial resources</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 rounded-xl bg-rose-500 hover:bg-rose-400 text-[#04050a] font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:scale-[1.05] active:scale-95">
            <Target size={16} /> Establish Limit
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Empty State */}
         <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-[#FFFFFF] border border-slate-900/5 rounded-[40px] bg-noise shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="h-24 w-24 rounded-full bg-slate-900/5 flex items-center justify-center mb-6 border border-slate-900/10">
               <PieChart className="h-10 w-10 text-slate-900/40" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">No Allocations Active</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900/50 max-w-md mx-auto leading-relaxed">
               Establish limits across categories to initiate financial surveillance and anomaly detection.
            </p>
            <button className="mt-8 px-8 py-4 rounded-xl border border-slate-900/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900/60 hover:text-slate-900 hover:bg-slate-900/5 transition-all">
               Initialize Matrix +
            </button>
         </div>
      </div>
    </div>
  );
}
