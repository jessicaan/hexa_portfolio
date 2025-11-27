'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiLayers,
  FiGrid,
  FiImage,
  FiSettings,
  FiUsers,
  FiBook,
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FiHome, badge: 'Live' },
  { href: '/admin/initial', label: 'Initial Section', icon: HiOutlineSparkles, badge: 'Live' },
  { href: '/admin/about', label: 'About Section', icon: FiUsers, badge: 'Live' },
  { href: '/admin/education', label: 'Education Section', icon: FiBook, badge: 'Live' },
  { href: '/admin/sections', label: 'Seções', icon: FiLayers, badge: 'Soon', disabled: true },
  { href: '/admin/projects', label: 'Projetos', icon: FiGrid, badge: 'Soon', disabled: true },
  { href: '/admin/media', label: 'Mídia', icon: FiImage, badge: 'Soon', disabled: true },
  { href: '/admin/access', label: 'Acesso', icon: FiUsers, badge: 'Soon', disabled: true },
  { href: '/admin/settings', label: 'Ajustes', icon: FiSettings, badge: 'Soon', disabled: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative">
      <div className="sticky top-6 space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border-subtle/60 bg-surface/70 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15 pointer-events-none" />
          <div className="relative p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">CMS</p>
                <h2 className="text-lg font-semibold text-foreground">Navegação</h2>
              </div>
              <span className="rounded-full border border-border-subtle/60 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">
                Seguro
              </span>
            </div>

            <nav className="space-y-2">
              {navItems.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <motion.div key={item.href} whileHover={{ x: item.disabled ? 0 : 4 }}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      className={`group flex items-center justify-between rounded-xl border px-3 py-3 text-sm transition-all ${
                        isActive
                          ? 'border-primary/60 bg-primary/10 text-foreground shadow-glow'
                          : 'border-border-subtle/70 bg-background/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                      } ${item.disabled ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex items-center justify-center rounded-lg border border-border-subtle/70 p-2 ${
                            isActive ? 'bg-primary/20 text-foreground' : 'bg-surface text-muted-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="tracking-wide">{item.label}</span>
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-[0.2em] rounded-full px-2 py-1 border ${
                          item.badge === 'Live'
                            ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
                            : 'border-border-subtle/70 bg-surface-soft text-muted-foreground-subtle'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle/60 bg-surface-soft/70 backdrop-blur-xl p-4 text-sm text-muted-foreground">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle mb-2">
            Boas práticas
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex size-2 rounded-full bg-primary shadow-glow-sm" />
              Use apenas conexões confiáveis para acessar o painel.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex size-2 rounded-full bg-primary shadow-glow-sm" />
              Faça logout em dispositivos compartilhados.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-flex size-2 rounded-full bg-primary shadow-glow-sm" />
              Em breve: 2FA e link mágico para reforçar a segurança.
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
