"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  ChevronDown, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft,
  Filter,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast-provider";
import TransactionForm from "./transaction-form";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Entertainment", "Utilities & Bills", "Health", "Education", "Transfers", "Cash", "Income", "Other"];
const PAYMENT_MODES = ["UPI (Paytm/GPay)", "Cash", "Credit/Debit Card", "Net Banking", "NEFT/IMPS", "Auto Debit"];

export default function TransactionTable() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  
  // FILTER STATES
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterMode, setFilterMode] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const [editItem, setEditItem] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/transactions");
        const json = await res.json();
        
        let apiTxns = [];
        if (Array.isArray(json)) {
            apiTxns = json;
        } else if (json.fallbackToLocal && Array.isArray(json.transactions)) {
            apiTxns = json.transactions;
        }

        // Always check local storage for imported data
        const local = localStorage.getItem("spendwise_transactions");
        let localTxns = [];
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) localTxns = parsed;
          } catch (e) {
            console.error("Local parity error", e);
          }
        }

        // Merge and deduplicate (by ID)
        const combined = [...apiTxns];
        const apiIds = new Set(apiTxns.map((t: any) => t.id));
        
        localTxns.forEach((lt: any) => {
          if (!apiIds.has(lt.id)) combined.push(lt);
        });

        setAllTransactions(combined);
      } catch (err) {
        console.error("Ledger sync failure", err);
        // Fallback to local only on total network failure
        const local = localStorage.getItem("spendwise_transactions");
        if (local) setAllTransactions(JSON.parse(local));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filtered = useMemo(() => {
    let result = [...allTransactions];
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        (t.description || "").toLowerCase().includes(q) || 
        (t.category_name || "").toLowerCase().includes(q) ||
        (t.amount || "").toString().includes(q)
      );
    }
    
    if (filterCat !== 'all') result = result.filter(t => t.category_name === filterCat);
    if (filterType !== 'all') result = result.filter(t => t.type === filterType);
    if (filterMode !== 'all') result = result.filter(t => t.payment_method === filterMode);
    
    if (dateFrom) result = result.filter(t => t.date * 1000 >= new Date(dateFrom).getTime());
    if (dateTo) result = result.filter(t => t.date * 1000 <= new Date(dateTo).getTime());
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':   return b.date - a.date;
        case 'date-asc':    return a.date - b.date;
        case 'amount-desc': return Number(b.amount) - Number(a.amount);
        case 'amount-asc':  return Number(a.amount) - Number(b.amount);
        default:            return 0;
      }
    });

    return result;
  }, [allTransactions, search, filterCat, filterType, filterMode, dateFrom, dateTo, sortBy]);

  const activeFiltersCount = [
    filterCat !== 'all',
    filterType !== 'all',
    filterMode !== 'all',
    !!dateFrom,
    !!dateTo,
    sortBy !== 'date-desc'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setFilterCat("all");
    setFilterType("all");
    setFilterMode("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("date-desc");
  };

  const handleDelete = async (id: string | number) => {
    const toastId = toast({ type: 'loading', title: 'Erasing Record', description: 'Zeroing transmission log...' });
    try {
      if (id.toString().startsWith('import-')) {
          // Local only delete
          const updated = allTransactions.filter(t => t.id !== id);
          setAllTransactions(updated);
          localStorage.setItem("spendwise_transactions", JSON.stringify(updated));
          toast({ type: 'success', title: 'Record Expunged', description: 'Transaction permanently removed from local terminal.' });
          return;
      }

      const response = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Deletion failed");
      
      const updated = allTransactions.filter(t => t.id !== id);
      setAllTransactions(updated);
      localStorage.setItem("spendwise_transactions", JSON.stringify(updated));
      toast({ type: 'success', title: 'Record Expunged', description: 'Transaction permanently removed from cloud terminal.' });
    } catch (err: any) {
      toast({ type: 'error', title: 'Deletion Error', description: err.message });
    }
  };

  if (loading) return <div className="h-[600px] w-full skeleton rounded-[40px]" />;

  return (
    <div className="space-y-8">
      
      {/* FILTER TERMINAL */}
      <div className="bg-[#0d1220] border border-white/5 rounded-[32px] overflow-hidden noise shadow-2xl">
        <div className="p-6 md:p-8 space-y-6">
          {/* Row 1: Search & Type */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 h-4 w-4 transition-colors" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Surveillance by entity, category or value..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-white focus:border-white/20 transition-all outline-none"
              />
            </div>
            
            <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-2xl w-full lg:w-auto">
              {['all', 'expense', 'income'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filterType === type ? 'bg-white/10 text-white shadow-inner' : 'text-white/20 hover:text-white/40'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1.5">
               <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 pl-2">Category</label>
               <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="w-full">
                  <option value="all">ANY CLASSIFICATION</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 pl-2">Mode</label>
               <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)} className="w-full">
                  <option value="all">ANY TERMINAL</option>
                  {PAYMENT_MODES.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 pl-2">Start</label>
               <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full" />
            </div>
            <div className="space-y-1.5">
               <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 pl-2">End</label>
               <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full" />
            </div>
            <div className="space-y-1.5">
               <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 pl-2">Sort</label>
               <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full">
                  <option value="date-desc">LATEST RECORDS</option>
                  <option value="date-asc">OLDEST RECORDS</option>
                  <option value="amount-desc">LARGEST VALUE</option>
                  <option value="amount-asc">SMALLEST VALUE</option>
               </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                 <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.1em] text-blue-500">
                    {activeFiltersCount} Active Filters Engaged
                 </div>
              </div>
              <button 
                onClick={clearFilters}
                className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors flex items-center gap-1.5"
              >
                Clear Terminal <X size={10} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DATA LEDGER */}
      <div className="bg-[#0d1220] border border-white/5 rounded-[40px] overflow-hidden noise shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Timeline</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Entity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Classification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Value</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-right w-[100px]">Node</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">No Transmissions Match Query</p>
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <motion.tr 
                    key={t.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                    className="group border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-white/40 tabular-nums uppercase tracking-widest">
                        {new Date(t.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                         <span className="text-sm font-extrabold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                           {t.description || "Vendor"}
                         </span>
                         <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">
                           Channel: {t.payment_method || "UPI"}
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className="bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider text-white/50 px-3 py-1 rounded-full">
                        {t.category_name}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className={`text-md font-black tabular-nums tracking-tighter ${t.type === 'income' ? 'text-emerald-500' : 'text-white'}`}>
                         {t.type === 'income' ? <ArrowDownLeft className="inline mr-1 h-3 w-3" /> : <ArrowUpRight className="inline mr-1 h-3 w-3" />}
                         {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(t.amount)}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditItem(t);
                              setIsEditOpen(true);
                            }}
                            className="h-8 w-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                            aria-label={`Edit transaction: ${t.description || "Vendor"}`}
                          >
                             <Pencil size={12} aria-hidden="true" />
                          </button>
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="h-8 w-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                            aria-label={`Delete transaction: ${t.description || "Vendor"}`}
                          >
                             <Trash2 size={12} aria-hidden="true" />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionForm open={isEditOpen} onOpenChange={setIsEditOpen} initialData={editItem} />
    </div>
  );
}
