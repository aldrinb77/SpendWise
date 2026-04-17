"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideWallet, LucideBell, LucideUser, LucideLogOut, LucideSettings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
    { name: "Import", href: "/import" },
    { name: "Insights", href: "/insights" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/50 dark:bg-slate-950/50 backdrop-blur-2xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-xl shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <LucideWallet className="h-6 w-6 font-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">SpendWise</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-muted/20 p-1 rounded-2xl border border-white/5 shadow-inner">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[11px] font-black uppercase tracking-widest px-5 py-2 rounded-xl transition-all ${
                pathname === item.href 
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm scale-105" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button aria-label="Notifications" variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-primary/5">
            <LucideBell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background shadow-pulse" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 overflow-hidden hover:scale-105 active:scale-95 transition-all">
                <Avatar className="h-10 w-10 border-2 border-white/10 shadow-lg">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-black text-xs">JD</AvatarFallback>
                </Avatar>
              </Button>
            } />
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings" className="flex items-center w-full">
                  <LucideUser className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="flex items-center w-full">
                  <LucideSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer group">
                <LucideLogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
