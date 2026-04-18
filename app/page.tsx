"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideArrowRight, LucideWallet, LucideZap, LucideShield, LucideGlobe, LucideBarChart3, LucideLayout } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px]" />
        </div>

        <div className="container relative mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 rounded-full bg-white/5 border-white/10 text-primary py-1 px-4 font-bold tracking-widest text-[10px] uppercase">
              Next-Gen Wealth Management
            </Badge>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.9]">
              Reimagining <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-500">Wealth</span> <br />
              One Transaction At A Time.
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium mb-12 leading-relaxed">
              Experience the future of financial tracking. AI-powered insights, multi-currency support, and biometric security. Designed for the modern elite.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button render={
               <Link href="/dashboard" className="flex items-center">
                 Launch Terminal <LucideArrowRight className="ml-3 h-5 w-5" />
               </Link>
              } size="lg" className="h-16 px-10 rounded-2xl text-lg font-black uppercase tracking-widest bg-gradient-to-r from-primary to-blue-600 shadow-2xl shadow-primary/40 hover:scale-[1.05] transition-transform" />
              <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl text-lg font-black uppercase tracking-widest border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all">
                View Showcase
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75" />
            <div className="relative rounded-[40px] border border-white/10 bg-slate-900 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] aspect-video">
                <div className="absolute top-0 left-0 w-full h-12 bg-slate-800/50 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <div className="pt-12 p-8 h-full flex flex-col gap-6 bg-slate-950 relative z-0">
                  {/* Top Nav Mock */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/20 rounded-xl" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-20 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <div className="h-8 w-8 bg-white/5 rounded-full" />
                       <div className="h-8 w-8 bg-white/5 rounded-full" />
                    </div>
                  </div>
                  {/* Body Mock */}
                  <div className="flex-1 grid grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="col-span-2 space-y-6 flex flex-col">
                      {/* Chart Area */}
                      <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 p-6 relative overflow-hidden flex flex-col">
                        <div className="h-4 w-1/4 bg-white/10 rounded mb-4" />
                        <div className="flex-1 relative">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                             <defs>
                               <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.5" />
                                 <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                               </linearGradient>
                             </defs>
                             <motion.path 
                               d="M0,100 L0,60 Q20,30 40,70 T80,40 T100,20 L100,100 Z" 
                               fill="url(#grad)" 
                               initial={{ opacity: 0, y: 50 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                             />
                             <motion.path 
                               d="M0,60 Q20,30 40,70 T80,40 T100,20" 
                               fill="none"
                               stroke="#4F46E5"
                               strokeWidth="2"
                               initial={{ pathLength: 0, opacity: 0 }}
                               animate={{ pathLength: 1, opacity: 1 }}
                               transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                             />
                          </svg>
                        </div>
                      </div>
                      {/* Sub Cards */}
                      <div className="h-32 grid grid-cols-3 gap-4">
                        {[1,2,3].map(i => (
                           <div key={i} className="bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col justify-end gap-2">
                             <div className="h-2 w-1/2 bg-white/10 rounded" />
                             <div className="h-4 w-3/4 bg-white/20 rounded" />
                           </div>
                        ))}
                      </div>
                    </div>
                    {/* Right Column */}
                    <div className="col-span-1 bg-white/5 rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
                      <div className="h-4 w-1/2 bg-white/10 rounded mb-6" />
                      {[1,2,3,4,5].map(i => (
                         <div key={i} className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-white/5 rounded-xl shrink-0" />
                           <div className="flex-1 space-y-2">
                             <div className="h-3 w-full bg-white/10 rounded" />
                             <div className="h-2 w-2/3 bg-white/5 rounded" />
                           </div>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
          </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-20 text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Engineered for <span className="text-primary underline decoration-indigo-500/30 underline-offset-8">Performance</span>.</h2>
            <p className="text-muted-foreground font-bold tracking-tight">Every edge case considered. Every pixel perfected.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Quantum Speed", icon: LucideZap, text: "Instant PDF parsing of 10,000+ transactions in milliseconds." },
              { title: "Military Shield", icon: LucideShield, text: "Client-side end-to-end encryption. Your data never leaves your device." },
              { title: "Neuro Insight", icon: LucideBarChart3, text: "Deep learning models predict your spending fatigue and saving potential." },
              { title: "Global Sync", icon: LucideGlobe, text: "Support for all major Indian banks and UPI merchant categorizations." },
              { title: "Glass UI", icon: LucideLayout, text: "The most beautiful financial interface ever built. Period." },
              { title: "Vault Logic", icon: LucideWallet, text: "Advanced multi-vault architecture for tracking complex asset portfolios." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-left hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <f.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-4">{f.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-400/20 blur-[100px] rounded-full translate-x-1/2" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-10 leading-[0.9]">
            Take Control of Your <br />Financial Destiny.
          </h2>
          <Button render={
           <Link href="/dashboard">Get Started Free</Link>
          } size="lg" className="h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest bg-white text-primary hover:bg-slate-100 transition-all shadow-2xl" />
          <p className="mt-8 text-white/60 font-bold hover:text-white transition-colors cursor-pointer uppercase text-xs tracking-widest leading-relaxed">
            No credit card required • GDPR Ready • Bank-Grade Security
          </p>
        </div>
      </section>

      <footer className="py-12 bg-slate-950 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <LucideWallet className="h-4 w-4" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">SpendWise</span>
          </div>
          <p className="text-slate-500 font-bold text-sm tracking-tight">&copy; 2026 SpendWise Elite Wealth Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
