"use client";

import React, { useState } from "react";
import TransactionForm from "@/components/transactions/transaction-form";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTransactionButtonProps {
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export default function AddTransactionButton({ 
  className,
  children, 
  showIcon = true
}: AddTransactionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className={cn(
          "h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04050a] font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.05] active:scale-95",
          className
        )}
      >
        {showIcon && <Plus size={16} />}
        {children || "Add Transaction"}
      </button>
      <TransactionForm open={open} onOpenChange={setOpen} />
    </>
  );
}
