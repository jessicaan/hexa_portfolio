'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiPlus, FiTrash, FiRefreshCw, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import {
    autoTranslateContact,
    saveContactContent,
} from '@/app/admin/contact/actions';
import type { ContactContent } from '@/lib/content/schema';

interface Props {
    initial: ContactContent;
}

export default function ContactSectionEditor({ initial }: Props) {
    const [form, setForm] = useState<ContactContent>(initial);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, startSave] = useTransition();
    const [isTranslating, startTranslate] = useTransition();

    const preferredMethods = ['Email', 'WhatsApp', 'LinkedIn', 'Telefone'];

    const togglePreferred = (method: string) => {
        setForm(prev => ({
            ...prev,
            preferredContact: prev.preferredContact.includes(method)
                ? prev.preferredContact.filter(m => m !== method)
                : [...prev.preferredContact, method],
        }));
    };

    const handleSave = () => {
        setMessage(null);
        setError(null);
        startSave(async () => {
            try {
                await saveContactContent(form);
                setMessage('Informações de contato salvas com sucesso.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao salvar.');
            }
        });
    };

    const handleAutoTranslate = () => {
        setMessage(null);
        setError(null);
        startTranslate(async () => {
            try {
                const translations = await autoTranslateContact({
                    headline: form.headline,
                    description: form.description,
                    availability: form.availability,
                });
                setForm(prev => ({ ...prev, translations }));
                setMessage('Traduções geradas com sucesso.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao traduzir.');
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Contact</p>
                    <h1 className="text-xl font-semibold text-foreground">Informações de contato</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleAutoTranslate}
                        className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm hover:border-primary/60 transition-colors"
                        disabled={isTranslating}
                    >
                        {isTranslating ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiRefreshCw className="w-4 h-4" />}
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-primary to-secondary px-3 py-2 text-sm font-semibold text-foreground shadow-glow hover:shadow-glow-lg transition-all"
                        disabled={isSaving}
                    >
                        {isSaving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                        Salvar
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <label className="space-y-2 block">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Título</span>
                    <input
                        value={form.headline}
                        onChange={e => setForm(prev => ({ ...prev, headline: e.target.value }))}
                        placeholder="Vamos conversar?"
                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                    />
                </label>

                <label className="space-y-2 block">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Descrição</span>
                    <textarea
                        value={form.description}
                        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição sobre como entrar em contato"
                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm min-h-20"
                    />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 block">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle flex items-center gap-2">
                            <FiMail className="w-4 h-4" />
                            Email
                        </span>
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="seu@email.com"
                            className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                        />
                    </label>

                    <label className="space-y-2 block">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle flex items-center gap-2">
                            <FiPhone className="w-4 h-4" />
                            Telefone
                        </span>
                        <input
                            type="tel"
                            value={form.phone ?? ''}
                            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+55 11 99999-9999"
                            className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                        />
                    </label>
                </div>

                <label className="space-y-2 block">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        Localização
                    </span>
                    <input
                        value={form.location ?? ''}
                        onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="São Paulo, Brasil"
                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                    />
                </label>

                <label className="space-y-2 block">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Disponibilidade</span>
                    <input
                        value={form.availability}
                        onChange={e => setForm(prev => ({ ...prev, availability: e.target.value }))}
                        placeholder="Disponível para projetos freelance"
                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                    />
                </label>

                <div className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle block">
                        Formas de contato preferidas
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {preferredMethods.map(method => (
                            <button
                                key={method}
                                type="button"
                                onClick={() => togglePreferred(method)}
                                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${form.preferredContact.includes(method)
                                    ? 'border-primary/60 bg-primary/10 text-foreground'
                                    : 'border-border-subtle bg-surface-soft text-muted-foreground hover:border-primary/40'
                                    }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}