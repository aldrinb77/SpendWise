"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LucideArrowRight, 
  LucideWallet, 
  LucideZap, 
  LucideShield, 
  LucideGlobe, 
  LucideBarChart3, 
  LucideLayout 
} from "lucide-react";
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050508] font-ui selection:bg-emerald-500/30 selection:text-white">
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050508; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 2px; }
      `}</style>



      {/* FLOAT NAVBAR */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-6 py-3 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)] w-fit">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <LucideWallet className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">SpendWise</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {['Features', 'Dashboard', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-xs text-white/50 hover:text-white transition-colors font-medium tracking-wide">{item}</a>
          ))}
        </div>
        <Link href="/login" className="text-xs font-semibold text-black bg-white hover:bg-white/90 transition-all px-4 py-2 rounded-full tracking-wide">
          Get Access
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050508]">
        {/* Noise grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px'
          }}
        />

        {/* Animated mesh gradient blobs */}
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
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', top: '40%', left: '50%' }}
            animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Thin horizontal line accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 text-center">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <div className="h-px w-12 bg-emerald-500/60" />
            <span className="text-emerald-400 text-xs font-semibold tracking-[0.25em] uppercase">Premium Wealth Terminal</span>
            <div className="h-px w-12 bg-emerald-500/60" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 leading-[0.92] tracking-tight"
          >
            <span className="font-display italic text-white text-7xl md:text-[9rem] block">
              Reimagine
            </span>
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 text-7xl md:text-[9rem] block">
              your wealth.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl mx-auto text-white/40 text-lg leading-relaxed mb-12 font-light"
          >
            The only expense tracker that thinks as fast as you spend. AI-categorized transactions, surgical insights, zero noise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
          >
            <Link href="/login" className="group relative flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-black font-bold text-sm tracking-wide overflow-hidden transition-all hover:bg-emerald-400 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              <span className="relative z-10">Start Tracking Free</span>
              <LucideArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white/60 font-medium text-sm tracking-wide hover:border-white/30 hover:text-white transition-all">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-white/70 ml-0.5" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 mb-16"
          >
            {[
              { value: '2.4M+', label: 'Transactions Tracked' },
              { value: '98%', label: 'Categorization Accuracy' },
              { value: '₹0', label: 'Forever Free' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-white text-xl font-black tracking-tight">{stat.value}</p>
                <p className="text-white/30 text-xs tracking-wide">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* HERO DASHBOARD PREVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: '1200px' }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-4 bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl rounded-[40px]" />

            <div className="relative rounded-[28px] overflow-hidden border border-white/[0.07] shadow-[0_80px_200px_rgba(0,0,0,0.8)]"
              style={{ background: 'linear-gradient(145deg, #0f1117 0%, #090c12 100%)' }}>

              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-white/30 text-xs font-mono">spendwise-b3u.pages.dev/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10" />
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs font-bold">J</span>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-12 gap-4">
                <div className="col-span-2 space-y-1">
                  {['Dashboard', 'Transactions', 'Import', 'Insights', 'Budgets'].map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${i === 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : ''}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-emerald-400' : 'bg-white/10'}`} />
                      <div className={`h-2 rounded ${i === 0 ? 'bg-emerald-400/60 w-16' : 'bg-white/10 w-12'}`} />
                    </div>
                  ))}
                </div>

                <div className="col-span-10 space-y-4 text-left">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Net Balance', value: '₹38,420', change: '+12.4%', up: true, accent: 'emerald' },
                      { label: 'Total Income', value: '₹52,000', change: '+8.1%', up: true, accent: 'blue' },
                      { label: 'Expenses', value: '₹13,580', change: '-3.2%', up: false, accent: 'rose' },
                      { label: 'Savings Rate', value: '73.9%', change: '+5%', up: true, accent: 'violet' },
                    ].map((stat, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="p-4 rounded-2xl border border-white/[0.06]"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <p className="text-white/30 text-[10px] mb-2 tracking-wide uppercase font-bold">{stat.label}</p>
                        <p className={`text-lg font-black text-${stat.accent}-400`}>{stat.value}</p>
                        <p className={`text-[10px] mt-1 ${stat.up ? 'text-emerald-400' : 'text-rose-400'}`}>{stat.change}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 p-4 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-white/50 text-xs font-semibold">Spending Trend</p>
                        <span className="text-emerald-400 text-[10px] bg-emerald-400/10 px-2 py-0.5 rounded-full">April 2026</span>
                      </div>
                      <svg viewBox="0 0 280 80" className="w-full h-16">
                        <defs>
                          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <motion.path d="M0,80 L0,55 C20,45 40,60 60,50 S100,25 140,35 S200,20 240,15 S265,18 280,10 L280,80 Z"
                          fill="url(#g)"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
                        <motion.path d="M0,55 C20,45 40,60 60,50 S100,25 140,35 S200,20 240,15 S265,18 280,10"
                          fill="none" stroke="#10b981" strokeWidth="2"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 1, ease: 'easeInOut' }} />
                      </svg>
                    </div>

                    <div className="col-span-1 p-4 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-white/50 text-xs font-semibold mb-3">Recent</p>
                      {[
                        { name: 'Zomato', cat: 'Food', amount: '-₹285', color: '#f97316' },
                        { name: 'Salary', cat: 'Income', amount: '+₹52k', color: '#10b981' },
                        { name: 'Netflix', cat: 'Entertainment', amount: '-₹649', color: '#ef4444' },
                        { name: 'Amazon', cat: 'Shopping', amount: '-₹1,299', color: '#3b82f6' },
                      ].map((tx, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + i * 0.08 }}
                          className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${tx.color}22` }}>
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: tx.color }} />
                            </div>
                            <div>
                              <p className="text-white/70 text-[10px] font-semibold leading-none">{tx.name}</p>
                              <p className="text-white/20 text-[9px]">{tx.cat}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white/50'}`}>
                            {tx.amount}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-black text-xs font-black px-4 py-2 rounded-full shadow-lg shadow-emerald-500/40"
            >
              ✦ Live Preview
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION (Bento Grid) */}
      <section id="features" className="py-32 bg-[#050508] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="mb-16 max-w-2xl text-left">
            <p className="text-emerald-400 text-xs tracking-[0.25em] uppercase font-semibold mb-4">Why SpendWise</p>
            <h2 className="font-display italic text-white text-5xl md:text-7xl leading-tight">
              Built different.<br/>
              <span className="not-italic text-white/20">By design.</span>
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-7 p-8 rounded-[28px] border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group min-h-[300px]">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-emerald-500/5 to-transparent" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative z-10">
                <LucideZap className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="font-display italic text-white text-4xl mb-4 relative z-10">Upload. Done.</h3>
              <p className="text-white/40 text-base leading-relaxed max-w-sm relative z-10">Drop your Paytm PDF or Excel statement. Our parser reads 10,000 transactions in milliseconds and categorizes every single one.</p>
              <div className="mt-8 flex items-center gap-3 p-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] w-fit relative z-10">
                <div className="w-10 h-12 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                  <span className="text-rose-400 text-[10px] font-black">PDF</span>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-semibold">Paytm_Statement_Apr.pdf</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-emerald-400 rounded-full"
                        initial={{ width: 0 }} animate={{ width: '100%' }}
                        transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 3 }} />
                    </div>
                    <span className="text-emerald-400 text-[10px]">Parsing...</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-5 p-8 rounded-[28px] border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group min-h-[300px]">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-violet-500/5 to-transparent" />
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 relative z-10">
                <LucideBarChart3 className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="font-display italic text-white text-4xl mb-4 relative z-10">Smart Categories</h3>
              <p className="text-white/40 text-sm leading-relaxed relative z-10">95% automatic categorization. Zomato → Food. Uber → Transport. Jio → Utilities. Instant.</p>
              <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                {[
                  { label: '🍕 Food', color: 'orange' },
                  { label: '🚗 Transport', color: 'blue' },
                  { label: '🛍️ Shopping', color: 'violet' },
                  { label: '⚡ Utilities', color: 'yellow' },
                  { label: '❤️ Health', color: 'rose' },
                  { label: '🎬 Entertainment', color: 'pink' },
                ].map((cat, i) => (
                  <motion.span key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/60 bg-white/[0.03]">
                    {cat.label}
                  </motion.span>
                ))}
              </div>
            </div>

            {[
              { icon: LucideShield, title: 'Zero Server Storage', body: 'Your financial data never touches our servers. Fully local, fully private.', color: 'emerald', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
              { icon: LucideGlobe, title: 'All Indian Banks', body: 'HDFC, SBI, ICICI, Axis, Paytm, PhonePe — every statement format supported.', color: 'blue', bg: 'bg-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-400' },
              { icon: LucideLayout, title: 'Glass Dashboard', body: 'Real-time insights. Gorgeous charts. The most beautiful finance UI ever made.', color: 'rose', bg: 'bg-rose-500/5', border: 'border-rose-500/20', text: 'text-rose-400' },
            ].map((f, i) => (
              <div key={i} className="col-span-12 md:col-span-4 p-8 rounded-[28px] border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden group min-h-[200px] text-left">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center mb-5`}>
                  <f.icon className={`w-6 h-6 ${f.text}`} />
                </div>
                <h3 className="text-white font-bold text-xl mb-3 tracking-tight">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#050508] border-t border-white/[0.04]">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/20 text-xs tracking-[0.3em] uppercase mb-12">Trusted by finance-obsessed Indians</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { quote: "Finally an app that understands my Paytm statements. Categorized 3 months of data in seconds.", name: "Arjun S.", role: "Software Engineer, Bangalore" },
              { quote: "The insights are insane. I discovered I was spending ₹8k/month on food delivery without realizing it.", name: "Priya M.", role: "Product Manager, Mumbai" },
              { quote: "This is what Mint should have been. Clean, fast, smart. The dashboard is absolutely gorgeous.", name: "Rohan K.", role: "Startup Founder, Delhi" },
            ].map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-left"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-emerald-400 text-xs">★</span>)}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-white/80 text-xs font-semibold">{t.name}</p>
                  <p className="text-white/30 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 bg-[#050508] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/[0.07] blur-[100px] rounded-full" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-emerald-400 text-xs tracking-[0.25em] uppercase font-semibold mb-6">Start today. Free forever.</p>
            <h2 className="font-display italic text-white text-6xl md:text-8xl mb-8 leading-tight">
              Your money,<br/>
              <span className="text-white/20">finally understood.</span>
            </h2>
            <p className="text-white/30 mb-12 max-w-md mx-auto font-light">Upload your first statement. See where every rupee went. Takes 30 seconds.</p>

            <Link href="/login"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold text-base tracking-wide hover:bg-emerald-400 transition-all hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(16,185,129,0.4)]">
              Start for Free
              <LucideArrowRight className="w-5 h-5" />
            </Link>

            <p className="mt-6 text-white/20 text-xs tracking-wide">No credit card · No account needed · Works with all Indian banks</p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-[#030306] border-t border-white/[0.04]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div className="max-w-xs text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <LucideWallet className="w-4 h-4 text-black" />
                </div>
                <span className="text-white font-black text-lg tracking-tight">SpendWise</span>
              </div>
              <p className="text-white/25 text-sm leading-relaxed">The premium wealth terminal for India's next generation of financially conscious individuals.</p>
            </div>
            <div className="grid grid-cols-2 gap-12 text-left">
              <div>
                <p className="text-white/20 text-xs tracking-[0.2em] uppercase mb-4">Product</p>
                {['Dashboard', 'Import', 'Insights', 'Budgets'].map(l => (
                  <a key={l} href="#" className="block text-white/40 hover:text-white text-sm mb-2 transition-colors">{l}</a>
                ))}
              </div>
              <div>
                <p className="text-white/20 text-xs tracking-[0.2em] uppercase mb-4">Legal</p>
                {['Privacy Policy', 'Terms of Service', 'Security', 'Contact'].map(l => (
                  <a key={l} href="#" className="block text-white/40 hover:text-white text-sm mb-2 transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">© 2026 SpendWise. All rights reserved.</p>
            <p className="text-white/20 text-xs">Made with obsession in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
