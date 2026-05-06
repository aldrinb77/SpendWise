"use client";

import React from "react";
import { Repeat, AlertCircle, Calendar } from "lucide-react";

interface AutoDebitsListProps {
  hideTitle?: boolean;
}

const MOCK_DEBITS: any[] = [];

export default function AutoDebitsList({ hideTitle }: AutoDebitsListProps) {
  return (
    <div className="bg-[#FFFFFF] border border-slate-900/5 rounded-[32px] overflow-hidden bg-noise shadow-[0_20px_50px_rgba(0,0,0,0.05)] h-full flex flex-col">
      {!hideTitle && (
        <div className="p-8 border-b border-slate-900/5 bg-slate-900/[0.01]">
          <h3 className="text-slate-900 font-bold text-lg tracking-tight">Recurring</h3>
          <p className="text-[10px] text-slate-900/50 uppercase font-black tracking-widest">Auto-Debit Pipeline</p>
        </div>
      )}
      
      <div className="flex-1 p-6 space-y-4">
        {MOCK_DEBITS.map((debit, i) => (
          <div 
            key={debit.id} 
            className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/[0.02] border border-slate-900/5 hover:border-slate-900/10 transition-all cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-slate-900/5 transition-colors ${debit.dueSoon ? 'text-amber-500' : 'text-slate-900/40'}`}>
                <Repeat size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1">{debit.name}</span>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-slate-900/40 font-black uppercase tracking-widest leading-none">{debit.category}</span>
                   {debit.dueSoon && (
                     <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase tracking-[0.1em] flex items-center gap-1">
                        <AlertCircle size={8} /> Due Soon
                     </span>
                   )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-black text-amber-500/80 tabular-nums">₹{debit.amount.toLocaleString()}</p>
              <p className="text-[10px] text-slate-900/40 font-black flex items-center gap-1 justify-end uppercase tracking-widest mt-1">
                 <Calendar size={10} /> {debit.date}
              </p>
            </div>
          </div>
        ))}

        <button className="w-full py-4 rounded-2xl border border-dashed border-slate-900/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900/40 hover:text-slate-900/60 hover:bg-slate-900/[0.02] transition-all mt-4">
          Configure Pipeline +
        </button>
      </div>
    </div>
  );
}
