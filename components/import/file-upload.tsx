"use client";

import React, { useCallback, useState } from "react";
import { LucideUpload, LucideFileText, LucideX, LucideCheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onFileSelect, isLoading = false }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSelect(file);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelect(file);
    }
  };

  const validateAndSelect = (file: File) => {
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a PDF, Excel, or CSV file.",
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error("File too large", {
        description: "Maximum file size is 10MB.",
      });
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center gap-4 group ${
          dragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
        }`}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept=".pdf,.xlsx,.xls,.csv"
          disabled={isLoading}
        />
        
        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <LucideUpload className="h-10 w-10 text-primary" />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold">Import Statement</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Drag and drop your bank statement here, or click to browse.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1">
              <LucideFileText className="h-3 w-3" /> PDF
            </span>
            <span className="flex items-center gap-1">
              <LucideFileText className="h-3 w-3" /> Excel
            </span>
            <span className="flex items-center gap-1">
              <LucideFileText className="h-3 w-3" /> CSV
            </span>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-8 p-6 bg-white dark:bg-slate-900 rounded-3xl border shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <LucideFileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-4 mr-4">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-indeterminate" />
                  </div>
                </div>
              ) : (
                <button
                  aria-label="Remove file"
                  onClick={() => setSelectedFile(null)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <LucideX className="h-5 w-5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
