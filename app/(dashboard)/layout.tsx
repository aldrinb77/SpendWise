import React from 'react';
import Navbar from "@/components/shared/navbar";
import MobileNav from "@/components/shared/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <div className="flex-1 pb-24 md:pb-0">
        {children}
      </div>
      <MobileNav />
    </div>
  );
}
