"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LucideMoreHorizontal, 
  LucidePencil, 
  LucideTrash2, 
  LucideCopy,
  LucideReceipt
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export default function TransactionTable() {
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json())
      .then(json => {
        setTransactions(json as any[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="rounded-3xl border border-white/20 glass-card p-12 space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="rounded-3xl border border-white/20 glass-card overflow-hidden shadow-2xl transition-all duration-500">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/10 hover:bg-transparent">
            <TableHead className="font-bold text-[11px] uppercase tracking-[0.2em] text-muted-foreground pl-6">Timeline</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Entity</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Category</TableHead>
            <TableHead className="font-bold text-[11px] uppercase tracking-[0.2em] text-muted-foreground text-right pr-6">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-48 text-center text-muted-foreground font-medium">
                No history recorded. Upload a statement to begin.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((t, idx) => (
              <motion.tr 
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group border-b border-white/5 last:border-0 hover:bg-white/5 dark:hover:bg-white/5 transition-colors cursor-default"
              >
                <TableCell className="pl-6">
                  <span className="text-xs font-black text-muted-foreground tabular-nums">
                    {new Date(t.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight">{t.description || "Vendor"}</span>
                    <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">{t.payment_method || "UPI"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className="font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border-0"
                    style={{ 
                      backgroundColor: `${t.category_color}22`, 
                      color: t.category_color,
                    }}
                  >
                    {t.category_name}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <span className={`text-sm font-black tracking-tight ${t.type === 'income' ? "text-emerald-500" : "text-foreground"}`}>
                    {t.type === 'income' ? "+" : ""}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(t.amount)}
                  </span>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
