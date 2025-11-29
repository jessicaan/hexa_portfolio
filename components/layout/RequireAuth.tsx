'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/layout/AuthProvider';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-surface via-background to-surface-soft text-muted-foreground-subtle">
        <div className="relative flex flex-col items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-full border border-primary/40"
            initial={{ scale: 0.8, opacity: 0.4 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              boxShadow: '0 0 60px hsl(var(--glow) / 0.3), inset 0 0 20px hsl(var(--glow) / 0.2)',
            }}
          />
          <p className="text-xs tracking-[0.3em] uppercase">Verificando acesso</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
