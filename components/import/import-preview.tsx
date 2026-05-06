"use client";

import React, { useState } from "react";
import { 
  Check, 
  X, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft 
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Food & Dining", "Shopping", "Transportation", "Bills & Utilities", "Entertainment", "Healthcare", "Education", "Investments", "Income", "Other"];

interface ImportPreviewProps {
  data: any[];
  onCancel: () => void;
}

export default function ImportPreview({ data: initialData, onCancel }: ImportPreviewProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleUpdate = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCommit = async () => {
    setIsSyncing(true);
    
    try {
      // In a real app, this would be a bulk API call
      // For now, we'll simulate it by writing to localStorage
      const existing = localStorage.getItem("spendwise_transactions");
      const existingArray = existing ? JSON.parse(existing) : [];
      
      const newTxns = items.map(item => ({
        ...item,
        id: `import-${Date.now()}-${Math.random()}`,
        payment_method: 'Imported (Statement)'
      }));
      
      localStorage.setItem("spendwise_transactions", JSON.stringify([...newTxns, ...existingArray]));
      
      toast({ type: 'success', title: 'Ledger Synchronized', description: `${items.length} records successfully committed to terminal.` });
      
      // Delay redirect to allow toast visibility
      setTimeout(() => {
        router.push('/transactions');
      }, 1500);
      
    } catch (err) {
      toast({ type: 'error', title: 'Sync Failed', description: 'Network transmission interrupted.' });
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#FFFFFF] border border-slate-900/5 rounded-[40px] overflow-hidden bg-noise shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-900/5 bg-slate-900/[0.01] sticky top-0 z-10 backdrop-blur-xl">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900/40">Timeline</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900/40">Entity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900/40">Classification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900/40 text-right">Value</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900/40 text-center w-[80px]">Node</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t, i) => (
                <tr key={i} className="group border-b border-slate-900/5 last:border-0 hover:bg-slate-900/[0.02] transition-colors">
                  <td className="px-8 py-4">
                    <span className="text-[11px] font-black text-slate-900/60 tabular-nums tracking-widest uppercase">
                      {new Date(t.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <input 
                      value={t.description} 
                      onChange={(e) => handleUpdate(i, 'description', e.target.value)}
                      className="bg-transparent border-0 text-sm font-bold text-slate-900 tracking-tight focus:ring-0 w-full p-0 placeholder:text-white/5"
                    />
                  </td>
                  <td className="px-8 py-4">
                    <select 
                      value={t.category_name} 
                      onChange={(e) => handleUpdate(i, 'category_name', e.target.value)}
                      className="bg-slate-900/[0.03] border border-slate-900/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-900/70 cursor-pointer hover:border-slate-900/20 transition-all outline-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 group/amt">
                       <span className={`text-sm font-black tabular-nums tracking-tighter ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900'}`}>
                         {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <button 
                      onClick={() => handleRemove(i)}
                      className="h-8 w-8 rounded-xl bg-slate-900/5 border border-slate-900/5 flex items-center justify-center text-slate-900/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 p-8 bg-slate-900/[0.02] border border-slate-900/5 rounded-[32px] bg-noise">
         <button 
           onClick={onCancel}
           className="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900/50 hover:text-slate-900 transition-all bg-slate-900/5"
         >
           Cancel Transmission
         </button>
         <button 
           onClick={handleCommit}
           disabled={isSyncing || items.length === 0}
           className="px-12 py-4 rounded-xl bg-emerald-500 text-[#04050a] font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:scale-[1.05] transition-all active:scale-95 disabled:opacity-50"
         >
           {isSyncing ? "Syncing..." : <>Commit to Terminal <Check size={14} /></>}
         </button>
      </div>
    </div>
  );
}
