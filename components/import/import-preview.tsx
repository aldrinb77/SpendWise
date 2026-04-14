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

  return (
    <div className="rounded-3xl border bg-white dark:bg-slate-900 shadow-xl overflow-hidden mt-8 animate-in fade-in slide-in-from-bottom-8">
      <div className="p-6 border-b flex items-center justify-between bg-muted/30">
        <div>
          <h3 className="text-lg font-bold">Review Transactions</h3>
          <p className="text-sm text-muted-foreground">Modify any incorrectly parsed data before saving.</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {data.length} Transactions Found
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[180px]">Category</TableHead>
              <TableHead className="text-right w-[120px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} className="group">
                <TableCell>
                  <Input
                    value={row.date}
                    onChange={(e) => onUpdate(i, "date", e.target.value)}
                    className="h-8 border-transparent group-hover:border-input transition-all"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={row.description}
                    onChange={(e) => onUpdate(i, "description", e.target.value)}
                    className="h-8 border-transparent group-hover:border-input transition-all"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={row.category_id}
                    onValueChange={(val) => onUpdate(i, "category_id", val)}
                  >
                    <SelectTrigger className="h-8 border-transparent group-hover:border-input transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className={`font-bold ${row.type === "income" ? "text-emerald-500" : "text-foreground"}`}>
                    {row.type === "income" ? "+" : "-"}₹{row.amount.toLocaleString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
