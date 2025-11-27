'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiSend,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { status, login, resetPassword, formatError } = useAuth();

  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = useMemo(() => status === "authenticated", [status]);
  const isLoadingStatus = status === "loading";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFeedback(null);

    if (!email || !password) {
      setError("Informe email e senha para continuar.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Digite um email válido.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : formatError(err, "login"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFeedback(null);

    if (!email) {
      setError("Digite o email cadastrado para recuperar o acesso.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Digite um email válido.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setFeedback("Enviamos um link de reset para seu email. Verifique sua caixa de entrada e spam.");
    } catch (err) {
      setError(err instanceof Error ? err.message : formatError(err, "reset"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingStatus || isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-surface to-background text-muted-foreground-subtle">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
            <motion.div
              className="relative size-14 rounded-full border border-primary/50"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              style={{ boxShadow: "0 0 50px hsl(var(--glow) / 0.25)" }}
            />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em]">Autenticando</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-surface to-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(155,92,255,0.18),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.12),transparent_20%),radial-gradient(circle_at_50%_80%,rgba(17,94,89,0.14),transparent_25%)]" />
      <div className="pointer-events-none absolute inset-0" style={{ maskImage: "radial-gradient(circle at center, black 40%, transparent 70%)", background: "linear-gradient(120deg, rgba(155,92,255,0.08), rgba(17,24,39,0.4), rgba(79,70,229,0.08))" }} />

      <div className="relative max-w-5xl mx-auto min-h-screen flex items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">
              Acesso privado
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Login seguro para o CMS imersivo
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Gerencie seções, textos, mídias e lançamentos do portfólio. Uma camada glassmorphism
              com neon roxo mantém a vibe futurista enquanto protege seus dados.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Firebase Auth com sessão persistente",
                "Redirecionamento automático ao logar",
                "Proteção de rota /admin ativa",
                "Reset de senha com link mágico",
              ].map(item => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl border border-border-subtle/60 bg-surface-soft/60 px-3 py-2 text-sm text-foreground"
                >
                  <span className="inline-flex size-2 rounded-full bg-primary shadow-glow-sm" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-border-subtle/70 bg-surface/70 backdrop-blur-2xl p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/10 pointer-events-none" />
            <div className="relative space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">
                    {mode === "login" ? "Login" : "Reset de senha"}
                  </p>
                  <h2 className="text-xl font-semibold text-foreground">
                    {mode === "login" ? "Entre na área autenticada" : "Recupere o acesso"}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground-subtle">
                  <span className="size-2 rounded-full bg-emerald-400 shadow-glow-sm" />
                  Sessão segura
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.form
                    key="login"
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                        Email
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          autoComplete="email"
                          placeholder="voce@email.com"
                          className="w-full rounded-xl border border-border-subtle/70 bg-background/50 px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                        Senha
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-border-subtle/70 bg-background/50 px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                          {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[12px]">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("reset");
                          setError(null);
                          setFeedback(null);
                        }}
                        className="text-primary hover:text-foreground transition-colors underline-offset-4 hover:underline"
                      >
                        Esqueci minha senha
                      </button>
                      <p className="text-muted-foreground-subtle">Apenas você tem acesso.</p>
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-60"
                      whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          Autenticando...
                        </>
                      ) : (
                        "Entrar e ir para o admin"
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="reset"
                    onSubmit={handleReset}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                        Email cadastrado
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          autoComplete="email"
                          placeholder="voce@email.com"
                          className="w-full rounded-xl border border-border-subtle/70 bg-background/50 px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition"
                        />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Enviaremos um link seguro para redefinir sua senha. Esse link expira após alguns minutos.
                    </p>

                    <div className="flex items-center justify-between text-[12px]">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setFeedback(null);
                          setError(null);
                        }}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <FiArrowLeft className="w-4 h-4" />
                        Voltar para login
                      </button>
                      <span className="text-muted-foreground-subtle">Link único via Firebase</span>
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-60"
                      whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          Enviando link...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4" />
                          Enviar link de reset
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100"
                  >
                    {error}
                  </motion.div>
                )}
                {feedback && (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="rounded-xl border border-border-subtle/50 bg-background/40 px-4 py-3 text-xs text-muted-foreground-subtle">
                <p className="uppercase tracking-[0.2em] text-[10px] mb-1 text-muted-foreground">Próximos upgrades</p>
                <div className="flex items-center justify-between gap-3">
                  <span>2FA com TOTP ou login por link mágico</span>
                  <span className="rounded-full bg-surface-soft px-3 py-1 text-[10px] uppercase tracking-[0.2em] border border-border-subtle/60">
                    Em breve
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
