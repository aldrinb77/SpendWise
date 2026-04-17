"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideLayoutDashboard, LucideReceipt, LucidePlus, LucideTrendingUp, LucideUser } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: LucideLayoutDashboard },
    { name: "Logs", href: "/transactions", icon: LucideReceipt },
    { name: "Insights", href: "/insights", icon: LucideTrendingUp },
    { name: "Profile", href: "/settings", icon: LucideUser },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
      <div className="flex items-center justify-around bg-slate-900/90 items-center backdrop-blur-xl border border-white/10 rounded-full h-16 shadow-2xl px-2">
        {navItems.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              pathname === item.href ? "text-primary" : "text-slate-400 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        ))}

        <button aria-label="Add transaction" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 -translate-y-4 hover:scale-110 transition-transform active:scale-95">
          <LucidePlus className="h-6 w-6" />
        </button>

        {navItems.slice(2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              pathname === item.href ? "text-primary" : "text-slate-400 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
