"use client";

import React, { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { 
  LucideMoreHorizontal, 
  LucidePencil, 
  LucideTrash2, 
  LucideSearch,
  LucideFilter,
  LucideChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_KEYWORDS } from "@/lib/categorization/keywords";
import TransactionForm from "./transaction-form";
import { toast } from "sonner";

export default function TransactionTable() {
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  const [editItem, setEditItem] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  React.useEffect(() => {
    fetch("/api/transactions")
      .then(res => res.json())
      .then(json => {
        const payload = json as any;
        if (payload.fallbackToLocal) {
          const localData = localStorage.getItem("spendwise_transactions");
          if (localData) {
            setTransactions(JSON.parse(localData).sort((a: any, b: any) => b.date - a.date));
          }
        } else {
          setTransactions(Array.isArray(payload) ? payload : []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Transactions fetch fail:", err);
        const localData = localStorage.getItem("spendwise_transactions");
        if (localData) setTransactions(JSON.parse(localData).sort((a: any, b: any) => b.date - a.date));
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
          const filtered = transactions.filter(t => t.id !== id);
          setTransactions(filtered);
          localStorage.setItem("spendwise_transactions", JSON.stringify(filtered));
          resolve(true);
        } catch (e) {
          reject(e);
        }
      }),
      {
        loading: 'Deleting transaction...',
        success: 'Transaction erased permanently.',
        error: 'Deletion failed. System error.',
      }
    );
  };

  const categories = ["All", ...Object.keys(CATEGORY_KEYWORDS), "Uncategorized"];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = (t.description || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || t.category_name === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, categoryFilter]);

  if (loading) return (
    <div className="rounded-3xl border border-white/20 glass-card p-12 space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Integrated Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 dark:bg-slate-900/50 p-4 rounded-3xl border border-white/10 backdrop-blur-md shadow-xl">
        <div className="relative w-full md:max-w-md">
          <LucideSearch className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-12 h-10 rounded-2xl bg-white dark:bg-slate-800 border-0 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" className="rounded-2xl h-10 gap-2 whitespace-nowrap bg-white dark:bg-slate-800 border-0 shadow-sm font-bold tracking-tight">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {categoryFilter === "All" ? "All Categories" : categoryFilter}
                <LucideChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            } />
            <DropdownMenuContent className="rounded-2xl border-white/10 shadow-2xl p-2 max-h-[300px] overflow-y-auto">
              {categories.map(cat => (
                <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)} className="rounded-xl font-bold tracking-tight cursor-pointer">
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-3xl border border-white/20 glass-card overflow-hidden shadow-2xl transition-all duration-500 bg-gradient-to-b from-white/40 to-white/10 dark:from-slate-900/40 dark:to-slate-900/10">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10 hover:bg-transparent">
              <TableHead className="font-bold text-[11px] uppercase tracking-[0.2em] text-muted-foreground pl-6">Timeline</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Entity</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Category</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-[0.2em] text-muted-foreground text-right">Value</TableHead>
              <TableHead className="font-bold text-[11px] uppercase tracking-[0.2em] text-muted-foreground w-[50px] pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center text-muted-foreground font-medium">
                  {transactions.length === 0 ? "No history recorded. Upload a statement to begin." : "No matching transactions found."}
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {filteredTransactions.map((t, idx) => (
                  <motion.tr 
                    key={t.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                    transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                    className="group border-b border-white/5 last:border-0 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors cursor-default"
                  >
                    <TableCell className="pl-6 py-4">
                      <span className="text-xs font-black text-slate-500 dark:text-slate-400 tabular-nums tracking-widest">
                        {new Date(t.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[15px] tracking-tight">{t.description || "Vendor"}</span>
                        <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">{t.payment_method || "UPI"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className="font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 shadow-sm"
                        style={{ 
                          backgroundColor: `${t.category_color}15`, 
                          color: t.category_color,
                        }}
                      >
                        {t.category_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`text-[15px] font-black tracking-tighter ${t.type === 'income' ? "text-emerald-500" : "text-slate-800 dark:text-slate-200"}`}>
                        {t.type === 'income' ? "+" : ""}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(t.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full">
                            <LucideMoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="rounded-2xl border-white/10 shadow-2xl p-2 min-w-[150px]">
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditItem(t);
                              setIsEditOpen(true);
                            }}
                            className="rounded-xl font-bold tracking-tight cursor-pointer focus:bg-primary/10 focus:text-primary"
                          >
                            <LucidePencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(t.id)} className="rounded-xl font-bold tracking-tight cursor-pointer focus:bg-rose-500/10 focus:text-rose-500 text-rose-500">
                            <LucideTrash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 bg-muted/30 rounded-3xl border border-white/10 glass-card">
          <p className="text-sm font-bold text-muted-foreground tracking-tight">
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 && 's'}
          </p>
          {transactions.length > 100 && (
            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest text-primary border-primary/20 bg-primary/5 rounded-full px-3">
              Local Memory Engaged
            </Badge>
          )}
        </div>
      )}

      {/* Manual Edit Modal */}
      <TransactionForm 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        initialData={editItem} 
      />
    </div>
  );
}
