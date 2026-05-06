"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface RecentTransactionsProps {
  limit?: number;
}

export default function RecentTransactions({ limit = 8 }: RecentTransactionsProps) {
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const json = await res.json();
        
        let apiTxns = [];
        if (Array.isArray(json)) {
            apiTxns = json;
        } else if (json.fallbackToLocal && Array.isArray(json.transactions)) {
            apiTxns = json.transactions;
        }

        // Merge with local storage
        const local = localStorage.getItem("spendwise_transactions");
        let localTxns = [];
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) localTxns = parsed;
          } catch (e) {
            console.error("Dashboard parity failure", e);
          }
        }

        const combined = [...apiTxns];
        const apiIds = new Set(apiTxns.map((t: any) => t.id));
        localTxns.forEach((lt: any) => {
          if (!apiIds.has(lt.id)) combined.push(lt);
        });

        const sorted = combined.sort((a, b) => {
          const timeA = new Date(typeof a.date === 'number' ? a.date * 1000 : a.date).getTime();
          const timeB = new Date(typeof b.date === 'number' ? b.date * 1000 : b.date).getTime();
          return timeB - timeA;
        });
        setTxns(sorted.slice(0, limit));
      } catch (err) {
        console.error("Dashboard trans retrieval error", err);
        const local = localStorage.getItem("spendwise_transactions");
        if (local) {
           const parsed = JSON.parse(local);
           parsed.sort((a: any, b: any) => {
              const timeA = new Date(typeof a.date === 'number' ? a.date * 1000 : a.date).getTime();
              const timeB = new Date(typeof b.date === 'number' ? b.date * 1000 : b.date).getTime();
              return timeB - timeA;
           });
           setTxns(parsed.slice(0, limit));
        }
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [limit]);

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-16 w-full skeleton rounded-2xl" />
      ))}
    </div>
  );

  return (
    <div className="bg-[#0d1220] border border-white/5 rounded-[32px] overflow-hidden noise shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Entity</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Classification</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {txns.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-white/20 font-bold uppercase tracking-widest text-[10px]">
                   No Recent Transmissions
                </td>
              </tr>
            ) : (
              txns.map((t, i) => (
                <motion.tr 
                  key={t.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">{t.description}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">
                        {new Date(typeof t.date === 'number' ? t.date * 1000 : t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase()} · {t.payment_method || 'UPI'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 shadow-inner">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white/50">{t.category_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-black tabular-nums tracking-tighter ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                      {t.type === 'income' ? '+' : ''}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(t.amount)}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
