"use client";

import React from "react";
import { LucideRepeat, LucideAlertCircle, LucideCalendar } from "lucide-react";

interface AutoDebitsListProps {
  hideTitle?: boolean;
}

const MOCK_DEBITS = [
  { id: 1, name: "Netflix Premium", amount: 649, date: "Apr 21", category: "Entertainment", dueSoon: true },
  { id: 2, name: "Amazon Prime", amount: 149, date: "Apr 24", category: "Entertainment", dueSoon: false },
  { id: 3, name: "Reliance Jio Fiber", amount: 849, date: "Apr 28", category: "Utilities", dueSoon: false },
  { id: 4, name: "HDFC Life Insurance", amount: 24500, date: "May 02", category: "Finance", dueSoon: false },
];

export default function AutoDebitsList({ hideTitle }: AutoDebitsListProps) {
  return (
    <div className="bg-[#0d1220] border border-white/5 rounded-[32px] overflow-hidden noise shadow-2xl h-full flex flex-col">
      {!hideTitle && (
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <h3 className="text-white font-bold text-lg tracking-tight">Recurring</h3>
          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Auto-Debit Pipeline</p>
        </div>
      )}
      
      <div className="flex-1 p-6 space-y-4">
        {MOCK_DEBITS.map((debit, i) => (
          <div 
            key={debit.id} 
            className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-default"
          >
            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-white/5 transition-colors ${debit.dueSoon ? 'text-amber-500' : 'text-white/20'}`}>
                <LucideRepeat size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight leading-none mb-1">{debit.name}</span>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-none">{debit.category}</span>
                   {debit.dueSoon && (
                     <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase tracking-[0.1em] flex items-center gap-1">
                        <LucideAlertCircle size={8} /> Due Soon
                     </span>
                   )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-black text-amber-500/80 tabular-nums">₹{debit.amount.toLocaleString()}</p>
              <p className="text-[10px] text-white/20 font-black flex items-center gap-1 justify-end uppercase tracking-widest mt-1">
                 <LucideCalendar size={10} /> {debit.date}
              </p>
            </div>
          </div>
        ))}

        <button className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 hover:bg-white/[0.02] transition-all mt-4">
          Configure Pipeline +
        </button>
      </div>
    </div>
  );
}
