"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Wallet, 
  Zap, 
  Shield, 
  Globe, 
  BarChart3, 
  Layout 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050508] font-ui selection:bg-emerald-500/30 selection:text-slate-900">
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050508; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 2px; }
      `}</style>

      {/* FLOAT NAVBAR */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-12 px-8 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] min-w-[320px] md:min-w-[600px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Wallet className="w-4 h-4 text-black" />
          </div>
          <span className="text-slate-900 font-black text-sm tracking-tight hidden sm:block">SpendWise</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          {['Features', 'Dashboard', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-slate-900/50 hover:text-slate-900 transition-all">{item}</a>
          ))}
        </div>
        
        <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-black bg-white hover:bg-emerald-400 transition-all px-6 py-2.5 rounded-full shadow-xl">
          Get Access
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050508] pt-20">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='bg-noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23bg-noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px'
          }}
        />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)', top: '-20%', left: '-10%' }}
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', bottom: '-10%', right: '-5%' }}
            animate={{ x: [0, -40, 0], y: [0, -60, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-20 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4"
          >
            <div className="h-px w-10 bg-emerald-500/20" />
            <span className="text-emerald-500/60 text-[10px] font-black tracking-[0.4em] uppercase">Premium Wealth Terminal</span>
            <div className="h-px w-10 bg-emerald-500/20" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 leading-[0.85] tracking-tight"
          >
            <span className="font-display italic text-slate-900 text-7xl md:text-[9.5rem] block">
              Reimagine
            </span>
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 text-6xl md:text-[9.5rem] block mt-4">
              your wealth.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-900/60 text-lg md:text-xl leading-relaxed font-medium"
          >
            The only expense tracker that thinks as fast as you spend.<br/>
            AI-categorized transactions, surgical insights, zero bg-noise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/login" className="group relative flex items-center gap-3 px-10 py-5 rounded-2xl bg-emerald-500 text-[#04050a] font-black uppercase tracking-widest text-[11px] overflow-hidden transition-all hover:bg-emerald-400 hover:scale-[1.05] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)]">
              Start Tracking Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="flex items-center gap-3 px-10 py-5 rounded-2xl border border-slate-900/10 text-slate-900/60 font-black uppercase tracking-widest text-[11px] hover:border-white/30 hover:text-slate-900 transition-all bg-slate-900/[0.02]">
               Watch Demo
            </button>
          </motion.div>

          {/* HERO DASHBOARD PREVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: '2000px' }}
            className="relative max-w-6xl mx-auto pt-20"
          >
            <div className="absolute -inset-10 bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-[120px] rounded-[100px] pointer-events-none opacity-50" />

            <div className="relative rounded-[40px] overflow-hidden border border-white/[0.08] shadow-[0_80px_250px_rgba(0,0,0,0.9)] bg-[#FFFFFF] bg-noise">
              
              {/* Browser Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06] bg-slate-900/[0.02] relative">
                <div className="flex items-center gap-2 relative z-10 w-20">
                  <div className="w-3 h-3 rounded-full bg-rose-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2 rounded-xl bg-black/40 border border-white/[0.06] w-full max-w-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-900/40 text-[10px] font-mono tracking-tight truncate">spendwise-terminal.network/dashboard</span>
                </div>
                
                <div className="flex items-center gap-3 relative z-10 w-20 justify-end">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-[10px] font-black">JD</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Internal Mock */}
              <div className="p-8 grid grid-cols-12 gap-6 bg-gradient-to-b from-white/[0.01] to-transparent">
                <div className="col-span-2 space-y-2 opacity-40">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={cn("h-10 rounded-xl", i === 1 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-900/5")} />
                  ))}
                </div>

                <div className="col-span-10 space-y-8 text-left">
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Net Balance', value: '₹38.4k', change: '+12.4%', up: true, accent: 'emerald' },
                      { label: 'Total Income', value: '₹52.0k', change: '+8.1%', up: true, accent: 'blue' },
                      { label: 'Expenses', value: '₹13.5k', change: '-3.2%', up: false, accent: 'rose' },
                      { label: 'Savings Rate', value: '73.9%', change: '+5%', up: true, accent: 'violet' },
                    ].map((stat, i) => (
                      <motion.div key={i} className="p-5 rounded-3xl border border-white/[0.06] bg-slate-900/[0.02]">
                        <p className="text-[9px] font-black text-slate-900/40 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                        <p className={cn("text-2xl font-black tabular-nums tracking-tighter", `text-${stat.accent}-400`)}>{stat.value}</p>
                        <p className={cn("text-[10px] font-bold mt-2", stat.up ? 'text-emerald-400' : 'text-rose-400')}>{stat.change}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 p-6 rounded-3xl border border-white/[0.08] bg-slate-900/[0.02] relative overflow-hidden h-[200px]">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-slate-900/70 text-[11px] font-black uppercase tracking-widest">Spending Trend</p>
                        <span className="text-emerald-400 text-[9px] font-black bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Surveillance Active</span>
                      </div>
                      <svg viewBox="0 0 280 80" className="w-full h-full opacity-60">
                        <defs>
                          <linearGradient id="g-hero" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <motion.path d="M0,80 L0,55 C20,45 40,60 60,50 S100,25 140,35 S200,20 240,15 S265,18 280,10 L280,80 Z"
                          fill="url(#g-hero)"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
                        <motion.path d="M0,55 C20,45 40,60 60,50 S100,25 140,35 S200,20 240,15 S265,18 280,10"
                          fill="none" stroke="#10b981" strokeWidth="2.5"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 3, delay: 0.8, ease: 'easeInOut' }} />
                      </svg>
                    </div>

                    <div className="col-span-1 p-6 rounded-3xl border border-white/[0.08] bg-slate-900/[0.02]">
                      <p className="text-slate-900/70 text-[11px] font-black uppercase tracking-widest mb-6">Recent</p>
                      {[
                        { name: 'Zomato', cat: 'Food', amount: '-₹285', color: '#f97316' },
                        { name: 'Salary', cat: 'Income', amount: '+₹52k', color: '#10b981' },
                        { name: 'Netflix', cat: 'Play', amount: '-₹649', color: '#ef4444' },
                      ].map((tx, i) => (
                        <div key={i} className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.04] last:border-0 last:mb-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-900/[0.03] border border-white/[0.06]">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: tx.color }} />
                            </div>
                            <div>
                              <p className="text-slate-900 font-extrabold text-[11px] leading-none mb-1">{tx.name}</p>
                              <p className="text-slate-900/40 text-[9px] font-black uppercase tracking-widest">{tx.cat}</p>
                            </div>
                          </div>
                          <span className={cn("text-[11px] font-black tabular-nums tracking-tighter", tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-900/70')}>
                            {tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-black text-[10px] font-black px-6 py-2.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] shadow-emerald-500/40 uppercase tracking-[0.2em] relative z-20"
            >
              ✦ Surveillance Active
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 bg-[#030306] border-t border-white/[0.04] mt-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-20">
            <div className="max-w-xs text-left space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-black" />
                </div>
                <span className="text-slate-900 font-black text-xl tracking-tight">SpendWise</span>
              </div>
              <p className="text-white/25 text-sm leading-relaxed font-medium">The premium wealth terminal for India's next generation of financially conscious individuals. Local-first. Privacy-centric. Machine-powered.</p>
              <div className="flex items-center gap-6">
                 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900/40">Operational Terminal Node 01</span>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 md:gap-32 text-left">
              <div className="space-y-6">
                <p className="text-slate-900/50 text-[10px] tracking-[0.3em] uppercase font-black">Structure</p>
                {['Dashboard', 'Ledger', 'AI Insights', 'Inversion'].map(l => (
                  <a key={l} href="#" className="block text-slate-900/60 hover:text-slate-900 text-xs font-bold transition-colors">{l}</a>
                ))}
              </div>
              <div className="space-y-6">
                <p className="text-slate-900/50 text-[10px] tracking-[0.3em] uppercase font-black">Protocols</p>
                {['Privacy Policy', 'Terms of Service', 'Security Matrix', 'Contact'].map(l => (
                  <a key={l} href="#" className="block text-slate-900/60 hover:text-slate-900 text-xs font-bold transition-colors">{l}</a>
                ))}
              </div>
              <div className="space-y-6 hidden lg:block">
                <p className="text-slate-900/50 text-[10px] tracking-[0.3em] uppercase font-black">Region</p>
                <span className="block text-slate-900/60 text-xs font-bold">Bangalore, IN</span>
                <span className="block text-slate-900/60 text-xs font-bold">Mumbai, IN</span>
                <span className="block text-slate-900/60 text-xs font-bold">Delhi, IN</span>
              </div>
            </div>
          </div>
          <div className="mt-32 pt-12 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/10 text-[10px] font-black uppercase tracking-widest italic">© 2026 SpendWise Intelligence Unit. All systems nominal.</p>
            <div className="flex items-center gap-1.5 grayscale opacity-30">
               <span className="text-[10px] font-black text-slate-900/70 uppercase tracking-widest">Powered by</span>
               <div className="h-4 w-12 bg-slate-900/20 rounded-md" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
