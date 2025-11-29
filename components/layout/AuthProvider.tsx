'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { FirebaseError } from 'firebase/app';
import {
  browserLocalPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  formatError: (error: unknown, action?: 'login' | 'reset') => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

let persistenceConfigured = false;

function mapFirebaseError(error: unknown, action: 'login' | 'reset' = 'login') {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Email ou senha incorretos. Tente novamente.';
      case 'auth/user-not-found':
        return 'Nenhuma conta encontrada com esse email.';
      case 'auth/invalid-email':
        return 'Digite um email válido.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Aguarde alguns instantes e tente novamente.';
      case 'auth/network-request-failed':
        return 'Falha de conexão. Verifique sua rede e tente novamente.';
      case 'auth/popup-blocked':
      case 'auth/popup-closed-by-user':
        return 'A janela de autenticação foi fechada. Tente novamente.';
      default:
        break;
    }
  }

  if (action === 'reset') {
    return 'Não foi possível enviar o link. Tente novamente em instantes.';
  }

  return 'Não foi possível autenticar agora. Tente novamente em instantes.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const setupAuth = async () => {
      if (!persistenceConfigured) {
        try {
          await setPersistence(auth, browserLocalPersistence);
          persistenceConfigured = true;
        } catch (error) {
          // Persistence fallback will be handled by Firebase defaults.
          console.error('Failed to set auth persistence', error);
        }
      }

      unsubscribe = onAuthStateChanged(auth, currentUser => {
        if (!isMounted) return;
        setUser(currentUser);
        setStatus(currentUser ? 'authenticated' : 'unauthenticated');
      });
    };

    setupAuth();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(mapFirebaseError(error, 'login'));
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(mapFirebaseError(error, 'reset'));
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const formatError = useCallback(
    (error: unknown, action: 'login' | 'reset' = 'login') => mapFirebaseError(error, action),
    [],
  );

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      resetPassword,
      logout,
      formatError,
    }),
    [user, status, login, resetPassword, logout, formatError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
