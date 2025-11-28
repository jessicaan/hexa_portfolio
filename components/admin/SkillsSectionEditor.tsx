'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiPlus, FiTrash, FiRefreshCw, FiTarget } from 'react-icons/fi';
import {
    autoTranslateSkills,
    saveSkillsContent,
} from '@/app/admin/skills/actions';
import type { SkillsContent, SkillCategory } from '@/lib/content/schema';

interface Props {
    initial: SkillsContent;
}

export default function SkillsSectionEditor({ initial }: Props) {
    const [form, setForm] = useState<SkillsContent>(initial);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, startSave] = useTransition();
    const [isTranslating, startTranslate] = useTransition();

    const addCategory = () => {
        setForm(prev => ({
            ...prev,
            categories: [...prev.categories, { name: '', skills: [{ name: '', level: 50 }] }],
        }));
    };

    const removeCategory = (index: number) => {
        setForm(prev => ({ ...prev, categories: prev.categories.filter((_, i) => i !== index) }));
    };

    const updateCategory = (index: number, key: keyof SkillCategory, value: any) => {
        setForm(prev => {
            const categories = [...prev.categories];
            categories[index] = { ...categories[index], [key]: value };
            return { ...prev, categories };
        });
    };

    const addSkill = (catIndex: number) => {
        setForm(prev => {
            const categories = [...prev.categories];
            categories[catIndex].skills = [...categories[catIndex].skills, { name: '', level: 50 }];
            return { ...prev, categories };
        });
    };

    const removeSkill = (catIndex: number, skillIndex: number) => {
        setForm(prev => {
            const categories = [...prev.categories];
            categories[catIndex].skills = categories[catIndex].skills.filter((_, i) => i !== skillIndex);
            return { ...prev, categories };
        });
    };

    const updateSkill = (catIndex: number, skillIndex: number, key: 'name' | 'level', value: any) => {
        setForm(prev => {
            const categories = [...prev.categories];
            categories[catIndex].skills[skillIndex] = { ...categories[catIndex].skills[skillIndex], [key]: value };
            return { ...prev, categories };
        });
    };

    const handleSave = () => {
        setMessage(null);
        setError(null);
        startSave(async () => {
            try {
                await saveSkillsContent(form);
                setMessage('Skills salvos com sucesso.');
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
                const translations = await autoTranslateSkills({
                    summary: form.summary,
                    categories: form.categories,
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
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Skills</p>
                    <h1 className="text-xl font-semibold text-foreground">Habilidades técnicas</h1>
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
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Resumo</span>
                    <textarea
                        value={form.summary}
                        onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Introdução sobre suas habilidades"
                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm min-h-[60px]"
                    />
                </label>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <FiTarget className="w-4 h-4" />
                            Categorias
                        </h3>
                        <button
                            type="button"
                            onClick={addCategory}
                            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-1.5 text-sm hover:border-primary/60 transition-colors"
                        >
                            <FiPlus className="w-4 h-4" />
                            Categoria
                        </button>
                    </div>

                    {form.categories.map((cat, catIdx) => (
                        <div key={catIdx} className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <input
                                    value={cat.name}
                                    onChange={e => updateCategory(catIdx, 'name', e.target.value)}
                                    placeholder="Nome da categoria"
                                    className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm font-semibold"
                                />
                                <button type="button" onClick={() => removeCategory(catIdx)} className="ml-2 text-red-300">
                                    <FiTrash className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {cat.skills.map((skill, skillIdx) => (
                                    <div key={skillIdx} className="flex items-center gap-2">
                                        <input
                                            value={skill.name}
                                            onChange={e => updateSkill(catIdx, skillIdx, 'name', e.target.value)}
                                            placeholder="Nome da skill"
                                            className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={skill.level}
                                            onChange={e => updateSkill(catIdx, skillIdx, 'level', Number(e.target.value))}
                                            className="w-16 rounded-lg border border-border-subtle/70 bg-background/60 px-2 py-2 text-sm text-center"
                                        />
                                        <span className="text-xs text-muted-foreground">%</span>
                                        <button type="button" onClick={() => removeSkill(catIdx, skillIdx)} className="text-red-300">
                                            <FiTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addSkill(catIdx)}
                                    className="text-xs text-primary hover:underline"
                                >
                                    + Adicionar skill
                                </button>
                            </div>
                        </div>
                    ))}
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