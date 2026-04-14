import React from "react";
import TransactionTable from "@/components/transactions/transaction-table";
import { Button } from "@/components/ui/button";
import { LucidePlus, LucideUpload, LucideHistory, LucideArrowLeft } from "lucide-react";
import Link from "next/link";
import AddTransactionButton from "@/components/shared/add-transaction-button";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="container mx-auto p-6 md:p-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
               <div className="h-6 w-1 bg-primary rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Ledger Terminal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Transactions History</h1>
            <p className="text-muted-foreground font-medium text-lg">Manage and analyze your complete financial footprint.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/import">
              <Button variant="outline" className="h-12 px-6 rounded-2xl border-white/20 bg-white dark:bg-slate-900 shadow-sm font-bold tracking-tight hover:bg-slate-50 transition-all">
                <LucideUpload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </Link>
            <AddTransactionButton className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 font-bold tracking-tight">
              <LucidePlus className="mr-2 h-4 w-4" />
              Manual Entry
            </AddTransactionButton>
          </div>
        </header>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <TransactionTable />
          </div>
        </div>

        <footer className="pt-12 border-t border-slate-200 dark:border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                <p>Last Sync: Just Now</p>
                <div className="flex items-center gap-6">
                    <button className="hover:text-primary transition-colors">Export CSV</button>
                    <button className="hover:text-primary transition-colors">Export PDF</button>
                    <button className="hover:text-primary transition-colors">Archived Data</button>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
}
