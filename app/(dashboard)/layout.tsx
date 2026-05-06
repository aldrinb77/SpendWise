import { Sidebar } from "@/components/layout/sidebar";
import MobileNav from "@/components/shared/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 md:ml-[240px] flex flex-col min-w-0">
        <div className="flex-1 pb-24 md:pb-0">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
