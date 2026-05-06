import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/shared/navbar";
import MobileNav from "@/components/shared/mobile-nav";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-ui" 
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-display" 
});

import { ToastProvider } from "@/components/ui/toast-provider";
import { CustomCursor } from "@/components/ui/cursor";

export const metadata: Metadata = {
  title: "SpendWise | Premium Intelligence Terminal",
  description: "Advanced AI-powered financial surveillance for the elite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`min-h-full bg-[#F8F9FA] text-[#0f172a] antialiased selection:bg-emerald-500/20 ${jakarta.variable} ${outfit.variable}`}>
        <ToastProvider>
           <CustomCursor />
           {children}
        </ToastProvider>
      </body>
    </html>
  );
}
