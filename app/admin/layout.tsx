import type { ReactNode } from "react";
import type { Metadata } from "next";
import RequireAuth from "@/components/layout/RequireAuth";

export const metadata: Metadata = {
  title: "Admin | Portfolio CMS",
  description: "Área de gerenciamento do portfólio",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-linear-to-br from-background via-surface/50 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-6">
          <header className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Portfolio CMS</h1>
                <p className="text-sm text-muted-foreground">Gerenciamento de conteúdo</p>
              </div>
              <nav className="flex gap-2">
                <AdminNav />
              </nav>
            </div>
          </header>

          <main className="rounded-xl border border-border-subtle/50 bg-surface/50 backdrop-blur-xl p-6 shadow-lg">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}

function AdminNav() {
  const links = [
    { href: '/admin/about', label: 'Sobre' },
    { href: '/admin/education', label: 'Educação' },
    { href: '/admin/experience', label: 'Experiência' },
    { href: '/admin/projects', label: 'Projetos' },
    { href: '/admin/skills', label: 'Skills' },
    { href: '/admin/personal', label: 'Pessoal' },
    { href: '/admin/contact', label: 'Contato' },
  ];

  return (
    <>
      {links.map(link => (
        <a
          key={link.href}
          href={link.href}
          className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-soft/60 rounded-lg transition-colors"
        >
          {link.label}
        </a>
      ))}
    </>
  );
}