import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/shared/navbar";
import MobileNav from "@/components/shared/mobile-nav";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit" 
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
      <body className="min-h-full bg-[#04050a] text-[#f1f5f9] antialiased selection:bg-emerald-500/20">
        <ToastProvider>
           <CustomCursor />
           {children}
        </ToastProvider>
      </body>
    </html>
  );
}
