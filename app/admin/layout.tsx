import type { ReactNode } from "react";
import type { Metadata } from "next";
import RequireAuth from "@/components/RequireAuth";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin | Portfolio CMS",
  description: "Área autenticada para gerenciar o portfólio imersivo.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-background via-surface to-background text-foreground">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-[140px]" />
        <div className="pointer-events-none absolute right-[-10%] top-1/3 h-96 w-96 rounded-full bg-secondary/20 blur-[160px]" />
        <div className="pointer-events-none absolute left-1/3 bottom-[-10%] h-72 w-72 rounded-full bg-accent/15 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-10">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <AdminSidebar />
            <div className="space-y-6">
              <AdminHeader />
              <div className="rounded-2xl border border-border-subtle/70 bg-surface/70 backdrop-blur-2xl p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
