"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { LucideCalendar, LucideCheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CATEGORY_KEYWORDS } from "@/lib/categorization/keywords";

const transactionSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.date(),
  type: z.enum(["income", "expense"]),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransactionForm({ open, onOpenChange }: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: "",
      description: "",
      category: "",
      date: new Date(),
      type: "expense",
      paymentMethod: "UPI",
    },
  });

  const categories = Object.keys(CATEGORY_KEYWORDS);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        date: Math.floor(data.date.getTime() / 1000),
        amount: parseFloat(data.amount),
        type: data.type,
        category_id: data.category,
        category_name: data.category,
        description: data.description,
        payment_method: data.paymentMethod,
        category_color: "#60A5FA" // default fallback
      };

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) throw new Error("Failed to save transaction");
      
      const payload = await response.json() as any;
      
      if (payload.fallbackToLocal) {
        const existing = localStorage.getItem("spendwise_transactions");
        const existingArray = existing ? JSON.parse(existing) : [];
        localStorage.setItem("spendwise_transactions", JSON.stringify([payload.mockData, ...existingArray]));
      }
      
      onOpenChange(false);
      form.reset();
      // Reload perfectly ensures all charts and tables independently pull the fresh values from source
      window.location.reload(); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l-0">
        <SheetHeader>
          <SheetTitle>Add Transaction</SheetTitle>
          <SheetDescription>
            Record a new income or expense manually.
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <div className="flex p-1 bg-muted rounded-xl gap-1">
              <Button
                type="button"
                variant={form.watch("type") === "expense" ? "default" : "ghost"}
                className="flex-1 rounded-lg h-9"
                onClick={() => form.setValue("type", "expense")}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={form.watch("type") === "income" ? "default" : "ghost"}
                className="flex-1 rounded-lg h-9"
                onClick={() => form.setValue("type", "income")}
              >
                Income
              </Button>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} className="text-2xl font-bold h-14" type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="What was this for?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UPI">UPI (Paytm/GPay)</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Credit/Debit Card</SelectItem>
                        <SelectItem value="Transfer">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <LucideCalendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-900 border-t">
              <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-primary/20">
                <LucideCheckCircle2 className="mr-2 h-5 w-5" />
                Save Transaction
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
