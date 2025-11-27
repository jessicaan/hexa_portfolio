'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLoader, FiRefreshCw } from 'react-icons/fi';

type Lang = 'en' | 'es' | 'fr';

interface FieldConfig<T> {
    key: keyof T;
    label: string;
    placeholder?: string;
    multiline?: boolean;
}

interface TranslationEditorProps<T extends Record<string, any>> {
    pt: T;
    translations: Record<Lang, T>;
    onChange: (translations: Record<Lang, T>) => void;
    onAutoTranslate: (pt: T) => Promise<Record<Lang, T>>;
    fields: FieldConfig<T>[];
}

const tabs: { code: Lang; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
];

export default function TranslationEditor<T extends Record<string, any>>({
    pt,
    translations,
    onChange,
    onAutoTranslate,
    fields,
}: TranslationEditorProps<T>) {
    const [active, setActive] = useState<Lang>('en');
    const [isTranslating, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const updateField = (lang: Lang, key: keyof T, value: string) => {
        onChange({
            ...translations,
            [lang]: {
                ...translations[lang],
                [key]: value,
            },
        });
    };

    const handleAutoTranslate = () => {
        setError(null);
        setMessage(null);

        startTransition(async () => {
            try {
                const result = await onAutoTranslate(pt);
                onChange(result);
                setMessage('Traduções geradas automaticamente.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao traduzir.');
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.code}
                        onClick={() => setActive(tab.code)}
                        className={`rounded-full border px-3 py-2 text-sm transition-colors ${active === tab.code
                            ? 'border-primary/60 bg-primary/10 text-foreground'
                            : 'border-border-subtle/70 bg-surface-soft text-muted-foreground hover:border-primary/40'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={isTranslating}
                    className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-3 py-2 text-sm text-foreground hover:border-primary/60 transition-colors disabled:opacity-60"
                >
                    {isTranslating ? (
                        <FiLoader className="w-4 h-4 animate-spin" />
                    ) : (
                        <FiRefreshCw className="w-4 h-4" />
                    )}
                    Auto traduzir
                </button>
            </div>

            {/* Active language form */}
            <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
            >
                {fields.map(f => (
                    <label key={String(f.key)} className="space-y-2 block">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">{f.label}</span>

                        {f.multiline ? (
                            <textarea
                                value={translations[active][f.key] ?? ''}
                                onChange={e => updateField(active, f.key, e.target.value)}
                                placeholder={f.placeholder}
                                className="w-full rounded-xl border border-border-subtle/70 bg-background/60 px-3 py-3 text-sm min-h-[120px]"
                            />
                        ) : (
                            <input
                                type="text"
                                value={translations[active][f.key] ?? ''}
                                onChange={e => updateField(active, f.key, e.target.value)}
                                placeholder={f.placeholder}
                                className="w-full rounded-xl border border-border-subtle/70 bg-background/60 px-3 py-3 text-sm"
                            />
                        )}
                    </label>
                ))}
            </motion.div>

            {/* Alerts */}
            <AnimatePresence>
                {message && (
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-sm text-emerald-300"
                    >
                        {message}
                    </motion.p>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-sm text-red-400"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}
