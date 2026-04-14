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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ParsedTransaction } from "@/lib/parsers/pdf-parser";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_KEYWORDS } from "@/lib/categorization/keywords";

interface ImportPreviewProps {
  data: ParsedTransaction[];
  onUpdate: (index: number, field: string, value: any) => void;
}

export default function ImportPreview({ data, onUpdate }: ImportPreviewProps) {
  const categories = Object.keys(CATEGORY_KEYWORDS);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return {
         date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
         time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return { date: "Invalid", time: "" };
    }
  };

  return (
    <div className="rounded-3xl border border-white/20 glass-card shadow-2xl overflow-hidden mt-8 animate-in fade-in slide-in-from-bottom-8">
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Statement Passbook</h3>
          <p className="text-sm text-muted-foreground/80 font-medium">Verify your parsed transactions before committing to the ledger.</p>
        </div>
        <Badge className="bg-primary hover:bg-primary text-primary-foreground font-bold tracking-widest uppercase text-[10px] px-3 py-1">
          {data.length} Transactions Detected
        </Badge>
      </div>
      
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-xl z-10">
            <TableRow className="border-b border-white/10 hover:bg-transparent">
              <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground pl-6 w-[140px]">Date & Time</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Transaction Details</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground w-[180px]">Notes & Tags</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-right pr-6 w-[140px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => {
              const { date, time } = formatDate(row.date);
              return (
                <TableRow key={i} className="group border-b border-white/5 hover:bg-white/5 transition-colors cursor-default">
                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-muted-foreground tracking-tight tabular-nums">{date}</span>
                      <span className="text-[10px] text-muted-foreground/50 font-bold">{time}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Input
                      value={row.description}
                      onChange={(e) => onUpdate(i, "description", e.target.value)}
                      className="h-8 bg-transparent border-transparent hover:border-white/10 focus-visible:ring-1 focus-visible:ring-primary shadow-none font-bold text-sm tracking-tight px-2 rounded-xl transition-all"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Select
                      value={row.category_id}
                      onValueChange={(val) => onUpdate(i, "category_id", val)}
                    >
                      <SelectTrigger className="h-8 bg-transparent border-transparent hover:border-white/10 shadow-none font-black text-[9px] uppercase tracking-wider rounded-xl transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-white/10 shadow-xl">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-xs font-bold font-inter tracking-tight">
                            {cat}
                          </SelectItem>
                        ))}
                        <SelectItem value="Uncategorized" className="text-xs font-bold font-inter tracking-tight">Uncategorized</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell className="text-right pr-6">
                    <span className={`text-sm tracking-tight font-black ${row.type === "income" ? "text-emerald-500" : "text-foreground"}`}>
                      {row.type === "income" ? "+" : ""}
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(row.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
