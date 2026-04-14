"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import FileUpload from "@/components/import/file-upload";
import ImportPreview from "@/components/import/import-preview";
import { parseBankPDF, ParsedTransaction } from "@/lib/parsers/pdf-parser";
import { Button } from "@/components/ui/button";
import { LucideCheck, LucideArrowLeft, LucideDatabase } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const router = useRouter();
  const [data, setData] = useState<ParsedTransaction[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsParsing(true);
    try {
      if (file.type === "application/pdf") {
        const parsedRaw = await parseBankPDF(file);
        
        // Enrich with categories from server
        const response = await fetch("/api/import/categorize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactions: parsedRaw }),
        });
        
        if (!response.ok) throw new Error("Failed to categorize");
        
        const enrichedData = await response.json() as any;
        setData(enrichedData);
        
        if (enrichedData.length === 0) {
          toast.warning("No transactions found", {
            description: "Try another file or check if the format is supported.",
          });
        }
      } else {
        toast.info("Excel/CSV support coming soon!", {
          description: "Currently, only PDF statements are processed.",
        });
      }
    } catch (error) {
      toast.error("Parsing failed", {
        description: "An error occurred while reading the file.",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleUpdate = (index: number, field: string, value: any) => {
    const newData = [...data];
    (newData[index] as any)[field] = value;
    setData(newData);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/import/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: data }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success("Success!", {
        description: `${data.length} transactions imported successfully.`,
      });
      router.push("/transactions");
    } catch (error) {
      toast.error("Save failed", {
        description: "There was an error saving your transactions.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-8 pb-32">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <LucideArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
          <p className="text-muted-foreground">Upload your bank statements to auto-categorize transactions.</p>
        </div>
      </div>

      {!data.length ? (
        <div className="mt-12">
          <FileUpload onFileSelect={handleFileSelect} isLoading={isParsing} />
        </div>
      ) : (
        <div className="space-y-6">
          <ImportPreview data={data} onUpdate={handleUpdate} />
          
          <div className="flex items-center justify-end gap-4 fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t z-50">
            <Button variant="outline" onClick={() => setData([])}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" size="lg" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <LucideDatabase className="mr-2 h-5 w-5" />
                  Save {data.length} Transactions
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
