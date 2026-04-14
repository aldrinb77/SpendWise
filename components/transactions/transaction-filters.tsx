"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LucideSearch, LucideFilter, LucideDownload, LucideChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TransactionFilters() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative w-full md:max-w-sm">
        <LucideSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search transactions..." className="pl-10 h-10 rounded-xl" />
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 whitespace-nowrap">
          <LucideFilter className="h-4 w-4" />
          More Filters
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 whitespace-nowrap">
              All Categories
              <LucideChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Food & Dining</DropdownMenuItem>
            <DropdownMenuItem>Transportation</DropdownMenuItem>
            <DropdownMenuItem>Shopping</DropdownMenuItem>
            <DropdownMenuItem>Bills</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-muted mx-2" />

        <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 whitespace-nowrap">
          <LucideDownload className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
