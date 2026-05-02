"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Plus, 
  Sparkles, 
  Settings 
} from "lucide-react";
import TransactionForm from "@/components/transactions/transaction-form";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const navItems = [
    { name: "Terminal", href: "/dashboard", icon: LayoutDashboard },
    { name: "Ledger", href: "/transactions", icon: ArrowLeftRight },
    { name: "AI", href: "/insights", icon: Sparkles },
    { name: "Config", href: "/settings", icon: Settings },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[340px] px-4">
        <div className="flex items-center bg-[#080c14]/90 backdrop-blur-2xl border border-white/10 rounded-[28px] h-20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] px-2 noise overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-30" />
          
          <div className="flex-1 flex justify-around">
            {navItems.slice(0, 2).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                    isActive ? "text-emerald-400" : "text-white/30 hover:text-white/60"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]")} />
                  <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsAddOpen(true)}
              aria-label="Add transaction"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-[#04050a] shadow-[0_0_30px_rgba(16,185,129,0.4)] -translate-y-6 hover:scale-110 transition-transform active:scale-95 border-4 border-[#080c14]"
            >
              <Plus className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 flex justify-around">
            {navItems.slice(2).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                    isActive ? "text-emerald-400" : "text-white/30 hover:text-white/60"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]")} />
                  <span className="text-[9px] font-black uppercase tracking-tighter">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <TransactionForm open={isAddOpen} onOpenChange={setIsAddOpen} />
    </>
  );
}
