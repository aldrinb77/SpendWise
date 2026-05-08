"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Check, 
  Calendar, 
  CreditCard, 
  ChevronDown, 
  Info 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/toast-provider";
import { CATEGORY_KEYWORDS } from "@/lib/categorization/keywords";

const transactionSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date(),
  type: z.enum(["income", "expense"]),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

const CATEGORIES = [
  { label: "Food & Dining", emoji: "🍕" },
  { label: "Transportation", emoji: "🚗" },
  { label: "Shopping", emoji: "🛍️" },
  { label: "Entertainment", emoji: "🎬" },
  { label: "Bills & Utilities", emoji: "⚡" },
  { label: "Healthcare", emoji: "❤️" },
  { label: "Education", emoji: "📚" },
  { label: "Investments", emoji: "💸" },
  { label: "Income", emoji: "💰" },
  { label: "Other", emoji: "📌" },
];

const PAYMENT_METHODS = [
  "UPI (Paytm/GPay)", "Cash", "Credit/Debit Card", "Net Banking", "NEFT/IMPS", "Auto Debit"
];

export default function TransactionForm({ open, onOpenChange, initialData }: TransactionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: initialData ? initialData.amount.toString() : "",
      description: initialData ? initialData.description : "",
      category: initialData ? initialData.category_name : "",
      date: initialData ? new Date(typeof initialData.date === 'number' ? initialData.date * 1000 : initialData.date) : new Date(),
      type: initialData ? initialData.type : "expense",
      paymentMethod: initialData ? initialData.payment_method : "UPI (Paytm/GPay)",
      notes: initialData ? initialData.notes : "",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          amount: initialData.amount.toString(),
          description: initialData.description,
          category: initialData.category_name,
          date: new Date(typeof initialData.date === 'number' ? initialData.date * 1000 : initialData.date),
          type: initialData.type,
          paymentMethod: initialData.payment_method,
          notes: initialData.notes || "",
        });
      } else {
        form.reset({
          amount: "",
          description: "",
          category: "",
          date: new Date(),
          type: "expense",
          paymentMethod: "UPI (Paytm/GPay)",
          notes: "",
        });
      }
    }
  }, [initialData, open, form]);

  const type = form.watch("type");

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    const toastId = toast({ type: 'loading', title: 'Processing Transaction', description: 'Updating terminal records...' });
    
    try {
      const formattedData = {
        date: data.date.toISOString(),
        amount: parseFloat(data.amount),
        type: data.type,
        category_name: data.category,
        description: data.description,
        payment_method: data.paymentMethod,
        notes: data.notes
      };

      const url = initialData?.id ? `/api/transactions/${initialData.id}` : "/api/transactions";
      const method = initialData?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) throw new Error("Terminal sync failed");
      
      toast({ type: 'success', title: 'Transaction Secured', description: 'Cloud ledger updated successfully.' });
      onOpenChange(false);
      setTimeout(() => window.location.reload(), 800);
    } catch (error: any) {
      toast({ type: 'error', title: 'Transmission Error', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-[#FFFFFF] border-l border-slate-900/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] z-[101] flex flex-col bg-noise overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
            
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-slate-900/5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {initialData ? "Edit Record" : "New Transaction"}
                </h2>
                <p className="text-xs text-slate-900/50 uppercase font-black tracking-widest mt-1">
                  Surveillance Unit · Manual Entry
                </p>
              </div>
              <button 
                onClick={() => onOpenChange(false)}
                aria-label="Close form"
                className="h-10 w-10 rounded-xl bg-slate-900/5 border border-slate-900/5 flex items-center justify-center text-slate-900/60 hover:text-slate-900 transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                
                {/* 1. Type Toggle */}
                <div className="flex gap-2 p-1 bg-slate-900/[0.03] rounded-2xl border border-slate-900/5">
                  <button
                    type="button"
                    onClick={() => form.setValue("type", "expense")}
                    className={cn(
                      "flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                      type === 'expense' ? "bg-[#f43f5e] text-slate-900 shadow-lg glow-red" : "text-slate-900/60 hover:text-slate-900/80"
                    )}
                  >
                    💸 Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => form.setValue("type", "income")}
                    className={cn(
                      "flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                      type === 'income' ? "bg-[#10b981] text-slate-900 shadow-lg glow-emerald" : "text-slate-900/60 hover:text-slate-900/80"
                    )}
                  >
                    💰 Income
                  </button>
                </div>

                {/* 2. Amount Input */}
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900/50">Amount</p>
                  <div className="relative inline-flex items-center justify-center group">
                    <span className={cn(
                      "text-4xl font-black mr-2 pb-1",
                      type === 'income' ? "text-emerald-500" : "text-rose-500"
                    )}>₹</span>
                    <input 
                      {...form.register("amount")}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      autoFocus
                      className={cn(
                        "bg-transparent border-0 text-5xl md:text-6xl font-black text-center focus:ring-0 focus:outline-none w-[200px] placeholder:text-white/5",
                        type === 'income' ? "text-emerald-500" : "text-rose-500"
                      )}
                    />
                    <div className={cn(
                      "absolute -bottom-2 left-0 right-0 h-[2px] rounded-full opacity-30 transition-shadow blur-[2px]",
                      type === 'income' ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                    )} />
                  </div>
                </div>

                {/* 3. Description */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900/50 flex items-center gap-2">
                    What was this for? <span className="h-1 w-1 rounded-full bg-slate-900/10" />
                  </label>
                  <input 
                    {...form.register("description")}
                    placeholder="e.g. Zomato dinner with friends"
                    className="w-full bg-slate-900/[0.03] border border-slate-900/5 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:border-slate-900/20 transition-all outline-none"
                  />
                  {form.formState.errors.description && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">{form.formState.errors.description.message}</p>}
                </div>

                {/* 4. Category */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-900/50 flex items-center gap-2">
                    Classification <span className="h-1 w-1 rounded-full bg-slate-900/10" />
                  </label>
                  <select 
                    {...form.register("category")}
                    className="w-full bg-slate-900/[0.03] border border-slate-900/5 rounded-2xl px-6 py-4 text-slate-900 font-bold cursor-pointer focus:border-slate-900/20 outline-none"
                  >
                    <option value="" disabled>Select Category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.label} value={cat.label}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Date & Payment Method */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-900/50 flex items-center gap-2">
                      Timeline <span className="h-1 w-1 rounded-full bg-slate-900/10" />
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-900/40 h-4 w-4" />
                      <input 
                        type="date"
                        value={format(form.watch("date"), "yyyy-MM-dd")}
                        onChange={(e) => form.setValue("date", new Date(e.target.value))}
                        className="w-full bg-slate-900/[0.03] border border-slate-900/5 rounded-2xl pl-12 pr-6 py-4 text-slate-900 font-bold focus:border-slate-900/20 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-900/50 flex items-center gap-2">
                      Terminal <span className="h-1 w-1 rounded-full bg-slate-900/10" />
                    </label>
                    <select 
                      {...form.register("paymentMethod")}
                      className="w-full bg-slate-900/[0.03] border border-slate-900/5 rounded-2xl px-6 py-4 text-slate-900 font-bold cursor-pointer focus:border-slate-900/20 outline-none"
                    >
                      {PAYMENT_METHODS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6. Notes Toggle */}
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowNotes(!showNotes)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-900/40 hover:text-slate-900/60 flex items-center gap-2 transition-colors"
                  >
                    <Info size={12} /> {showNotes ? "Hide Notes" : "Add Supplemental Notes (Optional)"}
                  </button>
                  <AnimatePresence>
                    {showNotes && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <textarea 
                          {...form.register("notes")}
                          placeholder="Internal transmission notes..."
                          rows={3}
                          className="w-full bg-slate-900/[0.03] border border-slate-900/5 rounded-2xl px-6 py-4 text-slate-900 font-medium focus:border-slate-900/20 outline-none mt-4 text-sm"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-900/5 bg-black/40">
              <button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className={cn(
                  "w-full py-5 rounded-2xl font-black uppercase tracking-widest text-slate-900 shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3",
                  type === 'income' ? "bg-[#10b981] hover:bg-[#34d399] glow-emerald" : "bg-[#f43f5e] hover:bg-[#fb7185] glow-red"
                )}
              >
                {isSubmitting ? <span className="animate-spin h-5 w-5 border-2 border-slate-900/20 border-t-white rounded-full" /> : (
                  <>
                    <Check size={20} />
                    {initialData ? "Verify Changes" : `Commit ${type}`}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
