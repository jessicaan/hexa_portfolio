'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import { useAuth } from '@/components/layout/AuthProvider';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const lastLogin = useMemo(() => {
    if (!user?.metadata?.lastSignInTime) return null;
    try {
      return new Date(user.metadata.lastSignInTime).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  }, [user]);

  const handleLogout = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await logout();
      router.replace('/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-subtle/60 bg-surface/70 backdrop-blur-2xl p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-primary/50 via-transparent to-secondary/50 blur-lg opacity-60" />
            <div className="relative size-12 rounded-2xl bg-surface-soft border border-border-subtle/70 flex items-center justify-center shadow-glow">
              <HiOutlineShieldCheck className="w-6 h-6 text-primary drop-shadow-neon-purple" />
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">CMS Privado</p>
            <h1 className="text-lg font-semibold text-foreground">Painel imersivo</h1>
            {user?.email && (
              <p className="text-xs text-muted-foreground">Logada como {user.email}</p>
            )}
            {lastLogin && (
              <p className="text-[11px] text-muted-foreground-subtle">Ultimo acesso {lastLogin}</p>
            )}
          </div>
        </div>

        <motion.button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-soft px-4 py-2 text-sm font-medium text-foreground hover:border-primary/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          disabled={isSigningOut}
        >
          <FiLogOut className="w-4 h-4" />
          {isSigningOut ? 'Saindo...' : 'Logout'}
        </motion.button>
      </div>
    </div>
  );
}
