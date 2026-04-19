"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AIInsightBanner() {
  return (
    <div className="relative group overflow-hidden rounded-[32px] border border-emerald-500/20 bg-[#0d1220] noise shadow-2xl p-8 lg:p-12 mb-12">
      <div className="absolute top-0 right-0 w-[400px] h-full bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="space-y-6 flex-1 text-center lg:text-left">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto lg:mx-0 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <Sparkles className="text-emerald-500 h-6 w-6" />
          </div>
          <div className="space-y-3">
             <h3 className="text-2xl md:text-3xl font-display italic text-white tracking-tight">
               "Intelligence terminal active. Add transactions to generate financial <span className="text-emerald-400">surveillance reports</span>."
             </h3>
             <p className="text-white/40 font-medium leading-relaxed max-w-2xl text-sm md:text-base">
               Our AI engine is scanning for patterns. As you populate your ledger, we'll provide surgical insights on your liquidity and burn rate.
             </p>
          </div>
        </div>

        <Link href="/insights" className="flex-shrink-0">
          <button className="px-10 py-5 rounded-2xl bg-white text-[#04050a] font-black uppercase tracking-widest text-[11px] flex items-center gap-3 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all active:scale-95 group">
            Deep Analysis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  );
}
