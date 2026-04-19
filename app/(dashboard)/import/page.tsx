"use client";

import React, { useState } from "react";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  History,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast-provider";
import ImportPreview from "@/components/import/import-preview";
import { parseBankPDF } from "@/lib/parsers/pdf-parser";

export default function ImportPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Upload, 2: Processing, 3: Preview
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    setFile(selected);
    setError(null);
    setStep(2);
    
    try {
      setStatusText("Initializing Sandbox...");
      setProgress(10);
      await sleep(600);
      
      setStatusText("Reading File Architecture...");
      setProgress(30);
      
      // Real Ingestion Attempt
      const results = await parseBankPDF(selected);
      
      setStatusText("Extracting Financial Matrix...");
      setProgress(60);
      await sleep(800);
      
      setStatusText("Classifying Entities...");
      setProgress(90);
      await sleep(600);

      if (results.length === 0) {
        throw new Error("No readable transactions found. The PDF might be password protected or use an unsupported format.");
      }
      
      // Transform lib/parsers format to UI format
      const uiFormatted = results.map(tx => ({
        date: Math.floor(new Date(tx.date).getTime() / 1000),
        description: tx.description,
        amount: tx.amount,
        type: tx.type,
        category_name: tx.category_id || "Other"
      }));

      setParsedData(uiFormatted);
      setProgress(100);
      setStatusText("Extraction Complete");
      await sleep(400);
      setStep(3);
      
    } catch (err: any) {
      console.error("PDF Ingestion Error:", err);
      setError(err.message || "Failed to parse the bank statement.");
      setStep(1); // Go back to upload on error
      toast({
        type: "error",
        title: "Ingestion Failure",
        description: err.message || "The file format was not recognized by our surveillance unit."
      });
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-12 animate-fade-in relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 transition-all hover:text-emerald-400 cursor-default">
              Ingestion Terminal · Secured
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display italic text-white leading-tight">
            Data Ingestion
          </h1>
          <p className="text-white/30 font-medium text-lg tracking-tight px-1">
            Universal statement processing with <span className="text-white/50 underline decoration-white/10 underline-offset-4">client-side encryption</span>
          </p>
        </div>
        
        <div className="hidden md:flex items-center gap-12 text-white/20">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-widest mb-1">Status</span>
              <span className="text-xs font-bold text-emerald-500">{error ? "Transmission Error" : "Node Ready"}</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-widest mb-1">Latency</span>
              <span className="text-xs font-bold text-emerald-500">0.02ms</span>
           </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: UPLOAD */}
          {step === 1 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d1220] border-2 border-dashed border-white/10 rounded-[40px] p-12 lg:p-24 flex flex-col items-center justify-center text-center space-y-8 group hover:border-emerald-500/30 transition-all duration-500 noise"
            >
              <div className="h-24 w-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                 <Upload size={32} className="text-emerald-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white tracking-tight">Drop your matrix here</h3>
                <p className="text-white/30 text-sm max-w-sm mx-auto leading-relaxed">
                  Supports PDF or XLSX bank statements from HDFC, SBI, ICICI, Axis, Paytm and more.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-3 text-rose-500 text-xs font-bold max-w-md">
                   <AlertTriangle size={16} /> {error}
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-3">
                 {['PDF', 'XLSX', 'CSV'].map(ext => (
                   <span key={ext} className="px-5 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-white/40 tracking-widest">{ext}</span>
                 ))}
              </div>
              <label className="cursor-pointer group/btn">
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.xlsx,.csv" />
                <div className="px-12 py-5 rounded-2xl bg-white text-[#04050a] font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl hover:scale-[1.05] transition-all active:scale-95 group-hover/btn:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  Browse Terminal Files <ArrowRight size={14} />
                </div>
              </label>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500/50 pt-4">
                 <ShieldCheck size={12} /> Local-Only Processing Active
              </div>
            </motion.div>
          )}

          {/* STEP 2: PROCESSING */}
          {step === 2 && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#0d1220] border border-white/5 rounded-[40px] p-12 lg:p-24 space-y-12 noise shadow-2xl"
            >
              <div className="flex flex-col items-center justify-center space-y-6">
                <Loader2 size={48} className="text-emerald-500 animate-spin" />
                <div className="text-center space-y-2">
                   <h3 className="text-xl font-bold text-white tracking-tight uppercase tracking-widest">{statusText}</h3>
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{progress}% Complete</p>
                </div>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 p-0.5">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-30 pointer-events-none">
                 {["Parsing PDF Blocks", "Identifying Merchants", "Applying ML Logic", "Constructing Ledger"].map((t, i) => (
                   <div key={t} className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5">
                      <CheckCircle2 size={16} className={progress >= (i+1)*25 ? "text-emerald-500" : "text-white/20"} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t}</span>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: PREVIEW */}
          {step === 3 && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-[#0d1220] border border-white/5 rounded-[32px] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-20" />
                <div className="flex items-center gap-6">
                   <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Files</span>
                      <span className="text-xl font-black text-white leading-none">01</span>
                   </div>
                   <div>
                      <h4 className="text-white font-bold tracking-tight truncate max-w-[200px] md:max-w-xs">{file?.name}</h4>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Extraction Complete · Ready for Sync</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                   <div className="text-right">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Found</p>
                      <p className="text-2xl font-black text-white tracking-tighter tabular-nums">{parsedData.length}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Net Value</p>
                      <p className="text-2xl font-black text-emerald-500 tracking-tighter tabular-nums">
                        ₹{(parsedData.reduce((acc, curr) => acc + (curr.type === 'expense' ? curr.amount : 0), 0) / 1000).toFixed(1)}k
                      </p>
                   </div>
                </div>
              </div>

              <ImportPreview 
                data={parsedData} 
                onCancel={() => {
                  setStep(1);
                  setFile(null);
                }} 
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
