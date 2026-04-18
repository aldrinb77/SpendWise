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
      <section className="relative pt-20 pb-32 overflow-hidden bg-[#030712]"
        style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(79,70,229,0.15) 0%, transparent 60%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "auto, 60px 60px, 60px 60px" }}
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container relative mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 rounded-full bg-primary/10 border border-primary/30 text-primary py-1.5 px-5 font-semibold tracking-widest text-[11px] uppercase backdrop-blur-sm">
              ✦ Next-Gen Wealth Management
            </Badge>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.9]">
              Reimagining <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-500">Wealth</span> <br />
              One Transaction At A Time.
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium mb-12 leading-relaxed">
              Experience the future of financial tracking. AI-powered insights, multi-currency support, and biometric security. Designed for the modern elite.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                render={
                  <Link href="/login" className="flex items-center">
                    Launch Terminal <LucideArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                }
                size="lg"
                className="h-16 px-10 rounded-2xl text-lg font-black uppercase tracking-widest bg-gradient-to-r from-primary to-blue-600 shadow-2xl shadow-primary/40 hover:scale-[1.05] transition-transform"
              />
              <Button
                variant="outline"
                size="lg"
                className="h-16 px-10 rounded-2xl text-lg font-black uppercase tracking-widest border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all"
              >
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
            <div className="relative rounded-[32px] border border-white/10 bg-[#0D1117] overflow-hidden shadow-[0_0_120px_rgba(79,70,229,0.3)]">
              {/* Title bar */}
              <div className="flex items-center px-6 py-4 bg-[#161B22] border-b border-white/5 gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-4 text-xs text-slate-500 font-mono">SpendWise Terminal — Dashboard</span>
              </div>

              <div className="p-8 grid grid-cols-3 gap-6 bg-[#0D1117]">
                {/* Stat Cards */}
                <div className="col-span-3 grid grid-cols-4 gap-4">
                  {[
                    { label: "Net Balance", value: "₹38,420", change: "+12.4%", color: "text-emerald-400" },
                    { label: "Total Income", value: "₹52,000", change: "+8.1%", color: "text-blue-400" },
                    { label: "Expenses", value: "₹13,580", change: "-3.2%", color: "text-rose-400" },
                    { label: "Savings Rate", value: "73.9%", change: "+5.0%", color: "text-violet-400" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="bg-white/5 rounded-2xl p-4 border border-white/5"
                    >
                      <p className="text-xs text-slate-500 mb-2">{stat.label}</p>
                      <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{stat.change} this month</p>
                    </motion.div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="col-span-2 bg-white/5 rounded-2xl border border-white/5 p-5">
                  <p className="text-xs text-slate-400 font-semibold mb-4">Spending Trend — April 2026</p>
                  <svg viewBox="0 0 300 120" className="w-full h-28">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.5"/>
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0,120 L0,80 Q30,50 60,70 T120,40 T180,55 T240,25 T300,10 L300,120 Z"
                      fill="url(#chartGrad)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                    />
                    <motion.path
                      d="M0,80 Q30,50 60,70 T120,40 T180,55 T240,25 T300,10"
                      fill="none" stroke="#4F46E5" strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
                    />
                  </svg>
                </div>

                {/* Recent transactions */}
                <div className="col-span-1 bg-white/5 rounded-2xl border border-white/5 p-5">
                  <p className="text-xs text-slate-400 font-semibold mb-4">Recent</p>
                  {[
                    { name: "Zomato", amount: "-₹285", color: "bg-orange-500" },
                    { name: "Salary", amount: "+₹52,000", color: "bg-emerald-500" },
                    { name: "Netflix", amount: "-₹649", color: "bg-red-500" },
                    { name: "Amazon", amount: "-₹1,299", color: "bg-blue-500" },
                  ].map((tx, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="flex items-center justify-between mb-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-lg ${tx.color} opacity-80`} />
                        <span className="text-xs text-slate-300">{tx.name}</span>
                      </div>
                      <span className={`text-xs font-bold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {tx.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-[#030712]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-20 text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white">
              Engineered for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Performance</span>.
            </h2>
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
                className="p-10 rounded-[32px] bg-[#0D1117] border border-white/5 text-left hover:border-primary/30 hover:bg-[#0D1117]/80 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent rounded-[32px]" />
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform relative z-10">
                  <f.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-4 text-white relative z-10">{f.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed relative z-10">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 bg-gradient-to-br from-primary via-indigo-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-400/20 blur-[100px] rounded-full translate-x-1/2" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-10 leading-[0.9]">
            Take Control of Your <br />Financial Destiny.
          </h2>
          <Button
            render={<Link href="/login">Get Started Free</Link>}
            size="lg"
            className="h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest bg-white text-primary hover:bg-slate-100 transition-all shadow-2xl"
          />
          <p className="mt-8 text-white/60 font-bold hover:text-white transition-colors cursor-pointer uppercase text-xs tracking-widest leading-relaxed">
            No credit card required • GDPR Ready • Bank-Grade Security
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#030712] border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center">
              <LucideWallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tighter">SpendWise</span>
              <p className="text-xs text-slate-600">Premium Wealth Terminal</p>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <p className="text-slate-600 text-sm">&copy; 2026 SpendWise. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile Sticky Nav Fix */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0D1117] border-t border-white/10 px-6 py-3 flex items-center justify-around">
        <Link href="/" className="text-primary flex flex-col items-center">
          <LucideLayout className="h-5 w-5" />
          <span className="text-[10px] mt-1 font-bold">Home</span>
        </Link>
        <Link href="/login" className="text-slate-500 hover:text-white transition-colors flex flex-col items-center">
          <LucideWallet className="h-5 w-5" />
          <span className="text-[10px] mt-1 font-bold">Login</span>
        </Link>
      </nav>
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
