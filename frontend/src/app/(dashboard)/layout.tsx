import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 h-full flex-shrink-0 z-50 shadow-2xl">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative z-10 w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
