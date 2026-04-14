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
  initialData?: any;
}

export default function TransactionForm({ open, onOpenChange, initialData }: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: initialData ? initialData.amount.toString() : "",
      description: initialData ? initialData.description : "",
      category: initialData ? initialData.category_id : "",
      date: initialData ? new Date(initialData.date * 1000) : new Date(),
      type: initialData ? initialData.type : "expense",
      paymentMethod: initialData ? initialData.payment_method : "UPI",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        amount: initialData.amount.toString(),
        description: initialData.description,
        category: initialData.category_id,
        date: new Date(initialData.date * 1000),
        type: initialData.type,
        paymentMethod: initialData.payment_method,
      });
    } else {
      form.reset({
        amount: "",
        description: "",
        category: "",
        date: new Date(),
        type: "expense",
        paymentMethod: "UPI",
      });
    }
  }, [initialData, open, form]);

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

      const url = initialData?.id ? `/api/transactions/${initialData.id}` : "/api/transactions";
      const method = initialData?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) throw new Error("Failed to save transaction");
      
      const payload = await response.json() as any;
      
      if (payload.fallbackToLocal) {
        const existing = localStorage.getItem("spendwise_transactions");
        const existingArray = existing ? JSON.parse(existing) : [];
        
        if (initialData?.id) {
          const filtered = existingArray.filter((t: any) => t.id !== initialData.id);
          localStorage.setItem("spendwise_transactions", JSON.stringify([{...payload.mockData, id: initialData.id}, ...filtered]));
        } else {
          localStorage.setItem("spendwise_transactions", JSON.stringify([payload.mockData, ...existingArray]));
        }
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
          <SheetTitle>{initialData ? "Edit Transaction" : "Add Transaction"}</SheetTitle>
          <SheetDescription>
            {initialData ? "Update your transaction details below." : "Record a new income or expense manually."}
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <div className="flex p-1 bg-muted rounded-xl gap-1">
              <Button
                type="button"
                variant={form.watch("type") === "expense" ? "default" : "ghost"}
                className="flex-1 rounded-lg h-9 font-bold"
                onClick={() => form.setValue("type", "expense")}
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={form.watch("type") === "income" ? "default" : "ghost"}
                className="flex-1 rounded-lg h-9 font-bold"
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
                  <FormLabel className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Amount (₹)</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} className="text-2xl font-black h-16 rounded-2xl bg-white dark:bg-slate-800 border-white/5 shadow-inner" type="number" step="0.01" />
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
                  <FormLabel className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Description</FormLabel>
                  <FormControl>
                    <Input placeholder="What was this for?" {...field} className="h-12 rounded-xl bg-white dark:bg-slate-800 border-white/5 font-bold" />
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
                    <FormLabel className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-800 border-white/5 font-bold">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-white/10 shadow-2xl">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="font-bold rounded-xl">{cat}</SelectItem>
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
                    <FormLabel className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-800 border-white/5 font-bold">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-white/10 shadow-2xl">
                        <SelectItem value="UPI" className="font-bold rounded-xl">UPI (Paytm/GPay)</SelectItem>
                        <SelectItem value="Cash" className="font-bold rounded-xl">Cash</SelectItem>
                        <SelectItem value="Card" className="font-bold rounded-xl">Credit/Debit Card</SelectItem>
                        <SelectItem value="Transfer" className="font-bold rounded-xl">Net Banking</SelectItem>
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
                  <FormLabel className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger render={
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-11 pl-3 text-left font-bold rounded-xl bg-white dark:bg-slate-800 border-white/5",
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
                    } />
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

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:scale-[1.02] transition-transform active:scale-95">
                {isSubmitting ? "Saving..." : (
                  <>
                    <LucideCheckCircle2 className="mr-2 h-5 w-5" />
                    {initialData ? "Update Record" : "Save Record"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
