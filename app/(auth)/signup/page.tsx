"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { LucideWallet, LucideArrowRight, LucideUserPlus } from "lucide-react";
import { getSupabase } from "@/lib/db/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignup() {
    setIsLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) {
        toast.info("Demo Mode", {
          description: "Supabase not connected. Simulating signup locally.",
        });
        localStorage.setItem("user", JSON.stringify({ name: "Demo User", email: "demo@example.com" }));
        router.push("/dashboard");
        return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://spendwise-b3u.pages.dev/auth/callback',
        },
      });

      if (error) throw error;
      
    } catch (error: any) {
      toast.error("Signup failed", {
        description: error.message || "Failed to start Google registration.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40">
          <LucideUserPlus className="h-8 w-8 font-black" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter">Join SpendWise</h1>
          <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em]">Create your elite account</p>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[32px] overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6 border-b border-black/5 dark:border-white/5">
          <CardTitle className="text-2xl font-black tracking-tight">One-Tap Enrollment</CardTitle>
          <CardDescription className="text-sm font-bold opacity-70 mt-2 italic">
            Zero password management. Total security.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-8">
          <Button 
            onClick={handleGoogleSignup} 
            disabled={isLoading}
            className="w-full h-16 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 group"
          >
            {/* Google Icon SVG */}
            <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-emerald-50 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <span className="text-lg font-black tracking-tight">{isLoading ? "Verifying..." : "Sign up with Google"}</span>
          </Button>

          <p className="text-[10px] text-muted-foreground/60 text-center font-black uppercase tracking-widest leading-relaxed">
            By registering, you instantly accept our <br />
            <span className="text-emerald-600 hover:underline cursor-pointer">Global Terms</span> and <span className="text-emerald-600 hover:underline cursor-pointer">Security Protocol</span>
          </p>
        </CardContent>
        <CardFooter className="bg-emerald-500/5 p-6 flex flex-col gap-2 items-center border-t border-emerald-500/10">
          <p className="text-xs font-bold text-slate-500">Already a member?</p>
          <Button variant="ghost" className="text-emerald-600 font-black uppercase text-[10px] tracking-widest h-auto p-0 hover:bg-transparent hover:text-emerald-700" onClick={() => router.push('/login')}>
            Return to Terminal
          </Button>
        </CardFooter>
      </Card>
      
      <div className="flex justify-center gap-8 opacity-40">
        <div className="h-8 w-16 bg-slate-400 rounded-md animate-pulse" />
        <div className="h-8 w-16 bg-slate-400 rounded-md animate-pulse" />
        <div className="h-8 w-16 bg-slate-400 rounded-md animate-pulse" />
      </div>
    </div>
  );
}
