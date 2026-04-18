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

export const metadata: Metadata = {
  title: "SpendWise | Premium Expense Tracker",
  description: "Advanced AI-powered financial tracking for the Indian market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50/50 dark:bg-slate-950/50">
        <main className="flex-1">
          {children}
        </main>
        <Toaster position="top-center" richColors closeButton expand={false} />
      </body>
    </html>
  );
}
