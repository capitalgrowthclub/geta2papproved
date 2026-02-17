import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-4 pt-[73px] sm:p-6 sm:pt-[73px] lg:p-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
