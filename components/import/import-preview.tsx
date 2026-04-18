"use client";

import React, { useState } from "react";
import { 
  LucideCheck, 
  LucideX, 
  LucideTrash2, 
  LucideArrowUpRight, 
  LucideArrowDownLeft 
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Entertainment", "Utilities & Bills", "Health", "Education", "Transfers", "Cash", "Income", "Other"];

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
    const toastId = toast({ type: 'loading', title: 'Syncing Ledger', description: 'Transmitting encrypted blocks...' });
    
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
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      toast({ type: 'error', title: 'Sync Failed', description: 'Network transmission interrupted.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#0d1220] border border-white/5 rounded-[40px] overflow-hidden noise shadow-2xl">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] sticky top-0 z-10 backdrop-blur-xl">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Timeline</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Entity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Classification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Value</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center w-[80px]">Node</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t, i) => (
                <tr key={i} className="group border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-4">
                    <span className="text-[11px] font-black text-white/40 tabular-nums tracking-widest uppercase">
                      {new Date(t.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <input 
                      value={t.description} 
                      onChange={(e) => handleUpdate(i, 'description', e.target.value)}
                      className="bg-transparent border-0 text-sm font-bold text-white tracking-tight focus:ring-0 w-full p-0 placeholder:text-white/5"
                    />
                  </td>
                  <td className="px-8 py-4">
                    <select 
                      value={t.category_name} 
                      onChange={(e) => handleUpdate(i, 'category_name', e.target.value)}
                      className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white/50 cursor-pointer hover:border-white/20 transition-all outline-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 group/amt">
                       <span className={`text-sm font-black tabular-nums tracking-tighter ${t.type === 'income' ? 'text-emerald-500' : 'text-white'}`}>
                         {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <button 
                      onClick={() => handleRemove(i)}
                      className="h-8 w-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <LucideTrash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] noise">
         <button 
           onClick={onCancel}
           className="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all bg-white/5"
         >
           Cancel Transmission
         </button>
         <button 
           onClick={handleCommit}
           disabled={isSyncing || items.length === 0}
           className="px-12 py-4 rounded-xl bg-emerald-500 text-[#04050a] font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:scale-[1.05] transition-all active:scale-95 disabled:opacity-50"
         >
           {isSyncing ? "Syncing..." : <>Commit to Terminal <LucideCheck size={14} /></>}
         </button>
      </div>
    </div>
  );
}
