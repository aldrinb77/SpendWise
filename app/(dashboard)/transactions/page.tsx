import React from "react";
import TransactionTable from "@/components/transactions/transaction-table";
import TransactionFilters from "@/components/transactions/transaction-filters";
import { Button } from "@/components/ui/button";
import { LucidePlus, LucideUpload } from "lucide-react";
import Link from "next/link";
import AddTransactionButton from "@/components/shared/add-transaction-button";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Detailed log of all your income and expenses.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/import">
            <Button variant="outline">
              <LucideUpload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </Link>
          <AddTransactionButton className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            Add New
          </AddTransactionButton>
        </div>
      </div>

      <div className="space-y-4">
        <TransactionFilters />
        <TransactionTable />
      </div>

      {/* Pagination or Infinite Scroll would go here */}
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Showing 1-10 of 124 transactions</p>
      </div>
    </div>
  );
}
