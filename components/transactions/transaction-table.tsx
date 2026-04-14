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

const mockTransactions = [
  { id: "1", date: "2024-04-12", description: "Zomato", category: "Food & Dining", amount: -450, method: "UPI", status: "Completed" },
  { id: "2", date: "2024-04-12", description: "Uber", category: "Transportation", amount: -280, method: "Card", status: "Completed" },
  { id: "3", date: "2024-04-11", description: "HDFC Salary", category: "Salary", amount: 85000, method: "Transfer", status: "Completed" },
  { id: "4", date: "2024-04-11", description: "Netflix Subscription", category: "Entertainment", amount: -199, method: "Card", status: "Completed" },
  { id: "5", date: "2024-04-10", description: "Amazon Shopping", category: "Shopping", amount: -1250, method: "UPI", status: "Completed" },
];

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
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden p-8 space-y-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                No transactions found. Add one to get started!
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((t) => (
              <TableRow key={t.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell className="text-muted-foreground text-xs leading-none">
                  {new Date(t.date * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{t.description || "No description"}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">#{t.id?.slice(0, 8)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className="font-medium text-[10px] px-2 py-0 border-opacity-20"
                    style={{ 
                      backgroundColor: `${t.category_color}1a`, 
                      color: t.category_color,
                      borderColor: `${t.category_color}4d`
                    }}
                  >
                    {t.category_name}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-medium">
                  {t.payment_method || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-bold ${t.type === 'income' ? "text-emerald-500" : "text-foreground"}`}>
                    {t.type === 'income' ? "+" : ""}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(t.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    {(DropdownMenuTrigger as any) && (
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <LucideMoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    )}
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="cursor-pointer">
                        <LucidePencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <LucideCopy className="mr-2 h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <LucideReceipt className="mr-2 h-4 w-4" /> Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                        <LucideTrash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
