"use client";

import React, { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import TransactionForm from "@/components/transactions/transaction-form";
import { LucidePlus } from "lucide-react";

interface AddTransactionButtonProps extends React.ComponentProps<typeof Button> {
  showIcon?: boolean;
  children?: React.ReactNode;
}

export default function AddTransactionButton({ 
  children, 
  showIcon = true,
  ...props 
}: AddTransactionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} {...props}>
        {showIcon && <LucidePlus className="mr-2 h-4 w-4" />}
        {children || "Add Transaction"}
      </Button>
      <TransactionForm open={open} onOpenChange={setOpen} />
    </>
  );
}
